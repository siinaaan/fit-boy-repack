import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";

import { getUsers } from "../api/authApi";
import { setUser } from "../features/authSlice";

import toast from "react-hot-toast";

function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const loginMutation = useMutation({
    mutationFn: async () => {
      const users = await getUsers();

      const user = users.find(
        (user) =>
          user.email === email && user.password === password
      );

      if (!user) {
        throw new Error("Invalid email or password");
      }

      return user;
    },

    onSuccess: (user) => {
      dispatch(setUser(user));

      toast.success("Logged in successfully!");

      navigate("/");
    },

    onError: (error) => {
      setError(error.message);

      toast.error(error.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");

    loginMutation.mutate();
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
     
      <div className="flex w-full max-w-5xl items-center gap-16">

        <div className="hidden flex-1 text-center lg:block">

          <h1
            className="
              text-5xl
              font-black
              tracking-wider
              text-emerald-400
              drop-shadow-[0_0_15px_rgba(16,185,129,0.6)]
            "
          >
            FitBoy Repack
          </h1>

          <p className="mt-3 text-slate-400">
            Your digital gaming universe
          </p>

        </div>

    ``
        {/* RIGHT SIDE - LOGIN CARD */}

        <form
          onSubmit={handleSubmit}
          className="
            w-full
            max-w-md
            rounded-2xl
            border
            border-emerald-500/25
            bg-[#07111a]/90
            p-8
            shadow-[0_0_35px_rgba(16,185,129,0.08)]
            backdrop-blur-xl
          "
        >

          {/* Login Heading */}

          <div className="mb-6">

            <h2 className="text-3xl font-bold text-white">
              Welcome back
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Sign in to continue your gaming journey.
            </p>

          </div>


          {/* EMAIL */}

          <div className="mb-4">

            <label
              className="
                mb-2
                block
                text-sm
                font-medium
                text-slate-300
              "
            >
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="
                w-full
                rounded-lg
                border
                border-emerald-500/20
                bg-[#050b12]
                px-4
                py-3
                text-white
                outline-none
                placeholder:text-slate-500
                transition-all
                duration-300
                focus:border-emerald-400
                focus:ring-2
                focus:ring-emerald-400/20
                focus:shadow-[0_0_15px_rgba(16,185,129,0.15)]
              "
            />

          </div>


          {/* PASSWORD */}

          <div className="mb-4">

            <label
              className="
                mb-2
                block
                text-sm
                font-medium
                text-slate-300
              "
            >
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="
                w-full
                rounded-lg
                border
                border-emerald-500/20
                bg-[#050b12]
                px-4
                py-3
                text-white
                outline-none
                placeholder:text-slate-500
                transition-all
                duration-300
                focus:border-emerald-400
                focus:ring-2
                focus:ring-emerald-400/20
                focus:shadow-[0_0_15px_rgba(16,185,129,0.15)]
              "
            />

          </div>


          {/* LOGIN BUTTON */}

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="
              mt-5
              w-full
              rounded-lg
              bg-emerald-500
              py-3
              font-bold
              text-black
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:bg-emerald-400
              hover:shadow-[0_0_25px_rgba(16,185,129,0.5)]
              active:translate-y-0
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {loginMutation.isPending
              ? "Logging in..."
              : "Login"}
          </button>


          {/* ERROR MESSAGE */}

          {error && (
            <div
              className="
                mt-3
                rounded-lg
                border
                border-red-500/20
                bg-red-500/10
                px-4
                py-3
                text-sm
                text-red-400
              "
            >
              {error}
            </div>
          )}


          {/* REGISTER LINK */}

          <p className="mt-6 text-center text-sm text-slate-400">

            Don't have an account?{" "}

            <Link
              to="/register"
              className="
                font-semibold
                text-emerald-400
                transition
                hover:text-emerald-300
                hover:drop-shadow-[0_0_8px_rgba(16,185,129,0.7)]
              "
            >
              Create account
            </Link>

          </p>

        </form>

      </div>
    </div>
  );
}

export default LoginPage;