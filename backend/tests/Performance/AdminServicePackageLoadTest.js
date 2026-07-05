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
  const payload = JSON.stringify({
    email: 'admin@test.com',
    password: 'password123',
  });

  const res = http.post(`${BASE_URL}/auth/login`, payload, {
    headers: { 'Content-Type': 'application/json' }
  });

  return { token: res.status === 200 ? res.json('data.token') : '' };
}

export default function (data) {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${data.token}`,
    'Accept': 'application/json'
  };

  // 1. List Service Packages
  const listRes = http.get(`${BASE_URL}/admin/services`, { headers });
  
  check(listRes, {
    'admin list packages status is 200': (r) => r.status === 200,
  });

  sleep(Math.random() * 1 + 1);

  // 2. Create Service Package
  const randomSuffix = Math.floor(Math.random() * 100000);
  const createPayload = JSON.stringify({
    title: `Load Test Package ${randomSuffix}`,
    description: 'A package created during load testing',
    type: 'paquete',
    price: 350.00,
    capacity: 20,
    duration: 120,
  });

  const createRes = http.post(`${BASE_URL}/admin/services`, createPayload, { headers });
  
  check(createRes, {
    'admin create package status is 201': (r) => r.status === 201,
  });

  sleep(Math.random() * 1 + 1);

  if (createRes.status === 201) {
    const packageId = createRes.json('data.id');

    // 3. View Package
    const viewRes = http.get(`${BASE_URL}/admin/services/${packageId}`, { headers });
    check(viewRes, { 'admin view package status is 200': (r) => r.status === 200 });

    // 4. Update Package
    const updatePayload = JSON.stringify({ title: `Updated Package ${randomSuffix}` });
    const updateRes = http.patch(`${BASE_URL}/admin/services/${packageId}`, updatePayload, { headers });
    check(updateRes, { 'admin update package status is 200': (r) => r.status === 200 });

    // 5. Delete Package
    const deleteRes = http.del(`${BASE_URL}/admin/services/${packageId}`, null, { headers });
    check(deleteRes, { 'admin delete package status is 204': (r) => r.status === 204 });
  }

  sleep(Math.random() * 2 + 1);
}
