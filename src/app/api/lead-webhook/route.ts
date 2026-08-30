import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabaseUrl = 'https://yvaqrcdqehybzlnpwaeb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2YXFyY2RxZWh5YnpsbnB3YWViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcyOTU1MTAsImV4cCI6MjEwMjg3MTUxMH0.fLqHfgvK4n12NfM_xa-_5uhO7Z6eLaWLzWxwVABCuZI';

const supabase = createClient(supabaseUrl, supabaseKey);

const VERIFY_TOKEN = 'ai_growth_crm_secret_token_123';
const WHATSAPP_PHONE_NUMBER_ID = '1230282856843762';
const WHATSAPP_ACCESS_TOKEN = 'EAAPAlXREmykBSVfPRjFREbowqanuiApfQZAwe9yZCyKenFAgifMgwARHTDYXb8gBZCa5X3F6KII2EoxornQf88GSPg3ZB9WkUFW2RqZC5UXCAA3NP6kWjPg5YMFyvms6pvXJ9luQLdN5F5NRUppdoaO6eiT0HlHeE0Q0Kl2CXmkb0lYeZCbqiXfMAZCnx7tZBDZB09uMqbMEzr8zq864ydkyiFlN1vpqks38MtSjSVTaOjPJZBoN31G3ZAPYsK0hmXOVfioqHEXykAxnp8s70Qb2wRW8321';

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

    return await res.json();
  } catch (error) {
    console.error('WhatsApp Error:', error);
  }
}

// १. Meta Webhook Verification (Meta च्या 'Verify and save' साठी आवश्यक)
export async function GET(request: Request) {
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
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Meta Ads / WhatsApp Cloud Webhook कडून आलेला डेटा
    if (body.object === 'whatsapp_business_account' || body.object === 'page') {
      return NextResponse.json({ status: 'EVENT_RECEIVED' }, { status: 200 });
    }

    // लँडिंग पेजवरून आलेला फॉर्म डेटा
    const { name, phone, email, source } = body;

    const { data, error } = await supabase.from('leads').insert([
      {
        name: name || 'वेबसाईट ग्राहक',
        phone: phone || '',
        email: email || '',
        source: source || 'Website Funnel (Auto WhatsApp)',
        status: 'New Lead',
      },
    ]);

    if (phone) {
      await sendWhatsAppTemplateMessage(phone);
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}