import connectDB from '../config/db.js';
import User from '../models/user.model.js';
import app from '../app.js';
import 'dotenv/config';

const runAuthTest = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await connectDB();
    console.log('Connected successfully!');

    // Test Server Express handlers directly
    const server = app.listen(0, async () => {
      const port = server.address().port;
      const baseUrl = `http://localhost:${port}/api/auth`;
      console.log(`Test server running on ${baseUrl}`);

      const testEmail = `homeeasetest2026_${Date.now()}@gmail.com`;
      const testPassword = 'password123';
      const testName = 'Test User 2026';

      console.log(`\n1. Testing POST /api/auth/register with ${testEmail}...`);
      const regRes = await fetch(`${baseUrl}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: testName,
          email: testEmail,
          password: testPassword
        })
      });

      const regData = await regRes.json();
      console.log('Register HTTP Status:', regRes.status);
      console.log('Register Response:', JSON.stringify(regData, null, 2));

      if (!regData.success || !regData.token) {
        throw new Error('Registration test failed!');
      }

      const token = regData.token;

      console.log(`\n2. Testing POST /api/auth/login with ${testEmail}...`);
      const loginRes = await fetch(`${baseUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: testEmail,
          password: testPassword
        })
      });

      const loginData = await loginRes.json();
      console.log('Login HTTP Status:', loginRes.status);
      console.log('Login Response:', JSON.stringify(loginData, null, 2));

      if (!loginData.success || !loginData.token) {
        throw new Error('Login test failed!');
      }

      console.log('\n3. Testing GET /api/auth/me with Bearer token...');
      const meRes = await fetch(`${baseUrl}/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const meData = await meRes.json();
      console.log('GetMe HTTP Status:', meRes.status);
      console.log('GetMe Response:', JSON.stringify(meData, null, 2));

      // Cleanup test user
      console.log('\nCleaning up test user from MongoDB...');
      await User.deleteOne({ email: testEmail });
      console.log('Cleanup complete!');

      server.close();
      process.exit(0);
    });

  } catch (err) {
    console.error('Test Error:', err);
    process.exit(1);
  }
};

runAuthTest();
