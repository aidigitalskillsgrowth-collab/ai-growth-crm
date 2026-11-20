import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

async function sendWhatsAppReply(
  phoneNumberId: string,
  accessToken: string,
  toPhone: string,
  replyText: string
): Promise<boolean> {
  const url = `https://graph.facebook.com/v21.0/${encodeURIComponent(phoneNumberId)}/messages`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to: toPhone,
      type: 'text',
      text: { body: replyText },
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    console.error('Meta Send Message Error:', JSON.stringify(data));
    return false;
  }
  return true;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  const VERIFY_TOKEN = process.env.WEBHOOK_VERIFY_TOKEN || 'ravi_crm_verified_2026';

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      return new NextResponse(challenge, { status: 200 });
    }
    return new NextResponse('Forbidden', { status: 403 });
  }
  return new NextResponse('Bad Request', { status: 400 });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const entry = body?.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const messages = value?.messages;
    const contactName = String(value?.contacts?.[0]?.profile?.name || '').trim();
    const phoneNumberId = String(value?.metadata?.phone_number_id || '').trim();

    if (messages && messages.length > 0) {
      const message = messages[0];
      const senderPhone = String(message.from || '').trim();
      const messageText = String(message.text?.body || 'Media/Non-text Message').trim();

      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
      const supabaseKey =
        process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

      if (supabaseUrl && supabaseKey) {
        const supabase = createClient(supabaseUrl, supabaseKey);

        // १. Inbox मध्ये मेसेज सेव्ह करणे
        await supabase.from('messages').insert([
          {
            sender: senderPhone,
            text: messageText,
            meta_phone_id: phoneNumberId || null,
          },
        ] as any);

        if (phoneNumberId && message.text?.body) {
          const { data: client } = await supabase
            .from('client_settings')
            .select('*')
            .eq('metaPhoneId', phoneNumberId)
            .maybeSingle();

          const isPlanExpired =
            client?.billing_cycle === 'expired' ||
            (client?.plan_expires_at && new Date(client.plan_expires_at).getTime() < Date.now());

          if (isPlanExpired) {
            return NextResponse.json({ success: true, expired: true }, { status: 200 });
          }

          const allowedList = Array.isArray(client?.allowed_modules)
            ? client.allowed_modules
            : ['inbox', 'agents'];
          const hasModuleAccess =
            allowedList.includes('inbox') ||
            allowedList.includes('agents') ||
            allowedList.includes('workflow');

          let apiKey = String(client?.geminiApiKey || process.env.GEMINI_API_KEY || '').trim();
          if (!apiKey) {
            const { data: adminRow } = await supabase
              .from('client_settings')
              .select('geminiApiKey')
              .ilike('client_email', 'aidigitalskillsgrowth@gmail.com')
              .maybeSingle();
            apiKey = String(adminRow?.geminiApiKey || '').trim();
          }

          const accessToken = String(
            client?.accessToken || process.env.WHATSAPP_ACCESS_TOKEN || ''
          ).trim();
          const systemPrompt = String(client?.systemPrompt || '').trim();
          const autoReplyEnabled = client?.aiAutoReply !== false;

          // २. AI Workflow Builder मधील सक्रिय नियम (Triggers) तपासणे
          const lowerMsg = messageText.toLowerCase();
          const { data: activeWorkflows } = await supabase
            .from('workflows')
            .select('*')
            .eq('meta_phone_id', phoneNumberId)
            .eq('is_active', true);

          let matchedWorkflow: any = null;
          if (Array.isArray(activeWorkflows)) {
            for (const wf of activeWorkflows) {
              const keywords = String(wf.trigger_keywords || '')
                .split(',')
                .map((k) => k.trim().toLowerCase())
                .filter(Boolean);

              if (keywords.includes('*') || keywords.some((kw) => lowerMsg.includes(kw))) {
                matchedWorkflow = wf;
                break;
              }
            }
          }

          // ३. जर Workflow मॅच झाला तर लीड आपोआप Leads Directory मध्ये सेव्ह करणे
          if (matchedWorkflow) {
            const cleanPhone = senderPhone.replace(/^91/, '');
            const { data: existingLead } = await supabase
              .from('leads')
              .select('id')
              .eq('meta_phone_id', phoneNumberId)
              .eq('phone', cleanPhone)
              .maybeSingle();

            if (existingLead?.id) {
              await supabase
                .from('leads')
                .update({
                  notes: `Latest WhatsApp (${matchedWorkflow.name}): ${messageText}`,
                  status: 'Contacted',
                })
                .eq('id', existingLead.id);
            } else {
              await supabase.from('leads').insert([
                {
                  client_email: client?.client_email || '',
                  meta_phone_id: phoneNumberId,
                  name: contactName || `WhatsApp User (${cleanPhone.slice(-4)})`,
                  phone: cleanPhone,
                  service: matchedWorkflow.lead_service || 'WhatsApp Inquiry',
                  deal_value: Number(matchedWorkflow.lead_value) || 2000,
                  status: 'New Lead',
                  source: `Workflow: ${matchedWorkflow.name}`,
                  sentiment: 'Highly Interested',
                  notes: `Auto-captured via WhatsApp: "${messageText}"`,
                  pipeline_id: 'default_main',
                },
              ]);
            }
          }

          // ४. रिप्लाय पाठवणे (Workflow Custom Reply किंवा Gemini AI Reply)
          if (autoReplyEnabled && hasModuleAccess && accessToken) {
            let finalReply = '';

            if (matchedWorkflow && matchedWorkflow.action_type === 'custom_reply' && matchedWorkflow.reply_template) {
              finalReply = String(matchedWorkflow.reply_template)
                .replace(/\{Name\}/gi, contactName || 'मित्र')
                .replace(/\{Service\}/gi, matchedWorkflow.lead_service || 'आमची सेवा')
                .replace(/\{Amount\}/gi, String(matchedWorkflow.lead_value || ''));
            } else if (apiKey) {
              try {
                const origin = request.nextUrl.origin;
                const workflowHint = matchedWorkflow
                  ? `\n\n[Active Workflow Triggered: ${matchedWorkflow.name} | Service: ${matchedWorkflow.lead_service} | Price: ₹${matchedWorkflow.lead_value}. Answer accordingly and encourage booking.]`
                  : '';

                const chatRes = await fetch(`${origin}/api/gemini-chat`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    apiKey,
                    message: messageText,
                    systemPrompt: `${systemPrompt}${workflowHint}`,
                  }),
                });
                const chatData = await chatRes.json().catch(() => ({}));
                if (chatRes.ok && chatData?.reply) {
                  finalReply = String(chatData.reply).trim();
                }
              } catch (chatErr: any) {
                console.error('Internal /api/gemini-chat fetch failed:', chatErr?.message || chatErr);
              }
            }

            if (!finalReply) {
              finalReply = `नमस्कार! 🙏 ${
                client?.businessName || 'AI Growth CRM'
              } कडून आपला मेसेज प्राप्त झाला आहे. आम्ही लवकरच आपल्याशी संपर्क साधतो.`;
            }

            await sendWhatsAppReply(phoneNumberId, accessToken, senderPhone, finalReply);
          }
        }
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: any) {
    console.error('Webhook POST Catch Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}