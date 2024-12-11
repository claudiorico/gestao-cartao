import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useFileUploadContext } from "../../context/FileUploadContext";

const ProtectedRoute = () => {
  const { session, loading } = useFileUploadContext();
  if (loading) {
    return <div>Carregando...</div>; // Você pode substituir por um spinner ou outro indicador de carregamento
  }

  return session ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
