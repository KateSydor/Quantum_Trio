import { useState } from 'react';
import { useNavigate } from '../router';
import { NavApp, Footer } from '../components/UI';

const CARDS = [
  { emoji: '🥗', grad: '#7C9A6B,#4A7C59', title: 'Грецький салат з авокадо та кіноа', time: '15 хв', portions: '2 порції', kcal: '280 ккал', rating: '4.8', reviews: 124, badge: 'Веган', badgeClass: 'tag--green' },
  { emoji: '🍝', grad: '#C4603A,#8B3A1F', title: 'Паста карбонара класична', time: '25 хв', portions: '4 порції', kcal: '520 ккал', rating: '4.9', reviews: 348, badge: 'Популярне', badgeClass: 'tag--amber' },
  { emoji: '🍲', grad: '#D4860A,#A8650A', title: 'Крем-суп з гарбуза з імбиром', time: '40 хв', portions: '6 порцій', kcal: '180 ккал', rating: '4.7', reviews: 89, badge: null, badgeClass: '' },
];

const CHIPS = [
  { id: 'all', label: 'Всі' }, { id: 'salad', label: '🥗 Салати' },
  { id: 'pasta', label: '🍝 Паста' }, { id: 'soup', label: '🍲 Супи' },
  { id: 'meat', label: '🥩 М\'ясо' }, { id: 'vegan', label: '🌱 Веган' },
  { id: 'dessert', label: '🎂 Десерти' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [activeChip, setActiveChip] = useState('all');

  return (
    <div className="page">
      <NavApp active="home" />

      <div className="home-hero">
        <div className="home-hero__inner">
          <div style={{ flex: 1, maxWidth: 540 }}>
            <div style={{ color: 'var(--mint)', fontSize: 15, marginBottom: 10 }}>Привіт, Олексій 👋</div>
            <h1 className="home-hero__title">Що приготуємо<br /><em>сьогодні</em>?</h1>
            <p style={{ color: 'var(--mint)', fontSize: 16, lineHeight: 1.6, marginBottom: 32 }}>
              Введи інгредієнти або опиши страву — AI підбере ідеальний рецепт
            </p>
            <div className="search-box">
              <span style={{ fontSize: 18 }}>🔍</span>
              <input type="text" placeholder="Введи інгредієнти: яйця, шпинат, сир..." />
              <button className="search-btn" onClick={() => navigate('generate')}>✨ Генерувати</button>
            </div>
          </div>

          <div style={{ flex: 1, display: 'flex', gap: 16 }}>
            {[['🥗','Грецький салат з авокадо','⏱ 15 хв · ⭐ 4.8'],
              ['🍝','Карбонара класична','⏱ 25 хв · ⭐ 4.9'],
              ['🍲','Гарбузовий суп-пюре','⏱ 40 хв · ⭐ 4.7']].map(([em, name, meta]) => (
              <div key={name} className="mini-card" onClick={() => navigate('recipe')}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>{em}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 6, lineHeight: 1.3 }}>{name}</div>
                <div style={{ fontSize: 12, color: 'var(--mint)' }}>{meta}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="home-content">
        <div className="chips-row">
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--charcoal)', marginRight: 4 }}>Категорії:</span>
          {CHIPS.map(({ id, label }) => (
            <button key={id} className={`chip ${activeChip === id ? 'chip--active' : ''}`} onClick={() => setActiveChip(id)}>
              {label}
            </button>
          ))}
        </div>

        <div className="home-content__header">
          <h2 className="home-content__title">Популярні рецепти</h2>
          <button style={{ fontSize: 14, color: 'var(--sage)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>
            Переглянути всі →
          </button>
        </div>

        <div className="recipe-grid">
          {CARDS.map(c => (
            <div key={c.title} className="recipe-card" onClick={() => navigate('recipe')}>
              <div className="recipe-card__thumb" style={{ background: `linear-gradient(135deg,${c.grad})` }}>
                {c.emoji}
                {c.badge && (
                  <div style={{ position: 'absolute', top: 12, right: 12 }}>
                    <span className={`tag ${c.badgeClass}`}>{c.badge}</span>
                  </div>
                )}
              </div>
              <div className="recipe-card__body">
                <div className="recipe-card__title">{c.title}</div>
                <div className="recipe-card__meta">
                  <span>⏱ {c.time}</span><span>👤 {c.portions}</span><span>🔥 {c.kcal}</span>
                </div>
                <div className="recipe-card__footer">
                  <span className="recipe-card__rating">★ {c.rating} <span style={{ color: 'var(--gray)', fontWeight: 400 }}>({c.reviews})</span></span>
                  <button className="recipe-card__save" onClick={e => e.stopPropagation()}>♡</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
