import { NavPublic, Footer } from '../components/UI';
import { useNavigate } from '../router';

const FEATURES = [
  ['🧠', 'AI-генерація рецептів', 'GPT-4 аналізує інгредієнти та створює оригінальні страви'],
  ['🎯', 'Персоналізація', 'Враховує алергії, дієту та кулінарні вподобання'],
  ['📊', 'Харчова цінність', 'Автоматичний розрахунок КБЖУ для кожного рецепту'],
  ['📋', 'Покрокові інструкції', 'Зрозумілі кулінарні кроки з таймером'],
];

const HOW_STEPS = [
  ['01', '🥬', 'Введи інгредієнти', 'Напиши що є вдома — яйця, сир, помідори. AI розпізнає будь-який формат.'],
  ['02', '⚙️', 'Налаштуй параметри', 'Час, тип страви, дієтичні обмеження — AI врахує всі побажання.'],
  ['03', '🍽️', 'Отримай рецепт', 'За секунди — повний рецепт з інгредієнтами, кроками та КБЖУ.'],
];

export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="page landing">
      <NavPublic />

      {/* HERO */}
      <div className="landing__hero">
        <div style={{ flex: 1, maxWidth: 580 }}>
          <div className="landing__eyebrow">✦ Powered by GPT-4</div>
          <h1 className="landing__title">
            Готуй розумніше<br />з <em>штучним<br />інтелектом</em>
          </h1>
          <p className="landing__sub">
            Введи інгредієнти, що маєш вдома — AI згенерує унікальний рецепт
            із покроковими інструкціями та харчовою цінністю.
          </p>
          <div className="landing__cta">
            <button className="btn-amber" onClick={() => navigate('register')}>Розпочати →</button>
            <button className="btn-outline" onClick={() => navigate('generate')}>▶ Демо</button>
          </div>
          <div className="landing__stats">
            {[['50k+', 'Рецептів'], ['12k+', 'Користувачів'], ['4.9★', 'Рейтинг']].map(([n, l]) => (
              <div key={l}><span className="stat-num">{n}</span><span className="stat-lbl">{l}</span></div>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', position: 'relative' }}>
          <div className="hero-card">
            <div className="hero-card__img">🥗</div>
            <div className="hero-card__title">Середземноморський салат з кіноа</div>
            <div className="hero-card__meta">
              <span>⏱ 20 хв</span><span>👤 2 порції</span><span>🔥 340 ккал</span>
            </div>
            <div className="hero-card__ai">
              <span>🤖</span>
              <span style={{ fontSize: 13, lineHeight: 1.5 }}>
                <strong style={{ color: 'var(--sage)' }}>AI порада:</strong> Додай лимонного соку перед подачею
              </span>
            </div>
            <div className="float-card" style={{ top: -18, right: -48 }}>
              <span style={{ fontSize: 28 }}>✨</span>
              <div>
                <strong style={{ display: 'block', fontSize: 13 }}>Рецепт за 3 сек</strong>
                <span style={{ fontSize: 12, color: 'var(--gray)' }}>AI згенерував</span>
              </div>
            </div>
            <div className="float-card" style={{ bottom: 50, left: -56 }}>
              <span style={{ fontSize: 28 }}>🥦</span>
              <div>
                <strong style={{ display: 'block', fontSize: 13 }}>3 інгредієнти</strong>
                <span style={{ fontSize: 12, color: 'var(--gray)' }}>з холодильника</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FEATURES STRIP */}
      <div className="features-strip">
        <div className="features-strip__inner">
          {FEATURES.map(([icon, title, desc]) => (
            <div key={title} className="feature-item">
              <span style={{ fontSize: 30, flexShrink: 0, marginTop: 2 }}>{icon}</span>
              <div>
                <div style={{ color: '#fff', fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{title}</div>
                <div style={{ color: 'var(--mint)', fontSize: 13, lineHeight: 1.5 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div className="how-section">
        <div className="how-section__inner">
          <div className="section-eyebrow">Як це працює</div>
          <h2 className="section-title">Три кроки до ідеальної страви</h2>
          <p className="section-sub">Від порожнього холодильника до готової страви — менше ніж за хвилину</p>
          <div className="how-grid">
            {HOW_STEPS.map(([num, icon, title, desc]) => (
              <div key={num} className="how-card">
                <div className="how-card__num">{num}</div>
                <div style={{ fontSize: 32, marginBottom: 14 }}>{icon}</div>
                <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--charcoal)', marginBottom: 8 }}>{title}</div>
                <div style={{ fontSize: 14, color: 'var(--gray)', lineHeight: 1.6 }}>{desc}</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <button className="btn-forest" onClick={() => navigate('register')}>Розпочати →</button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
