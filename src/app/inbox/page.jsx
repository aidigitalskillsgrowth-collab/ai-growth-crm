'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

export default function InboxPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

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
        
        console.log("Fetched Messages from Supabase:", data); // डीबग करण्यासाठी
        setMessages(data || []);
      } catch (err) {
        console.error('Error fetching messages:', err.message);
        setErrorMsg(err.message);
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

      {errorMsg && (
        <div style={{ background: '#ffebee', color: '#c62828', padding: '10px', borderRadius: '5px', margin: '10px 0' }}>
          Error: {errorMsg}
        </div>
      )}
      
      {loading ? (
        <p>मेसेजेस लोड होत आहेत...</p>
      ) : messages.length === 0 ? (
        <p>कोणतेही मेसेजेस उपलब्ध नाहीत.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' }}>
          {messages.map((msg, index) => (
            <div
              key={msg.id || index}
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
                  📞 {msg.sender || msg.phone || msg.from || 'Unknown Sender'}
                </strong>
                <small style={{ color: '#666' }}>
                  {msg.created_at ? new Date(msg.created_at).toLocaleString() : ''}
                </small>
              </div>
              <p style={{ margin: '5px 0 0 0', fontSize: '15px', color: '#333' }}>
                💬 {msg.text || msg.message || msg.message_text || msg.body || JSON.stringify(msg)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}