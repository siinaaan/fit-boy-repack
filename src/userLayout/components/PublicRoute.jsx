import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

function PublicRoute() {
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector(
    (state) => state.auth.isAuthenticated
  );

  if (isAuthenticated && user) {
    if (user.role === "admin") {
      return <Navigate to="/admin" replace />;
    }

    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default PublicRoute;