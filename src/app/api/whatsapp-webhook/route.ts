import { NextRequest, NextResponse } from 'next/server';

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

// २. ग्राहकाने पाठवलेले मेसेज रिसिव्ह करून इनबॉक्ससाठी प्रोसेस करण्यासाठी POST मेथड
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Incoming WhatsApp Webhook Payload:', JSON.stringify(body, null, 2));

    // मेटाच्या स्ट्रक्चरमधून युजरचा मोबाईल नंबर आणि मेसेज बाहेर काढणे
    const entry = body?.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const messages = value?.messages;

    if (messages && messages.length > 0) {
      const message = messages[0];
      const senderPhone = message.from; // पाठवणाऱ्याचा मोबाईल नंबर
      const messageText = message.text?.body || 'Media/Non-text Message'; // मेसेजचा मजकूर
      const messageTimestamp = message.timestamp;

      console.log(`New Message Received from ${senderPhone}: ${messageText}`);

      // TODO: इथे आपण हा मेसेज थेट आपल्या Supabase डेटाबेसमध्ये सेव्ह करू शकतो, 
      // जेणेकरून तो CRM च्या इनबॉक्स डॅशबोर्डवर दिसेल.
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: any) {
    console.error('Webhook Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}