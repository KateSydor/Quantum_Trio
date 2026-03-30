/**
 * Performance Tests — RecipeAI (k6 script)
 *
 * Запуск: k6 run tests/performance/load-test.js
 *
 * Сценарії:
 * 1. Smoke test — 1 VU, 30s
 * 2. Load test — 50 VU, 5 хвилин
 * 3. Stress test — 100 VU, 10 хвилин
 */

import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');
const loginDuration = new Trend('login_duration');
const generateDuration = new Trend('generate_duration');
const recipeListDuration = new Trend('recipe_list_duration');

// Test configuration
export const options = {
  scenarios: {
    smoke: {
      executor: 'constant-vus',
      vus: 1,
      duration: '30s',
      tags: { test_type: 'smoke' },
    },
    load: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '1m', target: 50 },   // ramp up
        { duration: '3m', target: 50 },   // steady
        { duration: '1m', target: 0 },    // ramp down
      ],
      startTime: '35s',
      tags: { test_type: 'load' },
    },
    stress: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '2m', target: 100 },  // ramp up
        { duration: '5m', target: 100 },  // steady
        { duration: '3m', target: 0 },    // ramp down
      ],
      startTime: '6m',
      tags: { test_type: 'stress' },
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<2000'],     // 95% запитів < 2 секунди
    http_req_failed: ['rate<0.05'],         // < 5% помилок
    errors: ['rate<0.1'],                   // < 10% errors
    login_duration: ['p(95)<500'],          // Login < 500ms
    recipe_list_duration: ['p(95)<1000'],   // Recipe list < 1s
    generate_duration: ['p(95)<10000'],     // Generation < 10s
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:8080';

// PT-001: Health check
function healthCheck() {
  group('Health Check', function () {
    const res = http.get(`${BASE_URL}/api/health`);
    check(res, {
      'health status 200': (r) => r.status === 200,
    });
    errorRate.add(res.status !== 200);
  });
}

// PT-002: Login performance
function loginTest() {
  group('Login', function () {
    const payload = JSON.stringify({
      email: 'oleksiy@example.com',
      password: 'password123',
    });
    const params = { headers: { 'Content-Type': 'application/json' } };

    const res = http.post(`${BASE_URL}/api/auth/login`, payload, params);
    loginDuration.add(res.timings.duration);

    check(res, {
      'login status 200': (r) => r.status === 200,
      'login has token': (r) => {
        try {
          return JSON.parse(r.body).token !== undefined;
        } catch {
          return false;
        }
      },
      'login duration < 500ms': (r) => r.timings.duration < 500,
    });
    errorRate.add(res.status !== 200);

    return res;
  });
}

// PT-003: Get recipes list
function getRecipesList(token) {
  group('Recipe List', function () {
    const params = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const res = http.get(`${BASE_URL}/api/recipes`, params);
    recipeListDuration.add(res.timings.duration);

    check(res, {
      'recipes status 200': (r) => r.status === 200,
      'recipes is array': (r) => {
        try {
          return Array.isArray(JSON.parse(r.body));
        } catch {
          return false;
        }
      },
      'recipes duration < 1s': (r) => r.timings.duration < 1000,
    });
    errorRate.add(res.status !== 200);
  });
}

// PT-004: Generate recipe (AI endpoint)
function generateRecipe(token) {
  group('Generate Recipe', function () {
    const payload = JSON.stringify({
      ingredients: ['Яйця', 'Шпинат', 'Сир фета'],
      mealType: 'breakfast',
      time: 30,
      servings: 2,
      allergies: ['gluten'],
    });
    const params = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };

    const res = http.post(`${BASE_URL}/api/recipes/generate`, payload, params);
    generateDuration.add(res.timings.duration);

    check(res, {
      'generate status 200': (r) => r.status === 200,
      'generate has recipe': (r) => {
        try {
          return JSON.parse(r.body).title !== undefined;
        } catch {
          return false;
        }
      },
      'generate duration < 10s': (r) => r.timings.duration < 10000,
    });
    errorRate.add(res.status !== 200);
  });
}

// PT-005: Get user profile
function getUserProfile(token) {
  group('User Profile', function () {
    const params = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const res = http.get(`${BASE_URL}/api/users/me`, params);

    check(res, {
      'profile status 200': (r) => r.status === 200,
      'profile duration < 500ms': (r) => r.timings.duration < 500,
    });
    errorRate.add(res.status !== 200);
  });
}

// Main test scenario
export default function () {
  healthCheck();

  const loginRes = loginTest();
  let token = '';
  try {
    token = JSON.parse(loginRes.body).token;
  } catch {
    return;
  }

  sleep(1);
  getRecipesList(token);

  sleep(1);
  generateRecipe(token);

  sleep(1);
  getUserProfile(token);

  sleep(2);
}

