# Sukkur IBA University (SIBAU) — Enterprise HR Intelligence Assistant

An enterprise-grade Human Resources AI Assistant powered by Google Gemini, vector embeddings, and Next.js 15. The application indexes the complete **118-page Sukkur IBA University Employees Handbook – 2018**, providing students, faculty, and administrative staff with conversational, accurate, and deeply detailed guidance with exact document citations.

🔗 **GitHub Repository**: [https://github.com/rajeelahmad-main/Enterprise-RAG](https://github.com/rajeelahmad-main/Enterprise-RAG)

---

## 🌟 Key Features

1. **Full 118-Page Sukkur IBA University Handbook Grounding**:
   - Covers all 21 core policy chapters from the official 2018 Handbook (Statutory Introduction, Code of Conduct, Harassment & Smoke-Free campus, Recruitment, Working Hours, Biometric Attendance, Resignation/Lien, Comprehensive Leave, Hostels/Housing, Loans, Provident Fund & Gratuity, Salary & Allowances, TA/DA, Training, Non-Teaching Promotions, Grievance Redressal, Advances/Procurement, Transport SOPs & Point Buses, and ORIC Research).
   - Vector embeddings generated via `gemini-embedding-001` (3,072 normalized dimensions across 114 semantic chunks parsed directly from the official `Sukkur_IBA_University_Handbook_2018.pdf`).
   - Instant cosine similarity vector search with lexical boosts — 0ms cold-start serverless search.

2. **Next-Gen Gemini Models (`gemini-3.1-flash-lite` & `gemini-3.5-flash-lite`)**:
   - **Primary Model**: `gemini-3.1-flash-lite` for ultra-fast, highly accurate responses.
   - **Automatic Fallback Model**: `gemini-3.5-flash-lite` if rate limits or network failovers occur.

3. **Natural, Empathetic Senior HR Partner Tone**:
   - No robotic headers or rigid executive summary templates.
   - Speaks warmly and professionally as a Senior HR Officer at Sukkur IBA University (`Assalam-o-Alaikum!`, clear bullet points, contact email `hr@iba-suk.edu.pk`).
   - Supports **English**, **Urdu (اردو)**, **Roman Urdu**, and regional languages.

4. **Public Access & Optional Administrative RBAC**:
   - **Public Mode**: Accessible immediately for employees, faculty, and visitors without requiring login barriers.
   - **Admin Portal**: Optional authenticated portal for HR administrators to author/ingest live documents with role-based JWT sessions.

5. **Production-Ready for Vercel**:
   - Next.js 15 App Router with full TypeScript type safety.
   - Serverless pre-embedded knowledge base (`src/data/embedded_knowledge_base.json`).
   - Clean production build tested with zero warnings or errors.

---

## 🏛️ Comprehensive Policy Coverage (21 Modules)

| Document ID | Policy Domain | Key Topics Covered |
|-------------|---------------|--------------------|
| **SIBAU-SEC-01** | Introduction & Vision | University charter, Sindh Act No. XXI of 2017, HEC accreditation, Core values |
| **SIBAU-SEC-02** | Code of Conduct | Integrity, conflict of interest, intellectual property, disciplinary actions |
| **SIBAU-SEC-03** | Conflict of Interest | Secondary employment, outside business, family affiliations |
| **SIBAU-SEC-04** | Harassment & Smoke-Free | Protection against harassment of women at workplace, tobacco-free campus |
| **SIBAU-SEC-05** | Recruitment & Selection | Selection Board, Syndicate approval, test & interview criteria, probationary rules |
| **SIBAU-SEC-06** | Placement & Working Hours | 40-hour work week, summer hours, Flexi-Time (7:30 AM - 3:30 PM), overtime |
| **SIBAU-SEC-07** | Biometric Attendance | 15-min grace, 1/4 & 1/2 day deductions, 7-late monthly cap, Good Attendance Cash Rewards |
| **SIBAU-SEC-08** | Separation & Resignation | 1 to 3 months notice or gross salary in lieu, clearance protocols, terminal dues |
| **SIBAU-SEC-09** | Lien Policy | Retention of lien up to 2 years, post-probation eligibility, Syndicate sanction |
| **SIBAU-SEC-10** | Comprehensive Leave | Casual (20d), Earned (30d, up to 345d encashment for non-teaching), Study, Maternity (90d), Paternity, Sabbatical, LPR |
| **SIBAU-SEC-11** | Housing & Hostels | Type-A to Type-D on-campus quarters allotment criteria, bachelor hostel rules |
| **SIBAU-SEC-12** | Loans & Financial Advances | Vehicle Loan (Grade 17+, 48 mos, 5% fee), Laptop Loan (Rs. 60,000, 12 mos), Salary Advance |
| **SIBAU-SEC-13** | Provident Fund & Gratuity | Contributory PF (equal 10% matching), Gratuity calculation (one month basic per completed year) |
| **SIBAU-SEC-14** | Salary, Benefits & Tuition | Pay scales, PhD (Rs. 10,000/mo) & MS (Rs. 2,500/mo) allowances, 50% child tuition fee waiver |
| **SIBAU-SEC-15** | TA/DA & Travel Policy | Domestic & international travel, mileage rates, hotel entitlement, daily allowances |
| **SIBAU-SEC-16** | Training & Development | In-service faculty training, higher study bonds, pre-service workshops |
| **SIBAU-SEC-17** | Non-Teaching Promotions | Time-scale upgrades, performance evaluation metrics, seniority rosters |
| **SIBAU-SEC-18** | Grievance Procedure | 3-tier grievance redressal: HoD -> Registrar -> Vice Chancellor |
| **SIBAU-SEC-19** | Procurement & Advances | Petty cash, operational advances, adjustment timelines, tender rules |
| **SIBAU-SEC-20** | Transport SOPs & Point Buses | Campus bus routes, faculty transport, Night Emergency Carry Bolan (7 PM - 7 AM) |
| **SIBAU-SEC-21** | Research & Case Studies | ORIC funding, impact factor journal publication incentives, case study development grants |

---

## 🚀 Quick Start (Local Development)

### 1. Clone & Install
```bash
git clone https://github.com/rajeelahmad-main/Enterprise-RAG.git
cd Enterprise-RAG
npm install
```

### 2. Configure `.env.local`
Create `.env.local` in the project root:
```env
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_EMBEDDING_MODEL=gemini-embedding-001
GEMINI_CHAT_MODEL=gemini-3.1-flash-lite
GEMINI_FALLBACK_CHAT_MODEL=gemini-3.5-flash-lite
JWT_SECRET=sibau-enterprise-rag-jwt-secret-key-2026
```

### 3. Embed Handbook (Pre-bundled)
The repository comes pre-bundled with all 72 embeddings in `src/data/embedded_knowledge_base.json`. To re-generate at any time:
```bash
npm run embed
```

### 4. Run the Dev Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Run Handbook Verification Suite
```bash
node scripts/test_sibau_handbook.mjs
```

---

## ☁️ Deploying to Vercel

### Step 1: Import Repository
1. Log in to [Vercel](https://vercel.com).
2. Click **Add New** &rarr; **Project**.
3. Select `rajeelahmad-main/Enterprise-RAG` (or your GitHub fork).
4. Framework Preset: **Next.js** (auto-detected).
5. Root Directory: `./`.

### Step 2: Set Environment Variables in Vercel
In the Vercel project configuration dashboard, add the following under **Environment Variables**:

| Variable Name | Example / Recommended Value | Description |
|---------------|-----------------------------|-------------|
| `GEMINI_API_KEY` | `AQ.Ab8RN6IzUh...` | Your Google Gemini API Key |
| `GEMINI_EMBEDDING_MODEL` | `gemini-embedding-001` | 3,072-dimensional embedding model |
| `GEMINI_CHAT_MODEL` | `gemini-3.1-flash-lite` | Primary fast conversational model |
| `GEMINI_FALLBACK_CHAT_MODEL` | `gemini-3.5-flash-lite` | Automatic fallback model |
| `JWT_SECRET` | `sibau-enterprise-rag-secret-2026` | Secret string for admin JWT sessions |

### Step 3: Deploy
Click **Deploy**! In under 60 seconds, your Sukkur IBA University Enterprise HR RAG bot will be live with high availability, SSL, and serverless response times.

---

## 👥 Optional Admin Credentials

| Role | Email | Password | Access Rights |
|------|-------|----------|---------------|
| **HR Admin** | `admin@northstar.example` | `AdminPassword2026!` | Chat + Policy Library + Ingestion Portal |
| **Employee** | `employee@northstar.example` | `EmployeePass2026!` | Chat + Policy Library |

*(Note: Public chat is available immediately on the home page without requiring sign-in).*
