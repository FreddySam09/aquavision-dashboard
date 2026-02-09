//components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  const serverIP = localStorage.getItem("server_ip");

if (!user) {
  return <Navigate to="/login" />;
}

if (!serverIP) {
  return <Navigate to="/connect" />;
}

return children;

};

export default ProtectedRoute;
