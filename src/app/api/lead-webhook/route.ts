import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabaseUrl = 'https://yvaqrcdqehybzlnpwaeb.supabase.co';
const supabaseKey = process.env.SUPABASE_SECRET_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

const VERIFY_TOKEN = 'ai_growth_crm_secret_token_123';
const WHATSAPP_PHONE_NUMBER_ID = '1387961227727412';
const WHATSAPP_ACCESS_TOKEN = 'EAAPAlXREmykBSgUuykkwGp4K0VCZB8WnWtrciZBw9lnpZCjc2eEzJGAQk275Cr35xeujiP4ZCzZApRCQxMjEGZCvsrZBqMvI0So54gH8mbOOv4AIvOfl6YFpmRrAJZB1jkp60dJjP5rUULDX5qyPTmMfFKr36w05ZCe9II2l9DGEMkxGfbmQ3J8G0dhvnuAfF0vxkFQZDZD';

async function sendWhatsAppTemplateMessage(recipientPhone: string) {
  const cleanPhone = recipientPhone.replace(/[^0-9]/g, '');
  const formattedPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;

  const url = `https://graph.facebook.com/v20.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`;

  const payload = {
    messaging_product: 'whatsapp',
    to: formattedPhone,
    type: 'template',
    template: {
      name: 'hello_world',
      language: {
        code: 'en_US',
      },
    },
  };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    console.log('WhatsApp Full API Response:', data);
    return data;
  } catch (error) {
    console.error('WhatsApp Catch Error:', error);
    return { error };
  }
}

// १. Meta Webhook Verification (Meta च्या 'Verify and save' साठी आवश्यक)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    return new NextResponse(challenge, {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    });
  }

  return NextResponse.json({ status: 'Webhook API Active' }, { status: 200 });
}

// २. Lead Capture & WhatsApp Trigger (लँडिंग पेज आणि Meta Ads साठी)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Meta Ads / WhatsApp Cloud Webhook कडून आलेला डेटा
    if (body.object === 'whatsapp_business_account' || body.object === 'page') {
      return NextResponse.json({ status: 'EVENT_RECEIVED' }, { status: 200 });
    }

    // लँडिंग पेजवरून आलेला फॉर्म डेटा
    const { name, phone, email, source } = body;

    const { data: dbData, error: dbError } = await supabase.from('leads').insert([
      {
        name: name || 'वेबसाईट ग्राहक',
        phone: phone || '',
        email: email || '',
        source: source || 'Website Funnel (Auto WhatsApp)',
        status: 'New Lead',
      },
    ]);

    if (dbError) {
      console.error('Supabase Error details:', dbError);
    }

    let waResult = null;
    if (phone) {
      waResult = await sendWhatsAppTemplateMessage(phone);
    }

    return NextResponse.json({ 
      success: true, 
      db: dbData, 
      whatsappResponse: waResult 
    }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}