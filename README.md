# Northstar HR Intelligence — Enterprise RAG Chatbot

An enterprise-grade Human Resources & IT Security AI Assistant powered by Google Gemini, vector embeddings, and Next.js 15. The application enables employees to ask natural language questions about corporate policies and receive grounded answers with exact source citations, while providing HR Administrators with dynamic document ingestion and role-based access control (RBAC).

---

## 🌟 Key Features

1. **Enterprise Grounded RAG Architecture**:
   - Indexes 20 comprehensive Northstar Digital Services HR & IT policies.
   - Vector embeddings generated via `gemini-embedding-001` (3072 dimensions).
   - Fast cosine similarity retrieval with lexical keyword boosts.
   - Strict hallucination refusal prompt: answers only from verified company documents and cites exact Document IDs (e.g. `[HR-002: Annual Leave Policy]`).

2. **Enterprise Authentication & RBAC**:
   - Multi-role support: **Employee** vs. **HR Admin**.
   - Secure HTTP-only JWT session cookies and bcrypt password hashing.
   - Protected API routes (`/api/chat`, `/api/documents`, `/api/documents/ingest`).
   - One-click demo sign-in for quick evaluation.

3. **Dynamic Ingestion (Admin Portal)**:
   - HR Administrators can author or upload new policy documents directly through the UI.
   - Documents are automatically chunked, embedded via Gemini, and made instantly searchable by the RAG bot without application restarts.

4. **Production-Ready for Vercel**:
   - Next.js 15 App Router with full TypeScript type safety.
   - Serverless-compatible in-memory and bundled vector store (`src/data/embedded_knowledge_base.json`).
   - Fully automated test suites for auth, RAG accuracy, and live HTTP endpoints.

---

## 🏢 Included Company Policies (20 Documents)

| Document ID | Policy Title | Department Owner |
|-------------|--------------|------------------|
| **HR-001** | Employee Handbook | People Operations |
| **HR-002** | Annual Leave Policy | People Operations |
| **HR-003** | Sick Leave and Absence Reporting | People Operations |
| **HR-004** | Remote and Hybrid Work Policy | People Operations & IT |
| **HR-005** | Workplace Code of Conduct | People Operations & Legal |
| **HR-006** | Anti-Harassment and Dignity at Work | People Operations & Legal |
| **HR-007** | New Employee Onboarding Checklist | People Operations |
| **HR-008** | Performance Review and Development | People Operations |
| **HR-009** | Compensation and Payroll Guide | Finance & People Operations |
| **HR-010** | Business Travel and Expense Reimbursement | Finance |
| **IT-011** | Information Security Policy | IT Security |
| **IT-012** | Data Privacy and Records Retention | IT & Compliance |
| **HR-013** | Learning and Professional Development | People Operations |
| **HR-014** | Temporary Working Away Policy | People Operations & IT |
| **ETH-015** | Grievance and Whistleblowing Procedure | Ethics & Compliance |
| **ETH-016** | Conflict of Interest and Secondary Employment | Ethics & Compliance |
| **HR-017** | Employee Feedback and Open Door Policy | People Operations |
| **IT-018** | Company Asset and Device Use | IT Operations |
| **HR-019** | Recruitment and Employee Referral Scheme | Talent Acquisition |
| **HR-020** | Resignation and Offboarding Procedure | People Operations & IT |

---

## 🚀 Quick Start (Local Development)

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create or verify `.env.local`:
```env
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_EMBEDDING_MODEL=gemini-embedding-001
GEMINI_CHAT_MODEL=gemini-3.8-flash
JWT_SECRET=northstar-digital-enterprise-rag-jwt-secret-key-2026
```

### 3. Generate Policy Embeddings
```bash
npm run embed
```
This chunks and embeds all 20 company policies and generates `src/data/embedded_knowledge_base.json`.

### 4. Run Automated Test Suites
```bash
# Test 1: Authentication & RBAC security test
npm run test-auth

# Test 2: RAG retrieval & answer benchmark
npm run test-rag

# Test 3: Run both unit suites
npm test
```

### 5. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 👥 Seed Credentials for Testing

| Role | Email | Password | Access Rights |
|------|-------|----------|---------------|
| **HR Admin** | `admin@northstar.example` | `AdminPassword2026!` | Chat + Policy Library + Admin Ingestion Portal |
| **Employee** | `employee@northstar.example` | `EmployeePass2026!` | Chat + Policy Library |
| **Employee** | `sarah.chen@northstar.example` | `SarahPass2026!` | Chat + Policy Library |

*Tip: The login page includes 1-Click buttons to instantly sign in as an Admin or Employee.*

---

## ☁️ Deploying to Vercel

### Option 1: Deploy with Vercel Web Dashboard (Recommended)

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "feat: complete enterprise HR RAG chatbot with Gemini & RBAC"
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git branch -M main
   git push -u origin main
   ```

2. **Import into Vercel**:
   - Go to [vercel.com](https://vercel.com) and log in.
   - Click **Add New** &rarr; **Project**.
   - Select your GitHub repository.
   - Framework preset: **Next.js** (automatically detected).
   - Root directory: `./` (default).

3. **Set Environment Variables in Vercel**:
   - `GEMINI_API_KEY`: `your_gemini_api_key_here`
   - `GEMINI_EMBEDDING_MODEL`: `gemini-embedding-001`
   - `GEMINI_CHAT_MODEL`: `gemini-3.1-flash-lite`
   - `GEMINI_FALLBACK_CHAT_MODEL`: `gemini-3.5-flash-lite`
   - `JWT_SECRET`: `northstar-digital-enterprise-rag-jwt-secret-key-2026`

4. Click **Deploy**! Your enterprise HR RAG chatbot will be live in under 60 seconds with SSL and global CDN.

---

### Option 2: Deploy with Vercel CLI

```bash
# Install Vercel CLI if needed
npm install -g vercel

# Log in and deploy
vercel
```
When prompted:
- Set up and deploy: **Yes**
- Which scope: Select your account
- Link to existing project: **No**
- Project name: `northstar-hr-rag`
- Directory: `./`
- Want to modify settings: **No**

Set environment variables:
```bash
vercel env add GEMINI_API_KEY
vercel env add GEMINI_EMBEDDING_MODEL
vercel env add GEMINI_CHAT_MODEL
vercel env add JWT_SECRET
```
Then trigger production deployment:
```bash
vercel --prod
```

---

## 🔒 Enterprise Security Highlights
- **Role-Based API Protection**: Employee users cannot call ingestion or administrative endpoints (verified via automated test step 5).
- **Session Security**: JWT cookies configured with `httpOnly`, `sameSite: lax`, and `secure` in production.
- **Privacy Enforcement**: System prompt explicitly instructs users never to send sensitive banking information or credentials through the chat interface.
- **Zero Hallucination Grounding**: Prompt engineering forces explicit citation of policy numbers (e.g. `[HR-002]`, `[IT-011]`) and provides fallback contact information to People Operations when an inquiry falls outside indexed policies.
