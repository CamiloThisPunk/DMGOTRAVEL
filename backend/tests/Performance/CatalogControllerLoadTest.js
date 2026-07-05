import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 50 }, // Ramp-up a 50 usuarios
    { duration: '1m', target: 50 },  // Carga sostenida
    { duration: '30s', target: 0 },  // Ramp-down a 0 usuarios
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% de las peticiones deben tomar menos de 500ms
    http_req_failed: ['rate<0.01'],   // Menos del 1% de errores permitidos
  },
};

const BASE_URL = 'http://127.0.0.1:8000/api';

export default function () {
  // Simular la obtención del catálogo público (GET /services)
  const res = http.get(`${BASE_URL}/services?per_page=15`);

  // Validaciones
  check(res, {
    'is status 200': (r) => r.status === 200,
    'has data array': (r) => r.json('data') !== undefined,
  });

  // Si hay paquetes, probar ver el detalle del primero
  if (res.status === 200 && res.json('data').length > 0) {
    const packageId = res.json('data')[0].id;
    const detailRes = http.get(`${BASE_URL}/services/${packageId}`);
    
    check(detailRes, {
      'detail status is 200': (r) => r.status === 200,
      'detail has correct id': (r) => r.json('data.id') === packageId,
    });
  }

  // Pausa aleatoria entre 1 y 3 segundos para simular comportamiento humano
  sleep(Math.random() * 2 + 1);
}
