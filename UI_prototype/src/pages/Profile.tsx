import { useState } from 'react';
import { useNavigate } from '../router';
import { Toggle, Footer } from '../components/UI';

export default function ProfilePage() {
  const navigate = useNavigate();

  const [prefs, setPrefs] = useState({ veg: false, gluten: false, lactose: true, spicy: true });
  const [ai, setAi] = useState({ tips: true, nutrition: true, personalize: true, email: false });
  const [twofa, setTwofa] = useState(false);

  type PrefKey = keyof typeof prefs;
  type AiKey = keyof typeof ai;

  return (
    <div className="page" style={{ background: 'var(--warm-white)' }}>
      <nav className="navbar">
        <button className="nav-logo" onClick={() => navigate('home')}>Recipe<em>AI</em></button>
        <div className="nav-links">
          <button className="nav-link" onClick={() => navigate('home')}>Головна</button>
          <button className="nav-link">Мої рецепти</button>
          <button className="nav-link nav-link--active">Профіль</button>
        </div>
        <div className="nav-actions">
          <button className="btn-nav-ghost" onClick={() => navigate('login')}>Вийти</button>
        </div>
      </nav>

      <div className="profile">
        <div className="profile__header">
          <div className="profile__avatar">🧑</div>
          <div>
            <div className="profile__name">Олексій Коваль</div>
            <div className="profile__email">oleksiy@example.com · Учасник з вересня 2024</div>
            <div className="profile__stats">
              {[['47', 'Рецептів'], ['12', 'Збережено'], ['8', 'Тижнів']].map(([n, l]) => (
                <div key={l}>
                  <span className="pstat-num">{n}</span>
                  <span className="pstat-lbl">{l}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <button className="btn-forest">Редагувати профіль</button>
          </div>
        </div>

        <div className="profile__grid">
          {/* FOOD PREFERENCES */}
          <div className="profile-card">
            <div className="profile-card__title">🌿 Харчові вподобання</div>
            {([['veg', '🌱', 'Вегетаріанство'], ['gluten', '🌾', 'Без глютену'], ['lactose', '🥛', 'Без лактози'], ['spicy', '🌶️', 'Гостра їжа']] as [PrefKey, string, string][]).map(([k, icon, label]) => (
              <div key={k} className="pref-row">
                <div className="pref-row__left"><span style={{ fontSize: 22 }}>{icon}</span>{label}</div>
                <Toggle on={prefs[k]} onChange={() => setPrefs(p => ({ ...p, [k]: !p[k] }))} />
              </div>
            ))}
          </div>

          {/* AI SETTINGS */}
          <div className="profile-card">
            <div className="profile-card__title">🤖 Налаштування AI</div>
            {([['tips', '💡', 'AI поради шеф-кухаря'], ['nutrition', '📊', 'Аналіз поживності'], ['personalize', '🎯', 'Персоналізація'], ['email', '📧', 'Email-підбірки']] as [AiKey, string, string][]).map(([k, icon, label]) => (
              <div key={k} className="pref-row">
                <div className="pref-row__left"><span style={{ fontSize: 22 }}>{icon}</span>{label}</div>
                <Toggle on={ai[k]} onChange={() => setAi(p => ({ ...p, [k]: !p[k] }))} />
              </div>
            ))}
          </div>

          {/* SECURITY */}
          <div className="profile-card">
            <div className="profile-card__title">🔒 Акаунт та безпека</div>
            <div className="pref-row">
              <div className="pref-row__left"><span style={{ fontSize: 22 }}>✉️</span>Email</div>
              <span style={{ fontSize: 14, color: 'var(--gray)' }}>oleksiy@…</span>
            </div>
            <div className="pref-row">
              <div className="pref-row__left"><span style={{ fontSize: 22 }}>🔑</span>Пароль</div>
              <button className="link-text">Змінити</button>
            </div>
            <div className="pref-row">
              <div className="pref-row__left"><span style={{ fontSize: 22 }}>🛡️</span>Двофакторна автентифікація</div>
              <Toggle on={twofa} onChange={() => setTwofa(p => !p)} />
            </div>
            <div className="pref-row">
              <div className="pref-row__left"><span style={{ fontSize: 22 }}>G</span>Google акаунт</div>
              <span className="tag tag--green">Підключено</span>
            </div>
          </div>

          {/* STATS */}
          <div className="profile-card">
            <div className="profile-card__title">📊 Статистика</div>
            {[['✨', 'Згенеровано рецептів', '47'], ['🔖', 'Збережених рецептів', '12'], ['🗓️', 'Тижнів активності', '8'], ['⭐', 'Улюблена категорія', 'Сніданки']].map(([icon, label, val]) => (
              <div key={label} className="pref-row">
                <div className="pref-row__left"><span style={{ fontSize: 22 }}>{icon}</span>{label}</div>
                <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--forest)' }}>{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
