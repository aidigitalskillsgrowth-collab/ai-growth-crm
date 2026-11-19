import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const GEMINI_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-1.5-flash-latest',
  'gemini-1.5-pro-latest',
  'gemini-1.5-flash',
  'gemini-1.5-pro',
  'gemini-pro',
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

  for (const model of GEMINI_MODELS) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
          model
        )}:generateContent?key=${encodeURIComponent(apiKey)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (reply && typeof reply === 'string') {
          return reply.trim();
        }
      }
    } catch {
      // पुढच्या मॉडेलवर प्रयत्न सुरू राहील
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
  return res.ok;
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

// २. मेसेज रिसिव्ह करून डेटाबेसमध्ये सेव्ह करण्यासाठी आणि Gemini AI ऑटो-रिप्लाय पाठवण्यासाठी POST मेथड
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

        // क्लायंट सेटिंग्सवरून Gemini AI ऑटो-रिप्लाय पाठवणे
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

          const apiKey = String(client?.geminiApiKey || process.env.GEMINI_API_KEY || '').trim();
          const accessToken = String(
            client?.accessToken || process.env.WHATSAPP_ACCESS_TOKEN || ''
          ).trim();
          const systemPrompt = String(client?.systemPrompt || '').trim();
          const autoReplyEnabled = client?.aiAutoReply !== false;

          if (autoReplyEnabled && hasModuleAccess && apiKey && accessToken) {
            const aiReply = await generateGeminiReply(apiKey, systemPrompt, messageText);
            if (aiReply) {
              const sent = await sendWhatsAppReply(
                phoneNumberId,
                accessToken,
                senderPhone,
                aiReply
              );
              console.log('WhatsApp AI Auto-Reply sent:', sent);
            }
          } else {
            console.log(
              'Skipping AI Auto-Reply: missing client config, module access, apiKey, or accessToken.'
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