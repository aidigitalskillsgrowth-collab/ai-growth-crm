'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Supabase कनेक्शन सेटअप
const supabaseUrl = 'https://yvaqrcdqehybzlnpwaeb.supabase.co';
const supabaseAnonKey = 'sb_publishable_w0lqq3_YGhJm7twd-FJxrQ_ymV4w';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function InboxPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (err) {
      console.error('Error fetching messages:', err.message);
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif', maxWidth: '850px', margin: '0 auto', background: '#07090e', minHeight: '100vh', color: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #1F6AFF', paddingBottom: '15px', marginBottom: '20px' }}>
        <h2 style={{ color: '#38bdf8', margin: 0 }}>📱 WhatsApp CRM Live Inbox</h2>
        <button 
          onClick={fetchMessages} 
          style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          🔄 रिफ्रेश करा
        </button>
      </div>

      {errorMsg && (
        <div style={{ background: '#ffebee', color: '#c62828', padding: '12px', borderRadius: '8px', marginBottom: '15px' }}>
          Error: {errorMsg}
        </div>
      )}
      
      {loading ? (
        <p style={{ textAlign: 'center', color: '#94a3b8', padding: '40px' }}>मेसेजेस लोड होत आहेत...</p>
      ) : messages.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', background: '#0d1424', borderRadius: '12px', border: '1px solid #1e293b' }}>
          <p style={{ color: '#cbd5e1', fontWeight: 'bold' }}>कोणतेही मेसेजेस उपलब्ध नाहीत.</p>
          <p style={{ color: '#64748b', fontSize: '12px' }}>दुसऱ्या नंबरवरून तुमच्या WhatsApp नंबरवर मेसेज पाठवून तपासा.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {messages.map((msg, index) => (
            <div
              key={msg.id || index}
              style={{
                background: '#0d1424',
                padding: '16px',
                borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
                borderLeft: '5px solid #1F6AFF',
                border: '1px solid #1e293b'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <strong style={{ color: '#38bdf8', fontSize: '15px' }}>
                  📞 Sender Number: {msg.sender || msg.phone || msg.from || 'Unknown Sender'}
                </strong>
                <small style={{ color: '#94a3b8' }}>
                  {msg.created_at ? new Date(msg.created_at).toLocaleString() : ''}
                </small>
              </div>
              <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#e2e8f0' }}>
                💬 Message: {msg.text || msg.message || msg.message_text || msg.body || 'Media/Non-text Message'}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}