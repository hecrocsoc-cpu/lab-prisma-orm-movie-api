// index.js
require('dotenv').config()
require('./src/config/db')

const express = require('express')

const peliculasRouter = require('./src/routes/peliculas')

const authRouter = require('./src/routes/auth')

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())

app.use('/api/peliculas', peliculasRouter)


app.use('/api/auth', authRouter)

app.use((req, res) => {
  res.status(404).json({ error: `Ruta ${req.method} ${req.url} no encontrada` })
})

app.use((err, req, res, next) => {
  const status = err.statusCode || 500
  res.status(status).json({ error: err.message })
})

app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`)
})