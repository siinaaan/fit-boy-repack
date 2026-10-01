import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";

import { getUsers } from "../api/authApi";
import { setUser } from "../features/authSlice";

import { Link } from "react-router-dom";

function loginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const loginMutation = useMutation({
    mutationFn: async () => {
      const users = await getUsers();

      const user = users.find(
        (user) => user.email === email && user.password === password,
      );

      if (!user) {
        throw new Error("Invalid email or password");
      }

      return user;
    },

    onSuccess: (user) => {
      dispatch(setUser(user));
      navigate("/");
    },

    onError: (error) => {
      setError(error.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    loginMutation.mutate();
  };

  return (
    <div className="flex flex-col justify-center items-center mt-50">
      <h1 className="text-4xl font-extrabold">Login</h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col  py-13 px-4 w-100 border rounded-md mt-2 gap-2"
      >
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border rounded-sm py-2 pl-2"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border rounded-sm py-2 pl-2"
        />

        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="border bg-gray-200 rounded-b-full"
        >
          {loginMutation.isPending ? "Logging in..." : "Login"}
        </button>

        {error && (
        <div className="w-80 rounded-md px-4 py-3 text-red-500">
          {error}
        </div>
      )}
        <p>
          Don't have an account?{" "}
          <Link to="/register">
            <span className="font-semibold text-blue-500">Register</span>
          </Link>
        </p>

      </form>
    </div>
  );
}

export default loginPage;
