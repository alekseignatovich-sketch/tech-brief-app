import { useState } from 'react';
import './styles.css';

const SNOWFLAKE_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="16" height="16">
  <path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2zm0 16l1.5 4.5L18 24l-4.5-1.5L12 28l-1.5-4.5L6 24l4.5-1.5L12 18z"/>
</svg>
`;

const STEPS = [
  "Основная цель",
  "О бизнесе",
  "Аудитория",
  "Формат продукта",
  "Дизайн и тон",
  "Техника",
  "Дедлайн"
];

export default function App() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    goal: [],
    brand_name: '',
    business_type: '',
    about: '',
    audience_age: '',
    audience_geo: '',
    audience_pain: '',
    audience_online: '',
    product_type: [],
    design_style: 'matrix',
    tone: 'friendly',
    payments: false,
    calendar: false,
    hosting: false,
    has_branding: false,
    branding_link: '',
    deadline: '',
    budget: ''
  });

  const next = () => setStep(prev => Math.min(prev + 1, STEPS.length - 1));
  const prev = () => setStep(prev => Math.max(prev - 1, 0));

  const updateData = (field, value) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const toggleGoal = (goal) => {
    setData(prev => ({
      ...prev,
      goal: prev.goal.includes(goal)
        ? prev.goal.filter(g => g !== goal)
        : [...prev.goal, goal]
    }));
  };

  const toggleProduct = (prod) => {
    setData(prev => ({
      ...prev,
      product_type: prev.product_type.includes(prod)
        ? prev.product_type.filter(p => p !== prod)
        : [...prev.product_type, prod]
    }));
  };

  const handleSubmit = () => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.sendData(JSON.stringify(data));
      window.Telegram.WebApp.close();
    } else {
      alert('[DEV] Data:\n' + JSON.stringify(data, null, 2));
    }
  };

  // === ШАГИ ===
  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div>
            <h2>🎯 Основная цель</h2>
            <p>Что вы хотите достичь?</p>
            {[
              "Продавать цифровые товары",
              "Собирать лиды",
              "Автоматизировать поддержку",
              "Обучать аудиторию",
              "Увеличить вовлечённость"
            ].map(g => (
              <label key={g} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={data.goal.includes(g)}
                  onChange={() => toggleGoal(g)}
                />
                {g}
              </label>
            ))}
          </div>
        );

      case 1:
        return (
          <div>
            <h2>💼 О бизнесе</h2>
            <input
              placeholder="Название бренда"
              value={data.brand_name}
              onChange={e => updateData('brand_name', e.target.value)}
            />
            <input
              placeholder="Сфера деятельности"
              value={data.business_type}
              onChange={e => updateData('business_type', e.target.value)}
            />
            <textarea
              placeholder="Кратко о себе (1–2 предложения): «Мы помогаем...»"
              value={data.about}
              onChange={e => updateData('about', e.target.value)}
              rows="3"
            />
          </div>
        );

      case 2:
        return (
          <div>
            <h2>👥 Целевая аудитория</h2>
            <input
              placeholder="Возраст (например: 25–40)"
              value={data.audience_age}
              onChange={e => updateData('audience_age', e.target.value)}
            />
            <input
              placeholder="Гео (страны, регионы)"
              value={data.audience_geo}
              onChange={e => updateData('audience_geo', e.target.value)}
            />
            <textarea
              placeholder="Боли / запросы"
              value={data.audience_pain}
              onChange={e => updateData('audience_pain', e.target.value)}
              rows="2"
            />
            <input
              placeholder="Где проводит время онлайн?"
              value={data.audience_online}
              onChange={e => updateData('audience_online', e.target.value)}
            />
          </div>
        );

      case 3:
        return (
          <div>
            <h2>📦 Формат продукта</h2>
            {[
              "Notion-шаблон",
              "PDF-разукрашка",
              "Telegram-бот",
              "Чек-лист / гайд",
              "Мини-курс"
            ].map(p => (
              <label key={p} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={data.product_type.includes(p)}
                  onChange={() => toggleProduct(p)}
                />
                {p}
              </label>
            ))}
          </div>
        );

      case 4:
        return (
          <div>
            <h2>🎨 Дизайн и тон</h2>
            <p><strong>Стиль оформления:</strong></p>
            {['matrix', 'mihome', 'creative', 'professional'].map(style => (
              <label key={style} className="radio-label">
                <input
                  type="radio"
                  name="design"
                  checked={data.design_style === style}
                  onChange={() => updateData('design_style', style)}
                />
                {style === 'matrix' && 'Matrix (киберпанк)'}
                {style === 'mihome' && 'MiHome (минимализм)'}
                {style === 'creative' && 'Креативный (эмодзи, юмор)'}
                {style === 'professional' && 'Профессиональный'}
              </label>
            ))}

            <p style={{ marginTop: '16px' }}><strong>Тон общения:</strong></p>
            {[
              { key: 'friendly', label: 'Дружелюбный и шутливый' },
              { key: 'expert', label: 'Экспертный и уверенный' },
              { key: 'minimal', label: 'Минималистичный и чёткий' }
            ].map(t => (
              <label key={t.key} className="radio-label">
                <input
                  type="radio"
                  name="tone"
                  checked={data.tone === t.key}
                  onChange={() => updateData('tone', t.key)}
                />
                {t.label}
              </label>
            ))}
          </div>
        );

      case 5:
        return (
          <div>
            <h2>⚙️ Технические пожелания</h2>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={data.payments}
                onChange={e => updateData('payments', e.target.checked)}
              />
              Нужна интеграция с оплатой?
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={data.calendar}
                onChange={e => updateData('calendar', e.target.checked)}
              />
              Нужен календарь / запись?
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={data.hosting}
                onChange={e => updateData('hosting', e.target.checked)}
              />
              Нужна помощь с хостингом?
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={data.has_branding}
                onChange={e => updateData('has_branding', e.target.checked)}
              />
              Есть логотип / фирменные цвета?
            </label>
            {data.has_branding && (
              <input
                placeholder="Ссылка на брендбук / изображение"
                value={data.branding_link}
                onChange={e => updateData('branding_link', e.target.value)}
                style={{ marginTop: '8px' }}
              />
            )}
          </div>
        );

      case 6:
        return (
          <div>
            <h2>📅 Дедлайн и бюджет</h2>
            <input
              placeholder="Когда нужен продукт? (дата или срок)"
              value={data.deadline}
              onChange={e => updateData('deadline', e.target.value)}
            />
            <input
              placeholder="Ориентировочный бюджет"
              value={data.budget}
              onChange={e => updateData('budget', e.target.value)}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container">
      {/* Прогресс-бар */}
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <div style={{ fontSize: '14px', color: '#aaa' }}>
          Шаг {step + 1} из {STEPS.length}
        </div>
        <div style={{ height: '6px', background: '#222', borderRadius: '3px', marginTop: '6px', overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              width: `${((step + 1) / STEPS.length) * 100}%`,
              background: '#ff3b30',
              transition: 'width 0.3s'
            }}
          />
        </div>
      </div>

      {renderStep()}

      <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
        {step > 0 && (
          <button className="red-btn" onClick={prev} style={{ flex: 1, background: '#555' }}>
            Назад
          </button>
        )}
        {step < STEPS.length - 1 ? (
          <button className="red-btn" onClick={next} style={{ flex: step > 0 ? 1 : 'none' }}>
            Далее
            <span dangerouslySetInnerHTML={{ __html: SNOWFLAKE_SVG }} />
          </button>
        ) : (
          <button className="red-btn" onClick={handleSubmit} style={{ flex: 1 }}>
            <span dangerouslySetInnerHTML={{ __html: SNOWFLAKE_SVG }} />
            Отправить бриф
            <span dangerouslySetInnerHTML={{ __html: SNOWFLAKE_SVG }} />
          </button>
        )}
      </div>
    </div>
  );
}
