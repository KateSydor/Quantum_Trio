# Quantum_Trio — RecipeAI

> Персоналізований генератор рецептів на базі AI (GPT-4)

## 📁 Структура проєкту

```
Quantum_Trio/
├── UI_prototype/              # React/TypeScript Frontend
│   ├── src/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   ├── router.tsx
│   │   ├── components/UI.tsx
│   │   └── pages/            # Landing, Login, Register, Home, Generate, Loading, Recipe, Profile
│   ├── index.html
│   ├── styles.css
│   └── bundle.js
├── tests/                     # 🧪 Тестування (Manual & Automated)
│   ├── manual/
│   │   ├── Manual_Test_Cases.md    # 142 ручних тест-кейси
│   │   └── Defects_Log.md          # 20 задокументованих дефектів
│   ├── frontend/
│   │   ├── unit/                   # Unit-тести компонентів React
│   │   ├── integration/            # Integration-тести навігації та workflow
│   │   └── e2e/                    # Playwright E2E UI-тести
│   ├── backend/
│   │   ├── unit/                   # Unit-тести бізнес-логіки
│   │   ├── integration/            # Integration-тести сервісів
│   │   └── api/                    # API-тести (REST endpoints)
│   ├── performance/                # k6 performance/load тести
│   └── setup.ts
├── docs/                      # 📚 Документація
│   ├── Testing_Strategy.md         # Стратегія тестування
│   └── *.pdf                       # Інша проєктна документація
├── .github/workflows/
│   └── ci-tests.yml           # 🔄 CI/CD Pipeline (GitHub Actions)
├── jest.config.js             # Конфігурація Jest
├── playwright.config.ts       # Конфігурація Playwright
├── package.json
└── old_version/               # Попередня версія документації
```

---

## 🧪 Стратегія тестування

### Типи тестів

| Тип | Інструмент | Кількість | Розташування |
|-----|-----------|----------|-------------|
| Manual Test Cases | — | 142 | `tests/manual/Manual_Test_Cases.md` |
| Defects Log | — | 20 | `tests/manual/Defects_Log.md` |
| Frontend Unit Tests | Jest + RTL | 104 | `tests/frontend/unit/` |
| Frontend Integration Tests | Jest + RTL | 20 | `tests/frontend/integration/` |
| API Tests | Jest (mock) | 33 | `tests/backend/api/` |
| Backend Unit Tests | Jest | 30 | `tests/backend/unit/` |
| Backend Integration Tests | Jest | 16 | `tests/backend/integration/` |
| E2E / UI Tests | Playwright | 16 | `tests/frontend/e2e/` |
| Performance Tests | k6 | 5 scenarios | `tests/performance/` |

**Всього автоматизованих тестів: ~120+**

### Категорії ручних тестів (142 тест-кейси)

| Категорія | Кількість |
|-----------|----------|
| Smoke Testing | 10 |
| Автентифікація | 15 |
| Реєстрація | 10 |
| Головна сторінка | 12 |
| Генерація рецептів | 18 |
| Loading page | 6 |
| Сторінка рецепту | 15 |
| Профіль | 12 |
| Landing page | 8 |
| Навігація | 6 |
| UI-тестування | 10 |
| Performance | 5 |
| Usability | 5 |
| API Testing | 10 |

### Задокументовані дефекти (20 багів)

| Пріоритет | Кількість |
|-----------|----------|
| 🔴 P1 — Critical | 3 |
| 🟠 P2 — High | 6 |
| 🟡 P3 — Medium | 8 |
| 🟢 P4 — Low | 3 |

---

## 🚀 Запуск тестів

### Встановлення залежностей

```bash
npm install
```

### Unit-тести

```bash
npm run test:unit
```

### Integration-тести

```bash
npm run test:integration
```

### API-тести

```bash
npm run test:api
```

### Всі тести з coverage

```bash
npm run test:ci
```

### E2E тести (Playwright)

```bash
npx playwright install
npm run test:e2e
```

### Performance тести (k6)

```bash
k6 run tests/performance/load-test.js
```

---

## 🔄 CI/CD Pipeline

Автоматизовані тести інтегровані у GitHub Actions (`.github/workflows/ci-tests.yml`):

1. **On Push/PR** → Unit + Integration + API тести
2. **On PR to main** → Повний набір тестів
3. **Nightly (02:00 UTC)** → E2E + Performance тести

### Pipeline Jobs

```
┌──────────────────────────┐
│  Frontend Unit Tests     │──┐
├──────────────────────────┤  │
│  Integration Tests       │──├── Full Test Suite + Coverage
├──────────────────────────┤  │
│  API Tests               │──┘
├──────────────────────────┤
│  E2E Tests (Playwright)  │ ← On PR / Nightly
├──────────────────────────┤
│  Performance (k6)        │ ← Nightly only
└──────────────────────────┘
```

---

## 👥 Команда

**Quantum Trio** — Проєктна команда
