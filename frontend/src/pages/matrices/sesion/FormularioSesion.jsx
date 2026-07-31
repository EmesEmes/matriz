import FormularioMatrizBase from "../FormularioMatrizBase";

const FormularioSesion = () => (
  <FormularioMatrizBase
    titulo="Generar Matriz de Sesión"
    tipoContrato="sesion"
    labelParte1="Cedente"
    labelParte1Plural="Cedentes"
    labelParte2="Cesionario"
    labelParte2Plural="Cesionarios"
    keyParte1="cedentes"
    keyParte2="cesionarios"
  />
);

export default FormularioSesion;
