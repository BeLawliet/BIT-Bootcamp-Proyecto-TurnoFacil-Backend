import mongoose from 'mongoose';

const servicioSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    descripcion: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 500,
    },
    precio: {
      type: Number,
      required: true,
      validate: {
        validator: (value) => Number.isInteger(value) && value > 0,
        message: 'El precio debe ser un entero positivo.',
      },
    },
    activo: {
      type: Boolean,
      default: true,
    },
  },
  {
    collection: 'servicios',
    timestamps: true,
  },
);

servicioSchema.index(
  { nombre: 1 },
  { unique: true, name: 'nombre_servicio_unico' },
);

const Servicio = mongoose.models.Servicio
  || mongoose.model('Servicio', servicioSchema);

export default Servicio;
