import { useState } from 'react';
import { useNavigate } from '../router';
import { Checkbox, SocialButtons } from '../components/UI';

export default function LoginPage() {
  const navigate = useNavigate();
  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(true);

  return (
    <div className="page">
      <nav className="navbar">
        <button className="nav-logo" onClick={() => navigate('landing')}>Recipe<em>AI</em></button>
        <div className="nav-links" />
        <div className="nav-actions">
          <span style={{ fontSize: 14, color: 'var(--gray)' }}>Немає акаунту?</span>
          <button className="btn-nav-solid" onClick={() => navigate('register')}>Зареєструватись</button>
        </div>
      </nav>

      <div className="auth">
        <div className="auth__left">
          <div className="auth__left-inner">
            <div className="auth__quote">
              Кулінарія — це<br /><em>мистецтво</em>,<br />яке живе в кожному
            </div>
            <div className="auth__quote-sub">
              Повертайтесь до RecipeAI і відкривайте нові рецепти щодня. Ваш AI-шеф завжди готовий допомогти.
            </div>
            {[
              ['👩', '«RecipeAI змінив мій підхід до готування. Тепер я ніколи не викидаю продукти!»', 'Марія К., Київ'],
              ['👨', '«Мої діти тепер самі генерують рецепти і готують вечерю. Неймовірно!»', 'Олег В., Львів'],
            ].map(([av, text, name]) => (
              <div key={name} className="auth__testi">
                <div className="auth__testi-text">{text}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--sage)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>{av}</div>
                  <span style={{ fontSize: 13, color: 'var(--mint)', fontWeight: 500 }}>{name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="auth__right">
          <div className="auth__form">
            <div className="auth__title">З поверненням! 👋</div>
            <div className="auth__subtitle">Увійдіть, щоб продовжити готувати</div>

            <SocialButtons onSuccess={() => navigate('home')} />
            <div className="divider-or"><span>або через email</span></div>

            <div className="form-group">
              <label className="input-label">Email</label>
              <div className="input-wrap">
                <span className="input-icon">✉️</span>
                <input type="email" className="input-field" placeholder="your@email.com" defaultValue="oleksiy@example.com" />
              </div>
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 7 }}>
                <label className="input-label" style={{ margin: 0 }}>Пароль</label>
                <button className="link-text">Забули пароль?</button>
              </div>
              <div className="input-wrap">
                <span className="input-icon">🔒</span>
                <input type={showPwd ? 'text' : 'password'} className="input-field" defaultValue="password123" />
                <button className="input-suffix" onClick={() => setShowPwd(p => !p)}>{showPwd ? '🙈' : '👁️'}</button>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
              <Checkbox checked={remember} onChange={() => setRemember(p => !p)} />
              <span style={{ fontSize: 14, color: 'var(--gray)' }}>Запам'ятати мене на цьому пристрої</span>
            </div>

            <button className="btn-full btn-full--amber" onClick={() => navigate('home')}>
              Увійти в акаунт →
            </button>
            <div className="auth__switch">
              Немає акаунту? <button onClick={() => navigate('register')}>Зареєструватись</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
