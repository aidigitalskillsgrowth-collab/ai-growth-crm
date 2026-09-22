import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const RAZORPAY_KEY_SECRET = 'AV21X64AuZ1bPbM8BnfNCSpU';

const supabaseUrl = 'https://yvaqrcdqehybzlnpwaeb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2YXFyY2RxZWh5YnpsbnB3YWViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcyOTU1MTAsImV4cCI6MjEwMjg3MTUxMH0.fLqHfgvK4n12NfM_xa-_5uhO7Z6eLaWLzWxwVABCuZI';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      planType,
    } = await request.json();

    const generatedSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json({ success: false, error: 'अवैध पेमेंट स्वाक्षरी' }, { status: 400 });
    }

    const expiryDays = planType === 'yearly' ? 365 : 30;
    const currentPeriodEnd = new Date();
    currentPeriodEnd.setDate(currentPeriodEnd.getDate() + expiryDays);

    await supabase.from('subscriptions').insert([
      {
        razorpay_subscription_id: razorpay_payment_id,
        plan_name: planType === 'yearly' ? 'Pro Yearly' : 'Pro Monthly',
        status: 'active',
        current_period_end: currentPeriodEnd.toISOString(),
      },
    ]);

    return NextResponse.json({ success: true, message: 'सबस्क्रिप्शन सक्रिय झाले!' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}