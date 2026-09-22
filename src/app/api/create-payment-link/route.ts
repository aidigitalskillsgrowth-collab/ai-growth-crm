import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const customerName = body?.customerName || 'Customer';
    const customerPhone = body?.customerPhone || '';
    const amount = body?.amount || '999';
    const note = body?.note || 'CRM Payment';

    const upiLink = `upi://pay?pa=ishwarimobile@upi&pn=Ishwari%20Mobile%20Shop&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiLink)}`;

    return NextResponse.json({
      success: true,
      paymentUrl: upiLink,
      qrUrl: qrUrl,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed' },
      { status: 500 }
    );
  }
}
