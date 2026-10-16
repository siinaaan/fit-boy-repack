import { Link, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../userLayout/features/authSlice";
import { User, Boxes } from "lucide-react";

function AdminLayout() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#050b12] text-white">
      <aside className="fixed inset-y-0 left-0 w-64 border-r border-white/10 bg-zinc-950 p-6">
        <h1 className="mb-2 text-2xl font-bold text-[#1F51FF] drop-shadow-[0_0_8px_rgba(31,81,225,0.5)]">
          FitBoy Admin
        </h1>

        <p className="mb-8 text-sm text-zinc-400">
          {user?.name}
        </p>

        <nav className="flex flex-col gap-4">
          <Link to="/admin">
          
            Dashboard</Link>
          <Link to="/admin/products" >Products</Link>
          <Link to="/admin/users" className="flex gap-1 items-center">
          <User size={18} />
          <span>Users</span>
          </Link>
          <Link to="/admin/orders" 
          className="flex gap-1 items-center">
          <Boxes size={18}/>
          <span>Orders</span>
          </Link>
        </nav>

        <button
          onClick={handleLogout}
          className="mt-10 rounded-lg bg-red-600 px-4 py-2 hover:bg-red-700"
        >
          Logout
        </button>
      </aside>

      <main className="ml-64 p-8">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;