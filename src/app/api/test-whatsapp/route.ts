import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const WHATSAPP_PHONE_NUMBER_ID = '1230282856843762';
  const WHATSAPP_ACCESS_TOKEN = 'EAAPAlXREmykBSZAcfMPQeXROrk9cYs9nwFDChZASWDgPn7tyIuhZCI2752CZAo5hv56LrM1fxF5pl1vZBOht2K2d1gXKdCwaf41YSnxWqvO1zaZATDZBto2sE6e9ZAAxAky2ttPO2YH0POj0AH0ZCZBAxfbP5RRbdzZALZCB8ZCFSUeXYkyVxuieWOXFO3Nub6i5cea33TxLCYdKje7kZC6zGgcqI64BPVrpTZAuMEeXD08qWc9mDBUsRBBRPKhaBHhK23ziZCNSmuTims0yyS47cNqW23thxfWS';

  const recipientPhone = '919922666144';
  const url = `https://graph.facebook.com/v20.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`;

  const payload = {
    messaging_product: 'whatsapp',
    to: recipientPhone,
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
    return NextResponse.json({
      status: res.status,
      response_from_meta: data,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}