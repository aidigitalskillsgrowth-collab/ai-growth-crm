'use client';

import React from 'react';
import { 
  LayoutDashboard, Users, Layers, Globe, QrCode, 
  Bot, Megaphone, FileText, GitBranch, MessageSquare, 
  Calendar, PhoneCall, Wallet, Share2, Settings, ShieldCheck 
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: 'dashboard', label: 'Growth Dashboard', icon: LayoutDashboard },
    { id: 'leads', label: 'Growth Leads', icon: Users, badge: '15' },
    { id: 'pipeline', label: 'Growth CRM & Pipeline', icon: Layers },
    { id: 'website', label: 'Website & Funnels', icon: Globe },
    { id: 'payments', label: 'Payment Gateways (All)', icon: QrCode },
    { id: 'agents', label: 'AI Agents & Chatbot', icon: Bot },
    { id: 'meta_ads', label: 'Ad Launcher (Meta)', icon: Megaphone },
    { id: 'templates', label: 'Template Manager', icon: FileText },
    { id: 'workflow', label: 'AI Workflow Builder', icon: GitBranch },
    { id: 'inbox', label: 'AI Inbox / WhatsApp', icon: MessageSquare },
    { id: 'calendar', label: 'Smart Calendar', icon: Calendar },
    { id: 'ivr', label: 'AI Sales & IVR', icon: PhoneCall },
    { id: 'finance', label: 'AI Finance & Revenue', icon: Wallet },
    { id: 'social', label: 'Social Media Auto-Post', icon: Share2 },
    { id: 'settings', label: 'Settings & Meta API', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#080c16] border-r border-slate-800/80 flex flex-col justify-between p-3.5 h-full select-none shrink-0">
      <div className="space-y-4 overflow-y-auto pr-1">
        <div className="flex items-center gap-3 px-2 py-1.5">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-black text-white text-sm shadow-lg shadow-blue-500/25">
            AI
          </div>
          <div>
            <h2 className="text-sm font-black text-white tracking-wide leading-tight">AI Growth CRM</h2>
            <span className="text-[10px] text-blue-400 font-semibold">Pro Automation Suite</span>
          </div>
        </div>

        <nav className="space-y-1 text-xs">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium transition text-left cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon size={16} className={isActive ? 'text-white' : 'text-slate-400'} />
                  <span className="text-[12px]">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="bg-blue-950 text-blue-400 border border-blue-800/50 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="pt-2 border-t border-slate-800/60">
        <div className="p-2.5 bg-[#0d1424] border border-slate-800/80 rounded-xl flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <ShieldCheck size={14} />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-200">Ishwari Mobile</p>
            <span className="text-[9px] text-emerald-400 font-medium">● Pro SaaS Active</span>
          </div>
        </div>
      </div>
    </aside>
  );
}