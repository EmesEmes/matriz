import React, { useState } from "react";
import UserForm from "./UserForm/UserForm.jsx";
import UserInfoDisplay from "./UserInfoDisplay";
import ComparecienteOptions from "./ComparecienteOptions";
import { useComparecienteOptions } from "../../hooks/useComparecienteOptions";
import { validarCedula } from "../../utils/validarCedula.js";
import { apiFetch } from '../../config/api';
import API_CONFIG from '../../config/api';
import { transformToCamelCase } from '../../utils/transformPartyData';

const Compareciente = ({ title, onUserReady }) => {
  const [documentNumber, setDocumentNumber] = useState("");
  const [user, setUser] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const optionsProps = useComparecienteOptions(user, onUserReady);

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!validarCedula(documentNumber)) {
      alert("Cédula incorrecta");
      return;
    }

    try {
      const res = await apiFetch(`${API_CONFIG.ENDPOINTS.USERS}/${documentNumber}`);
      
      if (res.ok) {
        const data = await res.json();
        // Transformar de snake_case a camelCase
        const transformedUser = transformToCamelCase(data);
        
        setUser(transformedUser);
        setNotFound(false);
        setIsEditing(false);
        optionsProps.enviarDatos(transformedUser);
      } else {
        setUser(null);
        setNotFound(true);
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error al buscar usuario:", error);
      setUser(null);
      setNotFound(true);
      setIsEditing(false);
    }
  };

  const handleSave = (enrichedUser) => {
    setUser(enrichedUser);
    setNotFound(false);
    setIsEditing(false);
    optionsProps.enviarDatos(enrichedUser);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  return (
    <div className="p-4 rounded-xl shadow-lg bg-white space-y-4 border border-gray-300">
      <h2 className="text-xl font-semibold">{title}</h2>

      <form onSubmit={handleSearch} className="flex gap-2 items-center">
        <input
          type="text"
          placeholder="Número de documento"
          value={documentNumber}
          onChange={(e) => setDocumentNumber(e.target.value)}
          className="border px-2 py-1 rounded w-full"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
        >
          Buscar
        </button>
      </form>

      {user && !isEditing ? (
        <div className="space-y-4">
          <UserInfoDisplay user={user} onEdit={handleEdit} />
          <ComparecienteOptions user={user} {...optionsProps} />
        </div>
      ) : user && isEditing ? (
        <UserForm
          documentNumber={user.documentNumber}
          user={user}
          onSave={handleSave}
          onCancel={handleCancelEdit}
          mode="edit"
        />
      ) : (
        notFound && (
          <UserForm
            documentNumber={documentNumber}
            onSave={handleSave}
            mode="create"
          />
        )
      )}
    </div>
  );
};

export default Compareciente;