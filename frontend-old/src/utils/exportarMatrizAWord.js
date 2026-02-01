import { Document, Packer, Paragraph, TextRun, AlignmentType } from "docx";
import { saveAs } from "file-saver";

export const exportarMatrizAWord = async (contenido, numeroProtocolo = "matriz") => {
  const doc = new Document({
    sections: [
      {
        children: contenido.split("\n").map((linea) => {
          const trimmed = linea.trim();

          // Línea vacía → párrafo vacío
          if (!trimmed) {
            return new Paragraph({ children: [new TextRun("")] });
          }

          // Títulos centrados y en mayúscula
          if (
            trimmed === trimmed.toUpperCase() &&
            trimmed.length < 80 &&
            !trimmed.includes(":")
          ) {
            return new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: trimmed,
                  bold: true,
                  font: "Arial",
                  size: 24, // 12pt
                }),
              ],
            });
          }

          // Párrafos justificados normales
          return new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            spacing: {
              after: 200, // espacio entre párrafos
            },
            children: [
              new TextRun({
                text: trimmed,
                font: "Arial",
                size: 22, // 11pt
              }),
            ],
          });
        }),
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const nombreArchivo = `matriz-${numeroProtocolo}.docx`;
  saveAs(blob, nombreArchivo);
};
