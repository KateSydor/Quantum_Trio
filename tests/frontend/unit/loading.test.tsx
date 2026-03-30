/**
 * Unit Tests — Loading Page
 * Тести сторінки завантаження (LoadingPage)
 */
import React from 'react';
import { render, screen, act } from '@testing-library/react';
import LoadingPage from '../../../UI_prototype/src/pages/Loading';
import { RouterProvider } from '../../../UI_prototype/src/router';

function renderLoading() {
  window.scrollTo = jest.fn();
  jest.useFakeTimers();
  const result = render(
    <RouterProvider>
      <LoadingPage />
    </RouterProvider>
  );
  return result;
}

afterEach(() => {
  jest.useRealTimers();
});

describe('Loading Page', () => {
  // UT-LD-001
  test('renders loading title', () => {
    renderLoading();
    expect(screen.getByText('AI готує рецепт...')).toBeInTheDocument();
  });

  // UT-LD-002
  test('renders loading subtitle', () => {
    renderLoading();
    expect(screen.getByText(/Аналізуємо інгредієнти/)).toBeInTheDocument();
  });

  // UT-LD-003
  test('renders 4 loading steps', () => {
    renderLoading();
    expect(screen.getByText('Аналіз інгредієнтів')).toBeInTheDocument();
    expect(screen.getByText('Підбір рецепту')).toBeInTheDocument();
    expect(screen.getByText('Генерація кроків')).toBeInTheDocument();
    expect(screen.getByText('Поради шеф-кухаря')).toBeInTheDocument();
  });

  // UT-LD-004
  test('renders spinner icon', () => {
    const { container } = renderLoading();
    expect(container.querySelector('.loading__spinner')).toBeInTheDocument();
  });

  // UT-LD-005
  test('renders skip button', () => {
    renderLoading();
    expect(screen.getByText('→ Переглянути результат')).toBeInTheDocument();
  });

  // UT-LD-006
  test('first step is active initially', () => {
    const { container } = renderLoading();
    const activeSteps = container.querySelectorAll('.loading-step--active');
    expect(activeSteps.length).toBe(1);
  });

  // UT-LD-007
  test('step 2 becomes active after ~900ms', () => {
    const { container } = renderLoading();
    act(() => { jest.advanceTimersByTime(950); });
    const doneSteps = container.querySelectorAll('.loading-step--done');
    expect(doneSteps.length).toBeGreaterThanOrEqual(1);
  });

  // UT-LD-008
  test('dark navbar is rendered', () => {
    const { container } = renderLoading();
    expect(container.querySelector('.navbar--dark')).toBeInTheDocument();
  });
});

