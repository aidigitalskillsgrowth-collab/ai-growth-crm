import { NextResponse } from 'next/server';

const PREFERRED_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-1.5-flash-latest',
  'gemini-1.5-pro-latest',
  'gemini-1.5-flash',
  'gemini-1.5-pro',
  'gemini-pro',
];

async function listSupportedGenerateModels(apiKey) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(apiKey)}`
  );
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData?.error?.message || `ListModels failed (${res.status})`);
  }
  const data = await res.json();
  const models = Array.isArray(data?.models) ? data.models : [];
  return models
    .filter((m) => Array.isArray(m.supportedGenerationMethods) && m.supportedGenerationMethods.includes('generateContent'))
    .map((m) => String(m.name || '').replace(/^models\//, ''))
    .filter(Boolean);
}

async function callGenerateContent(modelName, apiKey, promptText) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
    modelName
  )}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: promptText }],
        },
      ],
    }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const msg = data?.error?.message || `Request failed (${response.status})`;
    const err = new Error(msg);
    err.status = response.status;
    throw err;
  }

  const replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!replyText) {
    throw new Error('Empty response received from Gemini API');
  }

  return replyText;
}

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const apiKey = String(body?.apiKey || process.env.GEMINI_API_KEY || '').trim();
    const message = String(body?.message || '').trim();
    const systemPrompt = String(
      body?.systemPrompt ||
        'तुम्ही एक हुशार, नम्र आणि मदतीला तत्पर असलेले AI असिस्टंट आहात. ग्राहकाच्या प्रश्नाला नैसर्गिक आणि स्पष्ट भाषेत उत्तर द्या.'
    ).trim();

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini API Key दिलेली नाही. कृपया Settings मध्ये API Key टाकून सेव्ह करा.' },
        { status: 400 }
      );
    }

    if (!message) {
      return NextResponse.json({ error: 'मेसेज रिक्त आहे.' }, { status: 400 });
    }

    const composedPrompt = [
      `System Instructions:\n${systemPrompt}`,
      `Customer Message:\n${message}`,
      `Respond naturally, helpfully, and conversationally matching the user's language (Marathi / Hinglish / English).`,
    ].join('\n\n');

    let lastError = null;
    let triedDynamicList = false;
    const candidateQueue = [...PREFERRED_MODELS];

    while (candidateQueue.length > 0) {
      const currentModel = candidateQueue.shift();
      try {
        const reply = await callGenerateContent(currentModel, apiKey, composedPrompt);
        return NextResponse.json({
          reply,
          modelUsed: currentModel,
          connected: true,
        });
      } catch (err) {
        lastError = err;
        const isNotFoundOrUnsupported =
          err?.status === 404 ||
          String(err?.message || '').toLowerCase().includes('not found') ||
          String(err?.message || '').toLowerCase().includes('not supported');

        if (isNotFoundOrUnsupported && !triedDynamicList) {
          triedDynamicList = true;
          try {
            const availableModels = await listSupportedGenerateModels(apiKey);
            for (const m of availableModels) {
              if (!candidateQueue.includes(m) && m !== currentModel) {
                candidateQueue.unshift(m);
              }
            }
          } catch (listErr) {
            lastError = listErr;
            break;
          }
        }
      }
    }

    return NextResponse.json(
      {
        error: lastError?.message || 'Gemini API कडून प्रतिसाद मिळू शकला नाही.',
        connected: false,
      },
      { status: 502 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: error?.message || 'सर्व्हरमध्ये तांत्रिक अडचण आली.',
        connected: false,
      },
      { status: 500 }
    );
  }
}