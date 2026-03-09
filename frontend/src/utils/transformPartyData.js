// Transformar de camelCase (frontend) a snake_case (backend)
export const transformToSnakeCase = (data) => {
  return {
    document_number: data.documentNumber,
    names: data.names?.toUpperCase(),
    last_names: data.lastNames?.toUpperCase(),
    document_type: data.documentType?.toLowerCase(),
    gender: data.gender?.toLowerCase(),
    marital_status: data.maritalStatus?.toLowerCase(),
    partner_document_number: data.partnerDocumentNumber || null,
    nationality: data.nationality,
    birth_date: data.birthDate,
    email: data.email?.toLowerCase(),
    phone: data.phone,
    province: data.province,
    canton: data.canton,
    parroquia: data.parroquia,
    sector: data.sector || null,
    main_street: data.mainStreet,
    secondary_street: data.secondaryStreet,
    number_street: data.numberStreet,
    occupation: data.occupation,
    profession: data.profession || null,
  };
};

// Transformar de snake_case (backend) a camelCase (frontend)
export const transformToCamelCase = (data) => {
  if (!data) return null;

  // Si es una empresa (tiene ruc en lugar de document_number)
  if (data.ruc) {
    return {
      esEmpresa: true,
      ruc: data.ruc || "",
      razonSocial: data.razon_social || "",
      email: data.email || "",
      phone: data.phone || "",
      province: data.province || "",
      canton: data.canton || "",
      parroquia: data.parroquia || "",
      sector: data.sector || "",
      mainStreet: data.main_street || "",
      secondaryStreet: data.secondary_street || "",
      numberStreet: data.number_street || "",
      // Representante legal
      repDocumentType: data.rep_document_type || "cedula",
      repDocumentNumber: data.rep_document_number || "",
      repNames: data.rep_names || "",
      repLastNames: data.rep_last_names || "",
      repGender: data.rep_gender || "",
      repNationality: data.rep_nationality || "",
      repBirthDate: data.rep_birth_date || "",
      repEmail: data.rep_email || "",
      repPhone: data.rep_phone || "",
      repProvince: data.rep_province || "",
      repCanton: data.rep_canton || "",
      repParroquia: data.rep_parroquia || "",
      repSector: data.rep_sector || "",
      repMainStreet: data.rep_main_street || "",
      repSecondaryStreet: data.rep_secondary_street || "",
      repNumberStreet: data.rep_number_street || "",
      repOccupation: data.rep_occupation || "",
      repProfession: data.rep_profession || "",
      repPosition: data.rep_position || "",
    };
  }

  // Persona natural
  return {
    esEmpresa: false,
    documentNumber: data.document_number || "",
    names: data.names || "",
    lastNames: data.last_names || "",
    documentType: data.document_type || "cedula",
    gender: data.gender || "",
    maritalStatus: data.marital_status || "",
    partnerDocumentNumber: data.partner_document_number || null,
    nationality: data.nationality || "ecuatoriana",
    birthDate: data.birth_date || "",
    email: data.email || "",
    phone: data.phone || "",
    province: data.province || "",
    canton: data.canton || "",
    parroquia: data.parroquia || "",
    sector: data.sector || "",
    mainStreet: data.main_street || "",
    secondaryStreet: data.secondary_street || "",
    numberStreet: data.number_street || "",
    occupation: data.occupation || "",
    profession: data.profession || "",
    partner: data.partner ? transformToCamelCase(data.partner) : null,
  };
};
