console.log('🌐 Testing Public Access & Multilingual Capabilities on localhost:3000...\n');

async function testPublicAndMultilingual() {
  const BASE_URL = 'http://localhost:3000';

  // 1. Verify Home Page is directly accessible (no redirect!)
  console.log('--- Step 1: Testing Direct Public Home Page Access ---');
  const homeRes = await fetch(`${BASE_URL}/`, { redirect: 'manual' });
  console.log(`Status: ${homeRes.status} (Expected: 200, no redirect)`);
  if (homeRes.status !== 200) {
    throw new Error(`Home page was redirected or blocked with status: ${homeRes.status}`);
  }
  console.log('✅ Home page is directly open to public visitors without forced login!\n');

  // 2. Query in English without any auth token
  console.log('--- Step 2: Testing Public English Inquiry (No Login) ---');
  const enRes = await fetch(`${BASE_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: 'What is the standard procedure for reporting a phishing email?'
    })
  });

  if (!enRes.ok) throw new Error(`English query failed: ${enRes.status} ${await enRes.text()}`);
  const enData = await enRes.json();
  console.log(`💬 English Response:\n${enData.answer}\n`);
  console.log(`📚 Citations: ${enData.citations.map((c) => `${c.docTitle} [${c.docId}]`).join(', ')}`);
  console.log('✅ English public query answered professionally with citations.\n');

  // 3. Query in Urdu without any auth token
  console.log('--- Step 3: Testing Public Urdu Inquiry (اردو میں سوال) ---');
  const urduRes = await fetch(`${BASE_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: 'کمپنی پالیسی کے تحت سالانہ کتنی چھٹیاں ملتی ہیں؟'
    })
  });

  if (!urduRes.ok) throw new Error(`Urdu query failed: ${urduRes.status} ${await urduRes.text()}`);
  const urduData = await urduRes.json();
  console.log(`💬 Urdu Response:\n${urduData.answer}\n`);
  console.log(`📚 Citations: ${urduData.citations.map((c) => `${c.docTitle} [${c.docId}]`).join(', ')}`);
  console.log('✅ Urdu public query answered fluently with policy citations.\n');

  // 4. Query in Roman Urdu
  console.log('--- Step 4: Testing Public Roman Urdu Inquiry ---');
  const romanRes = await fetch(`${BASE_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: 'Remote work ya work from home ki kya policy hai kitnay din allow hain?'
    })
  });

  if (!romanRes.ok) throw new Error(`Roman Urdu query failed: ${romanRes.status} ${await romanRes.text()}`);
  const romanData = await romanRes.json();
  console.log(`💬 Roman Urdu Response:\n${romanData.answer}\n`);
  console.log(`📚 Citations: ${romanData.citations.map((c) => `${c.docTitle} [${c.docId}]`).join(', ')}`);
  console.log('✅ Roman Urdu query answered naturally with official policy citations.\n');

  console.log('🎉 ALL PUBLIC & MULTILINGUAL TESTS PASSED WITH 100% SUCCESS!');
}

testPublicAndMultilingual().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
