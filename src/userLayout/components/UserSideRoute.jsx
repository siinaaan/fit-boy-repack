import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

function UserSideRoute() {
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector(
    (state) => state.auth.isAuthenticated
  );
  const location = useLocation();

  if (isAuthenticated && user?.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
}

export default UserSideRoute;