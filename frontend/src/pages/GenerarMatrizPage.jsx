import { useState } from 'react';
import { Button } from '../components/shared';
import { DatosAdministrativos, DatosAbogado, TextNumberTransformer } from '../components/documentos';
import { ComparecienteInline } from '../components/comparecientes';
import { FileText, Download } from 'lucide-react';
import { useToast } from '../hooks/useToast';
import { apiFetch } from '../config/api';
import API_CONFIG from '../config/api';


const GenerarMatrizPage = () => {
  const [datosAdministrativos, setDatosAdministrativos] = useState(null);
  const [vendedores, setVendedores] = useState([]);
  const [compradores, setCompradores] = useState([]);
  const [datosAbogado, setDatosAbogado] = useState(null);
  const [minuta, setMinuta] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleAgregarVendedor = () => {
    setVendedores([...vendedores, null]);
  };

  const handleVendedorReady = (index, data) => {
    const newVendedores = [...vendedores];
    newVendedores[index] = data;
    setVendedores(newVendedores);
  };

  const handleEliminarVendedor = (index) => {
    const newVendedores = vendedores.filter((_, i) => i !== index);
    setVendedores(newVendedores);
  };

  const handleAgregarComprador = () => {
    setCompradores([...compradores, null]);
  };

  const handleCompradorReady = (index, data) => {
    const newCompradores = [...compradores];
    newCompradores[index] = data;
    setCompradores(newCompradores);
  };

  const handleEliminarComprador = (index) => {
    const newCompradores = compradores.filter((_, i) => i !== index);
    setCompradores(newCompradores);
  };

  const validateForm = () => {
    const errors = [];

    if (!datosAdministrativos?.notarioKey) {
      errors.push('Seleccione un notario');
    }

    if (!datosAdministrativos?.matrizador) {
      errors.push('Configure las iniciales del matrizador en su perfil');
    }

    if (!datosAdministrativos?.numeroProtocolo) {
      errors.push('Ingrese el número de protocolo');
    }

    if (!datosAdministrativos?.cuantia) {
      errors.push('Ingrese la cuantía');
    }

    if (vendedores.length === 0) {
      errors.push('Debe agregar al menos un vendedor');
    }

    if (vendedores.some(v => v === null)) {
      errors.push('Complete todos los datos de los vendedores');
    }

    if (compradores.length === 0) {
      errors.push('Debe agregar al menos un comprador');
    }

    if (compradores.some(c => c === null)) {
      errors.push('Complete todos los datos de los compradores');
    }

    if (!minuta.trim()) {
      errors.push('Ingrese la minuta del contrato');
    }

    if (!datosAbogado?.nombreAbogado) {
      errors.push('Ingrese el nombre del abogado');
    }

    if (!datosAbogado?.generoAbogado) {
      errors.push('Seleccione el género del abogado');
    }

    if (!datosAbogado?.numeroMatricula) {
      errors.push('Ingrese el número de matrícula del abogado');
    }

    if (datosAbogado?.tipoMatricula === 'colegio' && !datosAbogado?.provinciaAbogado) {
      errors.push('Seleccione la provincia del colegio de abogados');
    }

    if (datosAdministrativos?.needsConcuerdo) {
      if (!datosAdministrativos?.concuerdoNumeroProtocolo) {
        errors.push('Ingrese el número de protocolo del concuerdo');
      }
      if (!datosAdministrativos?.concuerdoNombres) {
        errors.push('Ingrese los nombres del solicitante del concuerdo');
      }
      if (!datosAdministrativos?.concuerdoApellidos) {
        errors.push('Ingrese los apellidos del solicitante del concuerdo');
      }
      if (!datosAdministrativos?.concuerdoCedula) {
        errors.push('Ingrese la cédula del solicitante del concuerdo');
      }
    }

    return errors;
  };

  const handleGenerarMatriz = async () => {
    const errors = validateForm();

    if (errors.length > 0) {
      toast.error(errors[0]);
      return;
    }

    setLoading(true);

    try {
      
      // Transformar vendedores al formato que espera el backend
      const vendedoresList = vendedores.map(v => ({
        cedula: v.documentNumber,
        nombres: v.names,
        apellidos: v.lastNames,
        genero: v.gender,
        estadoCivil: v.maritalStatus,
        nacionalidad: v.nationality,
        fechaNacimiento: v.birthDate,
        email: v.email || '',
        telefono: v.phone || '',
        provincia: v.province,
        canton: v.canton,
        parroquia: v.parroquia,
        sector: v.sector || '',
        callePrincipal: v.mainStreet,
        calleSecundaria: v.secondaryStreet || '',
        numeroCalle: v.numberStreet || '',
        ocupacion: v.occupation,
        profesion: v.profession || '',
        conyuge: v.partner ? {
          cedula: v.partner.documentNumber,
          nombres: v.partner.names,
          apellidos: v.partner.lastNames,
          genero: v.partner.gender,
          nacionalidad: v.partner.nationality,
          fechaNacimiento: v.partner.birthDate,
          ocupacion: v.partner.occupation
        } : null,
        // Opciones especiales
        needsInterpreter: v.needsInterpreter || false,
        nombreInterprete: v.nombreInterprete || null,
        generoInterprete: v.generoInterprete || null,
        cedulaInterprete: v.cedulaInterprete || null,
        idiomaInterprete: v.idiomaInterprete || null,
        isNoVidente: v.isNoVidente || false,
        personaConfianzaNoVidente: v.personaConfianzaNoVidente || null,
        isAnalfabeta: v.isAnalfabeta || false,
        personaConfianzaAnalfabeta: v.personaConfianzaAnalfabeta || null,
        hasDiscapacidadIntelectual: v.hasDiscapacidadIntelectual || false,
        tipoDiscapacidad: v.tipoDiscapacidad || null,
        razonExclusionConyugue: v.razonExclusionConyugue || null
      }));

      // Transformar compradores al formato que espera el backend
      const compradoresList = compradores.map(c => ({
        cedula: c.documentNumber,
        nombres: c.names,
        apellidos: c.lastNames,
        genero: c.gender,
        estadoCivil: c.maritalStatus,
        nacionalidad: c.nationality,
        fechaNacimiento: c.birthDate,
        email: c.email || '',
        telefono: c.phone || '',
        provincia: c.province,
        canton: c.canton,
        parroquia: c.parroquia,
        sector: c.sector || '',
        callePrincipal: c.mainStreet,
        calleSecundaria: c.secondaryStreet || '',
        numeroCalle: c.numberStreet || '',
        ocupacion: c.occupation,
        profesion: c.profession || '',
        conyuge: c.partner ? {
          cedula: c.partner.documentNumber,
          nombres: c.partner.names,
          apellidos: c.partner.lastNames,
          genero: c.partner.gender,
          nacionalidad: c.partner.nationality,
          fechaNacimiento: c.partner.birthDate,
          ocupacion: c.partner.occupation
        } : null,
        // Opciones especiales
        needsInterpreter: c.needsInterpreter || false,
        nombreInterprete: c.nombreInterprete || null,
        generoInterprete: c.generoInterprete || null,
        cedulaInterprete: c.cedulaInterprete || null,
        idiomaInterprete: c.idiomaInterprete || null,
        isNoVidente: c.isNoVidente || false,
        personaConfianzaNoVidente: c.personaConfianzaNoVidente || null,
        isAnalfabeta: c.isAnalfabeta || false,
        personaConfianzaAnalfabeta: c.personaConfianzaAnalfabeta || null,
        hasDiscapacidadIntelectual: c.hasDiscapacidadIntelectual || false,
        tipoDiscapacidad: c.tipoDiscapacidad || null,
        razonExclusionConyugue: c.razonExclusionConyugue || null
      }));

      // Participantes list (todos juntos)
      const participantesList = [...vendedoresList, ...compradoresList];

      // Verificar si alguno es tercera edad (65+ años)
      const isAnyTerceraEdad = participantesList.some(p => {
        const birthDate = new Date(p.fechaNacimiento);
        const age = Math.floor((new Date() - birthDate) / (365.25 * 24 * 60 * 60 * 1000));
        return age >= 65;
      });
console.log('Estado minuta antes de payload:', minuta);
console.log('Datos abogado:', datosAbogado);
      const payload = {
        // Datos administrativos
        numero_protocolo: datosAdministrativos.numeroProtocolo,
        tipo_contrato: datosAdministrativos.tipoContrato,
        cuantia: parseFloat(datosAdministrativos.cuantia),
        fecha_escritura: datosAdministrativos.fechaEscritura,
        notario: {
          nombre: datosAdministrativos.notario.nombre,
          titulo: datosAdministrativos.notario.titulo
        },
        matrizador: datosAdministrativos.matrizador,
        
        // Concuerdo
        needs_concuerdo: datosAdministrativos.needsConcuerdo || false,
        datos_concuerdo: datosAdministrativos.needsConcuerdo ? {
          numero_protocolo: datosAdministrativos.concuerdoNumeroProtocolo,
          names: datosAdministrativos.concuerdoNombres,
          last_names: datosAdministrativos.concuerdoApellidos,
          document_number: datosAdministrativos.concuerdoCedula,
          fecha: datosAdministrativos.concuerdoFecha
        } : null,
        
        // Participantes
        participantes_list: participantesList,
        vendedores_list: vendedoresList,
        compradores_list: compradoresList,
        
        // Abogado
        abogado: {
          nombre_abogado: datosAbogado.nombreAbogado,
          genero_abogado: datosAbogado.generoAbogado,
          tipo_matricula: datosAbogado.tipoMatricula,
          provincia_abogado: datosAbogado.provinciaAbogado || null,
          numero_matricula: datosAbogado.numeroMatricula,
          minuta_texto: minuta
        },
        
        // Flags
        is_any_tercera_edad: isAnyTerceraEdad
      };

      console.log('Payload a enviar:', payload);

      const response = await apiFetch(API_CONFIG.ENDPOINTS.GENERATE_MATRIZ, {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        
        // Descargar el documento
        const downloadResponse = await apiFetch(data.download_url);
        const blob = await downloadResponse.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `matriz_${datosAdministrativos.numeroProtocolo}.docx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        toast.success('Matriz generada exitosamente');
      } else {
        const data = await response.json();
        console.error('Error del backend:', data);
        toast.error(data.detail || 'Error al generar matriz');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al generar matriz: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Generar Matriz de Compraventa
        </h1>
        <p className="text-gray-600 mt-1">
          Complete todos los datos para generar la matriz notarial
        </p>
      </div>

      <div className="space-y-6">
        {/* DATOS ADMINISTRATIVOS */}
        <DatosAdministrativos onChange={setDatosAdministrativos} />

        {/* VENDEDORES */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Vendedores</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={handleAgregarVendedor}
            >
              + Agregar Vendedor
            </Button>
          </div>

          {vendedores.length === 0 && (
            <div className="p-6 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg text-center">
              <p className="text-gray-600">
                No hay vendedores agregados. Click en "Agregar Vendedor" para comenzar.
              </p>
            </div>
          )}

          {vendedores.map((_, index) => (
            <div key={index} className="relative">
              <ComparecienteInline
                title={`Vendedor ${index + 1}`}
                onComparecienteReady={(data) => handleVendedorReady(index, data)}
              />
              {vendedores.length > 1 && (
                <button
                  onClick={() => handleEliminarVendedor(index)}
                  className="absolute top-4 right-4 text-red-600 hover:text-red-800 font-medium text-sm"
                >
                  Eliminar
                </button>
              )}
            </div>
          ))}
        </div>

        {/* COMPRADORES */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Compradores</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={handleAgregarComprador}
            >
              + Agregar Comprador
            </Button>
          </div>

          {compradores.length === 0 && (
            <div className="p-6 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg text-center">
              <p className="text-gray-600">
                No hay compradores agregados. Click en "Agregar Comprador" para comenzar.
              </p>
            </div>
          )}

          {compradores.map((_, index) => (
            <div key={index} className="relative">
              <ComparecienteInline
                title={`Comprador ${index + 1}`}
                onComparecienteReady={(data) => handleCompradorReady(index, data)}
              />
              {compradores.length > 1 && (
                <button
                  onClick={() => handleEliminarComprador(index)}
                  className="absolute top-4 right-4 text-red-600 hover:text-red-800 font-medium text-sm"
                >
                  Eliminar
                </button>
              )}
            </div>
          ))}
        </div>

        {/* MINUTA */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Minuta del Contrato</h2>
          <TextNumberTransformer onChange={setMinuta} />
        </div>

        {/* DATOS DEL ABOGADO */}
        <DatosAbogado onChange={setDatosAbogado} />

        {/* BOTÓN GENERAR */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 shadow-lg">
          <div className="flex justify-end gap-3">
            <Button
              variant="primary"
              size="lg"
              icon={loading ? <Download className="w-5 h-5 animate-spin" /> : <FileText className="w-5 h-5" />}
              onClick={handleGenerarMatriz}
              loading={loading}
              disabled={loading}
            >
              {loading ? 'Generando...' : 'Generar Matriz'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerarMatrizPage;