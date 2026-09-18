"use client";
import React, { useState, useEffect } from 'react';

export default function SettingsMetaModule() {
  const [settings, setSettings] = useState({
    businessName: 'Ishwari Mobile Shop & AI Digital Skills',
    ownerName: 'Ravindra Borchate',
    whatsappNumber: '7219566777',
    metaPhoneId: '1387961227727412',
    metaAdAccountId: '778929936264833',
    accessToken: '',
    webhookVerifyToken: 'growth_crm_verify_2026'
  });

  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('ai_growth_crm_settings_v3');
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse settings');
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings(prev => {
      const updated = { ...prev, [name]: value };
      localStorage.setItem('ai_growth_crm_settings_v3', JSON.stringify(updated));
      return updated;
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('ai_growth_crm_settings_v3', JSON.stringify(settings));
    setStatusMsg('✅ सर्व सेटिंग्ज आणि क्रेडेंशियल्स लोकल स्टोरेजमध्ये यशस्वीरित्या सेव्ह केल्या गेल्यात!');
    setTimeout(() => setStatusMsg(''), 4000);
  };

  return (
    <div style={{ padding: '24px', color: '#f8fafc', background: '#0f172a', borderRadius: '12px' }}>
      <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#38bdf8', marginBottom: '8px' }}>
        ⚙️ Settings & Meta API (Manual Input Core)
      </h2>
      <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '20px' }}>
        हातातून WhatsApp नंबर, Phone ID, Ad Account ID आणि Access Token टाका. कोड कधीही डिलीट होणार नाही.
      </p>

      {statusMsg && (
        <div style={{ background: '#065f46', color: '#ecfdf5', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', border: '1px solid #34d399' }}>
          {statusMsg}
        </div>
      )}

      <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div style={{ background: '#1e293b', padding: '20px', borderRadius: '10px', border: '1px solid #334155' }}>
          <label style={{ display: 'block', fontSize: '13px', color: '#cbd5e1', marginBottom: '6px' }}>बिझनेस / ब्रँड नाव</label>
          <input type="text" name="businessName" value={settings.businessName} onChange={handleChange} style={inputStyle} />
          
          <label style={{ display: 'block', fontSize: '13px', color: '#cbd5e1', margin: '16px 0 6px' }}>मालक / कोच नाव</label>
          <input type="text" name="ownerName" value={settings.ownerName} onChange={handleChange} style={inputStyle} />
        </div>

        <div style={{ background: '#1e293b', padding: '20px', borderRadius: '10px', border: '1px solid #334155' }}>
          <label style={{ display: 'block', fontSize: '13px', color: '#cbd5e1', marginBottom: '6px' }}>WhatsApp फोन नंबर (उदा. 7219566777)</label>
          <input type="text" name="whatsappNumber" value={settings.whatsappNumber} onChange={handleChange} style={inputStyle} />

          <label style={{ display: 'block', fontSize: '13px', color: '#cbd5e1', margin: '16px 0 6px' }}>Meta Phone Number ID</label>
          <input type="text" name="metaPhoneId" value={settings.metaPhoneId} onChange={handleChange} style={inputStyle} />
        </div>

        <div style={{ background: '#1e293b', padding: '20px', borderRadius: '10px', border: '1px solid #334155', gridColumn: 'span 2' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#cbd5e1', marginBottom: '6px' }}>Meta Ad Account ID</label>
              <input type="text" name="metaAdAccountId" value={settings.metaAdAccountId} onChange={handleChange} style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#cbd5e1', marginBottom: '6px' }}>Webhook Verify Token</label>
              <input type="text" name="webhookVerifyToken" value={settings.webhookVerifyToken} onChange={handleChange} style={inputStyle} />
            </div>
          </div>

          <label style={{ display: 'block', fontSize: '13px', color: '#cbd5e1', margin: '16px 0 6px' }}>Graph API Access Token</label>
          <textarea name="accessToken" value={settings.accessToken} onChange={handleChange} rows={3} placeholder="EAAP..." style={{ ...inputStyle, fontFamily: 'monospace' }} />
        </div>

        <button type="submit" style={{ gridColumn: 'span 2', background: '#0284c7', color: 'white', border: 'none', padding: '14px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '15px' }}>
          💾 सर्व सेटिंग्ज सेव्ह करा (Permanent Storage)
        </button>
      </form>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  background: '#0f172a',
  border: '1px solid #475569',
  borderRadius: '6px',
  color: 'white',
  boxSizing: 'border-box',
  fontSize: '14px'
};