import { apiFetch } from '../config/api';
import API_CONFIG from '../config/api';

export const generarMatrizBackend = async (datosParaDocx) => {
  try {
    // Preparar datos para el backend
    const requestData = {
      numero_protocolo: datosParaDocx.numeroProtocolo,
      tipo_contrato: datosParaDocx.tipoContrato.toLowerCase(),
      cuantia: parseFloat(datosParaDocx.cuantia),
      fecha_escritura: datosParaDocx.fechaActual,
      notario: {
        nombre: datosParaDocx.notario,
        titulo: datosParaDocx.tituloNotario
      },
      matrizador: datosParaDocx.matrizador,
      needs_concuerdo: datosParaDocx.needsConcuerdo || false,
      datos_concuerdo: datosParaDocx.datosConcuerdo || null,
      participantes_list: datosParaDocx.participantesList,
      vendedores_list: datosParaDocx.vendedoresList,
      compradores_list: datosParaDocx.compradoresList,
      abogado: {
        nombre_abogado: datosParaDocx.abogadoNombre,
        genero_abogado: datosParaDocx.abogadoEsMujer ? "femenino" : "masculino",
        tipo_matricula: datosParaDocx.abogadoTipoMatricula,
        provincia_abogado: datosParaDocx.abogadoProvincia || null,
        numero_matricula: datosParaDocx.abogadoNumeroMatricula,
        minuta_texto: datosParaDocx.abogadoTexto
      },
      is_any_tercera_edad: datosParaDocx.isAnyTerceraEdad
    };

    // Enviar al backend
    const response = await apiFetch(API_CONFIG.ENDPOINTS.GENERATE_MATRIZ, {
      method: 'POST',
      body: JSON.stringify(requestData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || 'Error al generar documento');
    }

    // Descargar el archivo
    const downloadUrl = `${API_CONFIG.BASE_URL}${data.download_url}`;
    
    // Obtener token
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('token='))
      ?.split('=')[1];

    // Descargar con fetch
    const downloadResponse = await fetch(downloadUrl, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!downloadResponse.ok) {
      throw new Error('Error al descargar documento');
    }

    // Convertir a blob y descargar
    const blob = await downloadResponse.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `matriz-${datosParaDocx.numeroProtocolo}.docx`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    return { success: true, message: 'Documento generado exitosamente' };

  } catch (error) {
    console.error('Error generando documento:', error);
    return { success: false, error: error.message };
  }
};