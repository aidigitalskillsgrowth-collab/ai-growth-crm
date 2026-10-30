import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// १. मेटा (Meta) कडून वेबहुक व्हेरिफाय करण्यासाठी GET मेथड
export async function GET(request: NextRequest) {
  console.log('--- GET WEBHOOK HIT RECEIVED ---');
  const searchParams = request.nextUrl.searchParams;
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  const VERIFY_TOKEN = 'ravi_crm_verified_2026';

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

// २. मेसेज रिसिव्ह करून डेटाबेसमध्ये सेव्ह करण्यासाठी POST मेथड
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

    if (messages && messages.length > 0) {
      const message = messages[0];
      const senderPhone = message.from; 
      const messageText = message.text?.body || 'Media/Non-text Message'; 

      console.log(`New Message Extracted -> Sender: ${senderPhone}, Text: ${messageText}`);

      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

      if (supabaseUrl && supabaseKey) {
        const supabase = createClient(supabaseUrl, supabaseKey);

        const { data, error } = await supabase
          .from('messages')
          .insert([
            { 
              sender: senderPhone, 
              text: messageText
            }
          ] as any);

        if (error) {
          console.error('Supabase Insert Error:', error);
        } else {
          console.log('Message successfully saved to Supabase messages table!', data);
        }
      } else {
        console.error('Supabase environment variables missing in API route!');
      }
    } else {
      console.log('Webhook received, but no messages array found in payload (could be status update like delivered/read).');
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: any) {
    console.error('Webhook POST Catch Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}