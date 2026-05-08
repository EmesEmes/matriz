import { useState, useEffect } from "react";
import { useParams } from "react-router";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

const PROVINCIAS_ECUADOR = [
  "Azuay",
  "Bolívar",
  "Cañar",
  "Carchi",
  "Chimborazo",
  "Cotopaxi",
  "El Oro",
  "Esmeraldas",
  "Galápagos",
  "Guayas",
  "Imbabura",
  "Loja",
  "Los Ríos",
  "Manabí",
  "Morona Santiago",
  "Napo",
  "Orellana",
  "Pastaza",
  "Pichincha",
  "Santa Elena",
  "Santo Domingo de los Tsáchilas",
  "Sucumbíos",
  "Tungurahua",
  "Zamora Chinchipe",
];

const estadoInicial = () => ({
  document_type: "cedula",
  document_number: "",
  names: "",
  last_names: "",
  gender: "",
  marital_status: "",
  partner_document_number: "",
  nationality: "ecuatoriana",
  birth_date: "",
  email: "",
  phone: "",
  province: "",
  canton: "",
  parroquia: "",
  sector: "",
  main_street: "",
  secondary_street: "",
  number_street: "",
  occupation: "",
  profession: "",
});

// ============================================
// FORMULARIO POR PERSONA (reutilizable)
// ============================================
const FormularioPersona = ({
  titulo,
  datos,
  onChange,
  errors,
  mostrarEstadoCivil = true,
  mismaDir,
  onToggleMismaDir,
}) => {
  const inputClass = (field) =>
    `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm ${
      errors[field] ? "border-red-400 bg-red-50" : "border-gray-300"
    }`;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
      <h2 className="font-semibold text-gray-800 text-lg border-b pb-2">
        {titulo}
      </h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Documento
          </label>
          <select
            value={datos.document_type}
            onChange={(e) => onChange("document_type", e.target.value)}
            className={inputClass("document_type")}
          >
            <option value="cedula">Cédula</option>
            <option value="pasaporte">Pasaporte</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {datos.document_type === "cedula"
              ? "Número de Cédula"
              : "Número de Pasaporte"}
          </label>
          <input
            type="text"
            value={datos.document_number}
            onChange={(e) => onChange("document_number", e.target.value)}
            className={inputClass("document_number")}
            placeholder={
              datos.document_type === "cedula" ? "0000000000" : "AB123456"
            }
            maxLength={datos.document_type === "cedula" ? 10 : 13}
          />
          {errors.document_number && (
            <p className="text-red-500 text-xs mt-1">
              {errors.document_number}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombres
          </label>
          <input
            type="text"
            value={datos.names}
            onChange={(e) => onChange("names", e.target.value.toUpperCase())}
            className={inputClass("names")}
            placeholder="NOMBRES"
          />
          {errors.names && (
            <p className="text-red-500 text-xs mt-1">{errors.names}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Apellidos
          </label>
          <input
            type="text"
            value={datos.last_names}
            onChange={(e) =>
              onChange("last_names", e.target.value.toUpperCase())
            }
            className={inputClass("last_names")}
            placeholder="APELLIDOS"
          />
          {errors.last_names && (
            <p className="text-red-500 text-xs mt-1">{errors.last_names}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Género
          </label>
          <select
            value={datos.gender}
            onChange={(e) => onChange("gender", e.target.value)}
            className={inputClass("gender")}
          >
            <option value="">Seleccione</option>
            <option value="masculino">Masculino</option>
            <option value="femenino">Femenino</option>
          </select>
          {errors.gender && (
            <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
          )}
        </div>
        {mostrarEstadoCivil && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado Civil
            </label>
            <select
              value={datos.marital_status}
              onChange={(e) => onChange("marital_status", e.target.value)}
              className={inputClass("marital_status")}
            >
              <option value="">Seleccione</option>
              <option value="soltero">Soltero/a</option>
              <option value="casado">Casado/a</option>
              <option value="divorciado">Divorciado/a</option>
              <option value="viudo">Viudo/a</option>
            </select>
            {errors.marital_status && (
              <p className="text-red-500 text-xs mt-1">
                {errors.marital_status}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nacionalidad
          </label>
          <input
            type="text"
            value={datos.nationality}
            onChange={(e) =>
              onChange("nationality", e.target.value.toLowerCase())
            }
            className={inputClass("nationality")}
            placeholder="ecuatoriana"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha de Nacimiento
          </label>
          <input
            type="date"
            value={datos.birth_date}
            onChange={(e) => onChange("birth_date", e.target.value)}
            className={inputClass("birth_date")}
          />
          {errors.birth_date && (
            <p className="text-red-500 text-xs mt-1">{errors.birth_date}</p>
          )}
        </div>
      </div>

      <h3 className="font-medium text-gray-700 pt-2 border-t">Contacto</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Correo Electrónico
          </label>
          <input
            type="email"
            value={datos.email}
            onChange={(e) => onChange("email", e.target.value)}
            className={inputClass("email")}
            placeholder="correo@ejemplo.com"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Teléfono Celular
          </label>
          <input
            type="text"
            value={datos.phone}
            onChange={(e) => onChange("phone", e.target.value)}
            className={inputClass("phone")}
            placeholder="0987654321"
            maxLength={10}
          />
          {errors.phone && (
            <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
          )}
        </div>
      </div>

      <h3 className="font-medium text-gray-700 pt-2 border-t">Dirección</h3>

      {/* Checkbox "misma dirección" — solo para el cónyuge */}
      {onToggleMismaDir !== undefined && (
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={mismaDir}
            onChange={onToggleMismaDir}
            className="w-4 h-4 rounded text-blue-600"
          />
          <span className="text-sm text-gray-700">
            Misma dirección que el titular
          </span>
        </label>
      )}

      {/* Campos de dirección — ocultos si comparte dirección */}
      {!onToggleMismaDir || !mismaDir ? (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Provincia
            </label>
            <select
              value={datos.province}
              onChange={(e) => onChange("province", e.target.value)}
              className={inputClass("province")}
            >
              <option value="">Seleccione</option>
              {PROVINCIAS_ECUADOR.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            {errors.province && (
              <p className="text-red-500 text-xs mt-1">{errors.province}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cantón
            </label>
            <input
              type="text"
              value={datos.canton}
              onChange={(e) => onChange("canton", e.target.value)}
              className={inputClass("canton")}
              placeholder="Ej: Quito"
            />
            {errors.canton && (
              <p className="text-red-500 text-xs mt-1">{errors.canton}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Parroquia
            </label>
            <input
              type="text"
              value={datos.parroquia}
              onChange={(e) => onChange("parroquia", e.target.value)}
              className={inputClass("parroquia")}
              placeholder="Ej: Nayón"
            />
            {errors.parroquia && (
              <p className="text-red-500 text-xs mt-1">{errors.parroquia}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sector / Urbanización (opcional)
            </label>
            <input
              type="text"
              value={datos.sector}
              onChange={(e) => onChange("sector", e.target.value)}
              className={inputClass("sector")}
              placeholder="Ej: Valle Colores"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Calle Principal
            </label>
            <input
              type="text"
              value={datos.main_street}
              onChange={(e) => onChange("main_street", e.target.value)}
              className={inputClass("main_street")}
              placeholder="Ej: Av. Los Eucaliptos"
            />
            {errors.main_street && (
              <p className="text-red-500 text-xs mt-1">{errors.main_street}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Calle Secundaria
            </label>
            <input
              type="text"
              value={datos.secondary_street}
              onChange={(e) => onChange("secondary_street", e.target.value)}
              className={inputClass("secondary_street")}
              placeholder="Ej: Calle Eugenio Espejo"
            />
            {errors.secondary_street && (
              <p className="text-red-500 text-xs mt-1">
                {errors.secondary_street}
              </p>
            )}
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Número / Referencia
            </label>
            <input
              type="text"
              value={datos.number_street}
              onChange={(e) => onChange("number_street", e.target.value)}
              className={inputClass("number_street")}
              placeholder="Ej: E4-23, Casa 2"
            />
            {errors.number_street && (
              <p className="text-red-500 text-xs mt-1">
                {errors.number_street}
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-sm text-gray-500">
            ✓ Usando la misma dirección del titular
          </p>
        </div>
      )}

      <h3 className="font-medium text-gray-700 pt-2 border-t">Ocupación</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ocupación
          </label>
          <input
            type="text"
            value={datos.occupation}
            onChange={(e) => onChange("occupation", e.target.value)}
            className={inputClass("occupation")}
            placeholder="Ej: comerciante"
          />
          {errors.occupation && (
            <p className="text-red-500 text-xs mt-1">{errors.occupation}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Profesión (opcional)
          </label>
          <input
            type="text"
            value={datos.profession}
            onChange={(e) => onChange("profession", e.target.value)}
            className={inputClass("profession")}
            placeholder="Ej: Ingeniero Civil"
          />
        </div>
      </div>
    </div>
  );
};

// ============================================
// VALIDACIÓN
// ============================================
const validarPersona = (datos, prefijo = "") => {
  const e = {};
  if (!datos.document_number) e[`${prefijo}document_number`] = "Requerido";
  else if (
    datos.document_type === "cedula" &&
    !/^\d{10}$/.test(datos.document_number)
  )
    e[`${prefijo}document_number`] = "Cédula debe tener 10 dígitos";
  if (!datos.names.trim()) e[`${prefijo}names`] = "Requerido";
  if (!datos.last_names.trim()) e[`${prefijo}last_names`] = "Requerido";
  if (!datos.gender) e[`${prefijo}gender`] = "Requerido";
  if (!datos.birth_date) e[`${prefijo}birth_date`] = "Requerido";
  if (!datos.email) e[`${prefijo}email`] = "Requerido";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.email))
    e[`${prefijo}email`] = "Email inválido";
  if (!datos.phone) e[`${prefijo}phone`] = "Requerido";
  if (!datos.province) e[`${prefijo}province`] = "Requerido";
  if (!datos.canton) e[`${prefijo}canton`] = "Requerido";
  if (!datos.parroquia) e[`${prefijo}parroquia`] = "Requerido";
  if (!datos.main_street) e[`${prefijo}main_street`] = "Requerido";
  if (!datos.secondary_street) e[`${prefijo}secondary_street`] = "Requerido";
  if (!datos.number_street) e[`${prefijo}number_street`] = "Requerido";
  if (!datos.occupation) e[`${prefijo}occupation`] = "Requerido";
  return e;
};

// ============================================
// PÁGINA PRINCIPAL
// ============================================
const RegistroClientePage = () => {
  const { token } = useParams();

  const [tokenValido, setTokenValido] = useState(null);
  const [titular, setTitular] = useState(estadoInicial());
  const [conyugue, setConyugue] = useState(estadoInicial());
  const [mismaDir, setMismaDir] = useState(true);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [aceptaPrivacidad, setAceptaPrivacidad] = useState(false);

  const esCasado = titular.marital_status === "casado";

  // Sincronizar dirección del cónyuge con la del titular cuando mismaDir = true
  useEffect(() => {
    if (mismaDir && esCasado) {
      setConyugue((prev) => ({
        ...prev,
        province: titular.province,
        canton: titular.canton,
        parroquia: titular.parroquia,
        sector: titular.sector,
        main_street: titular.main_street,
        secondary_street: titular.secondary_street,
        number_street: titular.number_street,
      }));
    }
  }, [
    mismaDir,
    esCasado,
    titular.province,
    titular.canton,
    titular.parroquia,
    titular.sector,
    titular.main_street,
    titular.secondary_street,
    titular.number_street,
  ]);

  useEffect(() => {
    const verificar = async () => {
      try {
        const res = await fetch(
          `${API_BASE}/api/public/registro/verificar/${token}`,
        );
        const data = await res.json();
        setTokenValido(data.valido);
      } catch {
        setTokenValido(false);
      }
    };
    verificar();
  }, [token]);

  const handleTitularChange = (field, value) => {
    setTitular((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleConyugueChange = (field, value) => {
    setConyugue((prev) => ({ ...prev, [field]: value }));
    if (errors[`c_${field}`])
      setErrors((prev) => ({ ...prev, [`c_${field}`]: "" }));
  };

  const validar = () => {
    let e = {};
    e = { ...e, ...validarPersona(titular) };
    if (!titular.marital_status) e.marital_status = "Requerido";
    if (esCasado) {
      const erroresConyugue = validarPersona(conyugue, "c_");
      // Si comparte dirección no validar esos campos
      if (mismaDir) {
        [
          "c_province",
          "c_canton",
          "c_parroquia",
          "c_main_street",
          "c_secondary_street",
          "c_number_street",
        ].forEach((k) => delete erroresConyugue[k]);
      }
      e = { ...e, ...erroresConyugue };
      if (
        titular.document_number &&
        conyugue.document_number &&
        titular.document_number === conyugue.document_number
      ) {
        e.c_document_number =
          "La cédula del cónyuge no puede ser igual a la del titular";
      }
    }
    if (!aceptaPrivacidad)
      e.privacidad = "Debe aceptar el tratamiento de sus datos";
    return e;
  };

  const handleSubmit = async () => {
    const e = validar();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        titular: {
          ...titular,
          partner_document_number: esCasado ? conyugue.document_number : null,
        },
        conyugue: esCasado
          ? {
              ...conyugue,
              marital_status: "casado",
              partner_document_number: titular.document_number,
            }
          : null,
      };

      const res = await fetch(`${API_BASE}/api/public/registro/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setEnviado(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        const data = await res.json();
        setErrors({
          general:
            data.detail || "Error al guardar los datos. Intente nuevamente.",
        });
      }
    } catch {
      setErrors({ general: "Error de conexión. Intente nuevamente." });
    } finally {
      setLoading(false);
    }
  };

  // ---- ESTADOS DE PANTALLA ----

  if (tokenValido === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Verificando enlace...</p>
        </div>
      </div>
    );
  }

  if (!tokenValido) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white rounded-xl shadow-md p-8 max-w-md w-full text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">
            Enlace no válido
          </h1>
          <p className="text-gray-600">
            Este enlace no es válido, ya fue utilizado o ha expirado. Por favor
            contacte a la notaría para obtener un nuevo enlace.
          </p>
        </div>
      </div>
    );
  }

  if (enviado) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white rounded-xl shadow-md p-8 max-w-md w-full text-center">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">
            ¡Datos registrados!
          </h1>
          <p className="text-gray-600">
            Sus datos han sido guardados correctamente. Al momento de su cita,
            el personal de la notaría ya tendrá su información disponible.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Registro de Datos
          </h1>
          <p className="text-gray-600 mt-1">
            Complete sus datos para agilizar su trámite notarial
          </p>
        </div>

        {errors.general && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {errors.general}
          </div>
        )}

        {Object.keys(errors).filter(
          (k) => k !== "general" && k !== "privacidad",
        ).length > 0 && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            Por favor corrija los campos marcados en rojo antes de continuar.
          </div>
        )}

        <div className="space-y-6">
          {/* TITULAR */}
          <FormularioPersona
            titulo="Sus datos personales"
            datos={titular}
            onChange={handleTitularChange}
            errors={errors}
            mostrarEstadoCivil={true}
          />

          {/* CÓNYUGE */}
          {esCasado && (
            <div className="border-2 border-blue-200 rounded-xl overflow-hidden">
              <div className="bg-blue-50 px-6 py-3 border-b border-blue-200">
                <p className="text-sm font-medium text-blue-800">
                  👫 Como está casado/a, necesitamos también los datos de su
                  cónyuge
                </p>
              </div>
              <FormularioPersona
                titulo="Datos del cónyuge"
                datos={conyugue}
                onChange={handleConyugueChange}
                errors={Object.fromEntries(
                  Object.entries(errors)
                    .filter(([k]) => k.startsWith("c_"))
                    .map(([k, v]) => [k.replace("c_", ""), v]),
                )}
                mostrarEstadoCivil={false}
                mismaDir={mismaDir}
                onToggleMismaDir={() => setMismaDir((prev) => !prev)}
              />
            </div>
          )}

          {/* PRIVACIDAD */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h2 className="font-semibold text-blue-900 mb-3">
              Protección de Datos Personales
            </h2>
            <p className="text-sm text-blue-800 mb-4">
              Sus datos personales serán tratados por la notaría exclusivamente
              para la celebración del instrumento público solicitado, en
              cumplimiento de la{" "}
              <strong>
                Ley Orgánica de Protección de Datos Personales del Ecuador
                (LOPDP)
              </strong>
              . Usted tiene derecho a acceder, rectificar, cancelar u oponerse
              al tratamiento de sus datos contactando directamente a la notaría.
            </p>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={aceptaPrivacidad}
                onChange={(e) => {
                  setAceptaPrivacidad(e.target.checked);
                  if (errors.privacidad)
                    setErrors((prev) => ({ ...prev, privacidad: "" }));
                }}
                className="w-4 h-4 mt-0.5 rounded text-blue-600"
              />
              <span className="text-sm text-blue-800">
                Acepto el tratamiento de mis datos personales para los fines
                notariales descritos.
              </span>
            </label>
            {errors.privacidad && (
              <p className="text-red-500 text-xs mt-2">{errors.privacidad}</p>
            )}
          </div>

          {/* BOTÓN */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Guardando...
              </>
            ) : (
              "Enviar mis datos"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegistroClientePage;
