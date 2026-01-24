// Test login script
const axios = require('axios');

const testLogin = async () => {
  try {
    // 1. Username bilan login
    console.log('Testing login with username...');
    const response1 = await axios.post('http://localhost:4000/api/auth/login', {
      username: 'testuser',
      password: 'testpass123'
    });
    console.log('✅ Username login successful:', response1.data.message);

    // 2. Email bilan login
    console.log('\nTesting login with email...');
    const response2 = await axios.post('http://localhost:4000/api/auth/login', {
      email: 'test@example.com',
      password: 'testpass123'
    });
    console.log('✅ Email login successful:', response2.data.message);

  } catch (error) {
    console.error('❌ Login failed:', error.response?.data || error.message);
  }
};

testLogin();