'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

export default function InboxPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMessages() {
      try {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        );

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
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ color: '#0A1026', borderBottom: '2px solid #1F6AFF', paddingBottom: '10px' }}>
        📱 WhatsApp CRM Inbox
      </h2>
      
      {loading ? (
        <p>मेसेजेस लोड होत आहेत...</p>
      ) : messages.length === 0 ? (
        <p>कोणतेही मेसेजेस उपलब्ध नाहीत.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' }}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                background: '#ffffff',
                padding: '15px',
                borderRadius: '8px',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                borderLeft: '5px solid #1F6AFF',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <strong style={{ color: '#1F6AFF', fontSize: '16px' }}>
                  📞 {msg.sender || 'Unknown Sender'}
                </strong>
                <small style={{ color: '#666' }}>
                  {new Date(msg.created_at).toLocaleString()}
                </small>
              </div>
              <p style={{ margin: '5px 0 0 0', fontSize: '15px', color: '#333' }}>
                💬 {msg.text || msg.message_text || 'Media/Non-text Message'}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}