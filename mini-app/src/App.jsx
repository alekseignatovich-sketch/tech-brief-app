import { useState } from 'react';
import './styles.css';

const SNOWFLAKE_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white">
  <path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2zm0 16l1.5 4.5L18 24l-4.5-1.5L12 28l-1.5-4.5L6 24l4.5-1.5L12 18z"/>
</svg>
`;

export default function App() {
  const [data, setData] = useState({
    brand_name: '',
    business_type: 'digital products',
    email: '',
    socials: '',
    services: '',
    working_hours: 'Mon-Fri 10:00–18:00',
    team_size: '1',
    design_style: 'matrix',
    needs_hosting: false,
    extra_features: []
  });

  const toggleFeature = (feat) => {
    setData(prev => ({
      ...prev,
      extra_features: prev.extra_features.includes(feat)
        ? prev.extra_features.filter(f => f !== feat)
        : [...prev.extra_features, feat]
    }));
  };

  const handleSubmit = () => {
    const payload = {
      ...data,
      socials: data.socials.split(',').map(s => s.trim()).filter(Boolean),
      services: data.services.split('\n').map(s => {
        const [name, dur] = s.split('|');
        return { name: name?.trim(), duration_min: parseInt(dur) || 30 };
      }).filter(s => s.name),
      team_size: parseInt(data.team_size),
      needs_hosting: data.needs_hosting
    };

    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.sendData(JSON.stringify(payload));
      window.Telegram.WebApp.close();
    } else {
      alert('[DEV MODE] Data:\n' + JSON.stringify(payload, null, 2));
    }
  };

  return (
    <div className="container">
      <h1>🤖 ProjectKitten AI</h1>

      <input placeholder="Название бренда" value={data.brand_name} onChange={e => setData({...data, brand_name: e.target.value})} />
      <select value={data.business_type} onChange={e => setData({...data, business_type: e.target.value})}>
        <option value="digital products">Цифровые товары</option>
        <option value="coaching">Коучинг</option>
        <option value="e-commerce">Интернет-магазин</option>
        <option value="education">Образование</option>
      </select>
      <input placeholder="Email" value={data.email} onChange={e => setData({...data, email: e.target.value})} />
      <textarea placeholder="Соцсети (через запятую)" value={data.socials} onChange={e => setData({...data, socials: e.target.value})} rows="2" />
      <textarea placeholder="Услуги (по строке; длительность через |, например: Консультация | 45)" value={data.services} onChange={e => setData({...data, services: e.target.value})} rows="4" />
      <input placeholder="Режим работы" value={data.working_hours} onChange={e => setData({...data, working_hours: e.target.value})} />
      <input type="number" min="1" placeholder="Кол-во специалистов" value={data.team_size} onChange={e => setData({...data, team_size: e.target.value})} />
      <select value={data.design_style} onChange={e => setData({...data, design_style: e.target.value})}>
        <option value="matrix">Matrix</option>
        <option value="mihome">MiHome</option>
        <option value="minimal">Минимализм</option>
      </select>
      <label><input type="checkbox" checked={data.needs_hosting} onChange={e => setData({...data, needs_hosting: e.target.checked})} /> Нужна помощь с хостингом?</label>

      <div style={{ marginTop: '16px' }}>
        <p>Доп. функции:</p>
        {['calendar', 'payments', 'ai_chat', 'analytics'].map(feat => (
          <label key={feat} style={{ display: 'block', margin: '6px 0' }}>
            <input type="checkbox" checked={data.extra_features.includes(feat)} onChange={() => toggleFeature(feat)} />
            {feat === 'calendar' && '📅 Календарь'}
            {feat === 'payments' && '💳 Платежи'}
            {feat === 'ai_chat' && '🤖 AI-чат'}
            {feat === 'analytics' && '📊 Аналитика'}
          </label>
        ))}
      </div>

      <button className="red-btn" onClick={handleSubmit}>
        <span dangerouslySetInnerHTML={{ __html: SNOWFLAKE_SVG }} className="snowflake" />
        Отправить ТЗ
        <span dangerouslySetInnerHTML={{ __html: SNOWFLAKE_SVG }} className="snowflake" />
      </button>
    </div>
  );
}
