import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchAdminProducts } from "../features/adminProductSlice";
import { fetchAdminUsers } from "../features/adminUserSlice";
import { fetchAdminOrders } from "../features/adminOrderSlice";

import { Package,Users,ShoppingBag,Clock,RefreshCw } from "lucide-react";

function Dashboard() {
  const dispatch = useDispatch();

  const {
    products,
    loading: productsLoading,
    error: productsError,
  } = useSelector((state) => state.adminProducts);

  const {
    users,
    loading: usersLoading,
    error: usersError,
  } = useSelector((state) => state.adminUsers);

  const {
    orders,
    loading: ordersLoading,
    error: ordersError,
  } = useSelector((state) => state.adminOrders);

  useEffect(() => {
    dispatch(fetchAdminProducts());
    dispatch(fetchAdminUsers());
    dispatch(fetchAdminOrders());
  }, [dispatch]);

  const loading = productsLoading || usersLoading || ordersLoading;
  const error = productsError || usersError || ordersError;
  const pendingOrders = orders.filter(
    (order) =>
      String(order.orderStatus || order.status || "")
        .toLowerCase() === "pending"
  ).length;

  const stats = [
    {
      title: "Total Games",
      value: products.length,
      icon: Package,
      color: "text-blue-400",
      glow: "shadow-blue-500/10",
    },
    {
      title: "Total Users",
      value: users.length,
      icon: Users,
      color: "text-emerald-400",
      glow: "shadow-emerald-500/10",
    },
    {
      title: "Total Orders",
      value: orders.length,
      icon: ShoppingBag,
      color: "text-purple-400",
      glow: "shadow-purple-500/10",
    },
    {
      title: "Pending Orders",
      value: pendingOrders,
      icon: Clock,
      color: "text-amber-400",
      glow: "shadow-amber-500/10",
    },
  ];

  const handleRefresh = () => {
    dispatch(fetchAdminProducts());
    dispatch(fetchAdminUsers());
    dispatch(fetchAdminOrders());
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1F51FF] drop-shadow-[0_0_8px_rgba(31,81,225,0.5)]">
            Admin Dashboard
          </h1>

          <p className="mt-2 text-zinc-400">
            Welcome to the FitBoy Repacks Admin Panel.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg border border-blue-500/30 px-4 py-2 text-blue-400 transition hover:bg-blue-500/10 disabled:opacity-50"
        >
          <RefreshCw
            size={16}
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">
          Failed to load dashboard data: {error}
          <p className="mt-1 text-sm">
            Check that JSON Server is running at
            {" "}http://localhost:5000.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className={`rounded-2xl border border-white/10 bg-zinc-900/70 p-6 shadow-lg ${stat.glow}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-400">
                    {stat.title}
                  </p>

                  <h2 className="mt-3 text-3xl font-bold text-white">
                    {loading ? "..." : stat.value}
                  </h2>
                </div>

                <div className={`rounded-xl bg-white/5 p-3 ${stat.color}`}>
                  <Icon size={26} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Dashboard;