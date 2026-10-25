// src/utils/formatters.js

const unidades = [
  "cero", "uno", "dos", "tres", "cuatro", "cinco",
  "seis", "siete", "ocho", "nueve"
];

function numeroADigitos(numero) {
  return String(numero)
    .split("")
    .map((c) => (unidades[+c] !== undefined ? unidades[+c] : c))
    .join(" ");
}

function diaMesLetras( n ) {
  const menoresVeinte = [
    "cero", "uno", "dos", "tres", "cuatro", "cinco", "seis",
    "siete", "ocho", "nueve", "diez", "once", "doce", "trece",
    "catorce", "quince", "dieciséis", "diecisiete", "dieciocho", "diecinueve"
  ];

  if (n < 20) return menoresVeinte[n] || "";
  if (n <= 29) return `veinte y ${diaMesLetras(n - 20)}`;
  if ( n === 30 ) return `treinta`;
  if ( n === 31 ) return `treinta y uno`;
}

function numeroALetras(n) {
  const especiales = {
    20: "veinte", 30: "treinta", 40: "cuarenta", 50: "cincuenta",
    60: "sesenta", 70: "setenta", 80: "ochenta", 90: "noventa",
    100: "cien"
  };

  const menoresVeinte = [
    "cero", "uno", "dos", "tres", "cuatro", "cinco", "seis",
    "siete", "ocho", "nueve", "diez", "once", "doce", "trece",
    "catorce", "quince", "dieciséis", "diecisiete", "dieciocho", "diecinueve"
  ];

  if (n < 20) return menoresVeinte[n] || "";
  if (n <= 29) return `veinti${numeroALetras(n - 20)}`;
  if (especiales[n]) return especiales[n];

  if (n < 100) {
    const decena = Math.floor(n / 10) * 10;
    const unidad = n % 10;
    return `${especiales[decena]} y ${numeroALetras(unidad)}`;
  }

  if (n < 200) return `ciento ${numeroALetras(n - 100)}`;
  if (n < 300) return `doscientos ${numeroALetras(n - 200)}`;
  if (n < 400) return `trescientos ${numeroALetras(n - 300)}`;
  if (n < 500) return `cuatrocientos ${numeroALetras(n - 400)}`;
  if (n < 600) return `quinientos ${numeroALetras(n - 500)}`;
  if (n < 700) return `seiscientos ${numeroALetras(n - 600)}`;
  if (n < 800) return `setecientos ${numeroALetras(n - 700)}`;
  if (n < 900) return `ochocientos ${numeroALetras(n - 800)}`;
  if (n < 1000) return `novecientos ${numeroALetras(n - 900)}`;

  if (n < 2000) return `mil ${numeroALetras(n - 1000)}`;
  if (n < 1000000) {
    const miles = Math.floor(n / 1000);
    const resto = n % 1000;
    return `${numeroALetras(miles)} mil${resto ? " " + numeroALetras(resto) : ""}`;
  }

  if (n < 2000000) return `un millón ${numeroALetras(n - 1000000)}`;
  return `${numeroALetras(Math.floor(n / 1000000))} millones ${numeroALetras(n % 1000000)}`;
}

function formatearFechaNotarial(fecha) {
  const dias = [
    "domingo", "lunes", "martes", "miércoles",
    "jueves", "viernes", "sábado"
  ];
  const meses = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
  ];
  const diaSemana = dias[fecha.getDay()];
  const dia = diaMesLetras(fecha.getDate());
  const mes = meses[fecha.getMonth()];
  const anio = numeroALetras(fecha.getFullYear());

  return `${diaSemana} ${dia} de ${mes} del año ${anio}`;
}

export { numeroALetras, numeroADigitos, formatearFechaNotarial };
