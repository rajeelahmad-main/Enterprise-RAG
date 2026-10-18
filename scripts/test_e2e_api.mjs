console.log('🧪 Starting End-to-End Enterprise API Verification against localhost:3000...\n');

async function testE2E() {
  const BASE_URL = 'http://localhost:3000';

  // 1. Unauthenticated request to /api/chat
  console.log('--- Step 1: Testing Unauthenticated Security Rejection ---');
  const unauthRes = await fetch(`${BASE_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: 'What is the leave policy?' })
  });
  console.log(`Status: ${unauthRes.status} (Expected: 401)`);
  if (unauthRes.status !== 401) {
    throw new Error('Security flaw: Unauthenticated request was allowed!');
  }
  console.log('✅ Unauthenticated request was correctly blocked with 401 Unauthorized.\n');

  // 2. Employee Login
  console.log('--- Step 2: Testing Employee Login ---');
  const empLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'employee@northstar.example',
      password: 'EmployeePass2026!'
    })
  });
  if (!empLoginRes.ok) throw new Error('Employee login failed');
  const empData = await empLoginRes.json();
  const empToken = empData.token;
  console.log(`✅ Logged in as: ${empData.user.name} (${empData.user.email})`);
  console.log(`Role: ${empData.user.role}`);
  console.log(`Token acquired: ${empToken.slice(0, 25)}...\n`);

  // 3. Verify Session via /api/auth/me
  console.log('--- Step 3: Verifying User Session (/api/auth/me) ---');
  const meRes = await fetch(`${BASE_URL}/api/auth/me`, {
    headers: { Authorization: `Bearer ${empToken}` }
  });
  const meData = await meRes.json();
  if (!meRes.ok || !meData.authenticated) {
    throw new Error('Session verification failed');
  }
  console.log(`✅ Session verified for ${meData.user.name} [Role: ${meData.user.role}]\n`);

  // 4. Send Query to /api/chat
  console.log('--- Step 4: Testing Enterprise RAG Query via /api/chat ---');
  const chatRes = await fetch(`${BASE_URL}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${empToken}`
    },
    body: JSON.stringify({
      message: 'How many annual leave days are provided each year?'
    })
  });

  if (!chatRes.ok) {
    throw new Error(`Chat API failed: ${chatRes.status} ${await chatRes.text()}`);
  }

  const chatData = await chatRes.json();
  console.log('✅ Chat Response Received:');
  console.log(`💬 Answer: ${chatData.answer}`);
  console.log(`📚 Citations Count: ${chatData.citations.length}`);
  chatData.citations.forEach((c, i) => {
    console.log(`   Citation [${i + 1}]: ${c.docTitle} [${c.docId}] - ${c.section} (${c.score} score)`);
  });
  console.log(`⏱ Total Latency: ${chatData.metrics.totalLatencyMs}ms (Retrieval: ${chatData.metrics.retrievalLatencyMs}ms)\n`);

  // Verify answer correctness
  if (!chatData.answer.includes('18')) {
    throw new Error('RAG Answer did not contain the expected "18" annual leave days!');
  }
  console.log('✅ RAG accuracy check passed: Annual leave days correctly answered with 18 working days.\n');

  // 5. Employee trying Admin-only route /api/documents/ingest
  console.log('--- Step 5: Testing RBAC Enforcement (Employee -> Admin Route) ---');
  const forbiddenRes = await fetch(`${BASE_URL}/api/documents/ingest`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${empToken}`
    },
    body: JSON.stringify({
      title: 'Hacked Policy',
      docId: 'HACK-001',
      content: 'Unauthorized content'
    })
  });
  console.log(`Status: ${forbiddenRes.status} (Expected: 403)`);
  if (forbiddenRes.status !== 403) {
    throw new Error('RBAC Flaw: Employee was able to access admin-only endpoint!');
  }
  console.log('✅ RBAC check passed: Employee successfully blocked with 403 Forbidden.\n');

  // 6. Admin Login & Ingest
  console.log('--- Step 6: Testing Admin Privileges & Dynamic Ingestion ---');
  const adminLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@northstar.example',
      password: 'AdminPassword2026!'
    })
  });
  const adminData = await adminLoginRes.json();
  const adminToken = adminData.token;
  console.log(`✅ Admin logged in: ${adminData.user.name} (${adminData.user.role})`);

  // 7. Admin Ingests Dynamic Policy
  console.log('--- Step 7: Admin Embedding & Ingesting New Policy ---');
  const ingestRes = await fetch(`${BASE_URL}/api/documents/ingest`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`
    },
    body: JSON.stringify({
      title: 'Wellness Stipend Policy',
      docId: 'HR-021',
      owner: 'People Operations',
      section: 'Annual Gym and Health Reimbursement',
      content: 'Employees may claim up to $500 annually for gym memberships, mental wellness apps, or ergonomic office furniture.'
    })
  });

  if (!ingestRes.ok) {
    throw new Error(`Ingest failed: ${ingestRes.status} ${await ingestRes.text()}`);
  }

  const ingestData = await ingestRes.json();
  console.log('✅ Policy Ingestion Response:', ingestData.message);

  // 8. Immediately Query the Newly Ingested Policy!
  console.log('--- Step 8: Querying Newly Ingested Dynamic Policy via RAG ---');
  const dynChatRes = await fetch(`${BASE_URL}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${empToken}`
    },
    body: JSON.stringify({
      message: 'What is the annual gym and wellness stipend allowance?'
    })
  });

  const dynChatData = await dynChatRes.json();
  console.log(`💬 Answer: ${dynChatData.answer}`);
  console.log(`📚 Citations: ${dynChatData.citations.map((c) => c.docId).join(', ')}`);
  if (!dynChatData.answer.includes('500')) {
    throw new Error('RAG Answer did not retrieve the newly ingested $500 stipend!');
  }
  console.log('✅ Newly ingested document was retrieved and answered dynamically with 100% accuracy!\n');

  console.log('🎉 ALL END-TO-END HTTP INTEGRATION TESTS PASSED WITH 100% SUCCESS!');
}

testE2E().catch((err) => {
  console.error('❌ E2E API Verification failed:', err);
  process.exit(1);
});
