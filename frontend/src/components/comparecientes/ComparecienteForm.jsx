import { useState, useEffect } from 'react';
import { Button, FormField, Card } from '../shared';
import { getProvincias, getCantones } from '../../utils/datosEcuador';
import { validarCedula } from '../../utils/validarCedula';
import { transformToSnakeCase } from '../../utils/transformPartyData';
import { apiFetch } from '../../config/api';
import API_CONFIG from '../../config/api';
import { useToast } from '../../hooks/useToast';
import { Save, X } from 'lucide-react';

const ComparecienteForm = ({ initialData = null, onSuccess, onCancel }) => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [showPartnerForm, setShowPartnerForm] = useState(false);
  const [errors, setErrors] = useState({});
  const [cantones, setCantones] = useState([]);
  const [partnerCantones, setPartnerCantones] = useState([]);
  
  const [formData, setFormData] = useState({
    documentNumber: '',
    names: '',
    lastNames: '',
    documentType: 'cedula',
    gender: '',
    maritalStatus: '',
    nationality: 'ecuatoriana',
    birthDate: '',
    email: '',
    phone: '',
    province: '',
    canton: '',
    parroquia: '',
    sector: '',
    mainStreet: '',
    secondaryStreet: '',
    numberStreet: '',
    occupation: '',
    profession: '',
    partnerDocumentNumber: '',
    partnerNames: '',
    partnerLastNames: '',
    partnerGender: '',
    partnerNationality: 'ecuatoriana',
    partnerBirthDate: '',
    partnerEmail: '',
    partnerPhone: '',
    partnerOccupation: '',
    partnerProfession: '',
    partnerSameAddress: true,
    partnerProvince: '',
    partnerCanton: '',
    partnerParroquia: '',
    partnerSector: '',
    partnerMainStreet: '',
    partnerSecondaryStreet: '',
    partnerNumberStreet: ''
  });

  // Cargar datos iniciales - Los datos ya vienen en camelCase
  useEffect(() => {
    if (initialData) {
      const data = initialData;
      
      const newFormData = {
        documentNumber: data.documentNumber || '',
        names: data.names || '',
        lastNames: data.lastNames || '',
        documentType: data.documentType || 'cedula',
        gender: data.gender || '',
        maritalStatus: data.maritalStatus || '',
        nationality: data.nationality || 'ecuatoriana',
        birthDate: data.birthDate || '',
        email: data.email || '',
        phone: data.phone || '',
        province: data.province || '',
        canton: data.canton || '',
        parroquia: data.parroquia || '',
        sector: data.sector || '',
        mainStreet: data.mainStreet || '',
        secondaryStreet: data.secondaryStreet || '',
        numberStreet: data.numberStreet || '',
        occupation: data.occupation || '',
        profession: data.profession || '',
        partnerDocumentNumber: data.partner?.documentNumber || '',
        partnerNames: data.partner?.names || '',
        partnerLastNames: data.partner?.lastNames || '',
        partnerGender: data.partner?.gender || '',
        partnerNationality: data.partner?.nationality || 'ecuatoriana',
        partnerBirthDate: data.partner?.birthDate || '',
        partnerEmail: data.partner?.email || '',
        partnerPhone: data.partner?.phone || '',
        partnerOccupation: data.partner?.occupation || '',
        partnerProfession: data.partner?.profession || '',
        partnerSameAddress: false,
        partnerProvince: data.partner?.province || '',
        partnerCanton: data.partner?.canton || '',
        partnerParroquia: data.partner?.parroquia || '',
        partnerSector: data.partner?.sector || '',
        partnerMainStreet: data.partner?.mainStreet || '',
        partnerSecondaryStreet: data.partner?.secondaryStreet || '',
        partnerNumberStreet: data.partner?.numberStreet || ''
      };

      setFormData(newFormData);
      
      if (data.partner) {
        setShowPartnerForm(true);
      }
    }
  }, [initialData]);

  // Actualizar cantones cuando cambia la provincia
  useEffect(() => {
    if (formData.province) {
      const newCantones = getCantones(formData.province);
      setCantones(newCantones);
      
      if (!newCantones.includes(formData.canton)) {
        setFormData(prev => ({ ...prev, canton: '' }));
      }
    } else {
      setCantones([]);
      setFormData(prev => ({ ...prev, canton: '' }));
    }
  }, [formData.province]);

  // Actualizar cantones del partner
  useEffect(() => {
    if (formData.partnerProvince) {
      const newCantones = getCantones(formData.partnerProvince);
      setPartnerCantones(newCantones);
      
      if (!newCantones.includes(formData.partnerCanton)) {
        setFormData(prev => ({ ...prev, partnerCanton: '' }));
      }
    } else {
      setPartnerCantones([]);
      setFormData(prev => ({ ...prev, partnerCanton: '' }));
    }
  }, [formData.partnerProvince]);

  // Mostrar/ocultar formulario de cónyuge
  useEffect(() => {
    if (formData.maritalStatus === 'casado') {
      setShowPartnerForm(true);
    } else {
      setShowPartnerForm(false);
      setFormData(prev => ({
        ...prev,
        partnerDocumentNumber: '',
        partnerNames: '',
        partnerLastNames: '',
        partnerGender: '',
        partnerNationality: 'ecuatoriana',
        partnerBirthDate: '',
        partnerEmail: '',
        partnerPhone: '',
        partnerOccupation: '',
        partnerProfession: '',
        partnerSameAddress: true,
        partnerProvince: '',
        partnerCanton: '',
        partnerParroquia: '',
        partnerSector: '',
        partnerMainStreet: '',
        partnerSecondaryStreet: '',
        partnerNumberStreet: ''
      }));
    }
  }, [formData.maritalStatus]);

  // Sincronizar dirección del cónyuge
  useEffect(() => {
    if (formData.partnerSameAddress && showPartnerForm && formData.maritalStatus === 'casado') {
      setFormData(prev => ({
        ...prev,
        partnerProvince: prev.province,
        partnerCanton: prev.canton,
        partnerParroquia: prev.parroquia,
        partnerSector: prev.sector,
        partnerMainStreet: prev.mainStreet,
        partnerSecondaryStreet: prev.secondaryStreet,
        partnerNumberStreet: prev.numberStreet
      }));
    }
  }, [
    formData.partnerSameAddress,
    formData.province,
    formData.canton,
    formData.parroquia,
    formData.sector,
    formData.mainStreet,
    formData.secondaryStreet,
    formData.numberStreet,
    showPartnerForm,
    formData.maritalStatus
  ]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!validarCedula(formData.documentNumber)) {
      newErrors.documentNumber = 'Cédula inválida';
    }

    if (!formData.names.trim()) {
      newErrors.names = 'Los nombres son requeridos';
    }

    if (!formData.lastNames.trim()) {
      newErrors.lastNames = 'Los apellidos son requeridos';
    }

    if (!formData.gender) {
      newErrors.gender = 'El género es requerido';
    }

    if (!formData.maritalStatus) {
      newErrors.maritalStatus = 'El estado civil es requerido';
    }

    if (!formData.birthDate) {
      newErrors.birthDate = 'La fecha de nacimiento es requerida';
    }

    if (!formData.province) {
      newErrors.province = 'La provincia es requerida';
    }

    if (!formData.canton) {
      newErrors.canton = 'El cantón es requerido';
    }

    if (!formData.parroquia.trim()) {
      newErrors.parroquia = 'La parroquia es requerida';
    }

    if (!formData.mainStreet.trim()) {
      newErrors.mainStreet = 'La calle principal es requerida';
    }

    if (!formData.occupation.trim()) {
      newErrors.occupation = 'La ocupación es requerida';
    }

    if (showPartnerForm && formData.maritalStatus === 'casado') {
      if (!validarCedula(formData.partnerDocumentNumber)) {
        newErrors.partnerDocumentNumber = 'Cédula del cónyuge inválida';
      }

      if (!formData.partnerNames.trim()) {
        newErrors.partnerNames = 'Los nombres del cónyuge son requeridos';
      }

      if (!formData.partnerLastNames.trim()) {
        newErrors.partnerLastNames = 'Los apellidos del cónyuge son requeridos';
      }

      if (!formData.partnerGender) {
        newErrors.partnerGender = 'El género del cónyuge es requerido';
      }

      if (!formData.partnerBirthDate) {
        newErrors.partnerBirthDate = 'La fecha de nacimiento del cónyuge es requerida';
      }

      if (!formData.partnerOccupation.trim()) {
        newErrors.partnerOccupation = 'La ocupación del cónyuge es requerida';
      }

      if (!formData.partnerSameAddress) {
        if (!formData.partnerProvince) {
          newErrors.partnerProvince = 'La provincia del cónyuge es requerida';
        }
        if (!formData.partnerCanton) {
          newErrors.partnerCanton = 'El cantón del cónyuge es requerido';
        }
        if (!formData.partnerParroquia.trim()) {
          newErrors.partnerParroquia = 'La parroquia del cónyuge es requerida';
        }
        if (!formData.partnerMainStreet.trim()) {
          newErrors.partnerMainStreet = 'La calle principal del cónyuge es requerida';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Por favor corrija los errores en el formulario');
      return;
    }

    setLoading(true);

    try {
      const dataToSend = transformToSnakeCase(formData);

      if (showPartnerForm && formData.maritalStatus === 'casado') {
        const partnerData = {
          documentNumber: formData.partnerDocumentNumber,
          names: formData.partnerNames,
          lastNames: formData.partnerLastNames,
          documentType: 'cedula',
          gender: formData.partnerGender,
          maritalStatus: 'casado',
          nationality: formData.partnerNationality,
          birthDate: formData.partnerBirthDate,
          email: formData.partnerEmail,
          phone: formData.partnerPhone,
          province: formData.partnerProvince,
          canton: formData.partnerCanton,
          parroquia: formData.partnerParroquia,
          sector: formData.partnerSector,
          mainStreet: formData.partnerMainStreet,
          secondaryStreet: formData.partnerSecondaryStreet,
          numberStreet: formData.partnerNumberStreet,
          occupation: formData.partnerOccupation,
          profession: formData.partnerProfession
        };

        dataToSend.partner_document_number = formData.partnerDocumentNumber;
        
        const partnerResponse = await apiFetch(API_CONFIG.ENDPOINTS.PARTIES, {
          method: 'POST',
          body: JSON.stringify(transformToSnakeCase(partnerData))
        });

        if (!partnerResponse.ok) {
          const errorData = await partnerResponse.json();
          throw new Error(errorData.detail || 'Error al guardar datos del cónyuge');
        }
      }

      const url = initialData 
        ? `${API_CONFIG.ENDPOINTS.PARTIES}/${formData.documentNumber}`
        : API_CONFIG.ENDPOINTS.PARTIES;

      const response = await apiFetch(url, {
        method: initialData ? 'PUT' : 'POST',
        body: JSON.stringify(dataToSend)
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(initialData ? 'Compareciente actualizado' : 'Compareciente creado');
        if (onSuccess) {
          onSuccess(data);
        }
      } else {
        throw new Error(data.detail || 'Error al guardar compareciente');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message || 'Error al guardar compareciente');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* DATOS PERSONALES */}
      <Card title="Datos Personales">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Número de Cédula" required error={errors.documentNumber}>
            <input
              type="text"
              name="documentNumber"
              value={formData.documentNumber}
              onChange={handleChange}
              className="input-field"
              maxLength="10"
              disabled={!!initialData || loading}
            />
          </FormField>

          <FormField label="Tipo de Documento" required>
            <select
              name="documentType"
              value={formData.documentType}
              onChange={handleChange}
              className="input-field"
              disabled={loading}
            >
              <option value="cedula">Cédula</option>
              <option value="pasaporte">Pasaporte</option>
            </select>
          </FormField>

          <FormField label="Nombres" required error={errors.names}>
            <input
              type="text"
              name="names"
              value={formData.names}
              onChange={handleChange}
              className="input-field"
              placeholder="Nombres completos"
              disabled={loading}
            />
          </FormField>

          <FormField label="Apellidos" required error={errors.lastNames}>
            <input
              type="text"
              name="lastNames"
              value={formData.lastNames}
              onChange={handleChange}
              className="input-field"
              placeholder="Apellidos completos"
              disabled={loading}
            />
          </FormField>

          <FormField label="Género" required error={errors.gender}>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="input-field"
              disabled={loading}
            >
              <option value="">Seleccione</option>
              <option value="masculino">Masculino</option>
              <option value="femenino">Femenino</option>
            </select>
          </FormField>

          <FormField label="Estado Civil" required error={errors.maritalStatus}>
            <select
              name="maritalStatus"
              value={formData.maritalStatus}
              onChange={handleChange}
              className="input-field"
              disabled={loading}
            >
              <option value="">Seleccione</option>
              <option value="soltero">Soltero/a</option>
              <option value="casado">Casado/a</option>
              <option value="divorciado">Divorciado/a</option>
              <option value="viudo">Viudo/a</option>
              <option value="union_libre">Unión Libre</option>
            </select>
          </FormField>

          <FormField label="Nacionalidad" required>
            <input
              type="text"
              name="nationality"
              value={formData.nationality}
              onChange={handleChange}
              className="input-field"
              disabled={loading}
            />
          </FormField>

          <FormField label="Fecha de Nacimiento" required error={errors.birthDate}>
            <input
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              className="input-field"
              disabled={loading}
            />
          </FormField>

          <FormField label="Email">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input-field"
              placeholder="correo@ejemplo.com"
              disabled={loading}
            />
          </FormField>

          <FormField label="Teléfono">
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="input-field"
              placeholder="0991234567"
              disabled={loading}
            />
          </FormField>

          <FormField label="Ocupación" required error={errors.occupation}>
            <input
              type="text"
              name="occupation"
              value={formData.occupation}
              onChange={handleChange}
              className="input-field"
              placeholder="Ej: Comerciante"
              disabled={loading}
            />
          </FormField>

          <FormField label="Profesión">
            <input
              type="text"
              name="profession"
              value={formData.profession}
              onChange={handleChange}
              className="input-field"
              placeholder="Ej: Ingeniero"
              disabled={loading}
            />
          </FormField>
        </div>
      </Card>

      {/* DIRECCIÓN */}
      <Card title="Dirección">
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
              {getProvincias().map(prov => (
                <option key={prov} value={prov}>{prov}</option>
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
              {cantones.map(cant => (
                <option key={cant} value={cant}>{cant}</option>
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

          <FormField label="Sector">
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

          <FormField label="Calle Secundaria">
            <input
              type="text"
              name="secondaryStreet"
              value={formData.secondaryStreet}
              onChange={handleChange}
              className="input-field"
              disabled={loading}
            />
          </FormField>

          <FormField label="Número">
            <input
              type="text"
              name="numberStreet"
              value={formData.numberStreet}
              onChange={handleChange}
              className="input-field"
              placeholder="Ej: N24-660"
              disabled={loading}
            />
          </FormField>
        </div>
      </Card>

      {/* DATOS DEL CÓNYUGE */}
      {showPartnerForm && formData.maritalStatus === 'casado' && (
        <Card title="Datos del Cónyuge">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Cédula del Cónyuge" required error={errors.partnerDocumentNumber}>
              <input
                type="text"
                name="partnerDocumentNumber"
                value={formData.partnerDocumentNumber}
                onChange={handleChange}
                className="input-field"
                maxLength="10"
                disabled={loading}
              />
            </FormField>

            <FormField label="Género del Cónyuge" required error={errors.partnerGender}>
              <select
                name="partnerGender"
                value={formData.partnerGender}
                onChange={handleChange}
                className="input-field"
                disabled={loading}
              >
                <option value="">Seleccione</option>
                <option value="masculino">Masculino</option>
                <option value="femenino">Femenino</option>
              </select>
            </FormField>

            <FormField label="Nombres del Cónyuge" required error={errors.partnerNames}>
              <input
                type="text"
                name="partnerNames"
                value={formData.partnerNames}
                onChange={handleChange}
                className="input-field"
                disabled={loading}
              />
            </FormField>

            <FormField label="Apellidos del Cónyuge" required error={errors.partnerLastNames}>
              <input
                type="text"
                name="partnerLastNames"
                value={formData.partnerLastNames}
                onChange={handleChange}
                className="input-field"
                disabled={loading}
              />
            </FormField>

            <FormField label="Nacionalidad" required>
              <input
                type="text"
                name="partnerNationality"
                value={formData.partnerNationality}
                onChange={handleChange}
                className="input-field"
                disabled={loading}
              />
            </FormField>

            <FormField label="Fecha de Nacimiento" required error={errors.partnerBirthDate}>
              <input
                type="date"
                name="partnerBirthDate"
                value={formData.partnerBirthDate}
                onChange={handleChange}
                className="input-field"
                disabled={loading}
              />
            </FormField>

            <FormField label="Email">
              <input
                type="email"
                name="partnerEmail"
                value={formData.partnerEmail}
                onChange={handleChange}
                className="input-field"
                disabled={loading}
              />
            </FormField>

            <FormField label="Teléfono">
              <input
                type="tel"
                name="partnerPhone"
                value={formData.partnerPhone}
                onChange={handleChange}
                className="input-field"
                disabled={loading}
              />
            </FormField>

            <FormField label="Ocupación" required error={errors.partnerOccupation}>
              <input
                type="text"
                name="partnerOccupation"
                value={formData.partnerOccupation}
                onChange={handleChange}
                className="input-field"
                disabled={loading}
              />
            </FormField>

            <FormField label="Profesión">
              <input
                type="text"
                name="partnerProfession"
                value={formData.partnerProfession}
                onChange={handleChange}
                className="input-field"
                disabled={loading}
              />
            </FormField>

            <div className="col-span-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="partnerSameAddress"
                  checked={formData.partnerSameAddress}
                  onChange={handleChange}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                  disabled={loading}
                />
                <span className="text-sm text-gray-700">Misma dirección que el titular</span>
              </label>
            </div>

            {!formData.partnerSameAddress && (
              <>
                <FormField label="Provincia" required error={errors.partnerProvince}>
                  <select
                    name="partnerProvince"
                    value={formData.partnerProvince}
                    onChange={handleChange}
                    className="input-field"
                    disabled={loading}
                  >
                    <option value="">Seleccione</option>
                    {getProvincias().map(prov => (
                      <option key={prov} value={prov}>{prov}</option>
                    ))}
                  </select>
                </FormField>

                <FormField label="Cantón" required error={errors.partnerCanton}>
                  <select
                    name="partnerCanton"
                    value={formData.partnerCanton}
                    onChange={handleChange}
                    className="input-field"
                    disabled={!formData.partnerProvince || loading}
                  >
                    <option value="">Seleccione</option>
                    {partnerCantones.map(cant => (
                      <option key={cant} value={cant}>{cant}</option>
                    ))}
                  </select>
                </FormField>

                <FormField label="Parroquia" required error={errors.partnerParroquia}>
                  <input
                    type="text"
                    name="partnerParroquia"
                    value={formData.partnerParroquia}
                    onChange={handleChange}
                    className="input-field"
                    disabled={loading}
                  />
                </FormField>

                <FormField label="Sector">
                  <input
                    type="text"
                    name="partnerSector"
                    value={formData.partnerSector}
                    onChange={handleChange}
                    className="input-field"
                    disabled={loading}
                  />
                </FormField>

                <FormField label="Calle Principal" required error={errors.partnerMainStreet}>
                  <input
                    type="text"
                    name="partnerMainStreet"
                    value={formData.partnerMainStreet}
                    onChange={handleChange}
                    className="input-field"
                    disabled={loading}
                  />
                </FormField>

                <FormField label="Calle Secundaria">
                  <input
                    type="text"
                    name="partnerSecondaryStreet"
                    value={formData.partnerSecondaryStreet}
                    onChange={handleChange}
                    className="input-field"
                    disabled={loading}
                  />
                </FormField>

                <FormField label="Número">
                  <input
                    type="text"
                    name="partnerNumberStreet"
                    value={formData.partnerNumberStreet}
                    onChange={handleChange}
                    className="input-field"
                    disabled={loading}
                  />
                </FormField>
              </>
            )}
          </div>
        </Card>
      )}

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
          {initialData ? 'Actualizar' : 'Guardar'} Compareciente
        </Button>
      </div>
    </form>
  );
};

export default ComparecienteForm;