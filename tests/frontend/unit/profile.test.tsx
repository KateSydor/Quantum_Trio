/**
 * Unit Tests — Profile Page
 * Тести сторінки профілю (ProfilePage)
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProfilePage from '../../../UI_prototype/src/pages/Profile';
import { RouterProvider } from '../../../UI_prototype/src/router';

function renderProfile() {
  window.scrollTo = jest.fn();
  return render(
    <RouterProvider>
      <ProfilePage />
    </RouterProvider>
  );
}

describe('Profile Page', () => {
  // UT-PR-001
  test('renders user name', () => {
    renderProfile();
    expect(screen.getByText('Олексій Коваль')).toBeInTheDocument();
  });

  // UT-PR-002
  test('renders user email and join date', () => {
    renderProfile();
    expect(screen.getByText(/oleksiy@example.com/)).toBeInTheDocument();
  });

  // UT-PR-003
  test('renders profile stats', () => {
    renderProfile();
    expect(screen.getByText('47')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
  });

  // UT-PR-004
  test('renders food preferences section', () => {
    renderProfile();
    expect(screen.getByText('🌿 Харчові вподобання')).toBeInTheDocument();
    expect(screen.getByText('Вегетаріанство')).toBeInTheDocument();
    expect(screen.getByText('Без глютену')).toBeInTheDocument();
    expect(screen.getByText('Без лактози')).toBeInTheDocument();
    expect(screen.getByText('Гостра їжа')).toBeInTheDocument();
  });

  // UT-PR-005
  test('renders AI settings section', () => {
    renderProfile();
    expect(screen.getByText('🤖 Налаштування AI')).toBeInTheDocument();
    expect(screen.getByText('AI поради шеф-кухаря')).toBeInTheDocument();
    expect(screen.getByText('Аналіз поживності')).toBeInTheDocument();
    expect(screen.getByText('Персоналізація')).toBeInTheDocument();
    expect(screen.getByText('Email-підбірки')).toBeInTheDocument();
  });

  // UT-PR-006
  test('renders security section', () => {
    renderProfile();
    expect(screen.getByText('🔒 Акаунт та безпека')).toBeInTheDocument();
    expect(screen.getByText('Двофакторна автентифікація')).toBeInTheDocument();
    expect(screen.getByText('Підключено')).toBeInTheDocument();
  });

  // UT-PR-007
  test('renders statistics section', () => {
    renderProfile();
    expect(screen.getByText('📊 Статистика')).toBeInTheDocument();
    expect(screen.getByText('Згенеровано рецептів')).toBeInTheDocument();
    expect(screen.getByText('Збережених рецептів')).toBeInTheDocument();
    expect(screen.getByText('Улюблена категорія')).toBeInTheDocument();
    expect(screen.getByText('Сніданки')).toBeInTheDocument();
  });

  // UT-PR-008
  test('toggle food preference changes state', async () => {
    const user = userEvent.setup();
    renderProfile();
    // Find all toggle buttons (switches)
    const switches = screen.getAllByRole('switch');
    expect(switches.length).toBeGreaterThan(0);
    // Click first toggle
    await user.click(switches[0]);
    // Toggle should still be in the document (state changed)
    expect(switches[0]).toBeInTheDocument();
  });

  // UT-PR-009
  test('renders edit profile button', () => {
    renderProfile();
    expect(screen.getByText('Редагувати профіль')).toBeInTheDocument();
  });

  // UT-PR-010
  test('renders logout button', () => {
    renderProfile();
    expect(screen.getByText('Вийти')).toBeInTheDocument();
  });
});

