// Transformar datos de camelCase (frontend) a snake_case (backend)
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

// Transformar datos de snake_case (backend) a camelCase (frontend)
export const transformToCamelCase = (data) => {
  return {
    documentNumber: data.document_number,
    names: data.names,
    lastNames: data.last_names,
    documentType: data.document_type,
    gender: data.gender,
    maritalStatus: data.marital_status,
    partnerDocumentNumber: data.partner_document_number,
    nationality: data.nationality,
    birthDate: data.birth_date,
    email: data.email,
    phone: data.phone,
    province: data.province,
    canton: data.canton,
    parroquia: data.parroquia,
    sector: data.sector,
    mainStreet: data.main_street,
    secondaryStreet: data.secondary_street,
    numberStreet: data.number_street,
    occupation: data.occupation,
    profession: data.profession,
    partner: data.partner ? transformToCamelCase(data.partner) : null,
  };
};