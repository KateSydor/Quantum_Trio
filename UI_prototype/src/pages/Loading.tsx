import { useState, useEffect } from 'react';
import { useNavigate } from '../router';
import { NavDark } from '../components/UI';

const STEPS = [
  { icon: '🔍', label: 'Аналіз інгредієнтів' },
  { icon: '🧠', label: 'Підбір рецепту' },
  { icon: '⚗️', label: 'Генерація кроків' },
  { icon: '👨‍🍳', label: 'Поради шеф-кухаря' },
];

export default function LoadingPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    const timers = [
      setTimeout(() => setCurrentStep(2), 900),
      setTimeout(() => setCurrentStep(3), 1900),
      setTimeout(() => setCurrentStep(4), 2800),
      setTimeout(() => navigate('recipe'), 3600),
    ];
    return () => timers.forEach(clearTimeout);
  }, [navigate]);

  return (
    <div className="page" style={{ background: 'var(--forest)' }}>
      <NavDark />
      <div className="loading">
        <div className="loading__spinner">
          <div className="loading__icon">🍽️</div>
        </div>
        <h1 className="loading__title">AI готує рецепт...</h1>
        <p className="loading__sub">
          Аналізуємо інгредієнти, підбираємо оптимальну комбінацію та генеруємо покрокову інструкцію
        </p>

        <div className="loading__steps">
          {STEPS.map((step, i) => {
            const stepNum = i + 1;
            const isDone = stepNum < currentStep;
            const isActive = stepNum === currentStep;
            return (
              <div
                key={step.label}
                className={`loading-step ${isDone ? 'loading-step--done' : ''} ${isActive ? 'loading-step--active' : ''}`}
              >
                <span className="loading-step__icon">{step.icon}</span>
                <div className="loading-step__label">{step.label}</div>
                {isDone && <div className="loading-step__done">✓ Готово</div>}
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 48 }}>
          <button
            style={{ padding: '14px 32px', borderRadius: 50, border: '1.5px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.08)', color: 'var(--mint)', fontSize: 15, fontWeight: 500, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}
            onClick={() => navigate('recipe')}
          >
            → Переглянути результат
          </button>
        </div>
      </div>
    </div>
  );
}
