import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export const dynamic = 'force-dynamic';

const RAZORPAY_KEY_ID = 'rzp_test_TVGDpfU8rFQjf9';
const RAZORPAY_KEY_SECRET = 'AV21X64AuZ1bPbM8BnfNCSpU';

export async function POST(request: Request) {
  try {
    const razorpay = new Razorpay({
      key_id: RAZORPAY_KEY_ID,
      key_secret: RAZORPAY_KEY_SECRET,
    });

    const body = await request.json().catch(() => ({}));
    const planType = body?.planType || 'monthly';
    const amount = planType === 'yearly' ? 1999900 : 199900; // पैसे (Paise)

    const order = await razorpay.orders.create({
      amount: amount,
      currency: 'INR',
      receipt: `sub_${Date.now()}`,
    });

    return NextResponse.json({
      success: true,
      order: order,
      keyId: RAZORPAY_KEY_ID,
    });
  } catch (error: any) {
    console.error('Razorpay Error:', error);
    const msg = error?.error?.description || error?.message || 'Razorpay प्रमाणीकरण अयशस्वी';
    return NextResponse.json({ success: false, error: msg }, { status: 200 });
  }
}