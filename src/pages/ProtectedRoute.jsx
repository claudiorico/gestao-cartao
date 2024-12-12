import { Navigate, Outlet } from "react-router-dom";
import { useFileUploadContext } from "../../context/FileUploadContext";

const ProtectedRoute = () => {
  const { session } = useFileUploadContext();

  return session.user.email ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
