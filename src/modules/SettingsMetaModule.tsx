"use client";
import React, { useState, useEffect } from 'react';

export default function SettingsMetaModule() {
  const [whatsapp, setWhatsapp] = useState('7219566777');
  const [phoneId, setPhoneId] = useState('1387961227727412');
  const [adAccountId, setAdAccountId] = useState('778929936264833');
  const [token, setToken] = useState('');
  const [savedMsg, setSavedMsg] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem('meta_manual_config');
    if (data) {
      const parsed = JSON.parse(data);
      if (parsed.whatsapp) setWhatsapp(parsed.whatsapp);
      if (parsed.phoneId) setPhoneId(parsed.phoneId);
      if (parsed.adAccountId) setAdAccountId(parsed.adAccountId);
      if (parsed.token) setToken(parsed.token);
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('meta_manual_config', JSON.stringify({ whatsapp, phoneId, adAccountId, token }));
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  };

  return (
    <div style={{ color: 'white', padding: '10px' }}>
      <div style={{ background: '#1e293b', padding: '24px', borderRadius: '12px', border: '1px solid #334155' }}>
        <h3 style={{ fontSize: '18px', color: '#38bdf8', marginBottom: '16px' }}>⚙️ मॅन्युअल मेटा & व्हॉट्सॲप क्रेडेंशियल्स</h3>
        
        {savedMsg && (
          <div style={{ background: '#065f46', color: '#ecfdf5', padding: '10px', borderRadius: '6px', marginBottom: '16px' }}>
            ✅ क्रेडेंशियल्स यशस्वीरित्या सेव्ह झाले!
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '6px' }}>WhatsApp Number</label>
            <input type="text" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '6px' }}>Meta Phone Number ID</label>
            <input type="text" value={phoneId} onChange={e => setPhoneId(e.target.value)} style={inputStyle} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '6px' }}>Meta Ad Account ID</label>
            <input type="text" value={adAccountId} onChange={e => setAdAccountId(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '6px' }}>Access Token (Optional/Live)</label>
            <input type="password" value={token} onChange={e => setToken(e.target.value)} placeholder="EAAP..." style={inputStyle} />
          </div>
        </div>

        <button onClick={handleSave} style={{ background: '#0284c7', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
          💾 Save Settings
        </button>
      </div>
    </div>
  );
}

const inputStyle = { width: '100%', padding: '10px', background: '#0f172a', border: '1px solid #475569', borderRadius: '6px', color: 'white', boxSizing: 'border-box' as const };