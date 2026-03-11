import { useState } from 'react';
import { useNavigate } from '../router';

const MEAL_TYPES = [
  { id: 'breakfast', icon: '🥣', label: 'Сніданок', sub: 'до 20 хв' },
  { id: 'lunch',     icon: '🥗', label: 'Обід',     sub: '20–40 хв' },
  { id: 'dinner',    icon: '🍽️', label: 'Вечеря',   sub: '30–60 хв' },
  { id: 'dessert',   icon: '🎂', label: 'Десерт',   sub: 'солодке' },
];

const ALLERGENS = [
  { id: 'nuts',     label: '🥜 Горіхи' },
  { id: 'lactose',  label: '🥛 Лактоза' },
  { id: 'gluten',   label: '🌾 Глютен' },
  { id: 'eggs',     label: '🥚 Яйця' },
  { id: 'fish',     label: '🐟 Риба' },
  { id: 'seafood',  label: '🦐 Морепродукти' },
];

const DIFF_LABELS = ['', 'Легко', 'Середньо', 'Складно'];

export default function GeneratePage() {
  const navigate = useNavigate();
  const [ingredients, setIngredients] = useState(['🥚 Яйця', '🌿 Шпинат', '🧀 Сир фета', '🧅 Цибуля']);
  const [ingInput, setIngInput] = useState('');
  const [mealType, setMealType] = useState('breakfast');
  const [time, setTime] = useState(30);
  const [diff, setDiff] = useState(1);
  const [servings, setServings] = useState(2);
  const [allergies, setAllergies] = useState<string[]>(['gluten']);

  const addIngredient = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && ingInput.trim()) {
      setIngredients(p => [...p, ingInput.trim()]);
      setIngInput('');
    }
  };
  const removeIng = (ing: string) => setIngredients(p => p.filter(x => x !== ing));
  const toggleAllergen = (id: string) =>
    setAllergies(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  const servingsLabel = (n: number) =>
    `${n} порці${n === 1 ? 'я' : n < 5 ? 'ї' : 'й'}`;

  const currentMeal = MEAL_TYPES.find(t => t.id === mealType);

  return (
    <div className="page" style={{ background: 'var(--warm-white)' }}>
      <nav className="navbar">
        <button className="nav-logo" onClick={() => navigate('home')}>Recipe<em>AI</em></button>
        <div className="nav-links">
          <button className="nav-link" onClick={() => navigate('home')}>← Назад</button>
        </div>
        <div className="nav-actions">
          <button className="nav-avatar" onClick={() => navigate('profile')}>👤</button>
        </div>
      </nav>

      <div className="generate">
        {/* LEFT COLUMN */}
        <div>
          <h1 className="generate__title">✨ Генератор рецептів</h1>
          <p style={{ color: 'var(--gray)', fontSize: 16, marginBottom: 48 }}>
            Розкажи AI що маєш — отримай ідеальний рецепт
          </p>

          {/* INGREDIENTS */}
          <div className="gen-block">
            <div className="gen-block__title">🥬 Інгредієнти (що є вдома)</div>
            <div className="ing-box">
              <div className="ing-tags">
                {ingredients.map(ing => (
                  <span key={ing} className="ing-tag">
                    {ing}
                    <button className="ing-tag__remove" onClick={() => removeIng(ing)}>×</button>
                  </span>
                ))}
              </div>
              <input
                className="ing-input"
                placeholder="Додай ще інгредієнт та натисни Enter..."
                value={ingInput}
                onChange={e => setIngInput(e.target.value)}
                onKeyDown={addIngredient}
              />
            </div>
            <div style={{ fontSize: 13, color: 'var(--gray)', marginTop: 8 }}>
              💡 AI автоматично визначить можливі страви із зазначених продуктів
            </div>
          </div>

          {/* MEAL TYPE */}
          <div className="gen-block">
            <div className="gen-block__title">🍽️ Тип страви</div>
            <div className="type-grid">
              {MEAL_TYPES.map(t => (
                <div
                  key={t.id}
                  className={`type-card ${mealType === t.id ? 'type-card--selected' : ''}`}
                  onClick={() => setMealType(t.id)}
                >
                  <span style={{ fontSize: 32, display: 'block', marginBottom: 10 }}>{t.icon}</span>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--charcoal)' }}>{t.label}</div>
                  <div style={{ fontSize: 12, color: 'var(--gray)', marginTop: 3 }}>{t.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* SLIDERS */}
          <div className="gen-block">
            <div className="gen-block__title">⏱️ Параметри</div>
            <div className="params-box">
              {[
                { label: 'Час приготування', display: `${time} хв`, value: time, min: 5, max: 120, onChange: (v: number) => setTime(v) },
                { label: 'Складність', display: DIFF_LABELS[diff], value: diff, min: 1, max: 3, onChange: (v: number) => setDiff(v) },
                { label: 'Кількість порцій', display: servingsLabel(servings), value: servings, min: 1, max: 10, onChange: (v: number) => setServings(v) },
              ].map(s => (
                <div key={s.label}>
                  <div className="slider-header">
                    <label className="input-label" style={{ margin: 0 }}>{s.label}</label>
                    <span className="slider-val">{s.display}</span>
                  </div>
                  <input
                    type="range" className="range-slider"
                    min={s.min} max={s.max} value={s.value}
                    onChange={e => s.onChange(Number(e.target.value))}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* ALLERGIES */}
          <div className="gen-block">
            <div className="gen-block__title">⚠️ Алергії та обмеження</div>
            <div className="allergy-chips">
              {ALLERGENS.map(a => (
                <button
                  key={a.id}
                  className={`allergy-chip ${allergies.includes(a.id) ? 'allergy-chip--active' : ''}`}
                  onClick={() => toggleAllergen(a.id)}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>

          {/* WISHES */}
          <div className="gen-block">
            <div className="gen-block__title">💬 Додаткові побажання</div>
            <textarea className="input-field" rows={3} placeholder="напр. хочу щось легке та здорове, без гострого..." />
          </div>
        </div>

        {/* SIDEBAR */}
        <div>
          <div className="gen-sidebar">
            <div className="gen-sidebar__title">Параметри запиту</div>
            {[
              ['🥬', 'Інгредієнти', `${ingredients.length} додано`],
              ['🥣', 'Тип', currentMeal?.label],
              ['⏱️', 'Час', `${time} хв`],
              ['👤', 'Порції', servings],
            ].map(([icon, key, val]) => (
              <div key={String(key)} className="gen-summary-row">
                <div className="gen-summary-icon">{icon}</div>
                <span style={{ color: 'var(--gray)', flex: 1 }}>{key}</span>
                <span style={{ color: 'var(--charcoal)', fontWeight: 600 }}>{String(val)}</span>
              </div>
            ))}
            {allergies.length > 0 && (
              <div className="gen-summary-row">
                <div className="gen-summary-icon">⚠️</div>
                <span style={{ color: 'var(--gray)', flex: 1 }}>Алергії</span>
                <span style={{ color: '#EF4444', fontWeight: 600 }}>{allergies.length}</span>
              </div>
            )}
            <div className="gen-ai-hint">
              <span style={{ fontSize: 22 }}>🤖</span>
              <span>AI проаналізує ваші інгредієнти та згенерує <strong>3–5 варіантів</strong> з урахуванням усіх параметрів.</span>
            </div>
            <button
              className="btn-full btn-full--amber"
              style={{ fontSize: 17, padding: 18 }}
              onClick={() => navigate('loading')}
            >
              ✨ Згенерувати рецепт
            </button>
            <div style={{ textAlign: 'center', marginTop: 12, fontSize: 13, color: 'var(--gray)' }}>
              ⚡ Зазвичай 3–5 секунд
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
