# Enterprise AI CRM - Project Memory & Architecture

## 1. Project Overview
- **Name:** Enterprise AI CRM (`crm.aidigitalskillsgrowth.com`)
- **Developer/Owner:** Ravindra Borchate (Ravi Borchate / Ravi Patil)
- **Environment:** Cursor IDE, Live Cloud Server
- **Core Purpose:** To provide digital marketing consultants, coaches, and local businesses with an all-in-one CRM, WhatsApp automation, and AI website/funnel builder without needing coding knowledge.

## 2. Key Modules & File Paths
- **Main Dashboard & Layout:** `src/app/page.tsx`, `src/components/Sidebar.jsx`
- **Website & Funnel Builder / Templates:** `src/app/site/page.tsx`
- **API Routes (Backend):**
  - `src/app/api/create-subscription/`
  - `src/app/api/lead-webhook/`
  - `src/app/api/test-whatsapp/`
  - `src/app/api/verify-payment/`

## 3. Core Features Integrated
- Multi-user support and client management dashboard.
- WhatsApp Cloud API integration for automated messaging and bulk campaigns.
- AI Agents and Chatbots for 24x7 lead response.
- Pre-built templates and AI Website/Funnel generation system.
- Payment gateway integration.

## 4. Important Rules & Safeguards
- **Never delete or modify core existing features** (like WhatsApp automation, branding elements such as 'Ishwari Mobile Shop' or 'Pro SaaS', and sidebar navigation) when updating or fixing bugs.
- Always retain existing template lists and builder functions during code refactoring.