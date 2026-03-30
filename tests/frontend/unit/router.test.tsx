/**
 * Unit Tests — Router (router.tsx)
 * Тести для модуля навігації / маршрутизації
 */
import React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RouterProvider, useNavigate, usePage, Page } from '../../../UI_prototype/src/router';

/* ─── Helper: компонент для тестування хуків ─── */
function TestNavigator() {
  const navigate = useNavigate();
  const page = usePage();
  return (
    <div>
      <span data-testid="current-page">{page}</span>
      <button onClick={() => navigate('login')}>Go Login</button>
      <button onClick={() => navigate('home')}>Go Home</button>
      <button onClick={() => navigate('register')}>Go Register</button>
      <button onClick={() => navigate('generate')}>Go Generate</button>
      <button onClick={() => navigate('loading')}>Go Loading</button>
      <button onClick={() => navigate('recipe')}>Go Recipe</button>
      <button onClick={() => navigate('profile')}>Go Profile</button>
      <button onClick={() => navigate('landing')}>Go Landing</button>
    </div>
  );
}

describe('Router Module', () => {
  beforeEach(() => {
    window.scrollTo = jest.fn();
  });

  // UT-R-001
  test('default page should be "landing"', () => {
    render(
      <RouterProvider>
        <TestNavigator />
      </RouterProvider>
    );
    expect(screen.getByTestId('current-page')).toHaveTextContent('landing');
  });

  // UT-R-002
  test('navigate to "login" should update page state', async () => {
    const user = userEvent.setup();
    render(
      <RouterProvider>
        <TestNavigator />
      </RouterProvider>
    );
    await user.click(screen.getByText('Go Login'));
    expect(screen.getByTestId('current-page')).toHaveTextContent('login');
  });

  // UT-R-003
  test('navigate to "home" should update page state', async () => {
    const user = userEvent.setup();
    render(
      <RouterProvider>
        <TestNavigator />
      </RouterProvider>
    );
    await user.click(screen.getByText('Go Home'));
    expect(screen.getByTestId('current-page')).toHaveTextContent('home');
  });

  // UT-R-004
  test('navigate to "register" should update page state', async () => {
    const user = userEvent.setup();
    render(
      <RouterProvider>
        <TestNavigator />
      </RouterProvider>
    );
    await user.click(screen.getByText('Go Register'));
    expect(screen.getByTestId('current-page')).toHaveTextContent('register');
  });

  // UT-R-005
  test('navigate to "generate" should update page state', async () => {
    const user = userEvent.setup();
    render(
      <RouterProvider>
        <TestNavigator />
      </RouterProvider>
    );
    await user.click(screen.getByText('Go Generate'));
    expect(screen.getByTestId('current-page')).toHaveTextContent('generate');
  });

  // UT-R-006
  test('navigate to "recipe" should update page state', async () => {
    const user = userEvent.setup();
    render(
      <RouterProvider>
        <TestNavigator />
      </RouterProvider>
    );
    await user.click(screen.getByText('Go Recipe'));
    expect(screen.getByTestId('current-page')).toHaveTextContent('recipe');
  });

  // UT-R-007
  test('navigate to "profile" should update page state', async () => {
    const user = userEvent.setup();
    render(
      <RouterProvider>
        <TestNavigator />
      </RouterProvider>
    );
    await user.click(screen.getByText('Go Profile'));
    expect(screen.getByTestId('current-page')).toHaveTextContent('profile');
  });

  // UT-R-008
  test('navigate should call window.scrollTo(0, 0)', async () => {
    const user = userEvent.setup();
    render(
      <RouterProvider>
        <TestNavigator />
      </RouterProvider>
    );
    await user.click(screen.getByText('Go Home'));
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });

  // UT-R-009
  test('sequential navigation should update page correctly', async () => {
    const user = userEvent.setup();
    render(
      <RouterProvider>
        <TestNavigator />
      </RouterProvider>
    );
    await user.click(screen.getByText('Go Login'));
    expect(screen.getByTestId('current-page')).toHaveTextContent('login');
    await user.click(screen.getByText('Go Home'));
    expect(screen.getByTestId('current-page')).toHaveTextContent('home');
    await user.click(screen.getByText('Go Landing'));
    expect(screen.getByTestId('current-page')).toHaveTextContent('landing');
  });

  // UT-R-010
  test('navigate to "loading" should update page state', async () => {
    const user = userEvent.setup();
    render(
      <RouterProvider>
        <TestNavigator />
      </RouterProvider>
    );
    await user.click(screen.getByText('Go Loading'));
    expect(screen.getByTestId('current-page')).toHaveTextContent('loading');
  });
});

