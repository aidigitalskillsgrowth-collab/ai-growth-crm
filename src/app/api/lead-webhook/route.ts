import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const getSupabaseClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const key =
    process.env.SUPABASE_SECRET_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    '';
  return createClient(url, key);
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

// १. Meta Webhook Verification (GET) + Health Check
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  const VERIFY_TOKEN = process.env.WEBHOOK_VERIFY_TOKEN || 'ravi_crm_verified_2026';

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      return new NextResponse(challenge, { status: 200 });
    }
    return new NextResponse('Forbidden', { status: 403 });
  }

  return NextResponse.json(
    {
      status: 'online',
      message: 'Multi-tenant Meta & Landing Page Lead webhook GET endpoint is active.',
    },
    { status: 200, headers: corsHeaders }
  );
}

// क्लायंटच्या स्वतःच्या WhatsApp वरून लीडला वेलकम मेसेज पाठवणे
async function sendClientWhatsAppWelcome(
  phoneNumberId: string,
  accessToken: string,
  toPhone: string,
  leadName: string,
  businessName: string
) {
  if (!phoneNumberId || !accessToken || !toPhone) {
    return { skipped: true, reason: 'Missing client WhatsApp credentials' };
  }

  let formattedPhone = toPhone.replace(/\D/g, '');
  if (formattedPhone.length === 10) {
    formattedPhone = `91${formattedPhone}`;
  }

  const textRes = await fetch(`https://graph.facebook.com/v21.0/${phoneNumberId}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to: formattedPhone,
      type: 'text',
      text: {
        body: `नमस्कार ${leadName || 'मित्र'} जी! 🙏 *${businessName || 'AI Growth CRM'}* मध्ये आपली चौकशी प्राप्त झाली आहे. आमची टीम लवकरच आपल्याशी संपर्क साधेल.`,
      },
    }),
  });

  const textData = await textRes.json().catch(() => ({}));
  if (textRes.ok) return textData;

  const tplRes = await fetch(`https://graph.facebook.com/v21.0/${phoneNumberId}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to: formattedPhone,
      type: 'template',
      template: {
        name: 'hello_world',
        language: { code: 'en_US' },
      },
    }),
  });

  return await tplRes.json().catch(() => ({}));
}

// Meta Graph API वरून leadgen_id चे तपशील (नाव, फोन, ईमेल) आणणे
async function fetchMetaLeadDetails(leadgenId: string, accessToken: string) {
  const url = `https://graph.facebook.com/v21.0/${encodeURIComponent(leadgenId)}?access_token=${encodeURIComponent(accessToken)}`;
  const res = await fetch(url);
  const data = await res.json().catch(() => ({}));

  if (!res.ok || !Array.isArray(data?.field_data)) {
    console.error('Meta Graph API lead fetch failed:', JSON.stringify(data));
    return null;
  }

  let name = '';
  let phone = '';
  let email = '';

  for (const field of data.field_data) {
    const fieldName = String(field.name || '').toLowerCase();
    const val = Array.isArray(field.values) ? String(field.values[0] || '').trim() : '';

    if (fieldName.includes('name')) name = name ? `${name} ${val}` : val;
    if (fieldName.includes('phone') || fieldName.includes('mobile') || fieldName.includes('whatsapp')) {
      phone = val;
    }
    if (fieldName.includes('email')) email = val;
  }

  return {
    name: name || 'Meta Lead',
    phone,
    email,
    platform: data?.platform === 'ig' ? 'Instagram Lead Ad' : 'Facebook Lead Ad',
  };
}

// Safe Supabase Insert helper (अतिरिक्त कॉलम नसल्यास मूलभूत कॉलम्सवर fallback)
async function insertLeadSafely(supabase: any, fullPayload: Record<string, any>) {
  const firstAttempt = await supabase.from('leads').insert([fullPayload]).select();
  if (!firstAttempt.error) {
    return { data: firstAttempt.data, error: null };
  }

  const fallbackPayload = {
    name: fullPayload.name || 'Unknown Lead',
    phone: fullPayload.phone || '',
    email: fullPayload.email || '',
    source: fullPayload.source || 'Landing Page',
  };

  const secondAttempt = await supabase.from('leads').insert([fallbackPayload]).select();
  return {
    data: secondAttempt.data,
    error: secondAttempt.error ? secondAttempt.error.message : null,
  };
}

// २. Facebook/Instagram Lead Ads आणि Landing Page Leads स्वीकारणे (POST)
export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    const searchParams = request.nextUrl.searchParams;
    const queryClientEmail = String(searchParams.get('client_email') || '').trim().toLowerCase();
    const queryPhoneId = String(searchParams.get('meta_phone_id') || '').trim();

    const body = await request.json();

    // A) जर पेलोड Facebook / Instagram Lead Ads (Meta Webhook) कडून आला असेल तर:
    if (body?.object === 'page' && Array.isArray(body?.entry)) {
      const results: any[] = [];

      for (const entry of body.entry) {
        const pageId = String(entry?.id || '').trim();
        const changes = Array.isArray(entry?.changes) ? entry.changes : [];

        for (const change of changes) {
          if (change?.field !== 'leadgen') continue;
          const leadgenId = String(change?.value?.leadgen_id || '').trim();
          if (!leadgenId) continue;

          let client: any = null;
          if (pageId) {
            const { data } = await supabase
              .from('client_settings')
              .select('*')
              .eq('metaPageId', pageId)
              .maybeSingle();
            client = data;
          }
          if (!client && queryClientEmail) {
            const { data } = await supabase
              .from('client_settings')
              .select('*')
              .ilike('client_email', queryClientEmail)
              .maybeSingle();
            client = data;
          }
          if (!client) {
            const { data } = await supabase
              .from('client_settings')
              .select('*')
              .ilike('client_email', 'aidigitalskillsgrowth@gmail.com')
              .maybeSingle();
            client = data;
          }

          const isExpired =
            client?.billing_cycle === 'expired' ||
            (client?.plan_expires_at && new Date(client.plan_expires_at).getTime() < Date.now());
          if (isExpired) continue;

          const accessToken = String(
            client?.accessToken || process.env.WHATSAPP_ACCESS_TOKEN || ''
          ).trim();
          const phoneNumberId = String(
            client?.metaPhoneId || process.env.WHATSAPP_PHONE_NUMBER_ID || ''
          ).trim();

          if (!accessToken) {
            results.push({ leadgenId, error: 'Client Graph API Access Token missing' });
            continue;
          }

          const leadDetails = await fetchMetaLeadDetails(leadgenId, accessToken);
          if (!leadDetails || !leadDetails.phone) {
            results.push({ leadgenId, error: 'Could not extract phone from Meta leadgen_id' });
            continue;
          }

          const cleanPhone = leadDetails.phone.replace(/\D/g, '').replace(/^91/, '');

          const { data: inserted, error: dbErrorMsg } = await insertLeadSafely(supabase, {
            client_email: client?.client_email || '',
            meta_phone_id: phoneNumberId || null,
            name: leadDetails.name,
            phone: cleanPhone,
            email: leadDetails.email,
            service: leadDetails.platform,
            deal_value: 2000,
            status: 'New Lead',
            source: leadDetails.platform,
            sentiment: 'Highly Interested',
            notes: `Meta Leadgen ID: ${leadgenId}`,
            pipeline_id: 'default_main',
          });

          const waRes = await sendClientWhatsAppWelcome(
            phoneNumberId,
            accessToken,
            cleanPhone,
            leadDetails.name,
            client?.businessName || ''
          );

          results.push({
            leadgenId,
            client: client?.client_email,
            dbError: dbErrorMsg,
            lead: inserted?.[0] || null,
            whatsappResponse: waRes,
          });
        }
      }

      return NextResponse.json(
        { success: true, source: 'meta_lead_ads', results },
        { status: 200, headers: corsHeaders }
      );
    }

    // B) जर पेलोड Website / Landing Page / Test Lead कडून आला असेल तर:
    const { name, phone, email, source, service, deal_value, client_email, meta_phone_id } = body;

    const targetEmail = String(client_email || queryClientEmail || 'aidigitalskillsgrowth@gmail.com')
      .trim()
      .toLowerCase();

    const { data: client } = await supabase
      .from('client_settings')
      .select('*')
      .ilike('client_email', targetEmail)
      .maybeSingle();

    const targetPhoneId = String(
      meta_phone_id || queryPhoneId || client?.metaPhoneId || ''
    ).trim();

    let dbData = null;
    let dbErrorMsg: string | null = null;

    if (phone) {
      const cleanPhone = String(phone).replace(/\D/g, '').replace(/^91/, '');
      const insertedRes = await insertLeadSafely(supabase, {
        client_email: client?.client_email || targetEmail,
        meta_phone_id: targetPhoneId || null,
        name: name || 'Unknown Lead',
        phone: cleanPhone,
        email: email || '',
        service: service || 'Website Inquiry',
        deal_value: Number(deal_value) || 2000,
        status: 'New Lead',
        source: source || 'Landing Page',
        sentiment: 'Interested',
        pipeline_id: 'default_main',
      });

      dbData = insertedRes.data;
      dbErrorMsg = insertedRes.error;
    }

    let waResult = null;
    if (phone) {
      const accessToken = String(
        client?.accessToken || process.env.WHATSAPP_ACCESS_TOKEN || ''
      ).trim();
      waResult = await sendClientWhatsAppWelcome(
        targetPhoneId,
        accessToken,
        String(phone),
        name || 'मित्र',
        client?.businessName || ''
      );
    }

    return NextResponse.json(
      {
        success: !dbErrorMsg,
        db: dbData,
        dbError: dbErrorMsg,
        whatsappResponse: waResult,
        timestamp: new Date().toISOString(),
      },
      { status: dbErrorMsg ? 500 : 200, headers: corsHeaders }
    );
  } catch (err: any) {
    console.error('Webhook execution fatal error:', err);
    return NextResponse.json(
      {
        success: false,
        error: err.message || 'Internal server error during webhook processing',
      },
      { status: 500, headers: corsHeaders }
    );
  }
}