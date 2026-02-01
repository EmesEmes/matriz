import { useState, useEffect } from "react";

export const useComparecienteOptions = (user, onUserReady) => {
  const [needsConyugue, setNeedsConyugue] = useState(true);
  const [razonExclusionConyugue, setRazonExclusionConyugue] = useState("");
  const [isNoVidente, setIsNoVidente] = useState(false);
  const [isAnalfabeta, setIsAnalfabeta] = useState(false);
  const [personaConfianzaAnalfabeta, setPersonaConfianzaAnalfabeta] =
    useState("");
  const [personaConfianzaNoVidente, setPersonaConfianzaNoVidente] =
    useState("");
  const [hasDiscapacidadIntelectual, setHasDiscapacidadIntelectual] =
    useState(false);
  const [needsInterpreter, setNeedsInterpreter] = useState(false);
  const [nombreInterprete, setNombreInterprete] = useState("");

  const enviarDatos = (baseUser = null, updates = {}) => {
    const userData = baseUser || user;
    if (!userData) return;

    const shouldNeedsConyugue =
      userData.maritalStatus?.toLowerCase() === "casado"
        ? updates.needsConyugue !== undefined
          ? updates.needsConyugue
          : needsConyugue
        : false;

    let finalRazonExclusion = null;
    if (!shouldNeedsConyugue) {
      // Si NO debe comparecer, toma el valor de updates (si existe), o el estado actual.
      finalRazonExclusion =
        updates.razonExclusionConyugue !== undefined
          ? updates.razonExclusionConyugue
          : razonExclusionConyugue;
    }

    const enriched = {
      ...userData,
      needsConyugue: shouldNeedsConyugue,
      razonExclusionConyugue: finalRazonExclusion,
      hasDiscapacidadIntelectual,
      isNoVidente,
      personaConfianzaVidente: isNoVidente ? personaConfianzaNoVidente : null,
      isAnalfabeta,
      personaConfianzaAnalfabeta: isAnalfabeta
        ? personaConfianzaAnalfabeta
        : null,
      needsInterpreter, 
      interprete: needsInterpreter ?  nombreInterprete : null,
      ...updates,
    };
    onUserReady?.(enriched);
  };

  const handleConyugueChange = (e) => {
    const valor = e.target.checked;
    setNeedsConyugue(valor);

    if (valor) {
      setRazonExclusionConyugue("");
      enviarDatos(null, {
        needsConyugue: true,
        razonExclusionConyugue: null,
      });
    } else {
      enviarDatos(null, {
        needsConyugue: false,
        razonExclusionConyugue: razonExclusionConyugue,
      });
    }
  };

  const handleRazonExclusionChange = (e) => {
    const razon = e.target.value;
    setRazonExclusionConyugue(razon);

    enviarDatos(null, {
      needsConyugue: false,
      razonExclusionConyugue: razon,
    });
  };

  const handleDiscapacidadIntelectualChange = (e) => {
    const valor = e.target.checked;
    setHasDiscapacidadIntelectual(valor);
    enviarDatos(null, { hasDiscapacidadIntelectual: valor });
  };

  const handleNoVidenteChange = (e) => {
    const valor = e.target.checked;
    setIsNoVidente(valor);
    if (!valor) setPersonaConfianzaNoVidente("");
    enviarDatos(null, { isNoVidente: valor });
  };

  const handleAnalfabetaChange = (e) => {
    const valor = e.target.checked;
    setIsAnalfabeta(valor);
    if (!valor) setPersonaConfianzaAnalfabeta("");
    enviarDatos(null, { isAnalfabeta: valor });
  };

  const handlePersonaConfianzaNoVidenteChange = (value) => {
    const upperValue = value.toUpperCase();
    setPersonaConfianzaNoVidente(upperValue);
    enviarDatos(null, { personaConfianzaVidente: upperValue, isNoVidente: true });
  };

  const handlePersonaConfianzaAnalfabetaChange = (value) => {
    const upperValue = value.toUpperCase();
    setPersonaConfianzaAnalfabeta(upperValue);
    enviarDatos(null, {
      personaConfianzaAnalfabeta: upperValue,
      isAnalfabeta: true,
    });
  };

  const handleInterpreterChange = (e) => {
    const value = e.target.checked;
    setNeedsInterpreter(value)
    if (!value) setNombreInterprete('')
    enviarDatos(null, { needsInterpreter: value });
  };

  const handleInterpreterNameChange = (value) => {
    const upperValue = value.toUpperCase();
    setNombreInterprete(upperValue)
    enviarDatos(null, { interprete: upperValue, needsInterpreter: true });
  };

  useEffect(() => {
    if (!user) return;

    if (user.maritalStatus?.toLowerCase() === "casado") {
      setNeedsConyugue(user.needsConyugue !== false);
      setRazonExclusionConyugue(user.razonExclusionConyugue || "");
    } else {
      setNeedsConyugue(false);
      setRazonExclusionConyugue("");
    }

    if (user.isNoVidente !== undefined) setIsNoVidente(user.isNoVidente);
    if (user.isAnalfabeta !== undefined) setIsAnalfabeta(user.isAnalfabeta);
    if (user.personaConfianzaAnalfabeta)
      setPersonaConfianzaAnalfabeta(user.personaConfianzaAnalfabeta);
    if (user.personaConfianzaVidente)
      setPersonaConfianzaNoVidente(user.personaConfianzaVidente);
    
    if (user.needsInterpreter !== undefined) setNeedsInterpreter(user.needsInterpreter)
    if (user.nombreInterprete) setNombreInterprete(user.nombreInterprete)

    if (user.hasDiscapacidadIntelectual !== undefined) {
      setHasDiscapacidadIntelectual(user.hasDiscapacidadIntelectual);
    }
  }, [user]);

  return {
    // Estados
    needsConyugue,
    razonExclusionConyugue,
    isNoVidente,
    isAnalfabeta,
    personaConfianzaAnalfabeta,
    personaConfianzaNoVidente,
    hasDiscapacidadIntelectual,
    needsInterpreter,
    nombreInterprete,

    // Handlers
    handleConyugueChange,
    handleRazonExclusionChange,
    handleDiscapacidadIntelectualChange,
    handleNoVidenteChange,
    handleAnalfabetaChange,
    handlePersonaConfianzaNoVidenteChange,
    handlePersonaConfianzaAnalfabetaChange,
    handleInterpreterChange,
    handleInterpreterNameChange,

    // Función auxiliar
    enviarDatos,
  };
};
