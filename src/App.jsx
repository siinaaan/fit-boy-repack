import { Routes, Route } from "react-router-dom";

import Login from "./userLayout/pages/loginPage";
import Register from "./userLayout/pages/registerPage";
import Home from "./userLayout/pages/Home";
import ProtectedRoute from "./userLayout/components/ProtectedRoute";
import UserNav from "./userLayout/components/UserNav";
import Games from "./userLayout/pages/Games";
import GameDetails from "./userLayout/pages/GameDetails";

function App() {
  return (
    
    <Routes>

      
      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />


      
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      <Route
        element={
          <ProtectedRoute>
            <UserNav />
          </ProtectedRoute>
        }
      ></Route>

      <Route
      path="/games"
      element={
        <ProtectedRoute>
          <Games/>
        </ProtectedRoute>
      }>
      </Route>

     <Route
     path="/games/:id"
     element={
      <ProtectedRoute>
        <GameDetails/>
      </ProtectedRoute>
     }/>
  </Routes>
  );
}

export default App;