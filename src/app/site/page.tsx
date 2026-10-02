'use client';

import { useState } from 'react';

export default function WebsiteBuilderPage() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [htmlCode, setHtmlCode] = useState('');

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt) return;

    setLoading(true);
    try {
      const res = await fetch('/api/generate-website', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (data.success) {
        setHtmlCode(data.html);
      } else {
        alert('Error: ' + data.error);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to generate website.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">AI Website & Funnel Builder 🚀</h1>
      
      <form onSubmit={handleGenerate} className="mb-6 flex gap-3">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="उदा. Yoga classes landing page with lead capture form..."
          className="flex-1 p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Generating AI Page...' : 'Generate Website ✨'}
        </button>
      </form>

      {/* Live Preview Section */}
      <div className="border rounded-xl overflow-hidden shadow-lg bg-white h-[600px]">
        <div className="bg-gray-100 px-4 py-2 border-b text-sm text-gray-600 font-medium">
          Live Website Preview 🌐
        </div>
        {htmlCode ? (
          <iframe
            srcDoc={htmlCode}
            title="Generated Website Preview"
            className="w-full h-full border-none"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            तुमचा प्रॉम्प्ट टाका आणि जादू पहा! येथे लाईव्ह वेबसाईट दिसेल.
          </div>
        )}
      </div>
    </div>
  );
}