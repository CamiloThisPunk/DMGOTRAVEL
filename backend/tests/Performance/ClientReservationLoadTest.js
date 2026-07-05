import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 30 },
    { duration: '1m', target: 30 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01'],
  },
};

const BASE_URL = 'http://127.0.0.1:8000/api';

export function setup() {
  // Register a temporary client user for the load test
  const randomId = Math.floor(Math.random() * 1000000);
  const registerPayload = JSON.stringify({
    name: 'Client Load Test',
    email: `client_load_${randomId}@example.com`,
    password: 'password123',
    password_confirmation: 'password123',
  });

  const res = http.post(`${BASE_URL}/auth/register`, registerPayload, {
    headers: { 'Content-Type': 'application/json' }
  });

  if (res.status !== 201) {
    console.error('Setup failed to create client');
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

  // 1. List Reservations
  const listRes = http.get(`${BASE_URL}/client/reservations`, { headers });
  
  check(listRes, {
    'list reservations status is 200': (r) => r.status === 200,
  });

  sleep(Math.random() * 1 + 1);

  // 2. We skip creating reservations here unless we have a specific service_package_id.
  // We can query the public catalog to get a package ID first.
  const catalogRes = http.get(`${BASE_URL}/services?per_page=1`);
  if (catalogRes.status === 200 && catalogRes.json('data').length > 0) {
    const packageId = catalogRes.json('data')[0].id;

    // Create Reservation
    const payload = JSON.stringify({
      service_package_id: packageId,
      reservation_date: '2028-12-01',
      guests_count: 1,
    });

    const createRes = http.post(`${BASE_URL}/client/reservations`, payload, { headers });
    
    // We expect 201 Created or 422 Unprocessable Entity (if over capacity)
    check(createRes, {
      'create reservation status is 201 or 422': (r) => r.status === 201 || r.status === 422,
    });

    // 3. Cancel the reservation if it was created
    if (createRes.status === 201) {
      const reservationId = createRes.json('data.id');
      const cancelRes = http.patch(`${BASE_URL}/client/reservations/${reservationId}/cancel`, null, { headers });
      
      check(cancelRes, {
        'cancel reservation status is 200': (r) => r.status === 200,
      });
    }
  }

  sleep(Math.random() * 2 + 1);
}
