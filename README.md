# TurnoFácil Backend

API REST inicial para el proyecto TurnoFácil.

## Requisitos

- Node.js 20 o superior
- npm

## Instalación

```bash
npm ci
```

## Desarrollo

```bash
npm run dev
```

El servidor escucha en `http://localhost:3000` de forma predeterminada. Se puede
cambiar el puerto con la variable de entorno `PORT`; consulta `.env.example`.

## Comprobación de estado

```bash
curl http://127.0.0.1:3000/health
```

Respuesta esperada:

```json
{"status":"ok"}
```

## Pruebas

```bash
npm test
```
