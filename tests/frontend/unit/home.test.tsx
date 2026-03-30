/**
 * Unit Tests — Home Page
 * Тести головної сторінки (HomePage)
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HomePage from '../../../UI_prototype/src/pages/Home';
import { RouterProvider } from '../../../UI_prototype/src/router';

function renderHome() {
  window.scrollTo = jest.fn();
  return render(
    <RouterProvider>
      <HomePage />
    </RouterProvider>
  );
}

describe('Home Page', () => {
  // UT-HM-001
  test('renders greeting text', () => {
    renderHome();
    expect(screen.getByText(/Привіт, Олексій/)).toBeInTheDocument();
  });

  // UT-HM-002
  test('renders hero title', () => {
    renderHome();
    expect(screen.getByText(/Що приготуємо/)).toBeInTheDocument();
  });

  // UT-HM-003
  test('renders search input', () => {
    renderHome();
    const input = screen.getByPlaceholderText(/Введи інгредієнти/);
    expect(input).toBeInTheDocument();
  });

  // UT-HM-004
  test('renders generate button in search box', () => {
    renderHome();
    expect(screen.getByText('✨ Генерувати')).toBeInTheDocument();
  });

  // UT-HM-005
  test('renders 3 mini cards', () => {
    const { container } = renderHome();
    const miniCards = container.querySelectorAll('.mini-card');
    expect(miniCards.length).toBe(3);
  });

  // UT-HM-006
  test('renders category chips', () => {
    renderHome();
    expect(screen.getByText('Всі')).toBeInTheDocument();
    expect(screen.getByText('🥗 Салати')).toBeInTheDocument();
    expect(screen.getByText('🍝 Паста')).toBeInTheDocument();
    expect(screen.getByText('🍲 Супи')).toBeInTheDocument();
  });

  // UT-HM-007
  test('default active chip is "Всі"', () => {
    renderHome();
    const allChip = screen.getByText('Всі');
    expect(allChip).toHaveClass('chip--active');
  });

  // UT-HM-008
  test('clicking chip changes active state', async () => {
    const user = userEvent.setup();
    renderHome();
    const saladChip = screen.getByText('🥗 Салати');
    await user.click(saladChip);
    expect(saladChip).toHaveClass('chip--active');
  });

  // UT-HM-009
  test('renders "Популярні рецепти" section', () => {
    renderHome();
    expect(screen.getByText('Популярні рецепти')).toBeInTheDocument();
  });

  // UT-HM-010
  test('renders 3 recipe cards', () => {
    const { container } = renderHome();
    const recipeCards = container.querySelectorAll('.recipe-card');
    expect(recipeCards.length).toBe(3);
  });

  // UT-HM-011
  test('recipe cards display titles', () => {
    renderHome();
    expect(screen.getByText('Грецький салат з авокадо та кіноа')).toBeInTheDocument();
    expect(screen.getByText('Паста карбонара класична')).toBeInTheDocument();
    expect(screen.getByText('Крем-суп з гарбуза з імбиром')).toBeInTheDocument();
  });

  // UT-HM-012
  test('recipe card has save button (♡)', () => {
    renderHome();
    const saveButtons = screen.getAllByText('♡');
    expect(saveButtons.length).toBe(3);
  });

  // UT-HM-013
  test('save button click does not navigate', async () => {
    const user = userEvent.setup();
    renderHome();
    const saveButtons = screen.getAllByText('♡');
    await user.click(saveButtons[0]);
    // Should still be on Home page
    expect(screen.getByText(/Що приготуємо/)).toBeInTheDocument();
  });
});

