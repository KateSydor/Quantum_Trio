/**
 * Unit Tests — UI Components (UI.tsx)
 * Тести для переспільних UI-компонентів: Toggle, Checkbox, Footer, NavPublic, NavApp, SocialButtons
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toggle, Checkbox, Footer, NavPublic, NavApp, NavDark, SocialButtons } from '../../../UI_prototype/src/components/UI';
import { RouterProvider } from '../../../UI_prototype/src/router';

/* ─── Обгортка з RouterProvider ─── */
function withRouter(ui: React.ReactElement) {
  return render(<RouterProvider>{ui}</RouterProvider>);
}

/* ═══════ TOGGLE ═══════ */
describe('Toggle Component', () => {
  // UT-UI-001
  test('renders in "on" state with correct class', () => {
    const { container } = render(<Toggle on={true} onChange={() => {}} />);
    const toggle = container.querySelector('.toggle');
    expect(toggle).toHaveClass('toggle--on');
  });

  // UT-UI-002
  test('renders in "off" state with correct class', () => {
    const { container } = render(<Toggle on={false} onChange={() => {}} />);
    const toggle = container.querySelector('.toggle');
    expect(toggle).toHaveClass('toggle--off');
  });

  // UT-UI-003
  test('calls onChange when clicked', async () => {
    const onChange = jest.fn();
    const user = userEvent.setup();
    render(<Toggle on={false} onChange={onChange} />);
    const toggle = screen.getByRole('switch');
    await user.click(toggle);
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  // UT-UI-004
  test('has role="switch" for accessibility', () => {
    render(<Toggle on={true} onChange={() => {}} />);
    expect(screen.getByRole('switch')).toBeInTheDocument();
  });

  // UT-UI-005
  test('has aria-checked attribute', () => {
    render(<Toggle on={true} onChange={() => {}} />);
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
  });
});

/* ═══════ CHECKBOX ═══════ */
describe('Checkbox Component', () => {
  // UT-UI-006
  test('renders checked state with ✓', () => {
    render(<Checkbox checked={true} onChange={() => {}} />);
    const checkbox = document.querySelector('.checkbox');
    expect(checkbox).toHaveClass('checkbox--checked');
    expect(checkbox).toHaveTextContent('✓');
  });

  // UT-UI-007
  test('renders unchecked state without ✓', () => {
    render(<Checkbox checked={false} onChange={() => {}} />);
    const checkbox = document.querySelector('.checkbox');
    expect(checkbox).not.toHaveClass('checkbox--checked');
    expect(checkbox).toHaveTextContent('');
  });

  // UT-UI-008
  test('calls onChange when clicked', async () => {
    const onChange = jest.fn();
    const user = userEvent.setup();
    const { container } = render(<Checkbox checked={false} onChange={onChange} />);
    const checkbox = container.querySelector('.checkbox')!;
    await user.click(checkbox);
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});

/* ═══════ FOOTER ═══════ */
describe('Footer Component', () => {
  // UT-UI-009
  test('renders RecipeAI logo', () => {
    const { container } = render(<Footer />);
    const logo = container.querySelector('.footer__logo');
    expect(logo).toBeInTheDocument();
    expect(logo?.textContent).toContain('Recipe');
  });

  // UT-UI-010
  test('renders navigation links', () => {
    render(<Footer />);
    expect(screen.getByText('Про нас')).toBeInTheDocument();
    expect(screen.getByText('Блог')).toBeInTheDocument();
    expect(screen.getByText('API')).toBeInTheDocument();
    expect(screen.getByText('Конфіденційність')).toBeInTheDocument();
  });

  // UT-UI-011
  test('renders copyright text', () => {
    render(<Footer />);
    expect(screen.getByText('© 2025 RecipeAI')).toBeInTheDocument();
  });
});

/* ═══════ NAVPUBLIC ═══════ */
describe('NavPublic Component', () => {
  // UT-UI-012
  test('renders RecipeAI logo', () => {
    withRouter(<NavPublic />);
    const logos = screen.getAllByText(/Recipe/);
    expect(logos.length).toBeGreaterThan(0);
  });

  // UT-UI-013
  test('renders navigation links', () => {
    withRouter(<NavPublic />);
    expect(screen.getByText('Головна')).toBeInTheDocument();
    expect(screen.getByText('Як це працює')).toBeInTheDocument();
    expect(screen.getByText('Рецепти')).toBeInTheDocument();
  });

  // UT-UI-014
  test('renders action buttons', () => {
    withRouter(<NavPublic />);
    expect(screen.getByText('Увійти')).toBeInTheDocument();
    expect(screen.getByText('Розпочати →')).toBeInTheDocument();
  });
});

/* ═══════ NAVAPP ═══════ */
describe('NavApp Component', () => {
  // UT-UI-015
  test('renders generate recipe button', () => {
    withRouter(<NavApp active="home" />);
    expect(screen.getByText('✨ Згенерувати рецепт')).toBeInTheDocument();
  });

  // UT-UI-016
  test('renders user avatar button', () => {
    withRouter(<NavApp active="home" />);
    expect(screen.getByText('👤')).toBeInTheDocument();
  });

  // UT-UI-017
  test('renders navigation links', () => {
    withRouter(<NavApp active="home" />);
    expect(screen.getByText('Головна')).toBeInTheDocument();
    expect(screen.getByText('Мої рецепти')).toBeInTheDocument();
    expect(screen.getByText('Збережені')).toBeInTheDocument();
    expect(screen.getByText('Планувальник')).toBeInTheDocument();
  });
});

/* ═══════ NAVDARK ═══════ */
describe('NavDark Component', () => {
  // UT-UI-018
  test('renders with dark class', () => {
    const { container } = withRouter(<NavDark />);
    expect(container.querySelector('.navbar--dark')).toBeInTheDocument();
  });
});

/* ═══════ SOCIAL BUTTONS ═══════ */
describe('SocialButtons Component', () => {
  // UT-UI-019
  test('renders Google button', () => {
    render(<SocialButtons onSuccess={() => {}} />);
    expect(screen.getByText('Продовжити з Google')).toBeInTheDocument();
  });

  // UT-UI-020
  test('renders Apple button', () => {
    render(<SocialButtons onSuccess={() => {}} />);
    expect(screen.getByText('Продовжити з Apple')).toBeInTheDocument();
  });

  // UT-UI-021
  test('calls onSuccess when Google clicked', async () => {
    const onSuccess = jest.fn();
    const user = userEvent.setup();
    render(<SocialButtons onSuccess={onSuccess} />);
    await user.click(screen.getByText('Продовжити з Google'));
    expect(onSuccess).toHaveBeenCalledTimes(1);
  });

  // UT-UI-022
  test('calls onSuccess when Apple clicked', async () => {
    const onSuccess = jest.fn();
    const user = userEvent.setup();
    render(<SocialButtons onSuccess={onSuccess} />);
    await user.click(screen.getByText('Продовжити з Apple'));
    expect(onSuccess).toHaveBeenCalledTimes(1);
  });
});

