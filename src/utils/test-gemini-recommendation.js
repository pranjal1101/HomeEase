import http from 'http';

const makeRequest = (payload) => {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);
    const req = http.request(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/ai/recommend',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data)
        }
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          try {
            resolve({ statusCode: res.statusCode, body: JSON.parse(body) });
          } catch (e) {
            resolve({ statusCode: res.statusCode, rawBody: body });
          }
        });
      }
    );

    req.on('error', (err) => reject(err));
    req.write(data);
    req.end();
  });
};

async function runGeminiTests() {
  console.log('=== STARTING GEMINI AI RECOMMENDATION TESTS ===\n');

  const tests = [
    { name: 'TEST 1: Best overall (Plumber)', category: 'Plumber', preference: 'Best overall' },
    { name: 'TEST 2: Highest rated (Plumber)', category: 'Plumber', preference: 'Highest rated' },
    { name: 'TEST 3: Affordable (Plumber)', category: 'Plumber', preference: 'Affordable' },
    { name: 'TEST 4: Most experienced (Plumber)', category: 'Plumber', preference: 'Experienced' },
    { name: 'TEST 5: Custom ("I want someone affordable with good ratings.")', category: 'Plumber', preference: 'I want someone affordable with good ratings.' },
  ];

  for (const t of tests) {
    console.log(`--- ${t.name} ---`);
    const res = await makeRequest({ category: t.category, preference: t.preference });
    console.log(`HTTP Status: ${res.statusCode}`);
    if (res.body && res.body.data && res.body.data.recommendation) {
      const rec = res.body.data.recommendation;
      console.log(`Recommended Provider: "${rec.provider.serviceName}" (ID: ${rec.provider._id})`);
      console.log(`Price: ₹${rec.provider.price}/hr`);
      console.log(`Reason: "${rec.reason}"`);
      console.log(`Is Fallback: ${res.body.data.isFallback || false}`);
    } else {
      console.log('Response:', JSON.stringify(res.body, null, 2));
    }
    console.log('\n');
  }

  console.log('=== GEMINI AI RECOMMENDATION TESTS COMPLETED ===');
  process.exit(0);
}

runGeminiTests().catch(err => {
  console.error(err);
  process.exit(1);
});
