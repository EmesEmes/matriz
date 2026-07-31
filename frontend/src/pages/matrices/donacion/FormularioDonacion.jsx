import FormularioMatrizBase from "../FormularioMatrizBase";

const FormularioDonacion = () => (
  <FormularioMatrizBase
    titulo="Generar Matriz de Donación"
    tipoContrato="donacion"
    labelParte1="Donante"
    labelParte1Plural="Donantes"
    labelParte2="Donatario"
    labelParte2Plural="Donatarios"
    keyParte1="donantes"
    keyParte2="donatarios"
  />
);

export default FormularioDonacion;
