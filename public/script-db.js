
use('db_turno_facil');

// Crear las colecciones si aún no existen.
const colecciones = ['usuarios', 'servicios', 'citas'];

colecciones.forEach((nombre) => {
  if (!db.getCollectionNames().includes(nombre)) {
    db.createCollection(nombre);
  }
});

// Evitar correos duplicados.
db.usuarios.createIndex(
  { correo: 1 },
  { unique: true, name: 'correo_unico' }
);

// Evitar servicios duplicados.
db.servicios.createIndex(
  { nombre: 1 },
  { unique: true, name: 'nombre_servicio_unico' }
);

// Evitar dos citas activas en el mismo horario.
db.citas.createIndex(
  { fecha: 1, hora: 1 },
  {
    unique: true,
    name: 'horario_activo_unico',
    partialFilterExpression: { estado: 'activa' }
  }
);

// Facilitar la consulta de citas por cliente.
db.citas.createIndex(
  { usuarioId: 1, fecha: 1 },
  { name: 'citas_por_usuario' }
);

// Catálogo inicial de TurnoFácil.
const servicios = [
  {
    nombre: 'Corte clásico',
    descripcion: 'Corte de cabello clásico y personalizado.',
    precio: 25000,
    activo: true
  },
  {
    nombre: 'Arreglo de barba',
    descripcion: 'Perfilado y arreglo de barba.',
    precio: 18000,
    activo: true
  },
  {
    nombre: 'Combo completo',
    descripcion: 'Corte de cabello y arreglo de barba.',
    precio: 35000,
    activo: true
  }
];

servicios.forEach((servicio) => {
  const ahora = new Date();

  db.servicios.updateOne(
    { nombre: servicio.nombre },
    {
      $setOnInsert: {
        ...servicio,
        createdAt: ahora,
        updatedAt: ahora
      }
    },
    { upsert: true }
  );
});

// Consultar el resultado.
db.servicios.find({});
