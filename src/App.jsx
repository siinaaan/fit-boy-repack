import { Routes, Route } from "react-router-dom";

import Login from "./userLayout/pages/loginPage";
import Register from "./userLayout/pages/registerPage";
import Home from "./userLayout/pages/Home";
import Games from "./userLayout/pages/Games";
import GameDetails from "./userLayout/pages/GameDetails";
import Cart from "./userLayout/pages/Cart";
import Wishlist from "./userLayout/pages/Wishlist";
import Checkout from "./userLayout/pages/Checkout";
import OrderSuccess from "./userLayout/pages/OrderSuccess";
import Orders from "./userLayout/pages/Order";
import LandingPage from "./userLayout/pages/LandingPage";
import PublicRoute from "./userLayout/components/PublicRoute";
import UserSideRoute from "./userLayout/components/UserSideRoute";

import AdminProtectedRoute from "./adminLayout/components/AdminProtectedRoute";
import AdminLayout from "./adminLayout/layouts/AdminLayout";
import Dashboard from "./adminLayout/pages/Dashboard";
import Products from "./adminLayout/pages/Products";

function App() {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route element={<UserSideRoute />}>
        <Route path="/" element={<Home />}>
          <Route index element={<LandingPage />} />
          <Route path="games" element={<Games />} />
          <Route path="games/:id" element={<GameDetails />} />
          <Route path="cart" element={<Cart />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="order-success" element={<OrderSuccess />} />
          <Route path="orders" element={<Orders />} />
        </Route>
      </Route>

      <Route element={<AdminProtectedRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
