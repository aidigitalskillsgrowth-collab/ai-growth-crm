import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ success: false, error: 'Prompt is required' }, { status: 400 });
    }

    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ success: false, error: 'DeepSeek API key missing in environment' }, { status: 500 });
    }

    const apiResponse = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'You are an expert web developer. Given a user prompt, generate a single-file professional, modern landing page using HTML and Tailwind CSS. Output ONLY valid HTML code starting with <!DOCTYPE html> and containing all styles inline or via Tailwind CDN. Do not include markdown code blocks like ```html.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
      }),
    });

    const data = await apiResponse.json();

    if (!apiResponse.ok) {
      console.error('DeepSeek API Error Response:', data);
      return NextResponse.json({ 
        success: false, 
        error: data.error?.message || 'DeepSeek API failed to respond properly' 
      }, { status: 500 });
    }

    const generatedHtml = data.choices?.[0]?.message?.content || '<p>Error generating website content</p>';

    return NextResponse.json({
      success: true,
      html: generatedHtml,
    });

  } catch (err: any) {
    console.error('AI Website Generation Exception:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}