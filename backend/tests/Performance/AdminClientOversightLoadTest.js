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

  // 1. List Clients
  const listClientsRes = http.get(`${BASE_URL}/admin/clients`, { headers });
  
  check(listClientsRes, {
    'admin list clients status is 200': (r) => r.status === 200,
  });

  sleep(Math.random() * 1 + 1);

  // 2. List Audit Logs
  const listLogsRes = http.get(`${BASE_URL}/admin/logs`, { headers });
  
  check(listLogsRes, {
    'admin list logs status is 200': (r) => r.status === 200,
  });

  sleep(Math.random() * 2 + 1);
}
