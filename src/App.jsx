import { Routes, Route } from "react-router-dom";

import Login from "./userLayout/pages/loginPage";
import Register from "./userLayout/pages/registerPage";
import Home from "./userLayout/pages/Home";
import ProtectedRoute from "./userLayout/components/ProtectedRoute";
import Games from "./userLayout/pages/Games";
import GameDetails from "./userLayout/pages/GameDetails";
import Cart from "./userLayout/pages/Cart";
import Wishlist from "./userLayout/pages/Wishlist";
import Checkout from "./userLayout/pages/Checkout"
import OrderSuccess from "./userLayout/pages/OrderSuccess";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route path="/" element={<Home />}>
        <Route index element={<div>Home</div>} />
        <Route path="games" element={<Games />} />
        <Route path="/games/:id" element={<GameDetails />}/>
        <Route path="/cart" element = {<Cart />} />
        <Route path="/wishlist" element = {<Wishlist />} />
        <Route path="/checkout" element={<Checkout/>} />
        <Route path="/order-success" element={<OrderSuccess/>} />
      </Route>

    </Routes>
  );
}

export default App;
