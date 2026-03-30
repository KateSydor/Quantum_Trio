/**
 * Unit Tests — Register Page
 * Тести сторінки реєстрації (RegisterPage)
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegisterPage from '../../../UI_prototype/src/pages/Register';
import { RouterProvider } from '../../../UI_prototype/src/router';

function renderRegister() {
  window.scrollTo = jest.fn();
  return render(
    <RouterProvider>
      <RegisterPage />
    </RouterProvider>
  );
}

describe('Register Page', () => {
  // UT-RG-001
  test('renders page title', () => {
    renderRegister();
    expect(screen.getByText('Створити акаунт')).toBeInTheDocument();
  });

  // UT-RG-002
  test('renders step progress (Крок 1 з 3)', () => {
    renderRegister();
    expect(screen.getByText('Крок 1 з 3 — Основна інформація')).toBeInTheDocument();
  });

  // UT-RG-003
  test('renders first name and last name inputs', () => {
    renderRegister();
    expect(screen.getByPlaceholderText('Олексій')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Коваль')).toBeInTheDocument();
  });

  // UT-RG-004
  test('renders email input', () => {
    renderRegister();
    expect(screen.getByPlaceholderText('your@email.com')).toBeInTheDocument();
  });

  // UT-RG-005
  test('renders password and confirm password inputs', () => {
    renderRegister();
    expect(screen.getByPlaceholderText('Мінімум 8 символів')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Повторіть пароль')).toBeInTheDocument();
  });

  // UT-RG-006
  test('renders password strength indicator', () => {
    const { container } = renderRegister();
    const strengthBars = container.querySelectorAll('.strength-bar');
    expect(strengthBars.length).toBe(4);
    const filledBars = container.querySelectorAll('.strength-bar--filled');
    expect(filledBars.length).toBe(2);
  });

  // UT-RG-007
  test('renders 4 diet options', () => {
    renderRegister();
    expect(screen.getByText('Вегетаріанство')).toBeInTheDocument();
    expect(screen.getByText('Без лактози')).toBeInTheDocument();
    expect(screen.getByText('Без глютену')).toBeInTheDocument();
    expect(screen.getByText('Кето-дієта')).toBeInTheDocument();
  });

  // UT-RG-008
  test('lactose diet is pre-selected', () => {
    const { container } = renderRegister();
    const selectedDiets = container.querySelectorAll('.diet-opt--selected');
    expect(selectedDiets.length).toBe(1);
  });

  // UT-RG-009
  test('clicking diet option toggles selection', async () => {
    const user = userEvent.setup();
    renderRegister();
    const vegOption = screen.getByText('Вегетаріанство').closest('.diet-opt');
    expect(vegOption).not.toHaveClass('diet-opt--selected');
    await user.click(vegOption!);
    expect(vegOption).toHaveClass('diet-opt--selected');
  });

  // UT-RG-010
  test('terms checkbox is checked by default', () => {
    const { container } = renderRegister();
    const checkboxes = container.querySelectorAll('.checkbox--checked');
    expect(checkboxes.length).toBeGreaterThan(0);
  });

  // UT-RG-011
  test('renders social login buttons', () => {
    renderRegister();
    expect(screen.getByText('Продовжити з Google')).toBeInTheDocument();
    expect(screen.getByText('Продовжити з Apple')).toBeInTheDocument();
  });

  // UT-RG-012
  test('renders create account button', () => {
    renderRegister();
    expect(screen.getByText('Створити акаунт →')).toBeInTheDocument();
  });

  // UT-RG-013
  test('renders left panel perks', () => {
    renderRegister();
    expect(screen.getByText('Необмежена генерація рецептів')).toBeInTheDocument();
    expect(screen.getByText('Персональні налаштування')).toBeInTheDocument();
    expect(screen.getByText('Бібліотека рецептів')).toBeInTheDocument();
    expect(screen.getByText('Повністю безкоштовно')).toBeInTheDocument();
  });

  // UT-RG-014
  test('renders progress step circles', () => {
    const { container } = renderRegister();
    const stepCircles = container.querySelectorAll('.step-circle');
    expect(stepCircles.length).toBe(3);
    expect(stepCircles[0]).toHaveClass('step-circle--active');
    expect(stepCircles[1]).toHaveClass('step-circle--todo');
    expect(stepCircles[2]).toHaveClass('step-circle--todo');
  });

  // UT-RG-015
  test('renders "Увійти" link at bottom', () => {
    renderRegister();
    const loginLinks = screen.getAllByText('Увійти');
    expect(loginLinks.length).toBeGreaterThan(0);
  });
});

