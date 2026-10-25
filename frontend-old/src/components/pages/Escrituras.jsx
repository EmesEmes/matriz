import React, { useState } from "react";
import Compareciente from "../comparecientes/Compareciente";
import MatrizForm from "../matriz/MatrizForm";
import MinutaForm from "../matriz/MinutaForm";
import { generarMatrizBackend } from "../../utils/generarMatrizBackend";
import {
  formatearFechaNotarial,
  numeroALetras,
  numeroADigitos,
} from "../../utils/formatters";

const obtenerEdadPersona = (persona) => {
  if (!persona.birthDate) return 0;
  const today = new Date();
  const birthDate = new Date(persona.birthDate);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

const prepararPersonaData = (persona) => {
  const edad = obtenerEdadPersona(persona);
  const esCasado = persona.maritalStatus?.toLowerCase() === "casado";
  const esMujer = persona.gender?.toLowerCase() === "femenino";

  return {
    nombre: `${persona.names} ${persona.lastNames}`.toUpperCase(),
    cedula: persona.documentNumber,
    cedulaEnLetras: numeroADigitos(persona.documentNumber || ""),
    edad: edad,
    anios: numeroALetras(edad),
    isTerceraEdad: edad >= 65,
    nacionalidad: persona.nationality || "ecuatoriana",
    telefono: persona.phone || "",
    celularEnLetras: numeroADigitos(persona.phone || ""),
    correo: persona.email || "",
    tratamiento:
      persona.gender?.toLowerCase() === "femenino" ? "la señora" : "el señor",
    esMujer: esMujer,
    esCasado: esCasado,
    ocupacion: persona.occupation?.toLowerCase() || "",
    profesion: persona.profession || "",
    hasProfession: persona.profession ? true : false,
    provincia: persona.province || "",
    canton: persona.canton || "",
    parroquia: persona.parroquia || "",
    sector: persona.sector || "",
    direccion: `${persona.mainStreet || ""} No. ${
      persona.numberStreet || ""
    } y ${persona.secondaryStreet || ""}`.trim(),
    hasDiscapacidadIntelectual: persona.hasDiscapacidadIntelectual || false,
    isNoVidente: persona.isNoVidente || false,
    isAnalfabeta: persona.isAnalfabeta || false,
    tieneInterprete: persona.needsInterpreter || false,
    personaConfianzaNoVidente: persona.personaConfianzaVidente || "",
    personaConfianzaAnalfabeta: persona.personaConfianzaAnalfabeta || "",
    interprete: persona.interprete || null,
  };
};

const Escrituras = () => {
  const [vendedores, setVendedores] = useState([]);
  const [compradores, setCompradores] = useState([]);
  const [datosFormulario, setDatosFormulario] = useState(null);
  const [generando, setGenerando] = useState(false);

  const [datosAbogado, setDatosAbogado] = useState({
    nombreAbogado: "",
    generoAbogado: "",
    tipoMatricula: "cj",
    provinciaAbogado: "",
    numeroMatricula: "",
    minutaTexto: "",
  });

  const handleMinutaChange = (newAbogadoData) => {
    setDatosAbogado((prevData) => {
      const finalData = newAbogadoData(prevData);

      if (finalData.tipoMatricula === "cj") {
        return {
          ...finalData,
          provinciaAbogado: "", 
        };
      }
      return finalData;
    });
  };

  const agregarCompareciente = (tipo) => {
    if (tipo === "vendedor") {
      setVendedores([...vendedores, null]);
    } else {
      setCompradores([...compradores, null]);
    }
  };

  const eliminarCompareciente = (tipo, index) => {
    const lista = tipo === "vendedor" ? [...vendedores] : [...compradores];
    lista.splice(index, 1);
    tipo === "vendedor" ? setVendedores(lista) : setCompradores(lista);
  };

  const actualizarCompareciente = (tipo, index, datos) => {
    const lista = tipo === "vendedor" ? [...vendedores] : [...compradores];
    lista[index] = datos;
    tipo === "vendedor" ? setVendedores(lista) : setCompradores(lista);
  };

  const handleGenerarMatriz = async () => {
    if (
      vendedores.length === 0 ||
      compradores.length === 0 ||
      !datosFormulario
    ) {
      alert(
        "Por favor, complete al menos un vendedor, un comprador y el formulario principal."
      );
      return;
    }

    setGenerando(true);

    try {
      let numeroProtocoloFormateado = datosFormulario.numeroProtocolo;
      while (numeroProtocoloFormateado.length < 5) {
        numeroProtocoloFormateado = "0" + numeroProtocoloFormateado;
      }

      const participantesList = [];
      let contadorGlobal = 1;

      const addParticipante = (personaData, rol, esConyugue = false) => {
        participantesList.push({
          ...personaData,
          numero: contadorGlobal++,
          rol: rol,
          esConyugue: esConyugue,
        });
      };

      vendedores.forEach((vendedor) => {
        const dataVendedor = prepararPersonaData(vendedor);

        addParticipante(
          {
            ...dataVendedor,
            esTitular: true,
            conyugueNecesitaComparecer:
              vendedor.maritalStatus?.toLowerCase() === "casado" &&
              vendedor.needsConyugue,
            razonExclusionConyugue: vendedor.razonExclusionConyugue || "",
          },
          "VENDEDOR",
          false
        );

        if (
          vendedor.maritalStatus?.toLowerCase() === "casado" &&
          vendedor.needsConyugue &&
          vendedor.partner
        ) {
          const dataConyuge = prepararPersonaData(vendedor.partner);
          addParticipante({ ...dataConyuge, esTitular: false }, "VENDEDOR", true);
        }
      });

      compradores.forEach((comprador) => {
        const dataComprador = prepararPersonaData(comprador);

        addParticipante(
          {
            ...dataComprador,
            esTitular: true,
            conyugueNecesitaComparecer:
              comprador.maritalStatus?.toLowerCase() === "casado" &&
              comprador.needsConyugue,
            razonExclusionConyugue: comprador.razonExclusionConyugue || "",
          },
          "COMPRADOR",
          false
        );

        if (
          comprador.maritalStatus?.toLowerCase() === "casado" &&
          comprador.needsConyugue &&
          comprador.partner
        ) {
          const dataConyuge = prepararPersonaData(comprador.partner);
          addParticipante(
            { ...dataConyuge, esTitular: false },
            "COMPRADOR",
            true
          );
        }
      });

      const vendedoresList = participantesList.filter(
        (p) => p.rol === "VENDEDOR"
      );
      const compradoresList = participantesList.filter(
        (p) => p.rol === "COMPRADOR"
      );

      const isAnyTerceraEdad = participantesList.some((p) => p.isTerceraEdad);

      const needsConcuerdo = datosFormulario.needsConcuerdo || false;
      let datosConcuerdo = needsConcuerdo ? datosFormulario.nuevoConcuerdo : null;

      if (needsConcuerdo && datosConcuerdo?.numeroProtocolo) {
        let numeroConcuerdoFormateado = datosConcuerdo.numeroProtocolo;
        while (numeroConcuerdoFormateado.length < 5) {
          numeroConcuerdoFormateado = "0" + numeroConcuerdoFormateado;
        }
        const protocoloConcuerdoFinal = `20251701022O${numeroConcuerdoFormateado}`;

        datosConcuerdo = {
          ...datosConcuerdo,
          names: datosConcuerdo.names.toUpperCase(),
          lastNames: datosConcuerdo.lastNames.toUpperCase(),
          cedulaEnLetras: numeroADigitos(datosConcuerdo.documentNumber || ""),
          numeroProtocolo: protocoloConcuerdoFinal,
        };
      }

      const fechaEscritura = new Date(
        datosFormulario.fechaEscritura + "T00:00:00"
      );
      
      const datosParaDocx = {
        numeroProtocolo: `20251701022P${numeroProtocoloFormateado}`,
        tipoContrato: datosFormulario.tipoContrato.toUpperCase(),
        cuantia: datosFormulario.cuantia,
        fechaActual: formatearFechaNotarial(fechaEscritura),
        notario: datosFormulario.notario.nombre,
        tituloNotario: datosFormulario.notario.titulo,
        matrizador: datosFormulario.matrizador,
        isAnyTerceraEdad: isAnyTerceraEdad,
        needsConcuerdo: needsConcuerdo,
        datosConcuerdo: datosConcuerdo,
        abogadoNombre: datosAbogado.nombreAbogado,
        abogadoNumeroMatricula: datosAbogado.numeroMatricula,
        abogadoMatriculaAbogadoEnLetras: numeroADigitos(datosAbogado.numeroMatricula),
        abogadoTipoMatricula: datosAbogado.tipoMatricula,
        abogadoProvincia: datosAbogado.provinciaAbogado,
        abogadoEsMujer: datosAbogado.generoAbogado?.toLowerCase() === "femenino",
        abogadoTexto: datosAbogado.minutaTexto,
        participantesList: participantesList,
        vendedoresList: vendedoresList,
        compradoresList: compradoresList,
      };

      const result = await generarMatrizBackend(datosParaDocx);
      
      if (result.success) {
        alert('✅ Documento generado y descargado exitosamente');
      } else {
        alert(`❌ Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error inesperado al generar documento');
    } finally {
      setGenerando(false);
    }
  };

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Escrituras Públicas</h1>

      <MatrizForm onChange={setDatosFormulario} />
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Comparecientes Vendedores</h2>
          <div className="space-y-4">
            {vendedores.map((_, index) => (
              <div key={`vendedor-${index}`} className="relative">
                <Compareciente
                  title={`Compareciente Vendedor ${index + 1}`}
                  onUserReady={(data) =>
                    actualizarCompareciente("vendedor", index, data)
                  }
                />
                <button
                  onClick={() => eliminarCompareciente("vendedor", index)}
                  className="absolute top-2 right-2 text-red-600 text-xs"
                >
                  ✕ Eliminar
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={() => agregarCompareciente("vendedor")}
            className="text-blue-600 underline"
          >
            + Agregar Vendedor
          </button>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Comparecientes Compradores</h2>
          <div className="space-y-4">
            {compradores.map((_, index) => (
              <div key={`comprador-${index}`} className="relative">
                <Compareciente
                  title={`Compareciente Comprador ${index + 1}`}
                  onUserReady={(data) =>
                    actualizarCompareciente("comprador", index, data)
                  }
                />
                <button
                  onClick={() => eliminarCompareciente("comprador", index)}
                  className="absolute top-2 right-2 text-red-600 text-xs"
                >
                  ✕ Eliminar
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={() => agregarCompareciente("comprador")}
            className="text-blue-600 underline"
          >
            + Agregar Comprador
          </button>
        </div>
      </div>
      
      <MinutaForm value={datosAbogado} onChange={handleMinutaChange} />

      <div className="flex justify-end">
        <button
          onClick={handleGenerarMatriz}
          disabled={generando}
          className={`px-6 py-2 rounded text-white font-semibold ${
            generando 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {generando ? 'Generando...' : 'Generar Matriz'}
        </button>
      </div>
    </div>
  );
};

export default Escrituras;