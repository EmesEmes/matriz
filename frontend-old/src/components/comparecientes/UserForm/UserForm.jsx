import { useEffect, useState } from "react";
import { MainUserDataSection } from "./MainUserDataSection";
import { PartnerDataSection } from "./PartnerDataSection";
import { apiFetch } from '../../../config/api';
import API_CONFIG from '../../../config/api';
import { transformToSnakeCase, transformToCamelCase } from '../../../utils/transformPartyData';

const UserForm = ({
  documentNumber,
  user,
  onSave,
  onCancel,
  mode = "create",
}) => {
  const [formData, setFormData] = useState({
    documentNumber,
    names: "",
    lastNames: "",
    documentType: "cedula",
    gender: "",
    maritalStatus: "",
    partnerDocumentNumber: "",
    nationality: "",
    birthDate: "",
    email: "",
    phone: "",
    province: "",
    canton: "",
    parroquia: "",
    sector: "",
    mainStreet: "",
    secondaryStreet: "",
    numberStreet: "",
    occupation: "",
    profession: "",
  });

  const [partnerData, setPartnerData] = useState({
    documentNumber: "",
    names: "",
    lastNames: "",
    documentType: "cedula",
    gender: "",
    maritalStatus: "casado",
    partnerDocumentNumber: "",
    nationality: "",
    birthDate: "",
    email: "",
    phone: "",
    province: "",
    canton: "",
    parroquia: "",
    sector: "",
    mainStreet: "",
    secondaryStreet: "",
    numberStreet: "",
    occupation: "",
    profession: "",
  });

  const [showPartner, setShowPartner] = useState(false);
  const [needsConyugue, setNeedsConyugue] = useState(true);
  const [razonExclusionConyugue, setRazonExclusionConyugue] = useState("");
  const [useSameAdress, setUseSameAdress] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        ...user,
        birthDate: user.birthDate?.split("T")[0] || "",
        partnerDocumentNumber:
          user.partner?.documentNumber || user.partnerDocumentNumber || "",
      }));
    }

    if (user?.partner) {
      setPartnerData((prev) => ({
        ...prev,
        ...user.partner,
        birthDate: user.partner.birthDate?.split("T")[0] || "",
      }));
      setShowPartner(true);
    }
  }, [user]);

  useEffect(() => {
    const isMarried = formData?.maritalStatus.toLowerCase() === "casado";

    if (isMarried) {
      setShowPartner(needsConyugue);
      if (needsConyugue) {
        setRazonExclusionConyugue("");
      }
    } else {
      setShowPartner(false);
      setNeedsConyugue(true);
      setRazonExclusionConyugue("");
    }
  }, [formData.maritalStatus, needsConyugue]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newState = { ...prev, [name]: value };

      if (name === "province") {
        newState.canton = "";
        newState.parroquia = "";
      }
      if (name === "canton") {
        newState.parroquia = "";
      }

      return newState;
    });
  };

  const handlePartnerChange = (e) => {
    const { name, value } = e.target;
    setPartnerData((prev) => {
      const newState = { ...prev, [name]: value };

      if (name === "province") {
        newState.canton = "";
        newState.parroquia = "";
      }
      if (name === "canton") {
        newState.parroquia = "";
      }

      return newState;
    });
  };

  const handleSameAdressToggle = (e) => {
    const isChecked = e.target.checked;
    setUseSameAdress(isChecked);

    if (isChecked) {
      setPartnerData((prev) => ({
        ...prev,
        province: formData.province,
        canton: formData.canton,
        parroquia: formData.parroquia,
        sector: formData.sector,
        mainStreet: formData.mainStreet,
        secondaryStreet: formData.secondaryStreet,
        numberStreet: formData.numberStreet,
      }));
    } else {
      setPartnerData((prev) => ({
        ...prev,
        province: "",
        canton: "",
        parroquia: "",
        sector: "",
        mainStreet: "",
        secondaryStreet: "",
        numberStreet: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mode === "edit") {
      onSave && onSave({ ...formData, partner: partnerData });
      return;
    }
    
    try {
      // Transformar a snake_case para el backend
      const transformedData = transformToSnakeCase({
        ...formData,
        partnerDocumentNumber: partnerData.documentNumber?.trim() || null,
      });

      const res = await apiFetch(API_CONFIG.ENDPOINTS.USERS, {
        method: "POST",
        body: JSON.stringify(transformedData),
      });

      const savedUser = await res.json();

      if (res.ok) {
        alert("Usuario guardado con éxito");
        
        // Transformar respuesta de snake_case a camelCase
        const transformedUser = transformToCamelCase(savedUser);
        
        const enrichedUser = {
          ...transformedUser,
          needsConyugue:
            formData.maritalStatus.toLowerCase() === "casado"
              ? needsConyugue
              : false,
          razonExclusionConyugue:
            formData.maritalStatus.toLowerCase() === "casado" && !needsConyugue
              ? razonExclusionConyugue
              : null,
        };
        onSave && onSave(enrichedUser);
      } else {
        console.error('Error del servidor:', savedUser);
        alert(savedUser.detail || savedUser.message || "Error al guardar el usuario");
      }
    } catch (err) {
      console.error(err);
      alert("Error al guardar el usuario");
      return;
    }

    if (showPartner) {
      try {
        // Transformar datos del cónyuge a snake_case
        const transformedPartner = transformToSnakeCase({
          ...partnerData,
          partnerDocumentNumber: formData.documentNumber?.trim() || null,
        });

        const res = await apiFetch(API_CONFIG.ENDPOINTS.USERS, {
          method: "POST",
          body: JSON.stringify(transformedPartner),
        });

        const savedPartner = await res.json();

        if (res.ok) {
          alert("Cónyuge guardado con éxito");
        } else {
          console.error('Error del servidor:', savedPartner);
          alert(savedPartner.detail || savedPartner.message || "Error al guardar el cónyuge");
        }
      } catch (err) {
        console.error(err);
        alert("Error al guardar el cónyuge");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 ">
      <h2 className="text-xl font-bold text-blue-500">
        {mode === "edit" ? "Editar Usuario" : "Crear Nuevo Usuario"}
      </h2>

      <MainUserDataSection formData={formData} handleChange={handleChange} />

      {formData?.maritalStatus.toLowerCase() === "casado" && (
        <div className="border border-blue-200 p-4 rounded-lg bg-blue-50 space-y-4">
          <h3 className="text-lg font-semibold text-blue-700">
            Opciones de Comparecencia del Cónyuge
          </h3>

          <div className="flex gap-2 items-center">
            <input
              type="checkbox"
              id="needs-conyugue-userform"
              checked={needsConyugue}
              onChange={() => setNeedsConyugue(!needsConyugue)}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <label
              htmlFor="needs-conyugue-userform"
              className="text-sm font-medium text-gray-700"
            >
              ¿Cónyuge debe comparecer?
            </label>
          </div>

          {!needsConyugue && (
            <div className="ml-6 space-y-2">
              <label
                htmlFor="razon-exclusion"
                className="block text-sm font-medium text-gray-700"
              >
                Razón de exclusión del cónyuge:
              </label>
              <select
                id="razon-exclusion"
                value={razonExclusionConyugue}
                onChange={(e) => setRazonExclusionConyugue(e.target.value)}
                className="border rounded px-3 py-2 w-full mt-1 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Seleccione una razón</option>
                <option value="disolucion">
                  Disolución de sociedad conyugal
                </option>
                <option value="capitulacion">Capitulación matrimonial</option>
                <option value="adquirido_solo">
                  Bien adquirido soltero/viudo/divorciado
                </option>
              </select>
            </div>
          )}
        </div>
      )}

      {showPartner && (
        <PartnerDataSection
          partnerData={partnerData}
          handlePartnerChange={handlePartnerChange}
          showPartner={showPartner}
          useSameAdress={useSameAdress}
          handleSameAdressToggle={handleSameAdressToggle}
        />
      )}

      <div className="flex justify-end gap-3 mt-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-300 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-400 transition duration-150"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-150"
        >
          {mode === "edit" ? "Actualizar Usuario" : "Guardar Usuario"}
        </button>
      </div>
    </form>
  );
};

export default UserForm;