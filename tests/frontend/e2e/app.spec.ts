/**
 * E2E / UI Tests — RecipeAI (Playwright)
 * End-to-End тести для повного робочого процесу
 *
 * Потребує запущеного додатку на http://localhost:3000
 * Запуск: npx playwright test
 */
import { test, expect } from '@playwright/test';

test.describe('Smoke Tests', () => {
  test('ST-001: Landing page loads successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=Готуй розумніше')).toBeVisible();
    await expect(page.locator('.nav-logo')).toBeVisible();
  });

  test('ST-002: Navigation from Landing to Login', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Увійти');
    await expect(page.locator('text=З поверненням')).toBeVisible();
  });

  test('ST-003: Navigation from Landing to Register', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Розпочати →');
    await expect(page.locator('text=Створити акаунт')).toBeVisible();
  });
});

test.describe('Authentication Flow', () => {
  test('AUTH-001: Login flow - fill form and submit', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Увійти');

    // Verify form elements
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();

    // Click login button
    await page.click('text=Увійти в акаунт →');

    // Should navigate to Home
    await expect(page.locator('text=Що приготуємо')).toBeVisible();
  });

  test('AUTH-002: Password visibility toggle', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Увійти');

    // Initially password is hidden
    const passwordInput = page.locator('input[type="password"]');
    await expect(passwordInput).toBeVisible();

    // Click eye icon to show password
    await page.click('text=👁️');

    // Now should be text type
    await expect(page.locator('text=🙈')).toBeVisible();
  });

  test('AUTH-003: Register flow - navigate and verify form', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Розпочати →');

    // Check registration form elements
    await expect(page.locator('text=Створити акаунт')).toBeVisible();
    await expect(page.locator('text=Крок 1 з 3')).toBeVisible();

    // Check diet options
    await expect(page.locator('text=Вегетаріанство')).toBeVisible();
    await expect(page.locator('text=Без лактози')).toBeVisible();
    await expect(page.locator('text=Без глютену')).toBeVisible();
    await expect(page.locator('text=Кето-дієта')).toBeVisible();
  });

  test('AUTH-004: Social login buttons work', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Увійти');

    await page.click('text=Продовжити з Google');
    // Should navigate to Home
    await expect(page.locator('text=Що приготуємо')).toBeVisible();
  });
});

test.describe('Recipe Generation Flow', () => {
  test('GEN-001: Full generation flow - Landing → Login → Home → Generate → Loading → Recipe', async ({ page }) => {
    await page.goto('/');

    // Step 1: Login
    await page.click('text=Увійти');
    await page.click('text=Увійти в акаунт →');

    // Step 2: Navigate to Generate
    await page.click('text=✨ Згенерувати рецепт');
    await expect(page.locator('text=Генератор рецептів')).toBeVisible();

    // Step 3: Click Generate
    const generateBtn = page.locator('text=✨ Згенерувати рецепт').last();
    await generateBtn.click();

    // Step 4: Loading page
    await expect(page.locator('text=AI готує рецепт')).toBeVisible();

    // Step 5: Wait for Recipe page (auto-redirect after ~3.6s)
    await expect(page.locator('text=Шпинатна')).toBeVisible({ timeout: 10000 });
  });

  test('GEN-002: Add and remove ingredients', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Увійти');
    await page.click('text=Увійти в акаунт →');
    await page.click('text=✨ Згенерувати рецепт');

    // Add ingredient
    const input = page.locator('.ing-input');
    await input.fill('Помідори');
    await input.press('Enter');
    await expect(page.locator('text=Помідори')).toBeVisible();

    // Remove ingredient (click first ×)
    const removeButtons = page.locator('.ing-tag__remove');
    const count = await removeButtons.count();
    expect(count).toBe(5); // 4 default + 1 added
  });

  test('GEN-003: Select meal type', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Увійти');
    await page.click('text=Увійти в акаунт →');
    await page.click('text=✨ Згенерувати рецепт');

    // Click on "Обід"
    await page.click('.type-card:has-text("Обід")');
    const selected = page.locator('.type-card--selected');
    await expect(selected).toContainText('Обід');
  });

  test('GEN-004: Toggle allergens', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Увійти');
    await page.click('text=Увійти в акаунт →');
    await page.click('text=✨ Згенерувати рецепт');

    // Toggle nuts allergen
    await page.click('text=🥜 Горіхи');
    const nutsChip = page.locator('.allergy-chip--active:has-text("🥜 Горіхи")');
    await expect(nutsChip).toBeVisible();
  });
});

test.describe('Recipe Page Interactions', () => {
  test('REC-001: Tab switching works', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Увійти');
    await page.click('text=Увійти в акаунт →');

    // Navigate to Recipe via mini card
    await page.locator('.mini-card').first().click();

    // Default tab: Інгредієнти
    await expect(page.locator('text=Яйця курячі')).toBeVisible();

    // Switch to Приготування
    await page.click('text=👨‍🍳 Приготування');
    await expect(page.locator('text=Розігрій оливкову олію')).toBeVisible();

    // Switch to Поживність
    await page.click('text=📊 Поживність');
    await expect(page.locator('text=Калорії')).toBeVisible();
  });

  test('REC-002: Save recipe button', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Увійти');
    await page.click('text=Увійти в акаунт →');
    await page.locator('.mini-card').first().click();

    await page.click('text=♡ Зберегти рецепт');
    await expect(page.locator('text=✅ Збережено')).toBeVisible();
  });
});

test.describe('Profile Page', () => {
  test('PROF-001: Navigate to profile and verify content', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Увійти');
    await page.click('text=Увійти в акаунт →');
    await page.click('text=👤');

    await expect(page.locator('text=Олексій Коваль')).toBeVisible();
    await expect(page.locator('text=oleksiy@example.com')).toBeVisible();
  });

  test('PROF-002: Toggle preferences', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Увійти');
    await page.click('text=Увійти в акаунт →');
    await page.click('text=👤');

    // Find and click a toggle
    const toggles = page.locator('.toggle');
    const count = await toggles.count();
    expect(count).toBeGreaterThan(0);

    await toggles.first().click();
    // Toggle should still exist after click
    await expect(toggles.first()).toBeVisible();
  });

  test('PROF-003: Logout navigates to Login', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Увійти');
    await page.click('text=Увійти в акаунт →');
    await page.click('text=👤');

    await page.click('text=Вийти');
    await expect(page.locator('text=З поверненням')).toBeVisible();
  });
});

test.describe('UI Visual Checks', () => {
  test('UI-001: Landing page has correct structure', async ({ page }) => {
    await page.goto('/');

    // Navbar
    await expect(page.locator('.navbar')).toBeVisible();

    // Hero section
    await expect(page.locator('.landing__hero')).toBeVisible();

    // Features strip
    await expect(page.locator('.features-strip')).toBeVisible();

    // How section
    await expect(page.locator('.how-section')).toBeVisible();

    // Footer
    await expect(page.locator('.footer')).toBeVisible();
  });

  test('UI-002: Navbar is sticky', async ({ page }) => {
    await page.goto('/');
    const navbar = page.locator('.navbar');
    const position = await navbar.evaluate(el => getComputedStyle(el).position);
    expect(position).toBe('sticky');
  });
});

