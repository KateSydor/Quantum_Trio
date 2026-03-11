import { useState } from 'react';
import { useNavigate } from '../router';
import { Footer } from '../components/UI';

const INGREDIENTS = [
  { emoji: '🥚', name: 'Яйця курячі', amount: '4 штуки' },
  { emoji: '🌿', name: 'Шпинат свіжий', amount: '100 г' },
  { emoji: '🧀', name: 'Сир фета', amount: '50 г' },
  { emoji: '🧅', name: 'Цибуля ріпчаста', amount: '½ штуки' },
  { emoji: '🫒', name: 'Олія оливкова', amount: '2 ст.л.' },
  { emoji: '🧂', name: 'Сіль та перець', amount: 'за смаком' },
];

const STEPS_COOK = [
  'Розігрій оливкову олію на сковороді на середньому вогні.',
  'Додай нарізану цибулю і обсмажуй 2–3 хвилини до золотистості.',
  'Додай шпинат і смаж до в\'янення (~1 хв).',
  'Зроби заглиблення і розбий яйця. Посоли та поперчи.',
  'Готуй 3–4 хвилини до бажаної консистенції жовтка.',
  'Посип покришеним сиром фета перед подачею.',
];

const NUTRITION = [['320', 'Калорії'], ['22г', 'Білки'], ['24г', 'Жири'], ['6г', 'Вуглеводи']];

const TABS = ['🥬 Інгредієнти', '👨‍🍳 Приготування', '📊 Поживність', '💬 Відгуки (12)'];

export default function RecipePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [checked, setChecked] = useState([true, true, false, true, false, false]);
  const [saved, setSaved] = useState(false);

  const toggleCheck = (i: number) =>
    setChecked(p => { const n = [...p]; n[i] = !n[i]; return n; });

  return (
    <div className="page" style={{ background: 'var(--warm-white)' }}>
      <nav className="navbar">
        <button className="nav-logo" onClick={() => navigate('home')}>Recipe<em>AI</em></button>
        <div className="nav-links">
          <button className="nav-link" onClick={() => navigate('home')}>← Всі рецепти</button>
        </div>
        <div className="nav-actions">
          <button className="btn-nav-ghost" onClick={() => navigate('generate')}>✨ Новий рецепт</button>
          <button className="nav-avatar" onClick={() => navigate('profile')}>👤</button>
        </div>
      </nav>

      <div className="recipe-page">
        {/* MAIN CONTENT */}
        <div>
          <div className="recipe-banner">
            🥚
            <span className="recipe-banner__badge">✨ AI-генерований</span>
            <div className="recipe-banner__actions">
              {['♡', '↑', '🖨'].map(icon => (
                <button key={icon} className="recipe-action-btn">{icon}</button>
              ))}
            </div>
          </div>

          <h1 className="recipe-page__title">Шпинатна <em>яєчня</em> з сиром фета</h1>

          <div className="meta-pills">
            {[['⏱', 'Час:', '15 хв'], ['👤', 'Порції:', '2'], ['🔥', 'Калорії:', '320 ккал'], ['⭐', 'Рейтинг:', '4.8']].map(([em, lbl, val]) => (
              <div key={lbl} className="meta-pill">
                {em} <span style={{ color: 'var(--gray)' }}>{lbl}</span><span style={{ fontWeight: 600 }}>{val}</span>
              </div>
            ))}
            <span className="tag tag--green">Вегетаріанське</span>
            <span className="tag tag--amber">Легко</span>
          </div>

          <div className="ai-tip">
            <span style={{ fontSize: 26 }}>🤖</span>
            <div>
              <div className="ai-tip__head">AI Порада шеф-кухаря</div>
              <div className="ai-tip__text">
                Додай дрібку мускатного горіха до шпинату — це розкриє смак і надасть витонченого аромату.
                Подай з тостами з цільнозернового хліба для повноцінного сніданку.
              </div>
            </div>
          </div>

          {/* TABS */}
          <div className="tabs">
            {TABS.map((t, i) => (
              <button key={t} className={`tab-btn ${activeTab === i ? 'tab-btn--active' : ''}`} onClick={() => setActiveTab(i)}>{t}</button>
            ))}
          </div>

          {/* TAB: INGREDIENTS */}
          {activeTab === 0 && INGREDIENTS.map((ing, i) => (
            <div key={ing.name} className="ing-row" onClick={() => toggleCheck(i)}>
              <div className={`ing-check ${checked[i] ? 'ing-check--checked' : ''}`}>{checked[i] ? '✓' : ''}</div>
              <span style={{ fontSize: 22 }}>{ing.emoji}</span>
              <span style={{ flex: 1, fontSize: 15, color: checked[i] ? 'var(--gray)' : 'var(--charcoal)', textDecoration: checked[i] ? 'line-through' : 'none' }}>{ing.name}</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray)' }}>{ing.amount}</span>
            </div>
          ))}

          {/* TAB: STEPS */}
          {activeTab === 1 && (
            <div>
              {STEPS_COOK.map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: 16, marginBottom: 16, padding: 16, background: '#fff', borderRadius: 12 }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--forest)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0, fontSize: 14 }}>{i + 1}</div>
                  <span style={{ color: 'var(--charcoal)', lineHeight: 1.6, paddingTop: 4 }}>{step}</span>
                </div>
              ))}
            </div>
          )}

          {/* TAB: NUTRITION */}
          {activeTab === 2 && (
            <div style={{ background: '#fff', borderRadius: 16, padding: 24, border: '1.5px solid var(--light-gray)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
                {NUTRITION.map(([v, k]) => (
                  <div key={k} style={{ textAlign: 'center', background: 'var(--warm-white)', borderRadius: 10, padding: 16 }}>
                    <span style={{ fontFamily: "'Fraunces',serif", fontSize: 28, color: 'var(--forest)', display: 'block' }}>{v}</span>
                    <div style={{ fontSize: 13, color: 'var(--gray)', marginTop: 4 }}>{k}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: REVIEWS */}
          {activeTab === 3 && (
            <div style={{ color: 'var(--gray)', textAlign: 'center', padding: 40, fontSize: 15 }}>
              Відгуків поки немає. Будьте першим! ⭐
            </div>
          )}
        </div>

        {/* SIDEBAR */}
        <div>
          <div className="recipe-sidebar">
            <div style={{ fontFamily: "'Fraunces',serif", fontSize: 18, color: 'var(--charcoal)', marginBottom: 20 }}>
              Поживність на порцію
            </div>
            <div className="nutr-grid">
              {NUTRITION.map(([v, k]) => (
                <div key={k} className="nutr-item">
                  <span className="nutr-val">{v}</span>
                  <div className="nutr-key">{k}</div>
                </div>
              ))}
            </div>
            <button
              className="btn-full btn-full--amber"
              style={{ marginBottom: 12 }}
              onClick={() => setSaved(true)}
            >
              {saved ? '✅ Збережено' : '♡ Зберегти рецепт'}
            </button>
            <button
              className="btn-full btn-full--outline"
              onClick={() => navigate('generate')}
            >
              ✨ Згенерувати схожий
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
