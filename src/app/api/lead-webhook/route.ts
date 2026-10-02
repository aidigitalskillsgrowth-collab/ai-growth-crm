import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const getSupabaseClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';
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

export async function GET() {
  return NextResponse.json({
    status: 'online',
    message: 'Lead webhook GET endpoint is active and working fine for CRM integration.'
  }, { 
    status: 200, 
    headers: corsHeaders 
  });
}

async function sendWhatsAppTemplateMessage(phone: string) {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  
  if (!phoneNumberId || !accessToken) {
    throw new Error('WhatsApp credentials missing in environment variables');
  }

  const formattedPhone = phone.replace(/\D/g, '');

  const response = await fetch(`https://graph.facebook.com/v19.0/${phoneNumberId}/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to: formattedPhone,
      type: 'template',
      template: {
        name: 'hello_world',
        language: { code: 'en_US' }
      }
    }),
  });

  return await response.json();
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    const body = await request.json();
    const { name, phone, email, source } = body;

    let dbData = null;
    let dbErrorMsg = null;
    if (phone) {
      const { data, error } = await supabase
        .from('leads')
        .insert([
          { 
            name: name || 'Unknown Lead', 
            phone: phone, 
            email: email || '', 
            source: source || 'Lovable Landing Page' 
          }
        ])
        .select();
      
      if (error) {
        console.error('Supabase insert error:', error.message);
        dbErrorMsg = error.message;
      } else {
        dbData = data;
      }
    }

    let waResult = null;
    let waErrorMsg = null;
    if (phone) {
      try {
        waResult = await sendWhatsAppTemplateMessage(phone);
      } catch (waErr: any) {
        console.error('WhatsApp send error:', waErr.message);
        waErrorMsg = waErr.message;
      }
    }

    return NextResponse.json({
      success: true,
      db: dbData,
      dbError: dbErrorMsg,
      whatsappResponse: waResult,
      whatsappError: waErrorMsg,
      timestamp: new Date().toISOString()
    }, { 
      status: 200,
      headers: corsHeaders 
    });
  } catch (err: any) {
    console.error('Webhook execution fatal error:', err);
    return NextResponse.json({ 
      success: false, 
      error: err.message || 'Internal server error during webhook processing' 
    }, { 
      status: 500, 
      headers: corsHeaders 
    });
  }
}