import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 20 }, // Ramp-up
    { duration: '1m', target: 20 },  // Sustained load
    { duration: '30s', target: 0 },  // Ramp-down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01'],
  },
};

const BASE_URL = 'http://127.0.0.1:8001/api/auth';

export default function () {
  // We use a random suffix to avoid unique email constraint errors during registration
  const randomId = Math.floor(Math.random() * 10000000);
  const email = `testuser${randomId}@example.com`;
  const password = 'password123';

  // 1. Test Registration
  const registerPayload = JSON.stringify({
    name: 'Load Test User',
    email: email,
    password: password,
    password_confirmation: password,
  });

  const registerHeaders = { 'Content-Type': 'application/json' };
  
  const registerRes = http.post(`${BASE_URL}/register`, registerPayload, { headers: registerHeaders });

  check(registerRes, {
    'register status is 201': (r) => r.status === 201,
  });

  sleep(Math.random() * 1 + 1);

  // 2. Test Login
  const loginPayload = JSON.stringify({
    email: email,
    password: password,
  });

  const loginRes = http.post(`${BASE_URL}/login`, loginPayload, { headers: registerHeaders });

  check(loginRes, {
    'login status is 200': (r) => r.status === 200,
    'has token': (r) => r.json('data.token') !== undefined,
  });

  const token = loginRes.json('data.token');
  sleep(Math.random() * 1 + 1);

  // 3. Test Logout (if token exists)
  if (token) {
    const logoutHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
    
    const logoutRes = http.post(`${BASE_URL}/logout`, null, { headers: logoutHeaders });
    
    check(logoutRes, {
      'logout status is 204': (r) => r.status === 204,
    });
  }

  sleep(Math.random() * 1 + 1);
}
