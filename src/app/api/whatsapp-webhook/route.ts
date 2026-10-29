import { NextRequest, NextResponse } from 'next/server';

// १. मेटा (Meta) कडून वेबहुक व्हेरिफाय करण्यासाठी GET मेथड
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  // इथे आपण व्हेरिफाय टोकन ठरवला आहे
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

// २. ग्राहकाने पाठवलेले मेसेज रिसिव्ह करण्यासाठी POST मेथड (इनबॉक्ससाठी)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Incoming WhatsApp Webhook Message:', JSON.stringify(body, null, 2));

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: any) {
    console.error('Webhook Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}