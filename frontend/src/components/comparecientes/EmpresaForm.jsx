import { useState, useEffect } from "react";
import { Button, FormField, Card } from "../shared";
import { getProvincias, getCantones } from "../../utils/datosEcuador";
import { apiFetch } from "../../config/api";
import API_CONFIG from "../../config/api";
import { useToast } from "../../hooks/useToast";
import { Save, X } from "lucide-react";

const EmpresaForm = ({ initialData = null, onSuccess, onCancel }) => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [cantones, setCantones] = useState([]);
  const [repCantones, setRepCantones] = useState([]);

  const [formData, setFormData] = useState({
    // Empresa
    ruc: "",
    razonSocial: "",
    email: "",
    phone: "",
    province: "",
    canton: "",
    parroquia: "",
    sector: "",
    mainStreet: "",
    secondaryStreet: "",
    numberStreet: "",
    // Representante legal
    repDocumentType: "cedula",
    repDocumentNumber: "",
    repNames: "",
    repLastNames: "",
    repGender: "",
    repNationality: "ecuatoriana",
    repBirthDate: "",
    repEmail: "",
    repPhone: "",
    repProvince: "",
    repCanton: "",
    repParroquia: "",
    repSector: "",
    repMainStreet: "",
    repSecondaryStreet: "",
    repNumberStreet: "",
    repOccupation: "",
    repProfession: "",
    repPosition: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ruc: initialData.ruc || "",
        razonSocial: initialData.razonSocial || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
        province: initialData.province || "",
        canton: initialData.canton || "",
        parroquia: initialData.parroquia || "",
        sector: initialData.sector || "",
        mainStreet: initialData.mainStreet || "",
        secondaryStreet: initialData.secondaryStreet || "",
        numberStreet: initialData.numberStreet || "",
        repDocumentType: initialData.repDocumentType || "cedula",
        repDocumentNumber: initialData.repDocumentNumber || "",
        repNames: initialData.repNames || "",
        repLastNames: initialData.repLastNames || "",
        repGender: initialData.repGender || "",
        repNationality: initialData.repNationality || "ecuatoriana",
        repBirthDate: initialData.repBirthDate || "",
        repEmail: initialData.repEmail || "",
        repPhone: initialData.repPhone || "",
        repProvince: initialData.repProvince || "",
        repCanton: initialData.repCanton || "",
        repParroquia: initialData.repParroquia || "",
        repSector: initialData.repSector || "",
        repMainStreet: initialData.repMainStreet || "",
        repSecondaryStreet: initialData.repSecondaryStreet || "",
        repNumberStreet: initialData.repNumberStreet || "",
        repOccupation: initialData.repOccupation || "",
        repProfession: initialData.repProfession || "",
        repPosition: initialData.repPosition || "",
      });
    }
  }, [initialData]);

  // Cantones empresa
  useEffect(() => {
    if (formData.province) {
      const newCantones = getCantones(formData.province);
      setCantones(newCantones);
      setFormData((prev) => ({
        ...prev,
        canton: newCantones.includes(prev.canton) ? prev.canton : "",
      }));
    } else {
      setCantones([]);
      setFormData((prev) => ({ ...prev, canton: "" }));
    }
  }, [formData.province]);

  // Cantones representante
  useEffect(() => {
    if (formData.repProvince) {
      const newCantones = getCantones(formData.repProvince);
      setRepCantones(newCantones);
      setFormData((prev) => ({
        ...prev,
        repCanton: newCantones.includes(prev.repCanton) ? prev.repCanton : "",
      }));
    } else {
      setRepCantones([]);
      setFormData((prev) => ({ ...prev, repCanton: "" }));
    }
  }, [formData.repProvince]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const required = [
      ["ruc", "El RUC es requerido"],
      ["razonSocial", "La razón social es requerida"],
      ["email", "El correo es requerido"],
      ["phone", "El teléfono es requerido"],
      ["province", "La provincia es requerida"],
      ["canton", "El cantón es requerido"],
      ["parroquia", "La parroquia es requerida"],
      ["sector", "El sector es requerido"],
      ["mainStreet", "La calle principal es requerida"],
      ["secondaryStreet", "La calle secundaria es requerida"],
      ["numberStreet", "El número es requerido"],
      ["repDocumentNumber", "La cédula del representante es requerida"],
      ["repNames", "Los nombres del representante son requeridos"],
      ["repLastNames", "Los apellidos del representante son requeridos"],
      ["repGender", "El género del representante es requerido"],
      ["repNationality", "La nacionalidad del representante es requerida"],
      ["repBirthDate", "La fecha de nacimiento del representante es requerida"],
      ["repEmail", "El correo del representante es requerido"],
      ["repPhone", "El teléfono del representante es requerido"],
      ["repProvince", "La provincia del representante es requerida"],
      ["repCanton", "El cantón del representante es requerido"],
      ["repParroquia", "La parroquia del representante es requerida"],
      ["repSector", "El sector del representante es requerido"],
      ["repMainStreet", "La calle principal del representante es requerida"],
      [
        "repSecondaryStreet",
        "La calle secundaria del representante es requerida",
      ],
      ["repNumberStreet", "El número del representante es requerido"],
      ["repOccupation", "La ocupación del representante es requerida"],
      ["repPosition", "El cargo del representante es requerido"],
    ];

    required.forEach(([field, msg]) => {
      if (!formData[field]?.trim()) newErrors[field] = msg;
    });

    // Validar RUC
    if (
      formData.ruc &&
      (!/^\d{13}$/.test(formData.ruc) || !formData.ruc.endsWith("001"))
    ) {
      newErrors.ruc = "RUC inválido: debe tener 13 dígitos y terminar en 001";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Por favor corrija los errores en el formulario");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ruc: formData.ruc,
        razon_social: formData.razonSocial,
        email: formData.email,
        phone: formData.phone,
        province: formData.province,
        canton: formData.canton,
        parroquia: formData.parroquia,
        sector: formData.sector,
        main_street: formData.mainStreet,
        secondary_street: formData.secondaryStreet,
        number_street: formData.numberStreet,
        rep_document_type: formData.repDocumentType,
        rep_document_number: formData.repDocumentNumber,
        rep_names: formData.repNames,
        rep_last_names: formData.repLastNames,
        rep_gender: formData.repGender,
        rep_nationality: formData.repNationality,
        rep_birth_date: formData.repBirthDate,
        rep_email: formData.repEmail,
        rep_phone: formData.repPhone,
        rep_province: formData.repProvince,
        rep_canton: formData.repCanton,
        rep_parroquia: formData.repParroquia,
        rep_sector: formData.repSector,
        rep_main_street: formData.repMainStreet,
        rep_secondary_street: formData.repSecondaryStreet,
        rep_number_street: formData.repNumberStreet,
        rep_occupation: formData.repOccupation,
        rep_profession: formData.repProfession || null,
        rep_position: formData.repPosition,
      };

      const url = initialData
        ? `${API_CONFIG.ENDPOINTS.COMPANIES}/${formData.ruc}`
        : API_CONFIG.ENDPOINTS.COMPANIES;

      const response = await apiFetch(url, {
        method: initialData ? "PUT" : "POST",
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(
          initialData ? "Empresa actualizada" : "Empresa registrada",
        );
        if (onSuccess) onSuccess(data);
      } else {
        throw new Error(data.detail || "Error al guardar empresa");
      }
    } catch (error) {
      toast.error(error.message || "Error al guardar empresa");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* DATOS DE LA EMPRESA */}
      <Card title="Datos de la Empresa">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="RUC" required error={errors.ruc}>
            <input
              type="text"
              name="ruc"
              value={formData.ruc}
              onChange={handleChange}
              className="input-field"
              maxLength="13"
              placeholder="1790012345001"
              disabled={!!initialData || loading}
            />
          </FormField>

          <FormField label="Razón Social" required error={errors.razonSocial}>
            <input
              type="text"
              name="razonSocial"
              value={formData.razonSocial}
              onChange={handleChange}
              className="input-field"
              placeholder="Empresa XYZ S.A."
              disabled={loading}
            />
          </FormField>

          <FormField label="Correo electrónico" required error={errors.email}>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input-field"
              placeholder="info@empresa.com"
              disabled={loading}
            />
          </FormField>

          <FormField label="Teléfono" required error={errors.phone}>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="input-field"
              placeholder="022345678"
              disabled={loading}
            />
          </FormField>
        </div>
      </Card>

      {/* DIRECCIÓN EMPRESA */}
      <Card title="Dirección de la Empresa">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Provincia" required error={errors.province}>
            <select
              name="province"
              value={formData.province}
              onChange={handleChange}
              className="input-field"
              disabled={loading}
            >
              <option value="">Seleccione</option>
              {getProvincias().map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Cantón" required error={errors.canton}>
            <select
              name="canton"
              value={formData.canton}
              onChange={handleChange}
              className="input-field"
              disabled={!formData.province || loading}
            >
              <option value="">Seleccione</option>
              {cantones.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Parroquia" required error={errors.parroquia}>
            <input
              type="text"
              name="parroquia"
              value={formData.parroquia}
              onChange={handleChange}
              className="input-field"
              disabled={loading}
            />
          </FormField>

          <FormField label="Sector" required error={errors.sector}>
            <input
              type="text"
              name="sector"
              value={formData.sector}
              onChange={handleChange}
              className="input-field"
              disabled={loading}
            />
          </FormField>

          <FormField label="Calle Principal" required error={errors.mainStreet}>
            <input
              type="text"
              name="mainStreet"
              value={formData.mainStreet}
              onChange={handleChange}
              className="input-field"
              disabled={loading}
            />
          </FormField>

          <FormField
            label="Calle Secundaria"
            required
            error={errors.secondaryStreet}
          >
            <input
              type="text"
              name="secondaryStreet"
              value={formData.secondaryStreet}
              onChange={handleChange}
              className="input-field"
              disabled={loading}
            />
          </FormField>

          <FormField label="Número" required error={errors.numberStreet}>
            <input
              type="text"
              name="numberStreet"
              value={formData.numberStreet}
              onChange={handleChange}
              className="input-field"
              placeholder="N24-660"
              disabled={loading}
            />
          </FormField>
        </div>
      </Card>

      {/* REPRESENTANTE LEGAL */}
      <Card title="Representante Legal">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Tipo de Documento" required>
            <select
              name="repDocumentType"
              value={formData.repDocumentType}
              onChange={handleChange}
              className="input-field"
              disabled={loading}
            >
              <option value="cedula">Cédula</option>
              <option value="pasaporte">Pasaporte</option>
            </select>
          </FormField>

          <FormField
            label="Número de Documento"
            required
            error={errors.repDocumentNumber}
          >
            <input
              type="text"
              name="repDocumentNumber"
              value={formData.repDocumentNumber}
              onChange={handleChange}
              className="input-field"
              maxLength="13"
              disabled={loading}
            />
          </FormField>

          <FormField label="Nombres" required error={errors.repNames}>
            <input
              type="text"
              name="repNames"
              value={formData.repNames}
              onChange={handleChange}
              className="input-field"
              disabled={loading}
            />
          </FormField>

          <FormField label="Apellidos" required error={errors.repLastNames}>
            <input
              type="text"
              name="repLastNames"
              value={formData.repLastNames}
              onChange={handleChange}
              className="input-field"
              disabled={loading}
            />
          </FormField>

          <FormField label="Género" required error={errors.repGender}>
            <select
              name="repGender"
              value={formData.repGender}
              onChange={handleChange}
              className="input-field"
              disabled={loading}
            >
              <option value="">Seleccione</option>
              <option value="masculino">Masculino</option>
              <option value="femenino">Femenino</option>
            </select>
          </FormField>

          <FormField
            label="Nacionalidad"
            required
            error={errors.repNationality}
          >
            <input
              type="text"
              name="repNationality"
              value={formData.repNationality}
              onChange={handleChange}
              className="input-field"
              disabled={loading}
            />
          </FormField>

          <FormField
            label="Fecha de Nacimiento"
            required
            error={errors.repBirthDate}
          >
            <input
              type="date"
              name="repBirthDate"
              value={formData.repBirthDate}
              onChange={handleChange}
              className="input-field"
              disabled={loading}
            />
          </FormField>

          <FormField label="Cargo" required error={errors.repPosition}>
            <input
              type="text"
              name="repPosition"
              value={formData.repPosition}
              onChange={handleChange}
              className="input-field"
              placeholder="Ej: Gerente General"
              disabled={loading}
            />
          </FormField>

          <FormField
            label="Correo electrónico"
            required
            error={errors.repEmail}
          >
            <input
              type="email"
              name="repEmail"
              value={formData.repEmail}
              onChange={handleChange}
              className="input-field"
              disabled={loading}
            />
          </FormField>

          <FormField label="Teléfono" required error={errors.repPhone}>
            <input
              type="tel"
              name="repPhone"
              value={formData.repPhone}
              onChange={handleChange}
              className="input-field"
              disabled={loading}
            />
          </FormField>

          <FormField label="Ocupación" required error={errors.repOccupation}>
            <input
              type="text"
              name="repOccupation"
              value={formData.repOccupation}
              onChange={handleChange}
              className="input-field"
              disabled={loading}
            />
          </FormField>

          <FormField label="Profesión">
            <input
              type="text"
              name="repProfession"
              value={formData.repProfession}
              onChange={handleChange}
              className="input-field"
              disabled={loading}
            />
          </FormField>
        </div>
      </Card>

      {/* DIRECCIÓN REPRESENTANTE */}
      <Card title="Dirección del Representante Legal">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Provincia" required error={errors.repProvince}>
            <select
              name="repProvince"
              value={formData.repProvince}
              onChange={handleChange}
              className="input-field"
              disabled={loading}
            >
              <option value="">Seleccione</option>
              {getProvincias().map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Cantón" required error={errors.repCanton}>
            <select
              name="repCanton"
              value={formData.repCanton}
              onChange={handleChange}
              className="input-field"
              disabled={!formData.repProvince || loading}
            >
              <option value="">Seleccione</option>
              {repCantones.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Parroquia" required error={errors.repParroquia}>
            <input
              type="text"
              name="repParroquia"
              value={formData.repParroquia}
              onChange={handleChange}
              className="input-field"
              disabled={loading}
            />
          </FormField>

          <FormField label="Sector" required error={errors.repSector}>
            <input
              type="text"
              name="repSector"
              value={formData.repSector}
              onChange={handleChange}
              className="input-field"
              disabled={loading}
            />
          </FormField>

          <FormField
            label="Calle Principal"
            required
            error={errors.repMainStreet}
          >
            <input
              type="text"
              name="repMainStreet"
              value={formData.repMainStreet}
              onChange={handleChange}
              className="input-field"
              disabled={loading}
            />
          </FormField>

          <FormField
            label="Calle Secundaria"
            required
            error={errors.repSecondaryStreet}
          >
            <input
              type="text"
              name="repSecondaryStreet"
              value={formData.repSecondaryStreet}
              onChange={handleChange}
              className="input-field"
              disabled={loading}
            />
          </FormField>

          <FormField label="Número" required error={errors.repNumberStreet}>
            <input
              type="text"
              name="repNumberStreet"
              value={formData.repNumberStreet}
              onChange={handleChange}
              className="input-field"
              placeholder="N24-660"
              disabled={loading}
            />
          </FormField>
        </div>
      </Card>

      {/* BOTONES */}
      <div className="flex justify-end gap-3">
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={loading}
            icon={<X className="w-5 h-5" />}
          >
            Cancelar
          </Button>
        )}
        <Button
          type="submit"
          variant="success"
          loading={loading}
          disabled={loading}
          icon={<Save className="w-5 h-5" />}
        >
          {initialData ? "Actualizar" : "Guardar"} Empresa
        </Button>
      </div>
    </form>
  );
};

export default EmpresaForm;
