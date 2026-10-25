export const ZONA_HORARIA = 'America/Bogota';
export const DIAS_ATENCION = Object.freeze([1, 2, 3, 4, 5, 6]);
export const DURACION_RESERVA_MINUTOS = 60;
export const HORA_APERTURA = '09:00';
export const HORA_CIERRE = '18:00';

function minutosDesdeMedianoche(hora) {
  const [horas, minutos] = hora.split(':').map(Number);
  return (horas * 60) + minutos;
}

function formatearHora(minutos) {
  const horas = Math.floor(minutos / 60);
  const minutosRestantes = minutos % 60;
  return `${String(horas).padStart(2, '0')}:${String(minutosRestantes).padStart(2, '0')}`;
}

function generarHorariosReserva() {
  const inicio = minutosDesdeMedianoche(HORA_APERTURA);
  const cierre = minutosDesdeMedianoche(HORA_CIERRE);
  const horarios = [];

  for (
    let inicioReserva = inicio;
    inicioReserva + DURACION_RESERVA_MINUTOS <= cierre;
    inicioReserva += DURACION_RESERVA_MINUTOS
  ) {
    horarios.push(formatearHora(inicioReserva));
  }

  return Object.freeze(horarios);
}

export const HORARIOS_RESERVA = generarHorariosReserva();

export const FECHA_REGEX = /^\d{4}-\d{2}-\d{2}$/;
export const HORA_REGEX = /^(?:[01]\d|2[0-3]):[0-5]\d$/;

export function esFechaCalendarioValida(value) {
  if (typeof value !== 'string' || !FECHA_REGEX.test(value)) return false;

  const [year, month, day] = value.split('-').map(Number);
  if (year < 1 || month < 1 || month > 12 || day < 1) return false;

  const diasDelMes = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const esBisiesto = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  if (month === 2 && esBisiesto) diasDelMes[1] = 29;

  return day <= diasDelMes[month - 1];
}

export function obtenerFechaHoraBogota(ahora = new Date()) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: ZONA_HORARIA,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  });
  const parts = Object.fromEntries(
    formatter.formatToParts(ahora)
      .filter(({ type }) => type !== 'literal')
      .map(({ type, value }) => [type, value]),
  );

  return {
    fecha: `${parts.year}-${parts.month}-${parts.day}`,
    hora: `${parts.hour}:${parts.minute}`,
  };
}

export function esFechaActualOFutura(fecha, ahora = new Date()) {
  return fecha >= obtenerFechaHoraBogota(ahora).fecha;
}

function obtenerDiaSemana(fecha) {
  return new Date(`${fecha}T00:00:00.000Z`).getUTCDay();
}

export function esDiaAtencion(fecha) {
  return esFechaCalendarioValida(fecha)
    && DIAS_ATENCION.includes(obtenerDiaSemana(fecha));
}

function esFechaHoraFutura(fecha, hora, ahora = new Date()) {
  const actual = obtenerFechaHoraBogota(ahora);
  return fecha > actual.fecha || (fecha === actual.fecha && hora > actual.hora);
}

export function esHorarioReservable(fecha, hora, ahora = new Date()) {
  return esFechaCalendarioValida(fecha)
    && HORA_REGEX.test(hora)
    && esDiaAtencion(fecha)
    && HORARIOS_RESERVA.includes(hora)
    && esFechaHoraFutura(fecha, hora, ahora);
}

export function calcularHorasDisponibles(fecha, horasOcupadas = [], ahora = new Date()) {
  if (!esDiaAtencion(fecha)) return [];

  const ocupadas = new Set(horasOcupadas);
  return HORARIOS_RESERVA.filter((hora) => (
    !ocupadas.has(hora) && esFechaHoraFutura(fecha, hora, ahora)
  ));
}
