const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const path = require('path')
const wordsPath = path.join(__dirname, 'data/words.json')

const data = require(wordsPath)

// Endpoint de prueba para obtener todas las palabras
app.get('/words', (req, resp) => {
    return resp.json(data)
})

app.get('/test', (req, resp) => {
    let x = 10;
function test() {
    let x = 20;
    console.log(x);
}
return resp.json({ test: test() });
})



const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Palabras cargadas: ${data.length}`)
    console.log(`El servidor esta escuchando perfectamente en http://localhost:${port}`)
})
