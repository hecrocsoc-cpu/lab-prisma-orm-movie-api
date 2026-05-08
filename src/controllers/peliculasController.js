// src/controllers/peliculasController.js
const peliculaService = require('../services/PeliculaService')
const pool = require('../config/db')

const listarPeliculas = async (req, res, next) => {
  try {
    const { genero, buscar } = req.query
    const peliculas = await peliculaService.obtenerTodas({ genero, buscar })
    res.json(peliculas)
  } catch (err) {
    next(err)
  }
}

const obtenerPelicula = async (req, res, next) => {
  try {
    const pelicula = await peliculaService.obtenerPorId(Number(req.params.id))
    res.json(pelicula)
  } catch (err) {
    next(err)
  }
}

const crearPelicula = async (req, res, next) => {
  try {
    const nueva = await peliculaService.crear(req.body)
    res.status(201).json(nueva)
  } catch (err) {
    next(err)
  }
}

const actualizarPelicula = async (req, res, next) => {
  try {
    const actualizada = await peliculaService.actualizar(Number(req.params.id), req.body)
    res.json(actualizada)
  } catch (err) {
    next(err)
  }
}

const eliminarPelicula = async (req, res, next) => {
  try {
    const eliminada = await peliculaService.eliminar(Number(req.params.id))
    res.json({ mensaje: 'Película eliminada', pelicula: eliminada })
  } catch (err) {
    next(err)
  }
}

const obteneristicas = async (req, res, next) => {
  try {
    const stats = await peliculaService.obtenerEstadisticas()
    res.json(stats)
  } catch (err) {
    next(err)
  }
}

const listarResenas = async (req, res, next) => {
  try {
    const resenas = await peliculaService.obtenerResenas(Number(req.params.id))
    res.json(resenas)
  } catch (err) {
    next(err)
  }
}

const crearResena = async (req, res, next) => {
  try {
    const nueva = await peliculaService.crearResena(Number(req.params.id), req.body)
    res.status(201).json(nueva)
  } catch (err) {
    next(err)
  }
}

// GET /api/estadisticas/directores
const estadisticasDirectores = async (req, res, next) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        d.nombre AS director,
        COUNT(p.id) AS num_peliculas,
        ROUND(AVG(p.nota), 2) AS nota_media,
        MAX(p.nota) AS nota_maxima,
        MIN(p.nota) AS nota_minima
      FROM directores d
      JOIN peliculas p ON p.director_id = d.id
      GROUP BY d.id, d.nombre
      HAVING COUNT(p.id) >= 1
      ORDER BY nota_media DESC
    `)
    res.json(rows)
  } catch (err) {
    next(err)
  }
}

// GET /api/estadisticas/generos
const estadisticasGeneros = async (req, res, next) => {
  try {
    const { rows } = await pool.query(`
      WITH stats AS (
        SELECT
          g.nombre AS genero,
          COUNT(p.id) AS num_peliculas,
          ROUND(AVG(p.nota), 2) AS nota_media,
          COUNT(r.id) AS total_resenas
        FROM generos g
        LEFT JOIN peliculas p ON p.genero_id = g.id
        LEFT JOIN resenas r ON r.pelicula_id = p.id
        GROUP BY g.id, g.nombre
      )
      SELECT *, RANK() OVER (ORDER BY nota_media DESC NULLS LAST) AS ranking
      FROM stats
      ORDER BY ranking
    `)
    res.json(rows)
  } catch (err) {
    next(err)
  }
}

module.exports = {
  listarPeliculas,
  obtenerPelicula,
  crearPelicula,
  actualizarPelicula,
  eliminarPelicula,
  listarResenas,
  crearResena,
  estadisticasDirectores,
  estadisticasGeneros
}