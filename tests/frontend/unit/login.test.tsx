/**
 * Unit Tests — Login Page
 * Тести сторінки входу (LoginPage)
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginPage from '../../../UI_prototype/src/pages/Login';
import { RouterProvider } from '../../../UI_prototype/src/router';

function renderLogin() {
  return render(
    <RouterProvider>
      <LoginPage />
    </RouterProvider>
  );
}

describe('Login Page', () => {
  // UT-LG-001
  test('renders login title', () => {
    renderLogin();
    expect(screen.getByText(/З поверненням/)).toBeInTheDocument();
  });

  // UT-LG-002
  test('renders email input with default value', () => {
    renderLogin();
    const emailInput = screen.getByPlaceholderText('your@email.com');
    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toHaveValue('oleksiy@example.com');
  });

  // UT-LG-003
  test('renders password input', () => {
    renderLogin();
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    expect(passwordInputs.length).toBeGreaterThan(0);
  });

  // UT-LG-004
  test('password toggle shows/hides password', async () => {
    const user = userEvent.setup();
    renderLogin();
    const toggleBtn = screen.getByText('👁️');
    expect(toggleBtn).toBeInTheDocument();
    await user.click(toggleBtn);
    expect(screen.getByText('🙈')).toBeInTheDocument();
  });

  // UT-LG-005
  test('remember me checkbox is checked by default', () => {
    renderLogin();
    const checkbox = document.querySelector('.checkbox--checked');
    expect(checkbox).toBeInTheDocument();
  });

  // UT-LG-006
  test('renders social login buttons', () => {
    renderLogin();
    expect(screen.getByText('Продовжити з Google')).toBeInTheDocument();
    expect(screen.getByText('Продовжити з Apple')).toBeInTheDocument();
  });

  // UT-LG-007
  test('renders "Забули пароль?" link', () => {
    renderLogin();
    expect(screen.getByText('Забули пароль?')).toBeInTheDocument();
  });

  // UT-LG-008
  test('renders "Зареєструватись" link', () => {
    renderLogin();
    const regLinks = screen.getAllByText('Зареєструватись');
    expect(regLinks.length).toBeGreaterThan(0);
  });

  // UT-LG-009
  test('renders testimonials on left panel', () => {
    renderLogin();
    expect(screen.getByText(/RecipeAI змінив мій підхід/)).toBeInTheDocument();
    expect(screen.getByText(/Марія К., Київ/)).toBeInTheDocument();
  });

  // UT-LG-010
  test('renders login button', () => {
    renderLogin();
    expect(screen.getByText('Увійти в акаунт →')).toBeInTheDocument();
  });
});

