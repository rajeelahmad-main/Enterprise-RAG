console.log('🤖 Testing Gemini 3.1 Flash Lite (with 3.5 backup) Natural & Detailed Phrasing...\n');

async function testNaturalReplies() {
  const BASE_URL = 'http://localhost:3000';

  const queries = [
    {
      lang: 'English',
      q: 'How many annual leave days are provided each year, and how do I request time off?'
    },
    {
      lang: 'English',
      q: 'Can I upload company files to ChatGPT or other unapproved AI tools?'
    },
    {
      lang: 'Urdu (اردو)',
      q: 'کمپنی پالیسی کے تحت سالانہ کتنی چھٹیاں ملتی ہیں اور کیا بچی ہوئی چھٹیاں اگلے سال استعمال ہو سکتی ہیں؟'
    },
    {
      lang: 'Roman Urdu',
      q: 'Remote work ya work from home ki kya policy hai aur week mein kitnay din allow hain?'
    }
  ];

  for (const item of queries) {
    console.log(`================================================================`);
    console.log(`📝 [${item.lang}] Question: "${item.q}"`);

    const res = await fetch(`${BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: item.q })
    });

    if (!res.ok) {
      throw new Error(`API failed with ${res.status}: ${await res.text()}`);
    }

    const data = await res.json();
    console.log(`⚡ Model Used: ${data.metrics?.modelUsed || 'default'}`);
    console.log(`💬 Natural HR Response:\n${data.answer}\n`);
    console.log(`📚 Citations: ${data.citations.map((c) => `${c.docTitle} [${c.docId}]`).join(', ')}`);
    console.log(`⏱ Total Latency: ${data.metrics?.totalLatencyMs}ms\n`);

    // Brief delay between calls
    await new Promise((r) => setTimeout(r, 600));
  }

  console.log('🎉 ALL NATURAL PHRASING TESTS COMPLETED SUCCESSFULLY!');
}

testNaturalReplies().catch((err) => {
  console.error('❌ Natural Phrasing Test failed:', err);
  process.exit(1);
});
