import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 20 },
    { duration: '1m', target: 20 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01'],
  },
};

const BASE_URL = 'http://127.0.0.1:8000/api';

export function setup() {
  // Login with existing admin account. Ensure this user exists in your DB.
  const payload = JSON.stringify({
    email: 'admin@test.com', // Change to valid admin email
    password: 'password123',
  });

  const res = http.post(`${BASE_URL}/auth/login`, payload, {
    headers: { 'Content-Type': 'application/json' }
  });

  if (res.status !== 200) {
    console.warn('Admin login failed. Admin tests will likely return 401/403.');
    return { token: '' };
  }

  return { token: res.json('data.token') };
}

export default function (data) {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${data.token}`,
    'Accept': 'application/json'
  };

  // 1. List all reservations
  const listRes = http.get(`${BASE_URL}/admin/reservations`, { headers });
  
  check(listRes, {
    'admin list reservations status is 200': (r) => r.status === 200,
  });

  sleep(Math.random() * 1 + 1);

  // 3. Update reservation status if there are any
  if (listRes.status === 200 && listRes.json('data').length > 0) {
    const reservationId = listRes.json('data')[0].id;
    const payload = JSON.stringify({ status: 'confirmed' });
    
    const updateRes = http.patch(`${BASE_URL}/admin/reservations/${reservationId}/status`, payload, { headers });
    
    // We expect 200 or 422 (if transition is invalid)
    check(updateRes, {
      'admin update status is 200 or 422': (r) => r.status === 200 || r.status === 422,
    });
  }

  sleep(Math.random() * 1 + 1);

  // 2. Filter reservations
  const filterRes = http.get(`${BASE_URL}/admin/reservations?status=pending`, { headers });
  
  check(filterRes, {
    'admin filter reservations status is 200': (r) => r.status === 200,
  });

  sleep(Math.random() * 2 + 1);
}
