import mongoose from 'mongoose';

const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
const horaRegex = /^(?:[01]\d|2[0-3]):[0-5]\d$/;

function esFechaCalendarioValida(value) {
  if (typeof value !== 'string' || !fechaRegex.test(value)) return false;

  const [year, month, day] = value.split('-').map(Number);
  if (year < 1 || month < 1 || month > 12 || day < 1) return false;

  const diasDelMes = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const esBisiesto = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  if (month === 2 && esBisiesto) diasDelMes[1] = 29;

  return day <= diasDelMes[month - 1];
}

const citaSchema = new mongoose.Schema(
  {
    usuarioId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Usuario',
    },
    servicioId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Servicio',
    },
    fecha: {
      type: String,
      required: true,
      validate: {
        validator: esFechaCalendarioValida,
        message: 'La fecha debe tener el formato YYYY-MM-DD y ser válida.',
      },
    },
    hora: {
      type: String,
      required: true,
      validate: {
        validator: (value) => typeof value === 'string' && horaRegex.test(value),
        message: 'La hora debe tener el formato HH:mm y ser válida.',
      },
    },
    estado: {
      type: String,
      required: true,
      enum: ['activa', 'cancelada'],
      default: 'activa',
    },
    precioReservado: {
      type: Number,
      required: true,
      validate: {
        validator: (value) => Number.isInteger(value) && value > 0,
        message: 'El precio reservado debe ser un entero positivo.',
      },
    },
    notas: {
      type: String,
      trim: true,
    },
  },
  {
    collection: 'citas',
    timestamps: true,
  },
);

citaSchema.index(
  { fecha: 1, hora: 1 },
  {
    unique: true,
    name: 'horario_activo_unico',
    partialFilterExpression: { estado: 'activa' },
  },
);
citaSchema.index(
  { usuarioId: 1, fecha: 1 },
  { name: 'citas_por_usuario' },
);

const Cita = mongoose.models.Cita
  || mongoose.model('Cita', citaSchema);

export default Cita;
