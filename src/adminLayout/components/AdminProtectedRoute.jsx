import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

function AdminProtectedRoute() {
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector(
    (state) => state.auth.isAuthenticated
  );

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default AdminProtectedRoute;