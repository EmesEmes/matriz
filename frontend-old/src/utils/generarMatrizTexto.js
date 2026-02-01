export const generarMatrizTexto = (data) => {
  const {
    numeroProtocolo,
    tipoContrato,
    cuantia,
    siglasMatrizador,
    diCopias,
    fechaActual,
    nombreAbogado,
    matriculaNumero,
    minutaTexto,
    vendedores,
    compradores,
  } = data;

  const nombreCompleto = (u) => `${u.names || ''} ${u.lastNames || ''}`.trim();
  const esMujer = (u) => u.gender?.toLowerCase() === 'femenino';
  const getTratamiento = (u) => esMujer(u) ? 'la señora' : 'el señor';

  const calcularEdad = (fecha) =>
    new Date().getFullYear() - new Date(fecha).getFullYear();

  const redaccionCompareciente = (u) =>
    `${getTratamiento(u)} ${nombreCompleto(u)}, de nacionalidad ${u.nationality}, con cédula de ciudadanía número ${u.documentNumber}, de ${calcularEdad(u.birthDate)} años de edad, ocupación ${u.occupation}, teléfono celular número ${u.phone}, con correo electrónico ${u.email}, domiciliado${esMujer(u) ? 'a' : ''} en la ciudad de ${u.city}, provincia de ${u.province}, calle ${u.mainStreet} número ${u.numberStreet} y calle ${u.secondaryStreet}`;

  const v1 = vendedores[0];
  const c1 = compradores[0];
  const cv = v1.partner || null;
  const cc = c1.partner || null;

  const redaccionVendedor = (cv && v1.maritalStatus === 'casado')
    ? `los cónyuges señores ${nombreCompleto(v1)} y ${nombreCompleto(cv)}, ${redaccionCompareciente(v1)}; y ${redaccionCompareciente(cv)}, por sus propios derechos, de estado civil casados entre sí`
    : `${redaccionCompareciente(v1)}, por sus propios derechos`;

  const redaccionComprador = (cc && c1.maritalStatus === 'casado')
    ? `los cónyuges señores ${nombreCompleto(c1)} y ${nombreCompleto(cc)}, ${redaccionCompareciente(c1)}; y ${redaccionCompareciente(cc)}, por sus propios derechos, de estado civil casados entre sí`
    : `${redaccionCompareciente(c1)}, por sus propios derechos`;

  return `
${numeroProtocolo}

NOTARÍA VIGÉSIMO SEGUNDA DEL CANTÓN QUITO

ESCRITURA PÚBLICA DE ${tipoContrato.toUpperCase()}

OTORGADA POR:

${nombreCompleto(v1)}${cv ? ' y ' + nombreCompleto(cv) : ''}

A FAVOR DE:

${nombreCompleto(c1)}${cc ? ' y ' + nombreCompleto(cc) : ''}

CUANTÍA:

${cuantia}

${diCopias}

${siglasMatrizador}

En la ciudad de San Francisco de Quito, Distrito Metropolitano, Capital de la República del Ecuador, a los ${fechaActual}, ante mí, ALEX DAVID MEJÍA VITERI, Notario Público Vigésimo Segundo del cantón Quito, comparecen a la celebración de la presente escritura pública de ${tipoContrato.toLowerCase()}, por una parte, ${redaccionVendedor}; y, por otra parte, ${redaccionComprador}.

Doy fe: Que los comparecientes son legalmente capaces para contratar y obligarse, que se encuentran en el libre ejercicio de sus derechos, que han acordado el contenido de la presente escritura, y que la misma ha sido leída íntegramente por mí, el Notario, en voz alta, clara e inteligible, y en presencia de los comparecientes, quienes manifiestan su conformidad, ratifican su contenido y firman conjuntamente conmigo.

MINUTA.- ${minutaTexto}

Hasta aquí la minuta firmada por el abogado ${nombreAbogado}, con Matrícula número ${matriculaNumero}, misma que queda incorporada a la presente escritura pública.

En fe de lo cual, firmo y autorizo.

ALEX DAVID MEJÍA VITERI  
NOTARIO VIGÉSIMO SEGUNDO DEL CANTÓN QUITO
`;
};
