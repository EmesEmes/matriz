import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { saveAs } from "file-saver";
import expressionParser from "docxtemplater/expressions.js";

// Cargar la plantilla desde public
const cargarPlantilla = async () => {
  const response = await fetch("/plantillas/test.docx");
  const blob = await response.blob();
  const arrayBuffer = await blob.arrayBuffer();
  return arrayBuffer;
};

export const generarMatrizDocx = async (data, numeroProtocolo = "matriz") => {
  const content = await cargarPlantilla();
  const zip = new PizZip(content);

  const doc = new Docxtemplater(zip, {
    parser: expressionParser,
    paragraphLoop: true,
    linebreaks: true,
  });


  try {
    doc.render(data);
    const out = doc.getZip().generate({
      type: "blob",
      mimeType:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });
    saveAs(out, `matriz-${numeroProtocolo}.docx`);
    console.log(data)
  } catch (error) {
    console.error("Error al generar documento:", error);
    alert("Error generando el documento.");
  }
};
