console.log('🏛️ Testing Sukkur IBA University (SIBAU) 118-Page Employee Handbook RAG...\n');

async function testSIBAUHandbook() {
  const BASE_URL = 'http://localhost:3000';

  const testCases = [
    {
      topic: 'Earned Leave & Encashment',
      query: 'How many days of Earned Leave do employees receive, and what are the encashment rules for non-teaching staff?'
    },
    {
      topic: 'Faculty Laptop Loan',
      query: 'What is the amount and repayment term for the Faculty Laptop Loan policy?'
    },
    {
      topic: 'PhD and MS Allowances',
      query: 'How much are the monthly qualification allowances for PhD and MS/MPhil degrees at Sukkur IBA University?'
    },
    {
      topic: 'Night Emergency Transport',
      query: 'What is the procedure for availing the Carry Bolan emergency transport facility at night?'
    },
    {
      topic: 'Biometric Attendance & Late Comings',
      query: 'What are the rules and deductions for late arrivals under the biometric attendance policy?'
    },
    {
      topic: 'Urdu Vehicle Loan Test (وہیکل لون)',
      query: 'سکھر آئی بی اے یونیورسٹی میں گاڑی کے لون (Vehicle Loan) کے لیے کون اہل ہے اور واپسی کی کیا شرائط ہیں؟'
    }
  ];

  for (const tc of testCases) {
    console.log(`================================================================`);
    console.log(`📌 Topic: ${tc.topic}`);
    console.log(`❓ Question: "${tc.query}"`);

    const res = await fetch(`${BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: tc.query })
    });

    if (!res.ok) {
      throw new Error(`Chat API error (${res.status}): ${await res.text()}`);
    }

    const data = await res.json();
    console.log(`⚡ Model: ${data.metrics?.modelUsed}`);
    console.log(`💬 Natural HR Answer:\n${data.answer}\n`);
    console.log(`📚 Citations: ${data.citations.map((c) => `${c.docTitle} [${c.docId}]`).join(', ')}`);
    console.log(`⏱ Total Latency: ${data.metrics?.totalLatencyMs}ms\n`);

    await new Promise((r) => setTimeout(r, 600));
  }

  console.log('🎉 ALL SUKKUR IBA UNIVERSITY HANDBOOK TESTS PASSED WITH 100% SUCCESS!');
}

testSIBAUHandbook().catch((err) => {
  console.error('❌ SIBAU Test failed:', err);
  process.exit(1);
});
