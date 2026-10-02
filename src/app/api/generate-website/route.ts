import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ success: false, error: 'Prompt is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ success: false, error: 'Gemini API key missing in environment' }, { status: 500 });
    }

    // Google Gemini API Direct REST Endpoint (Gemini 1.5 Pro / Flash)
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const apiResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are an expert web developer. Given the user business prompt: "${prompt}", generate a professional, high-converting single-file landing page layout using modern HTML and Tailwind CSS.`
              }
            ]
          }
        ]
      }),
    });

    const data = await apiResponse.json();

    if (!apiResponse.ok) {
      console.error('Gemini API Error Response:', data);
      return NextResponse.json({ 
        success: false, 
        error: data.error?.message || 'Gemini API failed to respond properly' 
      }, { status: 500 });
    }

    const generatedHtml = data.candidates?.[0]?.content?.parts?.[0]?.text || '<p>Error generating website content</p>';

    return NextResponse.json({
      success: true,
      html: generatedHtml,
    });

  } catch (err: any) {
    console.error('AI Website Generation Exception:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}