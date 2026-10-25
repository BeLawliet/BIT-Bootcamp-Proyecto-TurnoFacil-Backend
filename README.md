# ✂️ TurnoFácil — Backend

> API REST para gestionar reservas de una barbería, con autenticación segura y disponibilidad de horarios en tiempo real.

![Node.js](https://img.shields.io/badge/Node.js-20%2B-339933?logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)

## Sobre el proyecto

**TurnoFácil** es una plataforma de reservas para barberías, desarrollada como proyecto de un bootcamp Full Stack. Este repositorio contiene el **backend en Node.js**; el frontend se desarrolla de manera independiente con Angular.

## Funcionalidades

- Registro e inicio de sesión de clientes con **bcrypt y JWT**.
- Rutas protegidas y acceso exclusivo a las reservas de cada usuario.
- Consulta pública de servicios y disponibilidad de horarios.
- Creación, consulta y cancelación de citas.
- Agenda única con prevención de horarios duplicados.
- Horario de atención de **lunes a sábado, de 9:00 a. m. a 6:00 p. m.**, con reservas de 60 minutos (hora de Colombia).

## Tecnologías

**Node.js · Express · MongoDB Atlas · Mongoose · JWT · bcrypt · express-validator**

## Ejecución local

**Requisito:** Node.js 20 o superior y acceso a una base de datos MongoDB.

```bash
npm install
```

Creá un archivo `.env` a partir de `.env-template` y configurá `PORT`, `MONGODB_URI`, `CORS_ORIGIN`, `JWT_SECRET` y `JWT_EXPIRES_IN` con tus propios valores. Nunca publiques las credenciales.

```bash
npm run dev
```

Para comprobar que la API está funcionando:

```http
GET http://localhost:3000/api/v1/health
```

## Endpoints principales

Todas las rutas utilizan el prefijo `/api/v1`.

| Método | Ruta | Acceso |
| --- | --- | --- |
| `POST` | `/auth/registro` | Público |
| `POST` | `/auth/login` | Público |
| `GET` | `/auth/me` | JWT |
| `GET` | `/servicios` | Público |
| `GET` | `/citas/disponibilidad?fecha=YYYY-MM-DD` | Público |
| `POST` | `/citas` | JWT |
| `GET` | `/citas` | JWT |
| `PATCH` | `/citas/:id/cancelar` | JWT |

Las respuestas mantienen el formato:

```json
{
  "message": "Operación realizada correctamente",
  "status": 200,
  "data": null
}
```

---

**Proyecto académico · Bootcamp de Desarrollo Web Full Stack**
