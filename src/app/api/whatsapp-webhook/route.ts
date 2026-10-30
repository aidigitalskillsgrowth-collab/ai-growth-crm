import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js'; // किंवा तुझ्या प्रोजेक्टमधील ॲक्चुअल Supabase इम्पोर्ट

// Supabase क्लायंट इनिशिएलाइज करणे (तुझ्या एन्व्हायरमेंट व्हेरिएबल्स वापरून)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// १. मेटा (Meta) कडून वेबहुक व्हेरिफाय करण्यासाठी GET मेथड
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  const VERIFY_TOKEN = 'ravi_crm_verified_2026';

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('WHATSAPP_WEBHOOK_VERIFIED');
      return new NextResponse(challenge, { status: 200 });
    } else {
      return new NextResponse('Forbidden', { status: 403 });
    }
  }
  return new NextResponse('Bad Request', { status: 400 });
}

// २. ग्राहकाने पाठवलेले मेसेज रिसिव्ह करून डेटाबेसमध्ये सेव्ह करण्यासाठी POST मेथड
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Incoming WhatsApp Webhook Payload:', JSON.stringify(body, null, 2));

    const entry = body?.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const messages = value?.messages;

    if (messages && messages.length > 0) {
      const message = messages[0];
      const senderPhone = message.from; // पाठवणाऱ्याचा मोबाईल नंबर
      const messageText = message.text?.body || 'Media/Non-text Message'; // मेसेजचा मजकूर
      const timestamp = new Date(parseInt(message.timestamp) * 1000).toISOString();

      console.log(`New Message Received from ${senderPhone}: ${messageText}`);

      // डेटाबेसमध्ये (उदा. whatsapp_messages टेबलमध्ये) मेसेज सेव्ह करणे
      const { data, error } = await supabase
        .from('whatsapp_messages') // तुझ्या ইনबॉक्सच्या टेबलचे नाव इथे टाकावे
        .insert([
          { 
            phone_number: senderPhone, 
            message: messageText, 
            direction: 'incoming', 
            created_at: timestamp 
          }
        ]);

      if (error) {
        console.error('Error saving message to Supabase:', error);
      } else {
        console.log('Message successfully saved to CRM inbox database:', data);
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: any) {
    console.error('Webhook Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}