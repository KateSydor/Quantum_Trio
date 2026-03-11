import { useState } from 'react';
import { useNavigate } from '../router';
import { Checkbox, SocialButtons } from '../components/UI';

const DIET_OPTIONS = [
  { id: 'veg', icon: '🌱', name: 'Вегетаріанство', desc: 'Без м\'яса' },
  { id: 'lactose', icon: '🥛', name: 'Без лактози', desc: 'Без молочного' },
  { id: 'gluten', icon: '🌾', name: 'Без глютену', desc: 'Безглютенове' },
  { id: 'keto', icon: '🥑', name: 'Кето-дієта', desc: 'Низьковуглеводне' },
];

const PERKS = [
  ['✨', 'Необмежена генерація рецептів', 'Генеруй скільки завгодно з будь-яких інгредієнтів'],
  ['🎯', 'Персональні налаштування', 'AI запам\'ятовує твої вподобання та алергії'],
  ['📚', 'Бібліотека рецептів', 'Зберігай улюблені рецепти та повертайся до них'],
  ['🆓', 'Повністю безкоштовно', 'Усі функції доступні без обмежень'],
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const [terms, setTerms] = useState(true);
  const [diets, setDiets] = useState<string[]>(['lactose']);
  const toggleDiet = (id: string) =>
    setDiets(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  return (
    <div className="page">
      <nav className="navbar">
        <button className="nav-logo" onClick={() => navigate('landing')}>Recipe<em>AI</em></button>
        <div className="nav-links" />
        <div className="nav-actions">
          <span style={{ fontSize: 14, color: 'var(--gray)' }}>Вже є акаунт?</span>
          <button className="btn-nav-ghost" onClick={() => navigate('login')}>Увійти</button>
        </div>
      </nav>

      <div className="register">
        <div className="register__left">
          <div style={{ position: 'relative', zIndex: 1, maxWidth: 400 }}>
            <div className="register__title">Твій <em>AI-шеф</em><br />вже чекає!</div>
            <div style={{ color: 'var(--mint)', fontSize: 15, lineHeight: 1.7, marginBottom: 48 }}>
              Приєднуйтесь до 12 000+ користувачів, які готують розумніше.
            </div>
            {PERKS.map(([icon, title, desc]) => (
              <div key={title} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 20 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, flexShrink: 0, background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{icon}</div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#fff', marginBottom: 3 }}>{title}</div>
                  <div style={{ fontSize: 13, color: 'var(--mint)', lineHeight: 1.5 }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="register__right">
          {/* Progress */}
          <div className="reg-progress">
            {[['1', 'Акаунт', 'active'], ['2', 'Уподобання', 'todo'], ['3', 'Готово!', 'todo']].map(([n, label, state], i) => (
              <div key={n} style={{ display: 'flex', alignItems: 'center', flex: i < 2 ? 'none' : undefined }}>
                {i > 0 && <div className="step-line" />}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <button className={`step-circle step-circle--${state}`}>{n}</button>
                  <span style={{ fontSize: 13, fontWeight: 500, color: state === 'active' ? 'var(--charcoal)' : 'var(--gray)' }}>{label}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="auth__title" style={{ fontSize: 28, marginBottom: 6 }}>Створити акаунт</div>
          <div className="auth__subtitle" style={{ marginBottom: 24 }}>Крок 1 з 3 — Основна інформація</div>

          <SocialButtons onSuccess={() => navigate('home')} />
          <div className="divider-or"><span>або заповніть форму</span></div>

          <div className="two-col">
            <div><label className="input-label">Ім'я</label><input type="text" className="input-field" placeholder="Олексій" /></div>
            <div><label className="input-label">Прізвище</label><input type="text" className="input-field" placeholder="Коваль" /></div>
          </div>

          <div className="form-group">
            <label className="input-label">Email</label>
            <div className="input-wrap">
              <span className="input-icon">✉️</span>
              <input type="email" className="input-field" placeholder="your@email.com" />
            </div>
          </div>

          <div className="form-group">
            <label className="input-label">Пароль</label>
            <div className="input-wrap">
              <span className="input-icon">🔒</span>
              <input type="password" className="input-field" placeholder="Мінімум 8 символів" />
            </div>
            <div className="strength-bars">
              {[0,1,2,3].map(i => <div key={i} className={`strength-bar ${i < 2 ? 'strength-bar--filled' : ''}`} />)}
            </div>
            <span style={{ fontSize: 11, color: 'var(--amber)' }}>Середній рівень надійності</span>
          </div>

          <div className="form-group">
            <label className="input-label">Підтвердіть пароль</label>
            <div className="input-wrap">
              <span className="input-icon">✅</span>
              <input type="password" className="input-field" placeholder="Повторіть пароль" style={{ borderColor: 'var(--sage)' }} />
            </div>
          </div>

          <div style={{ marginBottom: 18 }}>
            <label className="input-label" style={{ marginBottom: 12 }}>Харчові вподобання (необов'язково)</label>
            <div className="diet-grid">
              {DIET_OPTIONS.map(({ id, icon, name, desc }) => (
                <div key={id} className={`diet-opt ${diets.includes(id) ? 'diet-opt--selected' : ''}`} onClick={() => toggleDiet(id)}>
                  <span style={{ fontSize: 24 }}>{icon}</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--charcoal)' }}>{name}</div>
                    <div style={{ fontSize: 12, color: 'var(--gray)' }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(74,124,89,0.05)', padding: 12, borderRadius: 10, marginBottom: 20 }}>
            <Checkbox checked={terms} onChange={() => setTerms(p => !p)} />
            <span style={{ fontSize: 14, color: 'var(--gray)' }}>
              Я погоджуюсь з{' '}
              <span style={{ color: 'var(--sage)', fontWeight: 600, cursor: 'pointer' }}>Умовами використання</span>
              {' '}та{' '}
              <span style={{ color: 'var(--sage)', fontWeight: 600, cursor: 'pointer' }}>Політикою конфіденційності</span>
            </span>
          </div>

          <button className="btn-full btn-full--forest" onClick={() => navigate('home')}>
            Створити акаунт →
          </button>
          <div className="auth__switch" style={{ marginTop: 20 }}>
            Вже є акаунт? <button onClick={() => navigate('login')}>Увійти</button>
          </div>
        </div>
      </div>
    </div>
  );
}
