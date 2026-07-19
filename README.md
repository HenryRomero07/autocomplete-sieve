# Autocomplete con SIEVE

Prototipo académico de autocompletado que utiliza el algoritmo de caché **SIEVE** para reutilizar resultados de búsquedas por prefijo.

El backend (Node.js/Express) consulta un dataset de palabras y almacena respuestas en una caché de capacidad limitada. El frontend (React/Vite) permite escribir en un campo de texto y visualizar si cada sugerencia proviene de la caché o del dataset.

## Estructura inicial

```
├── server/                 # Backend
│   └── data/               # Dataset de palabras
├── client/                 # Frontend
│   └── src/
│       └── components/     # Componentes React
└── README.md
```

Cada integrante del equipo creará los archivos de su responsabilidad dentro de estas carpetas.
