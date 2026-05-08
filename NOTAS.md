1. ¿Qué ventajas concretas ofrece Prisma frente a escribir SQL en crudo en este proyecto?

La primera ventaja es el autocompletado y la seguridad de tipos. Con Prisma, el cliente generado conoce todos los modelos y sus campos, por lo que el editor te avisa de errores antes de ejecutar.
La segunda ventaja es la gestión de relaciones. En el controlador de películas con SQL tenías que escribir JOINs manualmente para obtener el director y el género. Con Prisma simplemente usas include: { director: true, genero: true } y él construye la query por ti, sin riesgo de errores en la sintaxis del JOIN.


2. ¿Qué hace prisma.$transaction([query1, query2])? ¿En qué se diferencia de prisma.$transaction(async (tx) => { ... })?

prisma.$transaction([query1, query2]) ejecuta un array de queries en paralelo dentro de una misma transacción. Si una falla, todas se revierten. 
La diferencia clave es que la primera forma es para queries independientes que quieres agrupar, y la segunda es para queries que dependen unas de otras.


3. ¿Qué archivo NO deberías commitear nunca? ¿Y cuáles sí deben estar en el repositorio?

.env, porque contiene credenciales reales como la contraseña de la base de datos y el JWT secret. Si lo subes a GitHub cualquiera podría acceder a tu base de datos.
Los archivos que sí deben estar en el repositorio son:

prisma/schema.prisma — define los modelos y es la fuente de verdad de la base de datos
prisma/migrations/ — contiene el historial de cambios de la base de datos, necesario para que cualquier desarrollador pueda reproducir el mismo schema
.env.example — la plantilla con los nombres de las variables sin valores reales