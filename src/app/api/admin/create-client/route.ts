import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = String(body?.email || '').trim().toLowerCase();
    const password = String(body?.password || '').trim();
    const ownerName = String(body?.ownerName || 'Client').trim();
    const businessName = String(body?.businessName || 'Client Business').trim();
    const planType = String(body?.planType || 'whatsapp_starter').trim();
    const allowedModules = Array.isArray(body?.allowedModules)
      ? Array.from(new Set([...body.allowedModules, 'settings']))
      : ['dashboard', 'inbox', 'agents', 'settings'];

    if (!email) {
      return NextResponse.json({ error: 'ईमेल आयडी आवश्यक आहे.' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { error: 'Vercel मध्ये SUPABASE_SERVICE_ROLE_KEY सेट केलेली नाही.' },
        { status: 500 }
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // १. Supabase Auth मध्ये युजर तपासा किंवा तयार/अपडेट करा
    const { data: usersData, error: listErr } = await supabaseAdmin.auth.admin.listUsers();
    if (listErr) throw listErr;

    const existingUser = usersData?.users?.find(
      (u) => String(u.email || '').toLowerCase() === email
    );

    let userId = existingUser?.id;

    if (existingUser && userId) {
      if (password && password.length >= 6) {
        const { error: updErr } = await supabaseAdmin.auth.admin.updateUserById(userId, {
          password,
          email_confirm: true,
        });
        if (updErr) throw updErr;
      }
    } else {
      if (!password || password.length < 6) {
        return NextResponse.json(
          { error: 'नवीन क्लायंटसाठी किमान ६ अक्षरी पासवर्ड आवश्यक आहे.' },
          { status: 400 }
        );
      }
      const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });
      if (createErr) throw createErr;
      userId = created.user?.id;
    }

    if (!userId) {
      return NextResponse.json({ error: 'युजर ID मिळू शकला नाही.' }, { status: 500 });
    }

    // २. client_settings मध्ये प्लॅन आणि Lock/Unlock मॉड्यूल्स सेव्ह करा
    const { data: existingRow } = await supabaseAdmin
      .from('client_settings')
      .select('user_id')
      .ilike('client_email', email)
      .maybeSingle();

    const targetId = existingRow?.user_id || userId;

    const { error: upsertErr } = await supabaseAdmin.from('client_settings').upsert({
      user_id: targetId,
      client_email: email,
      ownerName,
      businessName,
      plan_type: planType,
      allowed_modules: allowedModules,
      aiAutoReply: true,
      updated_at: new Date().toISOString(),
    });

    if (upsertErr) throw upsertErr;

    return NextResponse.json({ success: true, userId: targetId });
  } catch (err: any) {
    console.error('Admin create-client error:', err);
    return NextResponse.json(
      { error: err?.message || 'क्लायंट तयार करताना त्रुटी आली.' },
      { status: 500 }
    );
  }
}