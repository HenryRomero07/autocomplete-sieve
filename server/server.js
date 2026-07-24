const express = require('express')
const cors = require('cors')
const fs = require('fs')
const path = require('path')
const SieveCache = require('./SieveCache')

const app = express()
const DEFAULT_PORT = parseInt(process.env.PORT) || 3000
const port = DEFAULT_PORT || 3001 || 3002

app.use(cors())
app.use(express.json())

const datasetPath = path.join(__dirname, 'data/words.json')
const dataset = JSON.parse(fs.readFileSync(datasetPath, 'utf8'))
const cache = new SieveCache(30)

let hits = 0;
let misses = 0;

function buscarPorPrefijo(query) {
    return dataset.filter(word => word.toLowerCase().startsWith(query.toLowerCase())).slice(0, 20)
}

// Endpoint de prueba para obtener todas las palabras
app.get('/words', (req, resp) => {
    return resp.json(dataset)
})

app.get('/autocomplete', (req, resp) => {
    const { q } = req.query

    if (!q) {
        return resp.json([]);
    }

    const inicio = Date.now()

    const cached = cache.get(q)
    let suggestions, source

    if (cached !== null) {               // HIT: ya lo tengo
        hits++
        source = "cache"
        suggestions = cached
    } else {                             // MISS: no lo tengo
        misses++
        suggestions = buscarPorPrefijo(q)  // busco en el dataset
        cache.set(q, suggestions)           // guardo para la próxima
        source = "dataset"
    }

    const latency_ms = Date.now() - inicio
    resp.json({ query: q, suggestions, source, latency_ms })
})

app.get('/metrics', (req, resp) => {
    resp.json({ hits, misses, cacheSize: cache.cache.size, maxEntries: cache.capacity })
})

app.listen(port, () => {
    console.log(`Palabras cargadas: ${dataset.length}`)
    console.log(`El servidor esta escuchando perfectamente en http://localhost:${port}`)
})
