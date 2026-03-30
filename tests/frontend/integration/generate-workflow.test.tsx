/**
 * Integration Tests — Generate Page Workflow
 * Тести робочого процесу генерації рецептів
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GeneratePage from '../../../UI_prototype/src/pages/Generate';
import { RouterProvider } from '../../../UI_prototype/src/router';

function renderGenerate() {
  window.scrollTo = jest.fn();
  return render(
    <RouterProvider>
      <GeneratePage />
    </RouterProvider>
  );
}

describe('Generate Page — Integration', () => {
  // IT-GEN-001
  test('renders with default 4 ingredients', () => {
    renderGenerate();
    expect(screen.getByText('🥚 Яйця')).toBeInTheDocument();
    expect(screen.getByText('🌿 Шпинат')).toBeInTheDocument();
    expect(screen.getByText('🧀 Сир фета')).toBeInTheDocument();
    expect(screen.getByText('🧅 Цибуля')).toBeInTheDocument();
  });

  // IT-GEN-002
  test('add ingredient via Enter key', async () => {
    const user = userEvent.setup();
    renderGenerate();
    const input = screen.getByPlaceholderText(/Додай ще інгредієнт/);
    await user.type(input, 'Помідори{enter}');
    expect(screen.getByText('Помідори')).toBeInTheDocument();
  });

  // IT-GEN-003
  test('remove ingredient via × button', async () => {
    const user = userEvent.setup();
    renderGenerate();
    // Find remove buttons
    const removeBtns = screen.getAllByText('×');
    expect(removeBtns.length).toBe(4);
    await user.click(removeBtns[0]);
    // After removal should be 3 ingredients
    const remainingRemoveBtns = screen.getAllByText('×');
    expect(remainingRemoveBtns.length).toBe(3);
  });

  // IT-GEN-004
  test('empty Enter does not add ingredient', async () => {
    const user = userEvent.setup();
    renderGenerate();
    const input = screen.getByPlaceholderText(/Додай ще інгредієнт/);
    await user.type(input, '{enter}');
    const removeBtns = screen.getAllByText('×');
    expect(removeBtns.length).toBe(4); // Still 4
  });

  // IT-GEN-005
  test('meal type selection changes active card', async () => {
    const user = userEvent.setup();
    const { container } = renderGenerate();
    // Обід card
    const lunchCard = screen.getByText('Обід').closest('.type-card');
    await user.click(lunchCard!);
    expect(lunchCard).toHaveClass('type-card--selected');
    // Сніданок should no longer be selected
    const breakfastCard = screen.getByText('Сніданок').closest('.type-card');
    expect(breakfastCard).not.toHaveClass('type-card--selected');
  });

  // IT-GEN-006
  test('allergy chip toggles on/off', async () => {
    const user = userEvent.setup();
    renderGenerate();
    // Глютен is already selected by default
    const glutenChip = screen.getByText('🌾 Глютен');
    expect(glutenChip).toHaveClass('allergy-chip--active');
    // Toggle off
    await user.click(glutenChip);
    expect(glutenChip).not.toHaveClass('allergy-chip--active');
    // Toggle on again
    await user.click(glutenChip);
    expect(glutenChip).toHaveClass('allergy-chip--active');
  });

  // IT-GEN-007
  test('multiple allergens can be selected', async () => {
    const user = userEvent.setup();
    renderGenerate();
    const nutsChip = screen.getByText('🥜 Горіхи');
    const lactoseChip = screen.getByText('🥛 Лактоза');
    await user.click(nutsChip);
    await user.click(lactoseChip);
    expect(nutsChip).toHaveClass('allergy-chip--active');
    expect(lactoseChip).toHaveClass('allergy-chip--active');
  });

  // IT-GEN-008
  test('sidebar shows correct ingredient count', () => {
    renderGenerate();
    expect(screen.getByText('4 додано')).toBeInTheDocument();
  });

  // IT-GEN-009
  test('sidebar shows meal type', () => {
    renderGenerate();
    expect(screen.getByText('Сніданок')).toBeInTheDocument();
  });

  // IT-GEN-010
  test('generate button is present', () => {
    renderGenerate();
    const generateBtn = screen.getByText('✨ Згенерувати рецепт');
    expect(generateBtn).toBeInTheDocument();
  });
});

