/**
 * Unit Tests — Recipe Page
 * Тести сторінки рецепту (RecipePage)
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RecipePage from '../../../UI_prototype/src/pages/Recipe';
import { RouterProvider } from '../../../UI_prototype/src/router';

function renderRecipe() {
  window.scrollTo = jest.fn();
  return render(
    <RouterProvider>
      <RecipePage />
    </RouterProvider>
  );
}

describe('Recipe Page', () => {
  // UT-REC-001
  test('renders recipe title', () => {
    renderRecipe();
    expect(screen.getByText(/Шпинатна/)).toBeInTheDocument();
  });

  // UT-REC-002
  test('renders meta pills with time, servings, calories, rating', () => {
    renderRecipe();
    expect(screen.getByText('15 хв')).toBeInTheDocument();
    expect(screen.getByText('320 ккал')).toBeInTheDocument();
  });

  // UT-REC-003
  test('renders AI tip section', () => {
    renderRecipe();
    expect(screen.getByText('AI Порада шеф-кухаря')).toBeInTheDocument();
    expect(screen.getByText(/мускатного горіха/)).toBeInTheDocument();
  });

  // UT-REC-004
  test('renders all 4 tabs', () => {
    renderRecipe();
    expect(screen.getByText('🥬 Інгредієнти')).toBeInTheDocument();
    expect(screen.getByText('👨‍🍳 Приготування')).toBeInTheDocument();
    expect(screen.getByText('📊 Поживність')).toBeInTheDocument();
    expect(screen.getByText('💬 Відгуки (12)')).toBeInTheDocument();
  });

  // UT-REC-005
  test('ingredients tab shows 6 ingredients by default', () => {
    renderRecipe();
    expect(screen.getByText('Яйця курячі')).toBeInTheDocument();
    expect(screen.getByText('Шпинат свіжий')).toBeInTheDocument();
    expect(screen.getByText('Сир фета')).toBeInTheDocument();
    expect(screen.getByText('Цибуля ріпчаста')).toBeInTheDocument();
    expect(screen.getByText('Олія оливкова')).toBeInTheDocument();
    expect(screen.getByText('Сіль та перець')).toBeInTheDocument();
  });

  // UT-REC-006
  test('switching to steps tab shows cooking steps', async () => {
    const user = userEvent.setup();
    renderRecipe();
    await user.click(screen.getByText('👨‍🍳 Приготування'));
    expect(screen.getByText(/Розігрій оливкову олію/)).toBeInTheDocument();
    expect(screen.getByText(/Додай нарізану цибулю/)).toBeInTheDocument();
  });

  // UT-REC-007
  test('switching to nutrition tab shows КБЖУ', async () => {
    const user = userEvent.setup();
    renderRecipe();
    await user.click(screen.getByText('📊 Поживність'));
    expect(screen.getAllByText('320').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Калорії').length).toBeGreaterThan(0);
  });

  // UT-REC-008
  test('switching to reviews tab shows empty state', async () => {
    const user = userEvent.setup();
    renderRecipe();
    await user.click(screen.getByText('💬 Відгуки (12)'));
    expect(screen.getByText(/Відгуків поки немає/)).toBeInTheDocument();
  });

  // UT-REC-009
  test('save button toggles state', async () => {
    const user = userEvent.setup();
    renderRecipe();
    const saveBtn = screen.getByText('♡ Зберегти рецепт');
    await user.click(saveBtn);
    expect(screen.getByText('✅ Збережено')).toBeInTheDocument();
  });

  // UT-REC-010
  test('renders AI-generated badge', () => {
    renderRecipe();
    expect(screen.getByText('✨ AI-генерований')).toBeInTheDocument();
  });

  // UT-REC-011
  test('renders vegetarian and easy tags', () => {
    renderRecipe();
    expect(screen.getByText('Вегетаріанське')).toBeInTheDocument();
    expect(screen.getByText('Легко')).toBeInTheDocument();
  });
});

