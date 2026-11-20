import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

async function sendWhatsAppReply(
  phoneNumberId: string,
  accessToken: string,
  toPhone: string,
  replyText: string
): Promise<boolean> {
  const url = `https://graph.facebook.com/v21.0/${encodeURIComponent(phoneNumberId)}/messages`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to: toPhone,
      type: 'text',
      text: { body: replyText },
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    console.error('Meta Send Message Error:', JSON.stringify(data));
    return false;
  }
  console.log('Meta Send Message Success:', JSON.stringify(data));
  return true;
}

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
  return new NextResponse('Bad Request', { status: 400 });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const entry = body?.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const messages = value?.messages;
    const phoneNumberId = String(value?.metadata?.phone_number_id || '').trim();

    if (messages && messages.length > 0) {
      const message = messages[0];
      const senderPhone = String(message.from || '').trim();
      const messageText = String(message.text?.body || 'Media/Non-text Message').trim();

      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
      const supabaseKey =
        process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

      if (supabaseUrl && supabaseKey) {
        const supabase = createClient(supabaseUrl, supabaseKey);

        // १. त्या क्लायंटच्या meta_phone_id सोबत मेसेज सेव्ह करणे (Data Isolation)
        const { error } = await supabase
          .from('messages')
          .insert([
            {
              sender: senderPhone,
              text: messageText,
              meta_phone_id: phoneNumberId || null,
            },
          ] as any);

        if (error) {
          console.error('Supabase Insert Error:', error);
        }

        // २. संबंधित क्लायंटच्या सेटिंग्सनुसार AI रिप्लाय पाठवणे
        if (phoneNumberId && message.text?.body) {
          const { data: client } = await supabase
            .from('client_settings')
            .select('*')
            .eq('metaPhoneId', phoneNumberId)
            .maybeSingle();

          const allowedList = Array.isArray(client?.allowed_modules)
            ? client.allowed_modules
            : ['inbox', 'agents'];
          const hasModuleAccess =
            allowedList.includes('inbox') || allowedList.includes('agents');

          // क्लायंटची स्वतःची की नसेल तर Admin ची डिफॉल्ट Gemini Key वापरणे
          let apiKey = String(client?.geminiApiKey || process.env.GEMINI_API_KEY || '').trim();
          if (!apiKey) {
            const { data: adminRow } = await supabase
              .from('client_settings')
              .select('geminiApiKey')
              .ilike('client_email', 'aidigitalskillsgrowth@gmail.com')
              .maybeSingle();
            apiKey = String(adminRow?.geminiApiKey || '').trim();
          }

          const accessToken = String(
            client?.accessToken || process.env.WHATSAPP_ACCESS_TOKEN || ''
          ).trim();
          const systemPrompt = String(client?.systemPrompt || '').trim();
          const autoReplyEnabled = client?.aiAutoReply !== false;

          if (autoReplyEnabled && hasModuleAccess && accessToken) {
            let aiReply: string | null = null;

            if (apiKey) {
              try {
                const origin = request.nextUrl.origin;
                const chatRes = await fetch(`${origin}/api/gemini-chat`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    apiKey,
                    message: messageText,
                    systemPrompt,
                  }),
                });
                const chatData = await chatRes.json().catch(() => ({}));
                if (chatRes.ok && chatData?.reply) {
                  aiReply = String(chatData.reply).trim();
                }
              } catch (chatErr: any) {
                console.error('Internal /api/gemini-chat fetch failed:', chatErr?.message || chatErr);
              }
            }

            const finalReply =
              aiReply ||
              `नमस्कार! 🙏 ${
                client?.businessName || 'AI Growth CRM'
              } कडून आपला मेसेज प्राप्त झाला आहे. आम्ही लवकरच आपल्याशी संपर्क साधतो.`;

            await sendWhatsAppReply(phoneNumberId, accessToken, senderPhone, finalReply);
          }
        }
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: any) {
    console.error('Webhook POST Catch Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}