import React, { useState } from "react";
import Compareciente from "../comparecientes/Compareciente";
import { generarMinutaDocx } from "../../utils/generarMinutaDocx";
import { numeroALetras, numeroADigitos } from "../../utils/formatters";

const Minutas = () => {
  const [vendedores, setVendedores] = useState([]);
  const [compradores, setCompradores] = useState([]);

  const [datosMinuta, setDatosMinuta] = useState({
    tipoContrato: "compraventa",
    tipoPropiedad: "horizontal", // horizontal o comun
    precio: "",
    descripcionBien: "",
    // Datos del abogado
    nombreAbogado: "",
    generoAbogado: "",
    matriculaAbogado: "",
    tipoMatricula: "cj", // cj o colegio
    provinciaAbogado: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDatosMinuta((prev) => ({
      ...prev,
      [name]: value,
    }));
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

  const handleGenerarMinuta = () => {
    if (vendedores.length === 0 || compradores.length === 0) {
      alert("Por favor, agregue al menos un vendedor y un comprador.");
      return;
    }

    if (!datosMinuta.nombreAbogado || !datosMinuta.matriculaAbogado) {
      alert("Por favor, complete los datos del abogado.");
      return;
    }

    // Preparar datos para el documento
    const datosParaDocx = {
      tipoContrato: datosMinuta.tipoContrato,
      tipoPropiedad: datosMinuta.tipoPropiedad,
      precio: datosMinuta.precio,
      precioEnLetras: numeroALetras(parseFloat(datosMinuta.precio) || 0),
      descripcionBien: datosMinuta.descripcionBien,

      // Vendedores y compradores
      vendedores: vendedores,
      compradores: compradores,

      // Datos del abogado
      abogadoNombre: datosMinuta.nombreAbogado.toUpperCase(),
      abogadoMatricula: datosMinuta.matriculaAbogado,
      abogadoMatriculaEnLetras: numeroADigitos(datosMinuta.matriculaAbogado),
      abogadoTipoMatricula: datosMinuta.tipoMatricula,
      abogadoProvincia: datosMinuta.provinciaAbogado,
      abogadoEsMujer: datosMinuta.generoAbogado?.toLowerCase() === "femenino",
    };

    generarMinutaDocx(datosParaDocx);
  };

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Creación de Minutas</h1>

      {/* Tipo de Contrato */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Datos Generales</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Tipo de Contrato:
            </label>
            <select
              name="tipoContrato"
              value={datosMinuta.tipoContrato}
              onChange={handleInputChange}
              className="p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="compraventa">Compraventa</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Tipo de Propiedad:
            </label>
            <select
              name="tipoPropiedad"
              value={datosMinuta.tipoPropiedad}
              onChange={handleInputChange}
              className="p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="horizontal">Propiedad Horizontal</option>
              <option value="comun">Propiedad Común</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Precio (USD):
            </label>
            <input
              type="number"
              name="precio"
              value={datosMinuta.precio}
              onChange={handleInputChange}
              placeholder="Ej: 340000"
              className="p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex flex-col col-span-2">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Descripción del Bien:
            </label>
            <textarea
              name="descripcionBien"
              value={datosMinuta.descripcionBien}
              onChange={handleInputChange}
              placeholder="Ej: Departamento Dos, Planta Departamento Dos, nivel N más tres..."
              rows="4"
              className="p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Comparecientes */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Vendedores</h2>
          <div className="space-y-4">
            {vendedores.map((_, index) => (
              <div key={`vendedor-${index}`} className="relative">
                <Compareciente
                  title={`Vendedor ${index + 1}`}
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
          <h2 className="text-2xl font-semibold">Compradores</h2>
          <div className="space-y-4">
            {compradores.map((_, index) => (
              <div key={`comprador-${index}`} className="relative">
                <Compareciente
                  title={`Comprador ${index + 1}`}
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

      {/* Datos del Abogado */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Datos del Abogado Patrocinador</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Nombre Completo:
            </label>
            <input
              type="text"
              name="nombreAbogado"
              value={datosMinuta.nombreAbogado}
              onChange={handleInputChange}
              placeholder="Nombre completo del abogado"
              className="p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 uppercase"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Género:
            </label>
            <select
              name="generoAbogado"
              value={datosMinuta.generoAbogado}
              onChange={handleInputChange}
              className="p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Seleccione género</option>
              <option value="masculino">Masculino</option>
              <option value="femenino">Femenino</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Tipo de Matrícula:
            </label>
            <select
              name="tipoMatricula"
              value={datosMinuta.tipoMatricula}
              onChange={handleInputChange}
              className="p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="cj">Foro del Consejo de la Judicatura</option>
              <option value="colegio">Colegio de Abogados</option>
            </select>
          </div>

          {datosMinuta.tipoMatricula === "colegio" && (
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Provincia del Colegio:
              </label>
              <select
                name="provinciaAbogado"
                value={datosMinuta.provinciaAbogado}
                onChange={handleInputChange}
                className="p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Seleccione Provincia</option>
                <option value="Pichincha">Pichincha</option>
                <option value="Guayas">Guayas</option>
                <option value="Azuay">Azuay</option>
                {/* Agregar más provincias según necesidad */}
              </select>
            </div>
          )}

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Número de Matrícula:
            </label>
            <input
              type="text"
              name="matriculaAbogado"
              value={datosMinuta.matriculaAbogado}
              onChange={handleInputChange}
              placeholder="Ej: 17-2023-1717"
              className="p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>
      </div>

      {/* Botón Generar */}
      <div className="flex justify-end">
        <button
          onClick={handleGenerarMinuta}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          Generar Minuta
        </button>
      </div>
    </div>
  );
};

export default Minutas;
