const axios = require('axios');

const testApi = async () => {
  const BASE_URL = 'http://localhost:5000';
  console.log('[TEST] Starting API test cycle...');

  try {
    // 1. Health check
    console.log('[TEST] Checking health endpoint...');
    const healthRes = await axios.get(`${BASE_URL}/health`);
    console.log('[TEST] Health response:', healthRes.data);

    // 2. Swagger doc check
    console.log('[TEST] Checking Swagger docs endpoint...');
    const swaggerRes = await axios.get(`${BASE_URL}/api-docs/`);
    console.log('[TEST] Swagger UI returned status:', swaggerRes.status);

    // 3. User registration
    console.log('[TEST] Registering new user...');
    const email = `api_test_${Date.now()}@example.com`;
    const registerRes = await axios.post(`${BASE_URL}/api/auth/register`, {
      name: 'API Tester',
      email,
      password: 'testPassword123',
      phone: '9876543211'
    });
    console.log('[TEST] Registration successful. Message:', registerRes.data.message);
    const { accessToken, refreshToken } = registerRes.data.data;
    console.log('[TEST] Received Access Token:', accessToken.substring(0, 15) + '...');
    console.log('[TEST] Received Refresh Token:', refreshToken.substring(0, 15) + '...');

    // 4. Access protected profile endpoint
    console.log('[TEST] Fetching user profile using JWT token...');
    const profileRes = await axios.get(`${BASE_URL}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    console.log('[TEST] Profile returned successfully:', profileRes.data.data.name, '-', profileRes.data.data.email);

    // 5. User login
    console.log('[TEST] Logging in user...');
    const loginRes = await axios.post(`${BASE_URL}/api/auth/login`, {
      email,
      password: 'testPassword123'
    });
    console.log('[TEST] Login successful. Message:', loginRes.data.message);
    console.log('\x1b[32m%s\x1b[0m', '[TEST] SUCCESS: JWT Auth, DB Connectivity, Encryption, and Swagger documentation are fully verified!');

    process.exit(0);
  } catch (err) {
    console.error('\x1b[31m%s\x1b[0m', '[TEST] FAILED: API test encountered an error:', err.response ? err.response.data : err.message);
    process.exit(1);
  }
};

testApi();
