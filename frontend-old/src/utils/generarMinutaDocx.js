import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { saveAs } from "file-saver";
import expressionParser from "docxtemplater/expressions.js";

// Cargar la plantilla desde public
const cargarPlantilla = async () => {
  const response = await fetch("/plantillas/minuta.docx");
  const blob = await response.blob();
  const arrayBuffer = await blob.arrayBuffer();
  return arrayBuffer;
};

// Función auxiliar para preparar datos de persona
const prepararPersonaData = (persona) => {
  if (!persona) return null;

  const edad = calcularEdad(persona.birthDate);
  const esCasado = persona.maritalStatus?.toLowerCase() === "casado";
  const esMujer = persona.gender?.toLowerCase() === "femenino";

  return {
    nombre: `${persona.names} ${persona.lastNames}`.toUpperCase(),
    cedula: persona.documentNumber,
    edad: edad,
    nacionalidad: persona.nationality || "ecuatoriana",
    telefono: persona.phone || "",
    correo: persona.email || "",
    tratamiento: esMujer ? "la señora" : "el señor",
    esMujer: esMujer,
    esCasado: esCasado,
    ocupacion: persona.occupation?.toLowerCase() || "",
    profesion: persona.profession || "",
    hasProfession: persona.profession ? true : false,
    // Dirección
    provincia: persona.province || "",
    canton: persona.canton || "",
    parroquia: persona.parroquia || "",
    sector: persona.sector || "",
    direccion: `${persona.mainStreet || ""} ${persona.numberStreet || ""} y ${persona.secondaryStreet || ""}`.trim(),
  };
};

// Calcular edad
const calcularEdad = (fechaNacimiento) => {
  if (!fechaNacimiento) return 0;
  const today = new Date();
  const birthDate = new Date(fechaNacimiento);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

export const generarMinutaDocx = async (data) => {
  const content = await cargarPlantilla();
  const zip = new PizZip(content);

  const doc = new Docxtemplater(zip, {
    parser: expressionParser,
    paragraphLoop: true,
    linebreaks: true,
  });

  // Preparar vendedores
  const vendedoresList = data.vendedores.map((vendedor, index) => {
    const personaData = prepararPersonaData(vendedor);
    return {
      ...personaData,
      numero: index + 1,
      rol: "VENDEDOR",
    };
  });

  // Preparar compradores
  const compradoresList = data.compradores.map((comprador, index) => {
    const personaData = prepararPersonaData(comprador);
    return {
      ...personaData,
      numero: index + 1 + vendedoresList.length,
      rol: "COMPRADOR",
    };
  });

  // Datos completos para el template
  const datosParaDocx = {
    tipoContrato: data.tipoContrato.toUpperCase(),
    tipoPropiedad: data.tipoPropiedad,
    esHorizontal: data.tipoPropiedad === "horizontal",
    esComun: data.tipoPropiedad === "comun",
    precio: data.precio,
    precioEnLetras: data.precioEnLetras,
    descripcionBien: data.descripcionBien,

    // Listas de comparecientes
    vendedoresList: vendedoresList,
    compradoresList: compradoresList,

    // Datos del abogado
    abogadoNombre: data.abogadoNombre,
    abogadoMatricula: data.abogadoMatricula,
    abogadoMatriculaEnLetras: data.abogadoMatriculaEnLetras,
    abogadoTipoMatricula: data.abogadoTipoMatricula,
    abogadoProvincia: data.abogadoProvincia,
    abogadoEsMujer: data.abogadoEsMujer,
  };

  try {
    doc.render(datosParaDocx);
    const out = doc.getZip().generate({
      type: "blob",
      mimeType:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });

    const fileName = `minuta-${data.tipoContrato}-${Date.now()}.docx`;
    saveAs(out, fileName);

    console.log("Minuta generada exitosamente:", datosParaDocx);
  } catch (error) {
    console.error("Error al generar minuta:", error);
    alert("Error generando la minuta: " + error.message);
  }
};
