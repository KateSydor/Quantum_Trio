/**
 * Integration Tests — App Navigation Flow
 * Тести інтеграції навігації між сторінками
 */
import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../../../UI_prototype/src/App';

describe('App — Navigation Integration', () => {
  beforeEach(() => {
    window.scrollTo = jest.fn();
  });

  // IT-NAV-001
  test('app starts on Landing page', () => {
    render(<App />);
    expect(screen.getByText(/Готуй розумніше/)).toBeInTheDocument();
  });

  // IT-NAV-002
  test('Landing → Register via CTA button', async () => {
    const user = userEvent.setup();
    render(<App />);
    // Натиснути "Розпочати →" — обидві CTA кнопки ведуть на register
    const ctaButtons = screen.getAllByText('Розпочати →');
    await user.click(ctaButtons[0]);
    expect(screen.getByText('Створити акаунт')).toBeInTheDocument();
  });

  // IT-NAV-003
  test('Landing → Login via nav button', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByText('Увійти'));
    expect(screen.getByText(/З поверненням/)).toBeInTheDocument();
  });

  // IT-NAV-004
  test('Login → Home via login button', async () => {
    const user = userEvent.setup();
    render(<App />);
    // Спочатку на Landing, переходимо на Login
    await user.click(screen.getByText('Увійти'));
    // Натискаємо "Увійти в акаунт"
    await user.click(screen.getByText('Увійти в акаунт →'));
    expect(screen.getByText(/Що приготуємо/)).toBeInTheDocument();
  });

  // IT-NAV-005
  test('Login → Register via link', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByText('Увійти'));
    const regLinks = screen.getAllByText('Зареєструватись');
    await user.click(regLinks[regLinks.length - 1]);
    expect(screen.getByText('Створити акаунт')).toBeInTheDocument();
  });

  // IT-NAV-006
  test('Register → Home via create account', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByText('Увійти'));
    const regLinks = screen.getAllByText('Зареєструватись');
    await user.click(regLinks[0]);
    await user.click(screen.getByText('Створити акаунт →'));
    expect(screen.getByText(/Що приготуємо/)).toBeInTheDocument();
  });

  // IT-NAV-007
  test('Home → Generate via button', async () => {
    const user = userEvent.setup();
    render(<App />);
    // Go to Home via Login
    await user.click(screen.getByText('Увійти'));
    await user.click(screen.getByText('Увійти в акаунт →'));
    // Click generate button
    await user.click(screen.getByText('✨ Згенерувати рецепт'));
    expect(screen.getByText(/Генератор рецептів/)).toBeInTheDocument();
  });

  // IT-NAV-008
  test('Home → Recipe via recipe card', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByText('Увійти'));
    await user.click(screen.getByText('Увійти в акаунт →'));
    // Click on a mini card in hero section
    const miniCards = document.querySelectorAll('.mini-card');
    if (miniCards.length > 0) {
      await user.click(miniCards[0]);
      expect(screen.getByText(/Шпинатна/)).toBeInTheDocument();
    }
  });

  // IT-NAV-009
  test('Home → Profile via avatar', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByText('Увійти'));
    await user.click(screen.getByText('Увійти в акаунт →'));
    await user.click(screen.getByText('👤'));
    expect(screen.getByText('Олексій Коваль')).toBeInTheDocument();
  });

  // IT-NAV-010
  test('Landing → Generate via Demo button', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByText('▶ Демо'));
    expect(screen.getByText(/Генератор рецептів/)).toBeInTheDocument();
  });
});

