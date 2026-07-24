import React, { useState, useEffect } from 'react';
import Autocomplete from './components/Autocomplete';
import './components/App.css'

function App() {
  const [metrics, setMetrics] = useState({ hits: 0, misses: 0, cacheSize: 0 });

  // Función para obtener las métricas desde el backend
  const fetchMetrics = async () => {
    try {
      const response = await fetch('http://localhost:3000/metrics');
      if (response.ok) {
        const data = await response.json();
        setMetrics({
          hits: data.hits ?? 0,
          misses: data.misses ?? 0,
          cacheSize: data.cacheSize ?? 0,
          capacity: data.capacity ?? 30 // Asumimos 30 si no viene
        });
      }
    } catch (err) {
      console.error('Error al obtener métricas:', err);
    }
  };

  // Carga inicial de métricas
  useEffect(() => {
    fetchMetrics();
  }, []);

  const totalRequests = metrics.hits + metrics.misses;
  const hitRate = totalRequests > 0 ? ((metrics.hits / totalRequests) * 100).toFixed(0) : 0;

  return (
    <>
      <header className="header">
        <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🔍</div>
        <h1 className="titulo">
          Autocomplete con <span className="titulo-sieve">SIEVE</span>
        </h1>
        <p className="subtitulo">
          Caché inteligente con política de desalojo SIEVE
        </p>
      </header>

      <div className="autocomplete-wrapper">
        <Autocomplete onSearch={fetchMetrics} />
      </div>

      <div className="legend">
        <div>
          <span className="dot dot-sieve"></span>
          Respuesta desde caché SIEVE
        </div>
        <div>
          <span className="dot dot-dataset"></span>
          Respuesta desde dataset
        </div>
      </div>

      <section className="stats-card">
        <div className="stats-header">
          <h2 className="stats-title">
            📊 Estadísticas del Caché
          </h2>
          <p className="stats-subtitle">
            SIEVE · cap {metrics.capacity}
          </p>
        </div>

        <div className="stats-grid">
          <div className="stat-block">
            <p className="stat-value hits">{metrics.hits}</p>
            <p className="stat-label">Hits (caché)</p>
          </div>

          <div className="stat-block">
            <p className="stat-value misses">{metrics.misses}</p>
            <p className="stat-label">Misses (dataset)</p>
          </div>

          <div className="stat-block">
            <p className="stat-value rate">{hitRate}%</p>
            <p className="stat-label">Hit rate</p>
          </div>
        </div>

        <div className="progress-wrapper">
          <div className="progress-info">
            <span>Tamaño del caché</span>
            <strong>{metrics.cacheSize} / {metrics.capacity}</strong>
          </div>
          <div className="progress-bar-outer">
            <div 
              className="progress-bar-inner" 
              style={{ width: `${(metrics.cacheSize / metrics.capacity) * 100}%` }}
            ></div>
          </div>
        </div>
      </section>
    </>
  );
}

export default App;