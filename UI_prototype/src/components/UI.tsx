import { useState } from 'react';
import { useNavigate, Page } from '../router';

/* ─── FOOTER ─── */
export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__logo">Recipe<em>AI</em></div>
        <div className="footer__links">
          {['Про нас', 'Блог', 'API', 'Конфіденційність'].map(l => (
            <button key={l} className="footer__link">{l}</button>
          ))}
        </div>
        <span className="footer__copy">© 2025 RecipeAI</span>
      </div>
    </footer>
  );
}

/* ─── TOGGLE ─── */
export function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button
      className={`toggle toggle--${on ? 'on' : 'off'}`}
      onClick={onChange}
      aria-checked={on}
      role="switch"
    />
  );
}

/* ─── CHECKBOX ─── */
export function Checkbox({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      className={`checkbox ${checked ? 'checkbox--checked' : ''}`}
      onClick={onChange}
    >
      {checked ? '✓' : ''}
    </button>
  );
}

/* ─── NAVBAR: PUBLIC (landing) ─── */
export function NavPublic() {
  const navigate = useNavigate();
  return (
    <nav className="navbar">
      <button className="nav-logo" onClick={() => navigate('landing')}>Recipe<em>AI</em></button>
      <div className="nav-links">
        <button className="nav-link nav-link--active">Головна</button>
        <button className="nav-link">Як це працює</button>
        <button className="nav-link" onClick={() => navigate('home')}>Рецепти</button>
      </div>
      <div className="nav-actions">
        <button className="btn-nav-ghost" onClick={() => navigate('login')}>Увійти</button>
        <button className="btn-nav-solid" onClick={() => navigate('register')}>Розпочати →</button>
      </div>
    </nav>
  );
}

/* ─── NAVBAR: APP (authenticated) ─── */
export function NavApp({ active }: { active?: Page }) {
  const navigate = useNavigate();
  return (
    <nav className="navbar">
      <button className="nav-logo" onClick={() => navigate('home')}>Recipe<em>AI</em></button>
      <div className="nav-links">
        {[
          { page: 'home' as Page | null, label: 'Головна' },
          { page: null, label: 'Мої рецепти' },
          { page: null, label: 'Збережені' },
          { page: null, label: 'Планувальник' },
        ].map(({ page, label }) => (
          <button
            key={label}
            className={`nav-link ${active === page ? 'nav-link--active' : ''}`}
            onClick={() => page && navigate(page)}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="nav-actions">
        <button className="btn-nav-solid" onClick={() => navigate('generate')}>✨ Згенерувати рецепт</button>
        <button className="nav-avatar" onClick={() => navigate('profile')}>👤</button>
      </div>
    </nav>
  );
}

/* ─── NAVBAR: DARK (loading screen) ─── */
export function NavDark() {
  const navigate = useNavigate();
  return (
    <nav className="navbar navbar--dark">
      <button className="nav-logo" onClick={() => navigate('home')}>Recipe<em>AI</em></button>
      <div className="nav-links" />
      <div className="nav-actions" />
    </nav>
  );
}

/* ─── SOCIAL BUTTONS ─── */
export function SocialButtons({ onSuccess }: { onSuccess: () => void }) {
  return (
    <div className="social-btns">
      <button className="social-btn" onClick={onSuccess}>
        <span style={{ fontSize: 18, fontWeight: 700, color: '#EA4335' }}>G</span>
        Продовжити з Google
      </button>
      <button className="social-btn" onClick={onSuccess}>
        <span style={{ fontSize: 18 }}>🍎</span>
        Продовжити з Apple
      </button>
    </div>
  );
}
