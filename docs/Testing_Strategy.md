# 📋 Стратегія тестування — RecipeAI (Personalized Recipe Generator)

## 1. Вступ

Цей документ описує повну стратегію тестування для проєкту RecipeAI — персоналізованого генератора рецептів на базі AI. Стратегія охоплює ручне та автоматизоване тестування, включаючи функціональне, нефункціональне, UI-, unit-, integration- та API-тестування.

### 1.1 Область тестування

| Компонент | Технологія | Тип тестування |
|-----------|-----------|----------------|
| Frontend (UI) | React + TypeScript | Unit, UI, E2E |
| Backend API | Spring Boot (Java) | Unit, Integration, API |
| База даних | PostgreSQL | Integration |
| Кешування | Redis | Integration |
| AI інтеграція | OpenAI API | API, Integration |
| Автентифікація | Google OAuth 2.0 | Integration, Security |

### 1.2 Інструменти тестування

| Інструмент | Призначення |
|-----------|-------------|
| Jest | Unit-тести (Frontend) |
| React Testing Library | UI-тести компонентів |
| Playwright | E2E UI-тести |
| JUnit 5 | Unit-тести (Backend) |
| Mockito | Мокування залежностей |
| Spring Boot Test | Integration-тести |
| REST Assured | API-тести |
| k6 | Performance тестування |
| GitHub Actions | CI/CD pipeline |

### 1.3 Рівні тестування

```
┌─────────────────────────────────────────┐
│            E2E / UI Tests               │  ← Playwright
├─────────────────────────────────────────┤
│          Integration Tests              │  ← Spring Boot Test + RTL
├─────────────────────────────────────────┤
│             API Tests                   │  ← REST Assured + Supertest
├─────────────────────────────────────────┤
│            Unit Tests                   │  ← Jest + JUnit 5
└─────────────────────────────────────────┘
```

---

## 2. Типи тестування

### 2.1 Функціональне тестування
- Перевірка бізнес-логіки всіх модулів
- Тестування CRUD-операцій для рецептів, користувачів
- Валідація AI-генерації рецептів
- Перевірка авторизації та автентифікації

### 2.2 Нефункціональне тестування

#### Performance Testing
- Час відповіді API < 500ms (P95)
- Час генерації рецепту AI < 10 секунд
- Підтримка 100+ одночасних користувачів
- Навантажувальне тестування з k6

#### Usability Testing
- Інтуїтивність навігації (< 3 кліки до генерації рецепту)
- Доступність (WCAG 2.1 Level AA)
- Адаптивність на мобільних пристроях
- Читабельність тексту та контрастність

#### Security Testing
- XSS-захист
- CSRF-захист
- SQL injection тестування
- JWT/OAuth токен валідація

### 2.3 Smoke Testing
Набір базових тестів для підтвердження працездатності:
1. Завантаження Landing page
2. Реєстрація нового користувача
3. Вхід у систему
4. Генерація рецепту
5. Перегляд рецепту
6. Перегляд профілю
7. Вихід із системи

---

## 3. Метрики якості

| Метрика | Цільове значення |
|---------|-----------------|
| Code Coverage (Unit) | ≥ 80% |
| Code Coverage (Integration) | ≥ 60% |
| Critical Bugs | 0 у Production |
| Test Pass Rate | ≥ 95% |
| Defect Density | < 5 per 1000 LOC |
| Mean Time to Fix (Critical) | < 24 години |

---

## 4. Структура файлів тестування

```
Quantum_Trio/
├── tests/
│   ├── manual/
│   │   ├── Manual_Test_Cases.md          # 100+ ручних тест-кейсів
│   │   └── Defects_Log.md                # Журнал дефектів
│   ├── frontend/
│   │   ├── unit/                         # Unit-тести компонентів
│   │   ├── integration/                  # Integration-тести
│   │   └── e2e/                          # E2E UI-тести (Playwright)
│   ├── backend/
│   │   ├── unit/                         # JUnit unit-тести
│   │   ├── integration/                  # Spring Boot integration
│   │   └── api/                          # REST Assured API-тести
│   └── performance/                      # k6 performance тести
├── .github/
│   └── workflows/
│       └── ci-tests.yml                  # GitHub Actions CI/CD
└── docs/
    └── Testing_Strategy.md               # Цей документ
```

---

## 5. CI/CD інтеграція

Автоматизовані тести інтегровані у GitHub Actions pipeline:

1. **On Push/PR**: Unit + Integration тести
2. **On PR to main**: + API тести + Lint
3. **Nightly**: + E2E + Performance тести
4. **Pre-release**: Повний набір тестів

---

## 6. Відповідальність

| Роль | Завдання |
|------|---------|
| QA Engineer | Manual тест-кейси, дефекти, smoke тести |
| Frontend Dev | Unit + UI тести React |
| Backend Dev | Unit + Integration тести Java |
| DevOps | CI/CD pipeline, performance тести |

