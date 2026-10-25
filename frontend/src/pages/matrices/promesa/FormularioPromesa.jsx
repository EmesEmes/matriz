import FormularioMatrizBase from "../FormularioMatrizBase";

const FormularioPromesaCompraventa = () => (
  <FormularioMatrizBase
    titulo="Generar Matriz de Promesa de Compraventa"
    tipoContrato="promesa_compraventa"
    labelParte1="Promitente Vendedor"
    labelParte1Plural="Promitentes Vendedores"
    labelParte2="Promitente Comprador"
    labelParte2Plural="Promitentes Compradores"
    keyParte1="promitentes_vendedores"
    keyParte2="promitentes_compradores"
  />
);

export default FormularioPromesaCompraventa;
