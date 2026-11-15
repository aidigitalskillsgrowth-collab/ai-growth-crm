'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// सुरक्षितपणे Supabase क्लायंट तयार करणे (क्रॅश होणार नाही)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

export default function InboxPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMessages() {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setMessages(data || []);
      } catch (err) {
        console.error('Error fetching messages:', err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchMessages();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>WhatsApp CRM Inbox</h2>
      {loading ? (
        <p>लोड होत आहे...</p>
      ) : messages.length === 0 ? (
        <p>कोणतेही मेसेजेस उपलब्ध नाहीत.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {messages.map((msg) => (
            <li
              key={msg.id}
              style={{
                background: '#f4f4f4',
                margin: '10px 0',
                padding: '12px',
                borderRadius: '8px',
                borderLeft: '4px solid #1F6AFF',
              }}
            >
              <strong>Sender:</strong> {msg.sender} <br />
              <strong>Message:</strong> {msg.text} <br />
              <small style={{ color: '#666' }}>
                {new Date(msg.created_at).toLocaleString()}
              </small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}