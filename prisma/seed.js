const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  // Crear géneros
  const generos = await Promise.all([
    prisma.genero.upsert({ where: { slug: 'ciencia-ficcion' }, update: {}, create: { nombre: 'Ciencia Ficción', slug: 'ciencia-ficcion' } }),
    prisma.genero.upsert({ where: { slug: 'drama' }, update: {}, create: { nombre: 'Drama', slug: 'drama' } }),
    prisma.genero.upsert({ where: { slug: 'terror' }, update: {}, create: { nombre: 'Terror', slug: 'terror' } }),
    prisma.genero.upsert({ where: { slug: 'animacion' }, update: {}, create: { nombre: 'Animación', slug: 'animacion' } }),
    prisma.genero.upsert({ where: { slug: 'crimen' }, update: {}, create: { nombre: 'Crimen', slug: 'crimen' } }),
  ])

  console.log(`✅ ${generos.length} géneros creados`)

  // Crear directores
  const directores = await Promise.all([
    prisma.director.upsert({ where: { nombre: 'Christopher Nolan' }, update: {}, create: { nombre: 'Christopher Nolan' } }),
    prisma.director.upsert({ where: { nombre: 'Denis Villeneuve' }, update: {}, create: { nombre: 'Denis Villeneuve' } }),
    prisma.director.upsert({ where: { nombre: 'Greta Gerwig' }, update: {}, create: { nombre: 'Greta Gerwig' } }),
    prisma.director.upsert({ where: { nombre: 'Jordan Peele' }, update: {}, create: { nombre: 'Jordan Peele' } }),
    prisma.director.upsert({ where: { nombre: 'Alfonso Cuarón' }, update: {}, create: { nombre: 'Alfonso Cuarón' } }),
  ])

  console.log(`✅ ${directores.length} directores creados`)

  // Mapas para buscar por nombre/slug
  const generoMap = Object.fromEntries(generos.map(g => [g.slug, g.id]))
  const directorMap = Object.fromEntries(directores.map(d => [d.nombre, d.id]))

  // Crear películas
  const peliculasData = [
    { titulo: 'Inception', anio: 2010, nota: 8.8, director: 'Christopher Nolan', genero: 'ciencia-ficcion' },
    { titulo: 'Interstellar', anio: 2014, nota: 8.6, director: 'Christopher Nolan', genero: 'ciencia-ficcion' },
    { titulo: 'Oppenheimer', anio: 2023, nota: 8.5, director: 'Christopher Nolan', genero: 'drama' },
    { titulo: 'Dune', anio: 2021, nota: 8.0, director: 'Denis Villeneuve', genero: 'ciencia-ficcion' },
    { titulo: 'Blade Runner 2049', anio: 2017, nota: 8.0, director: 'Denis Villeneuve', genero: 'ciencia-ficcion' },
    { titulo: 'Arrival', anio: 2016, nota: 7.9, director: 'Denis Villeneuve', genero: 'ciencia-ficcion' },
    { titulo: 'Barbie', anio: 2023, nota: 6.9, director: 'Greta Gerwig', genero: 'drama' },
    { titulo: 'Lady Bird', anio: 2017, nota: 7.4, director: 'Greta Gerwig', genero: 'drama' },
    { titulo: 'Get Out', anio: 2017, nota: 7.7, director: 'Jordan Peele', genero: 'terror' },
    { titulo: 'Us', anio: 2019, nota: 6.8, director: 'Jordan Peele', genero: 'terror' },
    { titulo: 'Roma', anio: 2018, nota: 7.7, director: 'Alfonso Cuarón', genero: 'drama' },
    { titulo: 'Gravity', anio: 2013, nota: 7.7, director: 'Alfonso Cuarón', genero: 'ciencia-ficcion' },
  ]

  for (const p of peliculasData) {
    await prisma.pelicula.upsert({
      where: { id: (await prisma.pelicula.findFirst({ where: { titulo: p.titulo } }))?.id || 0 },
      update: {},
      create: {
        titulo: p.titulo,
        anio: p.anio,
        nota: p.nota,
        directorId: directorMap[p.director],
        generoId: generoMap[p.genero]
      }
    })
  }

  console.log(`✅ ${peliculasData.length} películas creadas`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())