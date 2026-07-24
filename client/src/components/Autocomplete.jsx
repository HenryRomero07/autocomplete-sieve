import React, { useState, useEffect, useRef } from 'react';
import './Autocomplete.css';

const Autocomplete = ({ onSearch }) => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const wrapperRef = useRef(null);

    // Cerrar sugerencias al hacer clic fuera
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Petición al backend con Debounce (~200ms) y manejo de estados (RF4)
    useEffect(() => {
        const trimmed = query.trim();
        if (!trimmed) {
            setSuggestions([]);
            setIsOpen(false);
            setLoading(false);
            setError(false);
            return;
        }
        setLoading(true);
        setError(false);
        const timer = setTimeout(async () => {
            try {
                const response = await fetch(`/autocomplete?q=${encodeURIComponent(trimmed)}`);
                if (!response.ok) throw new Error('Error en el servidor');
                const data = await response.json();
                setSuggestions(data);
                setIsOpen(true);
                setActiveIndex(-1);
            } catch (err) {
                console.error('Error al obtener sugerencias:', err);
                setError(true);
                setSuggestions([]);
            } finally {
                setLoading(false);
            }
        }, 200);
        return () => clearTimeout(timer);
    }, [query]);
    const handleSelect = (term) => {
        setQuery(term);
        setIsOpen(false);
        if (onSearch) onSearch(term);
    };

    const handleSearchClick = () => {
        setIsOpen(false);
        if (onSearch && query.trim()) {
            onSearch(query.trim());
        }
    };

    const handleKeyDown = (e) => {
        if (!isOpen || suggestions.length === 0) return;
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIndex(prev => Math.min(prev + 1, suggestions.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIndex(prev => Math.max(prev - 1, 0));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (activeIndex >= 0 && suggestions[activeIndex]) {
                handleSelect(suggestions[activeIndex].text || suggestions[activeIndex].term);
            } else {
                handleSearchClick();
            }
        } else if (e.key === 'Escape') {
            setIsOpen(false);
        }
    };

    return (
        <div className="sieve-app" ref={wrapperRef}>
            <div className="card">
                <h1>Interfaz de búsqueda</h1>
                <div className="search-wrap">
                    <div className={`search-box ${isOpen && query.trim() ? 'focused' : ''}`}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                            <circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                        </svg>
                        <input 
                            type="text" 
                            placeholder="Buscar términos, palabras clave..." 
                            autoComplete="off"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                            onFocus={() => { if (query.trim() && suggestions.length > 0) setIsOpen(true); }}
                        />
                        {loading && <div className="spinner" title="Buscando..."></div>}
                        {query && !loading && (
                            <button className="clear-btn" title="Limpiar" onClick={() => { setQuery(''); setIsOpen(false); }}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
                                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                                </svg>
                            </button>
                        )}
                        <button className="search-btn" onClick={handleSearchClick}>Buscar</button>
                    </div>
                    <div className={`dropdown ${isOpen ? 'open' : ''}`}>
                        <div id="suggestionsList">
                            {error ? (
                                <div className="empty-state" style={{ color: '#d93838' }}>Error al conectar con el servidor</div>
                            ) : suggestions.length > 0 ? (
                                suggestions.map((item, idx) => {
                                    const textVal = item.text || item.term;
                                    const sourceVal = item.source || 'dataset'; 
                                    return (
                                        <div 
                                            key={idx} 
                                            className={`suggestion ${idx === activeIndex ? 'active' : ''}`}
                                            onMouseEnter={() => setActiveIndex(idx)}
                                            onClick={() => handleSelect(textVal)}
                                        >
                                            <span className="icon">
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                                                    <circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                                                </svg>
                                            </span>
                                            <span className="text">{textVal}</span>
                                            <span className={`source-tag ${sourceVal}`}>{sourceVal}</span>
                                        </div>
                                    );
                                })
                            ) : (
                                query.trim() && !loading && <div className="empty-state">No se encontraron coincidencias para "{query}"</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Autocomplete;