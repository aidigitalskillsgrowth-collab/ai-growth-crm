import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const GEMINI_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.5-pro',
  'gemini-2.0-flash',
  'gemini-2.0-flash-lite',
];

async function generateGeminiReply(
  apiKey: string,
  systemPrompt: string,
  customerMessage: string
): Promise<string | null> {
  const prompt = [
    `System Instructions:\n${
      systemPrompt ||
      'तुम्ही एक हुशार, नम्र आणि मदतीला तत्पर असलेले AI असिस्टंट आहात. ग्राहकाच्या प्रश्नाला नैसर्गिक आणि स्पष्ट भाषेत उत्तर द्या.'
    }`,
    `Customer WhatsApp Message:\n${customerMessage}`,
    'Reply naturally and concisely matching the user language.',
  ].join('\n\n');

  const payload = JSON.stringify({
    contents: [{ parts: [{ text: prompt }] }],
  });

  for (const model of GEMINI_MODELS) {
    const baseUrl = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
      model
    )}:generateContent`;

    try {
      const res = await fetch(`${baseUrl}?key=${encodeURIComponent(apiKey)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (reply && typeof reply === 'string' && reply.trim()) {
          return reply.trim();
        }
      } else {
        console.error(`Gemini Model (${model}) [key] Error:`, JSON.stringify(data));
      }
    } catch (err: any) {
      console.error(`Gemini Fetch Error (${model}) [key]:`, err?.message || err);
    }

    try {
      const resBearer = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: payload,
      });
      const dataBearer = await resBearer.json().catch(() => ({}));
      if (resBearer.ok) {
        const reply = dataBearer?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (reply && typeof reply === 'string' && reply.trim()) {
          return reply.trim();
        }
      } else {
        console.error(`Gemini Model (${model}) [Bearer] Error:`, JSON.stringify(dataBearer));
      }
    } catch (err: any) {
      console.error(`Gemini Fetch Error (${model}) [Bearer]:`, err?.message || err);
    }
  }

  return null;
}

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

// १. मेटा (Meta) कडून वेबहुक व्हेरिफाय करण्यासाठी GET मेथड
export async function GET(request: NextRequest) {
  console.log('--- GET WEBHOOK HIT RECEIVED ---');
  const searchParams = request.nextUrl.searchParams;
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  const VERIFY_TOKEN = process.env.WEBHOOK_VERIFY_TOKEN || 'ravi_crm_verified_2026';

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('WHATSAPP_WEBHOOK_VERIFIED SUCCESSFULLY');
      return new NextResponse(challenge, { status: 200 });
    } else {
      console.error('Webhook Verification Failed: Token mismatch');
      return new NextResponse('Forbidden', { status: 403 });
    }
  }
  return new NextResponse('Bad Request', { status: 400 });
}

// २. मेसेज रिसिव्ह करून डेटाबेसमध्ये सेव्ह करण्यासाठी आणि ऑटो-रिप्लाय पाठवण्यासाठी POST मेथड
export async function POST(request: NextRequest) {
  console.log('========================================');
  console.log('--- POST WEBHOOK HIT RECEIVED FROM META ---');
  console.log('========================================');

  try {
    const body = await request.json();
    console.log('Full Incoming Payload:', JSON.stringify(body, null, 2));

    const entry = body?.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const messages = value?.messages;
    const phoneNumberId = String(value?.metadata?.phone_number_id || '').trim();

    if (messages && messages.length > 0) {
      const message = messages[0];
      const senderPhone = String(message.from || '').trim();
      const messageText = String(message.text?.body || 'Media/Non-text Message').trim();

      console.log(`New Message Extracted -> Sender: ${senderPhone}, Text: ${messageText}`);

      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
      const supabaseKey =
        process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

      if (supabaseUrl && supabaseKey) {
        const supabase = createClient(supabaseUrl, supabaseKey);

        const { data, error } = await supabase
          .from('messages')
          .insert([
            {
              sender: senderPhone,
              text: messageText,
            },
          ] as any);

        if (error) {
          console.error('Supabase Insert Error:', error);
        } else {
          console.log('Message successfully saved to Supabase messages table!', data);
        }

        if (phoneNumberId && message.text?.body) {
          console.log('Incoming phoneNumberId:', phoneNumberId);

          const { data: client, error: clientErr } = await supabase
            .from('client_settings')
            .select('*')
            .eq('metaPhoneId', phoneNumberId)
            .maybeSingle();

          console.log(
            'Matched client in client_settings:',
            client
              ? {
                  id: client.user_id,
                  hasKey: !!client.geminiApiKey,
                  hasToken: !!client.accessToken,
                  autoReply: client.aiAutoReply,
                  allowedModules: client.allowed_modules,
                }
              : null,
            clientErr
          );

          const allowedList = Array.isArray(client?.allowed_modules)
            ? client.allowed_modules
            : ['inbox', 'agents'];
          const hasModuleAccess =
            allowedList.includes('inbox') || allowedList.includes('agents');

          const apiKey = String(client?.geminiApiKey || process.env.GEMINI_API_KEY || '').trim();
          const accessToken = String(
            client?.accessToken || process.env.WHATSAPP_ACCESS_TOKEN || ''
          ).trim();
          const systemPrompt = String(client?.systemPrompt || '').trim();
          const autoReplyEnabled = client?.aiAutoReply !== false;

          if (autoReplyEnabled && hasModuleAccess && accessToken) {
            const aiReply = apiKey
              ? await generateGeminiReply(apiKey, systemPrompt, messageText)
              : null;

            const finalReply =
              aiReply ||
              `नमस्कार! 🙏 ${
                client?.businessName || 'AI Growth CRM'
              } कडून आपला मेसेज प्राप्त झाला आहे. आम्ही लवकरच आपल्याशी संपर्क साधतो.`;

            const sent = await sendWhatsAppReply(
              phoneNumberId,
              accessToken,
              senderPhone,
              finalReply
            );
            console.log('WhatsApp AI Auto-Reply sent:', sent);
          } else {
            console.log(
              'Skipping AI Auto-Reply:',
              JSON.stringify({
                autoReplyEnabled,
                hasModuleAccess,
                hasApiKey: !!apiKey,
                hasAccessToken: !!accessToken,
              })
            );
          }
        }
      } else {
        console.error('Supabase environment variables missing in API route!');
      }
    } else {
      console.log(
        'Webhook received, but no messages array found in payload (could be status update like delivered/read).'
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: any) {
    console.error('Webhook POST Catch Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}