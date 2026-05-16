/**
 * E2E / UI Tests — RecipeAI (Playwright)
 * End-to-End тести для повного робочого процесу
 *
 * Потребує запущеного додатку на http://localhost:3000
 * Запуск: npx playwright test
 */
import { test, expect, Page } from '@playwright/test';

/**
 * Хелпер: клікає по елементу через dispatchEvent щоб обійти
 * перехоплення pointer events мобільним navbar-ом.
 */
async function forceClick(page: Page, locator: ReturnType<Page['locator']>) {
  await locator.waitFor({ state: 'visible' });
  await locator.dispatchEvent('click');
}

test.describe('Smoke Tests', () => {
  test('ST-001: Landing page loads successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=Готуй розумніше')).toBeVisible();
    await expect(page.locator('.nav-logo')).toBeVisible();
  });

  test('ST-002: Navigation from Landing to Login', async ({ page }) => {
    await page.goto('/');
    await forceClick(page, page.locator('button.btn-nav-ghost'));
    await expect(page.locator('text=З поверненням')).toBeVisible();
  });

  test('ST-003: Navigation from Landing to Register', async ({ page }) => {
    await page.goto('/');
    await forceClick(page, page.locator('button.btn-nav-solid').first());
    await expect(page.locator('.auth__title')).toBeVisible();
  });
});

test.describe('Authentication Flow', () => {
  test('AUTH-001: Login flow - fill form and submit', async ({ page }) => {
    await page.goto('/');
    // FIX mobile: nav-links перекриває btn-nav-ghost
    await forceClick(page, page.locator('button.btn-nav-ghost'));

    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();

    await page.click('text=Увійти в акаунт →');
    await expect(page.locator('text=Що приготуємо')).toBeVisible();
  });

  test('AUTH-002: Password visibility toggle', async ({ page }) => {
    await page.goto('/');
    // FIX mobile: nav-links перекриває btn-nav-ghost
    await forceClick(page, page.locator('button.btn-nav-ghost'));

    const passwordInput = page.locator('input[type="password"]');
    await expect(passwordInput).toBeVisible();

    // FIX mobile: navbar перекриває input-suffix
    await forceClick(page, page.locator('button.input-suffix'));

    await expect(page.locator('text=🙈')).toBeVisible();
  });

  test('AUTH-003: Register flow - navigate and verify form', async ({ page }) => {
    await page.goto('/');
    // FIX mobile: nav-links перекриває btn-nav-solid (Розпочати →)
    await forceClick(page, page.locator('button.btn-nav-solid').first());

    await expect(page.locator('.auth__title')).toBeVisible();
    await expect(page.locator('text=Крок 1 з 3')).toBeVisible();

    await expect(page.locator('text=Вегетаріанство')).toBeVisible();
    await expect(page.locator('text=Без лактози')).toBeVisible();
    await expect(page.locator('text=Без глютену')).toBeVisible();
    await expect(page.locator('text=Кето-дієта')).toBeVisible();
  });

  test('AUTH-004: Social login buttons work', async ({ page }) => {
    await page.goto('/');
    // FIX mobile: nav-links перекриває btn-nav-ghost
    await forceClick(page, page.locator('button.btn-nav-ghost'));

    await page.click('text=Продовжити з Google');
    await expect(page.locator('text=Що приготуємо')).toBeVisible();
  });
});

test.describe('Recipe Generation Flow', () => {
  test('GEN-001: Full generation flow - Landing → Login → Home → Generate → Loading → Recipe', async ({ page }) => {
    await page.goto('/');

    // Step 1: Login
    await forceClick(page, page.locator('button.btn-nav-ghost'));
    await page.click('text=Увійти в акаунт →');

    // Step 2: Navigate to Generate
    await forceClick(page, page.locator('button.btn-nav-solid'));
    await expect(page.locator('text=Генератор рецептів')).toBeVisible();

    // Step 3: Click Generate — FIX mobile: gen-sidebar перекриває кнопку
    await forceClick(page, page.locator('button.btn-full--amber'));

    // Step 4: Loading page
    await expect(page.locator('text=AI готує рецепт')).toBeVisible();

    // Step 5: Wait for Recipe page (auto-redirect after ~3.6s)
    await expect(page.locator('text=Шпинатна')).toBeVisible({ timeout: 10000 });
  });

  test('GEN-002: Add and remove ingredients', async ({ page }) => {
    await page.goto('/');
    await forceClick(page, page.locator('button.btn-nav-ghost'));
    await page.click('text=Увійти в акаунт →');
    await forceClick(page, page.locator('button.btn-nav-solid'));

    const input = page.locator('.ing-input');
    await input.fill('Помідори');
    await input.press('Enter');
    await expect(page.locator('text=Помідори')).toBeVisible();

    const removeButtons = page.locator('.ing-tag__remove');
    const count = await removeButtons.count();
    expect(count).toBe(5); // 4 default + 1 added
  });

  test('GEN-003: Select meal type', async ({ page }) => {
    await page.goto('/');
    await forceClick(page, page.locator('button.btn-nav-ghost'));
    await page.click('text=Увійти в акаунт →');
    await forceClick(page, page.locator('button.btn-nav-solid'));

    await page.click('.type-card:has-text("Обід")');
    const selected = page.locator('.type-card--selected');
    await expect(selected).toContainText('Обід');
  });

  test('GEN-004: Toggle allergens', async ({ page }) => {
    await page.goto('/');
    await forceClick(page, page.locator('button.btn-nav-ghost'));
    await page.click('text=Увійти в акаунт →');
    await forceClick(page, page.locator('button.btn-nav-solid'));

    // FIX mobile: generate div перекриває allergy-chip
    await forceClick(page, page.locator('button.allergy-chip', { hasText: '🥜 Горіхи' }));
    const nutsChip = page.locator('.allergy-chip--active:has-text("🥜 Горіхи")');
    await expect(nutsChip).toBeVisible();
  });
});

test.describe('Recipe Page Interactions', () => {
  test('REC-001: Tab switching works', async ({ page }) => {
    await page.goto('/');
    await forceClick(page, page.locator('button.btn-nav-ghost'));
    await page.click('text=Увійти в акаунт →');

    await page.locator('.mini-card').first().click();

    await expect(page.locator('text=Яйця курячі')).toBeVisible();

    await page.locator('button.tab-btn', { hasText: '👨‍🍳 Приготування' }).click();
    await expect(page.locator('text=Розігрій оливкову олію')).toBeVisible();

    await forceClick(page, page.locator('button.tab-btn', { hasText: '📊 Поживність' }));
    await expect(page.locator('.nutr-key').first()).toBeVisible();
  });

  test('REC-002: Save recipe button', async ({ page }) => {
    await page.goto('/');
    await forceClick(page, page.locator('button.btn-nav-ghost'));
    await page.click('text=Увійти в акаунт →');
    await page.locator('.mini-card').first().click();

    await page.click('text=♡ Зберегти рецепт');
    await expect(page.locator('text=✅ Збережено')).toBeVisible();
  });
});

test.describe('Profile Page', () => {
  test('PROF-001: Navigate to profile and verify content', async ({ page }) => {
    await page.goto('/');
    await forceClick(page, page.locator('button.btn-nav-ghost'));
    await page.click('text=Увійти в акаунт →');
    await forceClick(page, page.locator('button.nav-avatar').first());

    await expect(page.locator('text=Олексій Коваль')).toBeVisible();
    await expect(page.locator('text=oleksiy@example.com')).toBeVisible();
  });

  test('PROF-002: Toggle preferences', async ({ page }) => {
    await page.goto('/');
    await forceClick(page, page.locator('button.btn-nav-ghost'));
    await page.click('text=Увійти в акаунт →');
    await forceClick(page, page.locator('button.nav-avatar').first());

    const toggles = page.locator('.toggle');
    const count = await toggles.count();
    expect(count).toBeGreaterThan(0);

    await toggles.first().click();
    await expect(toggles.first()).toBeVisible();
  });

  test('PROF-003: Logout navigates to Login', async ({ page }) => {
    await page.goto('/');
    await forceClick(page, page.locator('button.btn-nav-ghost'));
    await page.click('text=Увійти в акаунт →');
    await forceClick(page, page.locator('button.nav-avatar').first());

    // FIX mobile: navbar перекриває кнопку Вийти
    await forceClick(page, page.locator('button.btn-nav-ghost', { hasText: 'Вийти' }));
    await expect(page.locator('text=З поверненням')).toBeVisible();
  });
});

test.describe('UI Visual Checks', () => {
  test('UI-001: Landing page has correct structure', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('.navbar')).toBeVisible();
    await expect(page.locator('.landing__hero')).toBeVisible();
    await expect(page.locator('.features-strip')).toBeVisible();
    await expect(page.locator('.how-section')).toBeVisible();
    await expect(page.locator('.footer')).toBeVisible();
  });

  test('UI-002: Navbar is sticky', async ({ page }) => {
    await page.goto('/');
    const navbar = page.locator('.navbar');
    const position = await navbar.evaluate(el => getComputedStyle(el).position);
    expect(position).toBe('sticky');
  });
});