/**
 * Unit Tests — Landing Page
 * Тести сторінки Landing (LandingPage)
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LandingPage from '../../../UI_prototype/src/pages/Landing';
import { RouterProvider } from '../../../UI_prototype/src/router';

function renderLanding() {
  return render(
    <RouterProvider>
      <LandingPage />
    </RouterProvider>
  );
}

describe('Landing Page', () => {
  // UT-L-001
  test('renders hero title', () => {
    renderLanding();
    expect(screen.getByText(/Готуй розумніше/)).toBeInTheDocument();
  });

  // UT-L-002
  test('renders GPT-4 eyebrow badge', () => {
    renderLanding();
    expect(screen.getByText(/Powered by GPT-4/)).toBeInTheDocument();
  });

  // UT-L-003
  test('renders CTA buttons', () => {
    renderLanding();
    expect(screen.getByText('Розпочати →')).toBeInTheDocument();
    expect(screen.getByText('▶ Демо')).toBeInTheDocument();
  });

  // UT-L-004
  test('renders statistics', () => {
    renderLanding();
    expect(screen.getByText('50k+')).toBeInTheDocument();
    expect(screen.getByText('12k+')).toBeInTheDocument();
    expect(screen.getByText('4.9★')).toBeInTheDocument();
  });

  // UT-L-005
  test('renders features strip with 4 features', () => {
    renderLanding();
    expect(screen.getByText('AI-генерація рецептів')).toBeInTheDocument();
    expect(screen.getByText('Персоналізація')).toBeInTheDocument();
    expect(screen.getByText('Харчова цінність')).toBeInTheDocument();
    expect(screen.getByText('Покрокові інструкції')).toBeInTheDocument();
  });

  // UT-L-006
  test('renders "How it works" section with 3 steps', () => {
    renderLanding();
    expect(screen.getByText('Введи інгредієнти')).toBeInTheDocument();
    expect(screen.getByText('Налаштуй параметри')).toBeInTheDocument();
    expect(screen.getByText('Отримай рецепт')).toBeInTheDocument();
  });

  // UT-L-007
  test('renders hero recipe card', () => {
    renderLanding();
    expect(screen.getByText('Середземноморський салат з кіноа')).toBeInTheDocument();
  });

  // UT-L-008
  test('hero card shows meta info', () => {
    renderLanding();
    expect(screen.getByText('⏱ 20 хв')).toBeInTheDocument();
    expect(screen.getByText('👤 2 порції')).toBeInTheDocument();
    expect(screen.getByText('🔥 340 ккал')).toBeInTheDocument();
  });
});

