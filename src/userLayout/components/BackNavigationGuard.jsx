import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function BackNavigationGuard() {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const redirectAdmin = () => {
      if (user?.role === "admin" && window.location.pathname !== "/admin") {
        navigate("/admin", { replace: true });
      }
    };

    window.addEventListener("pageshow", redirectAdmin);

    return () => {
      window.removeEventListener("pageshow", redirectAdmin);
    };
  }, [user, navigate, location.pathname]);

  return null;
}

export default BackNavigationGuard;