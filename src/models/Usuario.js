import mongoose from 'mongoose';

const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const usuarioSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    correo: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: correoRegex,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    telefono: {
      type: String,
      trim: true,
    },
  },
  {
    collection: 'usuarios',
    timestamps: true,
  },
);

usuarioSchema.index(
  { correo: 1 },
  { unique: true, name: 'correo_unico' },
);

const Usuario = mongoose.models.Usuario
  || mongoose.model('Usuario', usuarioSchema);

export default Usuario;
