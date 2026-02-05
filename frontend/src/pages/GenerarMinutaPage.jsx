import { useState } from "react";
import { Button, Card, RichTextEditor } from "../components/shared";
import { ComparecienteInline } from "../components/comparecientes";
import { SeccionFormularioRedactar } from "../components/minutas";
import { FileText, Plus, Trash2 } from "lucide-react";

const GenerarMinutaPage = () => {
  const [tipoContrato, setTipoContrato] = useState("compraventa");
  const [vendedores, setVendedores] = useState([]);
  const [compradores, setCompradores] = useState([]);

  // Antecedentes
  const [tipoPropiedad, setTipoPropiedad] = useState("");
  const [nombreConjunto, setNombreConjunto] = useState("");
  const [predios, setPredios] = useState([]);

  // Construido en
  const [ubicacion, setUbicacion] = useState({
    lote: "",
    numero: "",
    parroquia: "",
    canton: "",
    provincia: "",
  });

  // Historia de dominio
  const [modoHistoria, setModoHistoria] = useState("formulario");
  const [historiaManual, setHistoriaManual] = useState("");
  const [historiaFormulario, setHistoriaFormulario] = useState({
    titulo: "",
    tituloOtro: "",
    fechaOtorgamiento: "",
    numeroNotaria: "",
    cantonNotaria: "",
    notario: "",
    fechaInscripcion: "",

    // Solo si es sucesión
    nombreCausante: "",
    causanteAdquiridoDe: "",
    causanteTitulo: "",
    causanteTituloOtro: "",
    causanteFechaOtorgamiento: "",
    causanteNumeroNotaria: "",
    causanteCantonNotaria: "",
    causanteNotario: "",
    causanteFechaInscripcion: "",
  });

  // Declaratoria de propiedad horizontal
  const [modoDeclaratoria, setModoDeclaratoria] = useState("formulario");
  const [declaratoriaManual, setDeclaratoriaManual] = useState("");
  const [declaratoriaFormulario, setDeclaratoriaFormulario] = useState({
    fechaOtorgamiento: "",
    numeroNotaria: "",
    cantonNotaria: "",
    notario: "",
    fechaInscripcion: "",
  });

  // Sujeto del contrato
  const [modoSujeto, setModoSujeto] = useState("auto");
  const [sujetoManual, setSujetoManual] = useState("");

  // Linderos generales
  const [linderosGenerales, setLinderosGenerales] = useState({
    norte: { metros: "", colindancia: "" },
    sur: { metros: "", colindancia: "" },
    este: { metros: "", colindancia: "" },
    oeste: { metros: "", colindancia: "" },
    superficie: "",
  });

  // Precio y forma de pago
  const [precioTotal, setPrecioTotal] = useState("");
  const [modoPrecio, setModoPrecio] = useState("formulario"); // 'formulario' | 'manual'
  const [precioManual, setPrecioManual] = useState("");
  const [partesPago, setPartesPago] = useState([
    {
      id: Date.now(),
      letra: "A",
      monto: "",
      tipoPago: "unico",
      medioPago: "",
      tipoCheque: "",
      momentoPago: "",
      momentoOtro: "",
      esCreditoBancario: false,
      nombreBanco: "",
      cuentaDestino: "",
      numeroCuotas: "",
      valorCuota: 0,
      periodicidad: "",
      periodicidadOtra: "",
    },
  ]);

  // Administrador
  const [hayAdministrador, setHayAdministrador] = useState(false);

  // Abogado
  const [abogado, setAbogado] = useState({
    nombre: "",
    numeroMatricula: "",
    tipoMatricula: "cj", // 'cj' | 'colegio'
    provincia: "",
  });

  // Opciones de bienes según tipo de propiedad
  const bienesHorizontal = [
    "Departamento",
    "Suite",
    "Casa",
    "Loft",
    "Estacionamiento",
    "Oficina",
    "Bodega",
    "Almacén",
    "Porche",
    "Terraza",
    "Jardín Delantero",
    "Jardín Trasero",
  ];

  const bienesComun = ["Casa", "Terreno", "Solares", "Fincas", "Haciendas"];

  // Opciones de tipos para predios
  const tiposPredios = [
    "Departamento",
    "Suite",
    "Casa",
    "Loft",
    "Estacionamiento",
    "Oficina",
    "Bodega",
    "Almacén",
    "Porche",
    "Terraza",
    "Jardín Delantero",
    "Jardín Trasero",
    "Secadero",
    "Otro",
  ];

  // Opciones de tipos para inmuebles (solo en predios compuestos)
  const tiposInmuebles = [
    "Planta",
    "Planta Baja",
    "Planta Alta",
    "Departamento",
    "Suite",
    "Casa",
    "Loft",
    "Estacionamiento",
    "Oficina",
    "Bodega",
    "Almacén",
    "Porche",
    "Terraza",
    "Jardín Delantero",
    "Jardín Trasero",
    "Secadero",
    "Otro",
  ];

  // Agregar predio
  const handleAgregarPredio = (esCompuesto) => {
    setPredios([
      ...predios,
      {
        id: Date.now(),
        esCompuesto: esCompuesto, // true o false
        tipo: "",
        tipoOtro: "",
        numero: "",
        inmuebles: [
          {
            id: Date.now() + Math.random(),
            tipo: "", // Solo se usa si esCompuesto === true
            tipoOtro: "",
            nivel: "",
            areaCubierta: "",
            areaDescubierta: "",
            alicuotaParcial: "",
          },
        ],
        alicuotaTotal: 0,
      },
    ]);
  };

  // Eliminar predio
  const handleEliminarPredio = (predioId) => {
    setPredios(predios.filter((p) => p.id !== predioId));
  };

  // Actualizar campo de predio
  const handlePredioChange = (predioId, field, value) => {
    setPredios(
      predios.map((predio) => {
        if (predio.id === predioId) {
          return { ...predio, [field]: value };
        }
        return predio;
      }),
    );
  };

  // Agregar inmueble a un predio compuesto
  const handleAgregarInmueble = (predioId) => {
    setPredios(
      predios.map((predio) => {
        if (predio.id === predioId && predio.esCompuesto) {
          return {
            ...predio,
            inmuebles: [
              ...predio.inmuebles,
              {
                id: Date.now() + Math.random(),
                tipo: "",
                tipoOtro: "",
                nivel: "",
                areaCubierta: "",
                areaDescubierta: "",
                alicuotaParcial: "",
              },
            ],
          };
        }
        return predio;
      }),
    );
  };

  // Eliminar inmueble de un predio
  const handleEliminarInmueble = (predioId, inmuebleId) => {
    setPredios(
      predios.map((predio) => {
        if (predio.id === predioId) {
          return {
            ...predio,
            inmuebles: predio.inmuebles.filter((i) => i.id !== inmuebleId),
          };
        }
        return predio;
      }),
    );
  };

  // Actualizar campo de inmueble
  const handleInmuebleChange = (predioId, inmuebleId, field, value) => {
    setPredios(
      predios.map((predio) => {
        if (predio.id === predioId) {
          const nuevosInmuebles = predio.inmuebles.map((inmueble) => {
            if (inmueble.id === inmuebleId) {
              return { ...inmueble, [field]: value };
            }
            return inmueble;
          });

          // Calcular alícuota total del predio
          const alicuotaTotal = nuevosInmuebles.reduce((sum, inm) => {
            return sum + (parseFloat(inm.alicuotaParcial) || 0);
          }, 0);

          return {
            ...predio,
            inmuebles: nuevosInmuebles,
            alicuotaTotal: alicuotaTotal,
          };
        }
        return predio;
      }),
    );
  };

  // Manejar vendedores
  const handleAgregarVendedor = () => {
    setVendedores([...vendedores, null]);
  };

  const handleVendedorReady = (index, data) => {
    const newVendedores = [...vendedores];
    newVendedores[index] = data;
    setVendedores(newVendedores);
  };

  const handleEliminarVendedor = (index) => {
    setVendedores(vendedores.filter((_, i) => i !== index));
  };

  // Manejar compradores
  const handleAgregarComprador = () => {
    setCompradores([...compradores, null]);
  };

  const handleCompradorReady = (index, data) => {
    const newCompradores = [...compradores];
    newCompradores[index] = data;
    setCompradores(newCompradores);
  };

  const handleEliminarComprador = (index) => {
    setCompradores(compradores.filter((_, i) => i !== index));
  };

  // Agregar bien
  const handleAgregarBien = (tipoBien) => {
    const id = Date.now() + Math.random();
    setBienesSeleccionados([...bienesSeleccionados, { tipo: tipoBien, id }]);
    setDatosBienes({
      ...datosBienes,
      [id]: {
        numero: "",
        nivel: "",
        alicuotaParcial: "",
        alicuotaTotal: "",
        areaCubierta: "",
        areaDescubierta: "",
      },
    });
  };

  // Eliminar bien
  const handleEliminarBien = (id) => {
    setBienesSeleccionados(bienesSeleccionados.filter((b) => b.id !== id));
    const newDatos = { ...datosBienes };
    delete newDatos[id];
    setDatosBienes(newDatos);
  };

  // Actualizar datos de un bien
  const handleDatosBienChange = (id, field, value) => {
    setDatosBienes({
      ...datosBienes,
      [id]: {
        ...datosBienes[id],
        [field]: value,
      },
    });
  };

  // Calcular saldo restante
  const calcularSaldoRestante = () => {
    const total = parseFloat(precioTotal) || 0;
    const sumaPagos = partesPago.reduce((sum, parte) => {
      return sum + (parseFloat(parte.monto) || 0);
    }, 0);
    return total - sumaPagos;
  };

  // Agregar nueva parte de pago
  const handleAgregarPartePago = () => {
    const letras = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    const nuevaLetra = letras[partesPago.length] || `${partesPago.length + 1}`;

    setPartesPago([
      ...partesPago,
      {
        id: Date.now(),
        letra: nuevaLetra,
        monto: "",
        tipoPago: "unico",
        medioPago: "",
        tipoCheque: "",
        momentoPago: "",
        momentoOtro: "",
        esCreditoBancario: false,
        nombreBanco: "",
        cuentaDestino: "",
        numeroCuotas: "",
        valorCuota: 0,
        periodicidad: "",
        periodicidadOtra: "",
      },
    ]);
  };

  // Eliminar parte de pago
  const handleEliminarPartePago = (id) => {
    const nuevasPartes = partesPago.filter((p) => p.id !== id);
    // Re-asignar letras
    const letras = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    nuevasPartes.forEach((parte, index) => {
      parte.letra = letras[index] || `${index + 1}`;
    });
    setPartesPago(nuevasPartes);
  };

  // Actualizar campo de una parte
  const handlePartePagoChange = (id, field, value) => {
    setPartesPago(
      partesPago.map((parte) => {
        if (parte.id === id) {
          const updated = { ...parte, [field]: value };

          // Auto-calcular valor de cuota
          if (field === "monto" || field === "numeroCuotas") {
            if (
              updated.tipoPago === "cuotas" &&
              updated.monto &&
              updated.numeroCuotas
            ) {
              updated.valorCuota =
                parseFloat(updated.monto) / parseInt(updated.numeroCuotas);
            }
          }

          // Si cambia a 'unico', limpiar campos de cuotas
          if (field === "tipoPago" && value === "unico") {
            updated.numeroCuotas = "";
            updated.valorCuota = 0;
            updated.periodicidad = "";
            updated.periodicidadOtra = "";
          }

          // Si no es cheque, limpiar tipo de cheque
          if (field === "medioPago" && value !== "cheque") {
            updated.tipoCheque = "";
          }

          // Si no es "otro" momento, limpiar momentoOtro
          if (field === "momentoPago" && value !== "otro") {
            updated.momentoOtro = "";
          }

          // Si no es crédito bancario, limpiar campos
          if (field === "esCreditoBancario" && !value) {
            updated.nombreBanco = "";
            updated.cuentaDestino = "";
          }

          return updated;
        }
        return parte;
      }),
    );
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Generar Minuta</h1>
        <p className="text-gray-600 mt-1">
          Complete los datos para generar la minuta
        </p>
      </div>

      <div className="space-y-6">
        {/* 1. TIPO DE CONTRATO */}
        <Card title="Tipo de Contrato">
          <select
            value={tipoContrato}
            onChange={(e) => setTipoContrato(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option value="compraventa">Compraventa</option>
            <option value="poderes" disabled>
              Poderes (Próximamente)
            </option>
          </select>
        </Card>

        {/* 2. VENDEDORES */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Vendedores</h2>
            <Button variant="outline" size="sm" onClick={handleAgregarVendedor}>
              + Agregar Vendedor
            </Button>
          </div>

          {vendedores.length === 0 && (
            <div className="p-6 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg text-center">
              <p className="text-gray-600">
                No hay vendedores. Click en "Agregar Vendedor".
              </p>
            </div>
          )}

          {vendedores.map((_, index) => (
            <div key={index} className="relative">
              <ComparecienteInline
                title={`Vendedor ${index + 1}`}
                onComparecienteReady={(data) =>
                  handleVendedorReady(index, data)
                }
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

        {/* 3. COMPRADORES */}
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
                No hay compradores. Click en "Agregar Comprador".
              </p>
            </div>
          )}

          {compradores.map((_, index) => (
            <div key={index} className="relative">
              <ComparecienteInline
                title={`Comprador ${index + 1}`}
                onComparecienteReady={(data) =>
                  handleCompradorReady(index, data)
                }
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

        {/* SEPARADOR - ANTECEDENTES */}
        <div className="border-t-4 border-primary-500 pt-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            ANTECEDENTES
          </h2>
        </div>

        {/* 4. TIPO DE PROPIEDAD */}
        <Card title="Tipo de Propiedad">
          <select
            value={tipoPropiedad}
            onChange={(e) => {
              setTipoPropiedad(e.target.value);
              setBienesSeleccionados([]);
              setDatosBienes({});
              setNombreConjunto("");
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Seleccione tipo de propiedad</option>
            <option value="horizontal">Propiedad Horizontal</option>
            <option value="comun">Propiedad Común</option>
          </select>
        </Card>

        {/* 5. NOMBRE DEL CONJUNTO (solo para horizontal) */}
        {tipoPropiedad === "horizontal" && (
          <Card title="Nombre del Conjunto/Edificio">
            <input
              type="text"
              value={nombreConjunto}
              onChange={(e) => setNombreConjunto(e.target.value.toUpperCase())}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 uppercase"
              placeholder="Ej: EDIFICIO MONTICELLO"
            />
          </Card>
        )}

        {/* 6. BIENES A INCLUIR (PREDIOS) */}
        {tipoPropiedad === "horizontal" && (
          <Card title="Bienes a Incluir (Predios)">
            <div className="space-y-6">
              {/* Botones para agregar predio */}
              <div className="flex flex-col gap-3">
                <p className="text-sm font-medium text-gray-700">
                  ¿Qué tipo de predio desea agregar?
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleAgregarPredio(false)}
                    className="flex-1 p-4 border-2 border-blue-300 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-left"
                  >
                    <div className="font-semibold text-blue-900 mb-1">
                      Predio Simple
                    </div>
                    <div className="text-xs text-blue-700">
                      Un solo inmueble independiente (ej: Parqueadero, Bodega)
                    </div>
                  </button>

                  <button
                    onClick={() => handleAgregarPredio(true)}
                    className="flex-1 p-4 border-2 border-purple-300 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-left"
                  >
                    <div className="font-semibold text-purple-900 mb-1">
                      Predio Compuesto
                    </div>
                    <div className="text-xs text-purple-700">
                      Múltiples inmuebles relacionados (ej: Departamento con
                      porche, terraza, jardines)
                    </div>
                  </button>
                </div>
              </div>

              {/* Lista de predios */}
              {predios.length === 0 && (
                <div className="p-6 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg text-center">
                  <p className="text-gray-600">
                    No hay predios agregados. Seleccione el tipo de predio
                    arriba.
                  </p>
                </div>
              )}

              {predios.map((predio, predioIndex) => (
                <div
                  key={predio.id}
                  className={`border-2 rounded-lg p-6 ${
                    predio.esCompuesto
                      ? "border-purple-300 bg-purple-50"
                      : "border-blue-300 bg-blue-50"
                  }`}
                >
                  {/* Header del predio */}
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                      <h3
                        className={`text-lg font-bold ${
                          predio.esCompuesto
                            ? "text-purple-900"
                            : "text-blue-900"
                        }`}
                      >
                        PREDIO {predioIndex + 1}
                      </h3>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          predio.esCompuesto
                            ? "bg-purple-200 text-purple-800"
                            : "bg-blue-200 text-blue-800"
                        }`}
                      >
                        {predio.esCompuesto ? "Compuesto" : "Simple"}
                      </span>
                    </div>
                    <button
                      onClick={() => handleEliminarPredio(predio.id)}
                      className="text-red-600 hover:text-red-800 font-medium text-sm"
                    >
                      Eliminar Predio
                    </button>
                  </div>

                  {/* Datos del predio */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tipo de Predio
                      </label>
                      <select
                        value={predio.tipo}
                        onChange={(e) =>
                          handlePredioChange(predio.id, "tipo", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white"
                      >
                        <option value="">Seleccione tipo</option>
                        {tiposPredios.map((tipo) => (
                          <option key={tipo} value={tipo}>
                            {tipo}
                          </option>
                        ))}
                      </select>
                    </div>

                    {predio.tipo === "Otro" && (
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Especifique el tipo
                        </label>
                        <input
                          type="text"
                          value={predio.tipoOtro}
                          onChange={(e) =>
                            handlePredioChange(
                              predio.id,
                              "tipoOtro",
                              e.target.value,
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                          placeholder="Ej: Local comercial"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Número
                      </label>
                      <input
                        type="text"
                        value={predio.numero}
                        onChange={(e) =>
                          handlePredioChange(
                            predio.id,
                            "numero",
                            e.target.value,
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        placeholder="Ej: 2"
                      />
                    </div>
                  </div>

                  {/* Inmuebles del predio */}
                  <div className="border-t-2 border-gray-300 pt-4">
                    <h4 className="font-semibold text-gray-900 mb-3">
                      {predio.esCompuesto
                        ? "Inmuebles del Predio"
                        : "Datos del Inmueble"}
                    </h4>

                    <div className="space-y-3">
                      {predio.inmuebles.map((inmueble, inmuebleIndex) => (
                        <div
                          key={inmueble.id}
                          className="border border-gray-300 rounded-lg p-4 bg-white"
                        >
                          {predio.esCompuesto && (
                            <div className="flex justify-between items-center mb-3">
                              <span className="text-sm font-semibold text-gray-700">
                                Inmueble {inmuebleIndex + 1}
                              </span>
                              {predio.inmuebles.length > 1 && (
                                <button
                                  onClick={() =>
                                    handleEliminarInmueble(
                                      predio.id,
                                      inmueble.id,
                                    )
                                  }
                                  className="text-red-600 hover:text-red-800 text-sm"
                                >
                                  Eliminar
                                </button>
                              )}
                            </div>
                          )}

                          <div className="grid grid-cols-2 gap-3">
                            {/* Solo mostrar tipo si es compuesto */}
                            {predio.esCompuesto && (
                              <>
                                <div className="col-span-2">
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tipo de Inmueble
                                  </label>
                                  <select
                                    value={inmueble.tipo}
                                    onChange={(e) =>
                                      handleInmuebleChange(
                                        predio.id,
                                        inmueble.id,
                                        "tipo",
                                        e.target.value,
                                      )
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
                                  >
                                    <option value="">Seleccione tipo</option>
                                    {tiposInmuebles.map((tipo) => (
                                      <option key={tipo} value={tipo}>
                                        {tipo}
                                      </option>
                                    ))}
                                  </select>
                                </div>

                                {inmueble.tipo === "Otro" && (
                                  <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      Especifique el tipo
                                    </label>
                                    <input
                                      type="text"
                                      value={inmueble.tipoOtro}
                                      onChange={(e) =>
                                        handleInmuebleChange(
                                          predio.id,
                                          inmueble.id,
                                          "tipoOtro",
                                          e.target.value,
                                        )
                                      }
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
                                      placeholder="Ej: Balcón"
                                    />
                                  </div>
                                )}
                              </>
                            )}

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nivel
                              </label>
                              <input
                                type="text"
                                value={inmueble.nivel}
                                onChange={(e) =>
                                  handleInmuebleChange(
                                    predio.id,
                                    inmueble.id,
                                    "nivel",
                                    e.target.value,
                                  )
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                placeholder="Ej: N+3.00"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Área Cubierta (m²)
                              </label>
                              <input
                                type="text"
                                value={inmueble.areaCubierta}
                                onChange={(e) =>
                                  handleInmuebleChange(
                                    predio.id,
                                    inmueble.id,
                                    "areaCubierta",
                                    e.target.value,
                                  )
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                placeholder="Ej: 217.49"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Área Descubierta (m²)
                              </label>
                              <input
                                type="text"
                                value={inmueble.areaDescubierta}
                                onChange={(e) =>
                                  handleInmuebleChange(
                                    predio.id,
                                    inmueble.id,
                                    "areaDescubierta",
                                    e.target.value,
                                  )
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                placeholder="Ej: 166.04"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Alícuota Parcial (%)
                              </label>
                              <input
                                type="text"
                                value={inmueble.alicuotaParcial}
                                onChange={(e) =>
                                  handleInmuebleChange(
                                    predio.id,
                                    inmueble.id,
                                    "alicuotaParcial",
                                    e.target.value,
                                  )
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                placeholder="Ej: 11.4013"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Botón agregar inmueble (solo para compuestos) */}
                    {predio.esCompuesto && (
                      <button
                        onClick={() => handleAgregarInmueble(predio.id)}
                        className="mt-3 w-full text-sm px-3 py-2 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors"
                      >
                        + Agregar Inmueble
                      </button>
                    )}

                    {/* Alícuota total del predio */}
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-green-900">
                          Alícuota Total del Predio:
                        </span>
                        <span className="text-lg font-bold text-green-700">
                          {predio.alicuotaTotal.toFixed(4)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
        {/* 6B. BIENES PARA PROPIEDAD COMÚN */}
        {tipoPropiedad === "comun" && (
          <Card title="Descripción del Bien (Propiedad Común)">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Bien
                </label>
                <select
                  value={ubicacion.tipoBienComun || ""}
                  onChange={(e) =>
                    setUbicacion({
                      ...ubicacion,
                      tipoBienComun: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Seleccione el tipo de bien</option>
                  <option value="casa">Casa</option>
                  <option value="terreno">Terreno</option>
                  <option value="solares">Solares</option>
                  <option value="fincas">Fincas</option>
                  <option value="haciendas">Haciendas</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              {ubicacion.tipoBienComun === "otro" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Especifique el tipo de bien
                  </label>
                  <input
                    type="text"
                    value={ubicacion.tipoBienComunOtro || ""}
                    onChange={(e) =>
                      setUbicacion({
                        ...ubicacion,
                        tipoBienComunOtro: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="Ej: Quinta"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Superficie Total (m²)
                  </label>
                  <input
                    type="text"
                    value={ubicacion.superficieBienComun || ""}
                    onChange={(e) =>
                      setUbicacion({
                        ...ubicacion,
                        superficieBienComun: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="Ej: 1000.44"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número de Predio (opcional)
                  </label>
                  <input
                    type="text"
                    value={ubicacion.numeroPredio || ""}
                    onChange={(e) =>
                      setUbicacion({
                        ...ubicacion,
                        numeroPredio: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="Ej: 123"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción Adicional (opcional)
                </label>
                <textarea
                  value={ubicacion.descripcionBienComun || ""}
                  onChange={(e) =>
                    setUbicacion({
                      ...ubicacion,
                      descripcionBienComun: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 resize-none"
                  rows="3"
                  placeholder="Ej: Casa de dos plantas con jardín frontal y posterior..."
                />
              </div>
            </div>
          </Card>
        )}

        {/* 7. CONSTRUIDO EN */}
        {tipoPropiedad && (
          <>
            <div className="border-t-2 border-gray-300 pt-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                CONSTRUIDO EN
              </h3>
            </div>

            <Card>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lote
                  </label>
                  <input
                    type="text"
                    value={ubicacion.lote}
                    onChange={(e) =>
                      setUbicacion({ ...ubicacion, lote: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Ej: Lote de terreno número Dos"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número
                  </label>
                  <input
                    type="text"
                    value={ubicacion.numero}
                    onChange={(e) =>
                      setUbicacion({ ...ubicacion, numero: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Ej: 2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Parroquia
                  </label>
                  <input
                    type="text"
                    value={ubicacion.parroquia}
                    onChange={(e) =>
                      setUbicacion({ ...ubicacion, parroquia: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Ej: Nayón"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cantón
                  </label>
                  <input
                    type="text"
                    value={ubicacion.canton}
                    onChange={(e) =>
                      setUbicacion({ ...ubicacion, canton: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Ej: Quito"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Provincia
                  </label>
                  <input
                    type="text"
                    value={ubicacion.provincia}
                    onChange={(e) =>
                      setUbicacion({ ...ubicacion, provincia: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Ej: Pichincha"
                  />
                </div>
              </div>
            </Card>
          </>
        )}

        {/* 8. HISTORIA DE DOMINIO */}
        {tipoPropiedad && (
          <SeccionFormularioRedactar
            titulo="HISTORIA DE DOMINIO"
            onTextoManualChange={setHistoriaManual}
            placeholderTexto="Escriba aquí la historia de dominio del inmueble..."
            renderFormulario={() => (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Título de Adquisición
                    </label>
                    <select
                      value={historiaFormulario.titulo}
                      onChange={(e) =>
                        setHistoriaFormulario({
                          ...historiaFormulario,
                          titulo: e.target.value,
                          tituloOtro:
                            e.target.value === "otro"
                              ? historiaFormulario.tituloOtro
                              : "",
                          // Limpiar campos de causante si no es sucesión
                          nombreCausante:
                            e.target.value === "sucesion"
                              ? historiaFormulario.nombreCausante
                              : "",
                          causanteAdquiridoDe:
                            e.target.value === "sucesion"
                              ? historiaFormulario.causanteAdquiridoDe
                              : "",
                          causanteTitulo:
                            e.target.value === "sucesion"
                              ? historiaFormulario.causanteTitulo
                              : "",
                          causanteTituloOtro:
                            e.target.value === "sucesion"
                              ? historiaFormulario.causanteTituloOtro
                              : "",
                          causanteFechaOtorgamiento:
                            e.target.value === "sucesion"
                              ? historiaFormulario.causanteFechaOtorgamiento
                              : "",
                          causanteNumeroNotaria:
                            e.target.value === "sucesion"
                              ? historiaFormulario.causanteNumeroNotaria
                              : "",
                          causanteCantonNotaria:
                            e.target.value === "sucesion"
                              ? historiaFormulario.causanteCantonNotaria
                              : "",
                          causanteNotario:
                            e.target.value === "sucesion"
                              ? historiaFormulario.causanteNotario
                              : "",
                          causanteFechaInscripcion:
                            e.target.value === "sucesion"
                              ? historiaFormulario.causanteFechaInscripcion
                              : "",
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">Seleccione el título</option>
                      <option value="compraventa">Compraventa</option>
                      <option value="donacion">Donación</option>
                      <option value="sucesion">
                        Sucesión a Causa de Muerte
                      </option>
                      <option value="permuta">Permuta</option>
                      <option value="particion">
                        Partición y Adjudicación
                      </option>
                      <option value="otro">Otro</option>
                    </select>
                  </div>

                  {historiaFormulario.titulo === "otro" && (
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Especifique el título
                      </label>
                      <input
                        type="text"
                        value={historiaFormulario.tituloOtro}
                        onChange={(e) =>
                          setHistoriaFormulario({
                            ...historiaFormulario,
                            tituloOtro: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        placeholder="Ej: Adjudicación judicial"
                      />
                    </div>
                  )}

                  {/* SI ES SUCESIÓN - Mostrar causante */}
                  {historiaFormulario.titulo === "sucesion" && (
                    <div className="col-span-2 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-3">
                        Datos del Causante
                      </h4>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nombre completo del Causante (de quien heredaron)
                          </label>
                          <input
                            type="text"
                            value={historiaFormulario.nombreCausante}
                            onChange={(e) =>
                              setHistoriaFormulario({
                                ...historiaFormulario,
                                nombreCausante: e.target.value.toUpperCase(),
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 uppercase"
                            placeholder="Ej: JUAN CARLOS PÉREZ LÓPEZ"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SI NO ES SUCESIÓN - Campo "Adquirido de" */}
                  {historiaFormulario.titulo &&
                    historiaFormulario.titulo !== "sucesion" && (
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Adquirido de
                        </label>
                        <input
                          type="text"
                          value={historiaFormulario.adquiridoDe}
                          onChange={(e) =>
                            setHistoriaFormulario({
                              ...historiaFormulario,
                              adquiridoDe: e.target.value.toUpperCase(),
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 uppercase"
                          placeholder="Ej: los cónyuges CECILIA IZURIETA y HUGO HURTADO"
                        />
                      </div>
                    )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha de Otorgamiento
                    </label>
                    <input
                      type="date"
                      value={historiaFormulario.fechaOtorgamiento}
                      onChange={(e) =>
                        setHistoriaFormulario({
                          ...historiaFormulario,
                          fechaOtorgamiento: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Número de Notaría
                    </label>
                    <input
                      type="text"
                      value={historiaFormulario.numeroNotaria}
                      onChange={(e) =>
                        setHistoriaFormulario({
                          ...historiaFormulario,
                          numeroNotaria: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      placeholder="Ej: Vigésimo Segunda"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cantón de la Notaría
                    </label>
                    <input
                      type="text"
                      value={historiaFormulario.cantonNotaria}
                      onChange={(e) =>
                        setHistoriaFormulario({
                          ...historiaFormulario,
                          cantonNotaria: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      placeholder="Ej: Quito"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notario/Notaria
                    </label>
                    <input
                      type="text"
                      value={historiaFormulario.notario}
                      onChange={(e) =>
                        setHistoriaFormulario({
                          ...historiaFormulario,
                          notario: e.target.value.toUpperCase(),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 uppercase"
                      placeholder="Ej: ALEX DAVID MEJÍA VITERI"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha de Inscripción
                    </label>
                    <input
                      type="date"
                      value={historiaFormulario.fechaInscripcion}
                      onChange={(e) =>
                        setHistoriaFormulario({
                          ...historiaFormulario,
                          fechaInscripcion: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                {/* ADQUISICIÓN DEL CAUSANTE (solo si es sucesión) */}
                {historiaFormulario.titulo === "sucesion" && (
                  <div className="p-4 bg-amber-50 border-2 border-amber-200 rounded-lg">
                    <h4 className="font-semibold text-amber-900 mb-3">
                      Adquisición del Causante
                    </h4>
                    <p className="text-sm text-amber-700 mb-4">
                      Datos de cómo el causante adquirió originalmente el
                      inmueble
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          El causante lo adquirió de
                        </label>
                        <input
                          type="text"
                          value={historiaFormulario.causanteAdquiridoDe}
                          onChange={(e) =>
                            setHistoriaFormulario({
                              ...historiaFormulario,
                              causanteAdquiridoDe: e.target.value.toUpperCase(),
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 uppercase"
                          placeholder="Ej: los señores MARÍA LÓPEZ y PEDRO SÁNCHEZ"
                        />
                      </div>

                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Título de Adquisición del Causante
                        </label>
                        <select
                          value={historiaFormulario.causanteTitulo}
                          onChange={(e) =>
                            setHistoriaFormulario({
                              ...historiaFormulario,
                              causanteTitulo: e.target.value,
                              causanteTituloOtro:
                                e.target.value === "otro"
                                  ? historiaFormulario.causanteTituloOtro
                                  : "",
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        >
                          <option value="">Seleccione el título</option>
                          <option value="compraventa">Compraventa</option>
                          <option value="donacion">Donación</option>
                          <option value="permuta">Permuta</option>
                          <option value="particion">
                            Partición y Adjudicación
                          </option>
                          <option value="otro">Otro</option>
                        </select>
                      </div>

                      {historiaFormulario.causanteTitulo === "otro" && (
                        <div className="col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Especifique el título
                          </label>
                          <input
                            type="text"
                            value={historiaFormulario.causanteTituloOtro}
                            onChange={(e) =>
                              setHistoriaFormulario({
                                ...historiaFormulario,
                                causanteTituloOtro: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                            placeholder="Ej: Adjudicación judicial"
                          />
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Fecha de Otorgamiento
                        </label>
                        <input
                          type="date"
                          value={historiaFormulario.causanteFechaOtorgamiento}
                          onChange={(e) =>
                            setHistoriaFormulario({
                              ...historiaFormulario,
                              causanteFechaOtorgamiento: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Número de Notaría
                        </label>
                        <input
                          type="text"
                          value={historiaFormulario.causanteNumeroNotaria}
                          onChange={(e) =>
                            setHistoriaFormulario({
                              ...historiaFormulario,
                              causanteNumeroNotaria: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                          placeholder="Ej: Trigésimo Séptima"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Cantón de la Notaría
                        </label>
                        <input
                          type="text"
                          value={historiaFormulario.causanteCantonNotaria}
                          onChange={(e) =>
                            setHistoriaFormulario({
                              ...historiaFormulario,
                              causanteCantonNotaria: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                          placeholder="Ej: Quito"
                        />
                      </div>

                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Notario/Notaria
                        </label>
                        <input
                          type="text"
                          value={historiaFormulario.causanteNotario}
                          onChange={(e) =>
                            setHistoriaFormulario({
                              ...historiaFormulario,
                              causanteNotario: e.target.value.toUpperCase(),
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 uppercase"
                          placeholder="Ej: ROBERTO DUEÑAS"
                        />
                      </div>

                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Fecha de Inscripción
                        </label>
                        <input
                          type="date"
                          value={historiaFormulario.causanteFechaInscripcion}
                          onChange={(e) =>
                            setHistoriaFormulario({
                              ...historiaFormulario,
                              causanteFechaInscripcion: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          />
        )}

        {/* 9. DECLARATORIA DE PROPIEDAD HORIZONTAL */}
        {tipoPropiedad === "horizontal" && (
          <SeccionFormularioRedactar
            titulo="DECLARATORIA DE PROPIEDAD HORIZONTAL"
            onTextoManualChange={setDeclaratoriaManual}
            placeholderTexto="Escriba aquí la declaratoria de propiedad horizontal..."
            renderFormulario={() => (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de Otorgamiento
                  </label>
                  <input
                    type="date"
                    value={declaratoriaFormulario.fechaOtorgamiento}
                    onChange={(e) =>
                      setDeclaratoriaFormulario({
                        ...declaratoriaFormulario,
                        fechaOtorgamiento: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número de Notaría
                  </label>
                  <input
                    type="text"
                    value={declaratoriaFormulario.numeroNotaria}
                    onChange={(e) =>
                      setDeclaratoriaFormulario({
                        ...declaratoriaFormulario,
                        numeroNotaria: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="Ej: Cuadragésima"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cantón de la Notaría
                  </label>
                  <input
                    type="text"
                    value={declaratoriaFormulario.cantonNotaria}
                    onChange={(e) =>
                      setDeclaratoriaFormulario({
                        ...declaratoriaFormulario,
                        cantonNotaria: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="Ej: Quito"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notario/Notaria
                  </label>
                  <input
                    type="text"
                    value={declaratoriaFormulario.notario}
                    onChange={(e) =>
                      setDeclaratoriaFormulario({
                        ...declaratoriaFormulario,
                        notario: e.target.value.toUpperCase(),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 uppercase"
                    placeholder="Ej: PAOLA ANDRADE TORRES"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de Inscripción
                  </label>
                  <input
                    type="date"
                    value={declaratoriaFormulario.fechaInscripcion}
                    onChange={(e) =>
                      setDeclaratoriaFormulario({
                        ...declaratoriaFormulario,
                        fechaInscripcion: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
            )}
          />
        )}
        {/* 10. LINDEROS GENERALES */}
        {tipoPropiedad && (
          <>
            <div className="border-t-2 border-gray-300 pt-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                LINDEROS GENERALES
              </h3>
            </div>

            <Card>
              <div className="space-y-4">
                {/* Norte */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Norte - Metros
                    </label>
                    <input
                      type="text"
                      value={linderosGenerales.norte.metros}
                      onChange={(e) =>
                        setLinderosGenerales({
                          ...linderosGenerales,
                          norte: {
                            ...linderosGenerales.norte,
                            metros: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      placeholder="Ej: 37.84"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Norte - Colindancia
                    </label>
                    <input
                      type="text"
                      value={linderosGenerales.norte.colindancia}
                      onChange={(e) =>
                        setLinderosGenerales({
                          ...linderosGenerales,
                          norte: {
                            ...linderosGenerales.norte,
                            colindancia: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      placeholder="Ej: con propiedad del señor Carlos Vicente Reyes"
                    />
                  </div>
                </div>

                {/* Sur */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sur - Metros
                    </label>
                    <input
                      type="text"
                      value={linderosGenerales.sur.metros}
                      onChange={(e) =>
                        setLinderosGenerales({
                          ...linderosGenerales,
                          sur: {
                            ...linderosGenerales.sur,
                            metros: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      placeholder="Ej: 27.05"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sur - Colindancia
                    </label>
                    <input
                      type="text"
                      value={linderosGenerales.sur.colindancia}
                      onChange={(e) =>
                        setLinderosGenerales({
                          ...linderosGenerales,
                          sur: {
                            ...linderosGenerales.sur,
                            colindancia: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      placeholder="Ej: con propiedad del señor José Ayala"
                    />
                  </div>
                </div>

                {/* Este */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Este - Metros
                    </label>
                    <input
                      type="text"
                      value={linderosGenerales.este.metros}
                      onChange={(e) =>
                        setLinderosGenerales({
                          ...linderosGenerales,
                          este: {
                            ...linderosGenerales.este,
                            metros: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      placeholder="Ej: 35.86"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Este - Colindancia
                    </label>
                    <input
                      type="text"
                      value={linderosGenerales.este.colindancia}
                      onChange={(e) =>
                        setLinderosGenerales({
                          ...linderosGenerales,
                          este: {
                            ...linderosGenerales.este,
                            colindancia: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      placeholder="Ej: con calle interna de la Urbanización"
                    />
                  </div>
                </div>

                {/* Oeste */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Oeste - Metros
                    </label>
                    <input
                      type="text"
                      value={linderosGenerales.oeste.metros}
                      onChange={(e) =>
                        setLinderosGenerales({
                          ...linderosGenerales,
                          oeste: {
                            ...linderosGenerales.oeste,
                            metros: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      placeholder="Ej: 27.28"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Oeste - Colindancia
                    </label>
                    <input
                      type="text"
                      value={linderosGenerales.oeste.colindancia}
                      onChange={(e) =>
                        setLinderosGenerales({
                          ...linderosGenerales,
                          oeste: {
                            ...linderosGenerales.oeste,
                            colindancia: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      placeholder="Ej: con propiedad del señor José Tituaña"
                    />
                  </div>
                </div>

                {/* Superficie */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Superficie Total
                  </label>
                  <input
                    type="text"
                    value={linderosGenerales.superficie}
                    onChange={(e) =>
                      setLinderosGenerales({
                        ...linderosGenerales,
                        superficie: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="Ej: 1000.44"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    En metros cuadrados y decímetros cuadrados
                  </p>
                </div>
              </div>
            </Card>
          </>
        )}
        {/* 11. SUJETO DEL CONTRATO (OPCIONAL - MANUAL) */}
        {tipoPropiedad && (
          <>
            <div className="border-t-4 border-primary-500 pt-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  OBJETO DEL CONTRATO
                </h2>
                <Button
                  variant={modoSujeto === "manual" ? "primary" : "outline"}
                  size="sm"
                  onClick={() =>
                    setModoSujeto(modoSujeto === "auto" ? "manual" : "auto")
                  }
                >
                  {modoSujeto === "auto"
                    ? "Redactar Manualmente"
                    : "Usar Datos del Formulario"}
                </Button>
              </div>
            </div>

            {modoSujeto === "manual" ? (
              <Card>
                <p className="text-sm text-gray-600 mb-3">
                  Redacte manualmente el objeto del contrato:
                </p>
                <RichTextEditor
                  onChange={setSujetoManual}
                  placeholder="Escriba aquí el objeto del contrato..."
                  minHeight="12rem"
                />
              </Card>
            ) : (
              <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="text-blue-600 mt-1">ℹ️</div>
                  <div>
                    <p className="text-sm font-medium text-blue-900">
                      El objeto del contrato se generará automáticamente
                    </p>
                    <p className="text-xs text-blue-700 mt-1">
                      Se usarán los datos de vendedores, compradores y bienes
                      que ingresó arriba. Si necesita personalizar el texto, use
                      el botón "Redactar Manualmente".
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        {/* 12. PRECIO Y FORMA DE PAGO */}
        {tipoPropiedad && (
          <>
            <div className="border-t-4 border-primary-500 pt-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  PRECIO Y FORMA DE PAGO
                </h2>
                <Button
                  variant={modoPrecio === "manual" ? "primary" : "outline"}
                  size="sm"
                  onClick={() =>
                    setModoPrecio(
                      modoPrecio === "formulario" ? "manual" : "formulario",
                    )
                  }
                >
                  {modoPrecio === "formulario"
                    ? "✏️ Redactar Manualmente"
                    : "📋 Usar Formulario"}
                </Button>
              </div>
            </div>

            {modoPrecio === "manual" ? (
              <Card>
                <p className="text-sm text-gray-600 mb-3">
                  Redacte manualmente la cláusula de precio y forma de pago:
                </p>
                <RichTextEditor
                  onChange={setPrecioManual}
                  placeholder="Escriba aquí la cláusula de precio y forma de pago..."
                  minHeight="16rem"
                />
              </Card>
            ) : (
              <>
                {/* PRECIO TOTAL */}
                <Card title="Precio Total">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-gray-700">$</span>
                    <input
                      type="number"
                      value={precioTotal}
                      onChange={(e) => setPrecioTotal(e.target.value)}
                      className="flex-1 text-2xl font-bold px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="340000"
                      step="0.01"
                    />
                    <span className="text-lg text-gray-600">USD</span>
                  </div>
                </Card>

                {/* PARTES DE PAGO */}
                <Card title="Forma de Pago">
                  <div className="space-y-6">
                    {partesPago.map((parte, index) => (
                      <div
                        key={parte.id}
                        className="border-2 border-gray-300 rounded-lg p-6 bg-gray-50"
                      >
                        {/* Header de la parte */}
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-bold text-gray-900">
                            Parte {parte.letra})
                          </h3>
                          {partesPago.length > 1 && (
                            <button
                              onClick={() => handleEliminarPartePago(parte.id)}
                              className="text-red-600 hover:text-red-800 font-medium text-sm"
                            >
                              Eliminar
                            </button>
                          )}
                        </div>

                        <div className="space-y-4">
                          {/* Monto */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Monto de esta parte
                            </label>
                            <div className="flex items-center gap-2">
                              <span className="text-xl font-bold text-gray-700">
                                $
                              </span>
                              <input
                                type="number"
                                value={parte.monto}
                                onChange={(e) =>
                                  handlePartePagoChange(
                                    parte.id,
                                    "monto",
                                    e.target.value,
                                  )
                                }
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                placeholder="70000"
                                step="0.01"
                              />
                            </div>
                          </div>

                          {/* Tipo de Pago */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Tipo de Pago
                            </label>
                            <select
                              value={parte.tipoPago}
                              onChange={(e) =>
                                handlePartePagoChange(
                                  parte.id,
                                  "tipoPago",
                                  e.target.value,
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                            >
                              <option value="unico">Pago Único</option>
                              <option value="cuotas">
                                Pago en Cuotas Iguales
                              </option>
                            </select>
                          </div>

                          {/* SI ES PAGO ÚNICO */}
                          {parte.tipoPago === "unico" && (
                            <>
                              {/* Medio de Pago */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Medio de Pago
                                </label>
                                <select
                                  value={parte.medioPago}
                                  onChange={(e) =>
                                    handlePartePagoChange(
                                      parte.id,
                                      "medioPago",
                                      e.target.value,
                                    )
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                >
                                  <option value="">
                                    Seleccione medio de pago
                                  </option>
                                  <option value="transferencia">
                                    Transferencia Bancaria
                                  </option>
                                  <option value="deposito">
                                    Depósito Bancario
                                  </option>
                                  <option value="cheque">Cheque</option>
                                  <option value="efectivo">Efectivo</option>
                                </select>
                              </div>

                              {/* Si es Cheque - Tipo de Cheque */}
                              {parte.medioPago === "cheque" && (
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tipo de Cheque
                                  </label>
                                  <select
                                    value={parte.tipoCheque}
                                    onChange={(e) =>
                                      handlePartePagoChange(
                                        parte.id,
                                        "tipoCheque",
                                        e.target.value,
                                      )
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                  >
                                    <option value="">Seleccione tipo</option>
                                    <option value="certificado">
                                      Cheque Certificado
                                    </option>
                                    <option value="gerencia">
                                      Cheque de Gerencia
                                    </option>
                                    <option value="vista">
                                      Cheque a la Vista
                                    </option>
                                  </select>
                                </div>
                              )}

                              {/* Momento de Pago */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Momento de Pago
                                </label>
                                <select
                                  value={parte.momentoPago}
                                  onChange={(e) =>
                                    handlePartePagoChange(
                                      parte.id,
                                      "momentoPago",
                                      e.target.value,
                                    )
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                >
                                  <option value="">Seleccione momento</option>
                                  <option value="ya_pagado">
                                    Ya pagado (en forma previa)
                                  </option>
                                  <option value="al_firmar">
                                    Al momento de la firma
                                  </option>
                                  <option value="despues_inscribir">
                                    Después de inscribir en Registro
                                  </option>
                                  <option value="otro">
                                    Otro (especificar)
                                  </option>
                                </select>
                              </div>

                              {/* Si es Otro momento */}
                              {parte.momentoPago === "otro" && (
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Especifique el momento de pago
                                  </label>
                                  <input
                                    type="text"
                                    value={parte.momentoOtro}
                                    onChange={(e) =>
                                      handlePartePagoChange(
                                        parte.id,
                                        "momentoOtro",
                                        e.target.value,
                                      )
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                    placeholder="Ej: dentro de 30 días hábiles"
                                  />
                                </div>
                              )}
                            </>
                          )}

                          {/* SI ES PAGO EN CUOTAS */}
                          {parte.tipoPago === "cuotas" && (
                            <>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Número de Cuotas
                                  </label>
                                  <input
                                    type="number"
                                    value={parte.numeroCuotas}
                                    onChange={(e) =>
                                      handlePartePagoChange(
                                        parte.id,
                                        "numeroCuotas",
                                        e.target.value,
                                      )
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                    placeholder="6"
                                    min="1"
                                  />
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Valor por Cuota (auto-calculado)
                                  </label>
                                  <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg">
                                    <span className="font-bold text-gray-700">
                                      $
                                    </span>
                                    <span className="font-bold text-gray-900">
                                      {parte.valorCuota
                                        ? parte.valorCuota.toFixed(2)
                                        : "0.00"}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Periodicidad
                                </label>
                                <select
                                  value={parte.periodicidad}
                                  onChange={(e) =>
                                    handlePartePagoChange(
                                      parte.id,
                                      "periodicidad",
                                      e.target.value,
                                    )
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                >
                                  <option value="">
                                    Seleccione periodicidad
                                  </option>
                                  <option value="mensual">Mensual</option>
                                  <option value="trimestral">Trimestral</option>
                                  <option value="semestral">Semestral</option>
                                  <option value="anual">Anual</option>
                                  <option value="otro">
                                    Otro (especificar)
                                  </option>
                                </select>
                              </div>

                              {parte.periodicidad === "otro" && (
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Especifique la periodicidad
                                  </label>
                                  <input
                                    type="text"
                                    value={parte.periodicidadOtra}
                                    onChange={(e) =>
                                      handlePartePagoChange(
                                        parte.id,
                                        "periodicidadOtra",
                                        e.target.value,
                                      )
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                    placeholder="Ej: cada 45 días"
                                  />
                                </div>
                              )}

                              {/* Medio de Pago para cuotas */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Medio de Pago
                                </label>
                                <select
                                  value={parte.medioPago}
                                  onChange={(e) =>
                                    handlePartePagoChange(
                                      parte.id,
                                      "medioPago",
                                      e.target.value,
                                    )
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                >
                                  <option value="">
                                    Seleccione medio de pago
                                  </option>
                                  <option value="transferencia">
                                    Transferencia Bancaria
                                  </option>
                                  <option value="deposito">
                                    Depósito Bancario
                                  </option>
                                  <option value="cheque">Cheque</option>
                                  <option value="efectivo">Efectivo</option>
                                </select>
                              </div>

                              {/* Si es Cheque - Tipo */}
                              {parte.medioPago === "cheque" && (
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tipo de Cheque
                                  </label>
                                  <select
                                    value={parte.tipoCheque}
                                    onChange={(e) =>
                                      handlePartePagoChange(
                                        parte.id,
                                        "tipoCheque",
                                        e.target.value,
                                      )
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                  >
                                    <option value="">Seleccione tipo</option>
                                    <option value="certificado">
                                      Cheque Certificado
                                    </option>
                                    <option value="gerencia">
                                      Cheque de Gerencia
                                    </option>
                                    <option value="vista">
                                      Cheque a la Vista
                                    </option>
                                  </select>
                                </div>
                              )}
                            </>
                          )}

                          {/* CRÉDITO BANCARIO (aplica para ambos tipos) */}
                          <div className="border-t pt-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={parte.esCreditoBancario}
                                onChange={(e) =>
                                  handlePartePagoChange(
                                    parte.id,
                                    "esCreditoBancario",
                                    e.target.checked,
                                  )
                                }
                                className="w-4 h-4 text-primary-600 focus:ring-primary-500 rounded"
                              />
                              <span className="text-sm font-medium text-gray-700">
                                Proviene de crédito bancario
                              </span>
                            </label>

                            {parte.esCreditoBancario && (
                              <div className="mt-3 space-y-3 pl-6">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nombre del Banco
                                  </label>
                                  <input
                                    type="text"
                                    value={parte.nombreBanco}
                                    onChange={(e) =>
                                      handlePartePagoChange(
                                        parte.id,
                                        "nombreBanco",
                                        e.target.value.toUpperCase(),
                                      )
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 uppercase"
                                    placeholder="Ej: BANCO DEL PACÍFICO"
                                  />
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Cuenta Destino
                                  </label>
                                  <input
                                    type="text"
                                    value={parte.cuentaDestino}
                                    onChange={(e) =>
                                      handlePartePagoChange(
                                        parte.id,
                                        "cuentaDestino",
                                        e.target.value,
                                      )
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                    placeholder="Ej: a la cuenta que determinen los VENDEDORES"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Resumen y botón agregar */}
                    <div className="border-t-2 border-gray-300 pt-4">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <p className="text-sm text-gray-600">
                            Precio Total: ${precioTotal || "0"}
                          </p>
                          <p className="text-sm text-gray-600">
                            Total asignado: $
                            {partesPago
                              .reduce(
                                (sum, p) => sum + (parseFloat(p.monto) || 0),
                                0,
                              )
                              .toFixed(2)}
                          </p>
                          <p
                            className={`text-lg font-bold ${calcularSaldoRestante() === 0 ? "text-green-600" : "text-orange-600"}`}
                          >
                            Saldo restante: $
                            {calcularSaldoRestante().toFixed(2)}
                          </p>
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleAgregarPartePago}
                        >
                          + Agregar Parte de Pago
                        </Button>
                      </div>

                      {calcularSaldoRestante() !== 0 && precioTotal && (
                        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <p className="text-sm text-yellow-800">
                            ⚠️ La suma de las partes debe ser igual al precio
                            total
                          </p>
                        </div>
                      )}

                      {calcularSaldoRestante() === 0 && precioTotal && (
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-sm text-green-800">
                            ✅ La suma de las partes coincide con el precio
                            total
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </>
            )}
          </>
        )}
        {/* 13. ADMINISTRADOR */}
        {tipoPropiedad === "horizontal" && (
          <Card title="Administrador del Condominio">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={hayAdministrador}
                onChange={(e) => setHayAdministrador(e.target.checked)}
                className="w-5 h-5 text-primary-600 focus:ring-primary-500 rounded"
              />
              <span className="text-sm font-medium text-gray-700">
                ¿El condominio tiene administrador nombrado?
              </span>
            </label>

            {!hayAdministrador && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  ℹ️ Se incluirá en la minuta la declaración juramentada de que
                  no existe administrador nombrado
                </p>
              </div>
            )}

            {hayAdministrador && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  ⚠️ Si existe administrador, deberá incluir la información
                  correspondiente manualmente en el documento final
                </p>
              </div>
            )}
          </Card>
        )}

        {/* 14. DATOS DEL ABOGADO */}
        <div className="border-t-4 border-primary-500 pt-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            DATOS DEL ABOGADO
          </h2>
        </div>

        <Card>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre Completo del Abogado
              </label>
              <input
                type="text"
                value={abogado.nombre}
                onChange={(e) =>
                  setAbogado({
                    ...abogado,
                    nombre: e.target.value.toUpperCase(),
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 uppercase"
                placeholder="Ej: MARIELA VERA SOSA"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Matrícula
                </label>
                <select
                  value={abogado.tipoMatricula}
                  onChange={(e) =>
                    setAbogado({ ...abogado, tipoMatricula: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="cj">Consejo de la Judicatura</option>
                  <option value="colegio">Colegio de Abogados</option>
                </select>
              </div>

              {abogado.tipoMatricula === "colegio" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Provincia del Colegio
                  </label>
                  <input
                    type="text"
                    value={abogado.provincia}
                    onChange={(e) =>
                      setAbogado({ ...abogado, provincia: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="Ej: Pichincha"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número de Matrícula
              </label>
              <input
                type="text"
                value={abogado.numeroMatricula}
                onChange={(e) =>
                  setAbogado({ ...abogado, numeroMatricula: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="Ej: 17-2023-1717"
              />
            </div>
          </div>
        </Card>

        {/* BOTÓN GENERAR MINUTA */}
        <div className="flex justify-end pt-6 pb-12">
          <Button
            variant="primary"
            size="lg"
            onClick={() => alert("Próximamente: Generar Minuta")}
          >
            Generar Minuta
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GenerarMinutaPage;
