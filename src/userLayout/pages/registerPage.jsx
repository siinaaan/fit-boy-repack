import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { registerUser, getUsers } from "../api/authApi";

import toast from "react-hot-toast";

function RegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const registerMutation = useMutation({
    mutationFn: async (userData) => {
      const users = await getUsers();

      const existingUser = users.find(
        (user) =>
          user.email.trim().toLowerCase() ===
          userData.email.trim().toLowerCase(),
      );

      if (existingUser) {
        throw new Error("User already exists");
      }

      return registerUser(userData);
    },

    onSuccess: () => {
      toast.success("Account created successfully");
      navigate("/login");
    },

    onError: (error) => {
      console.log(error);
      setError(error.message);
      toast.error(error.message);
    },
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Password doesn't match");
      toast.error("Password doesn't match");
      return;
    }

    registerMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">

      <div className="flex w-full max-w-6xl items-center gap-24">

        <div className="hidden w-1/2 text-center lg:block">

          <h1
            className="
              text-4xl
              font-black
              tracking-wider
              text-emerald-400
              drop-shadow-[0_0_15px_rgba(16,185,129,0.6)]
            "
          >
            FitBoy Repack
          </h1>

          <p className="mt-3 text-sm text-slate-400">
            Your digital gaming universe
          </p>

        </div>


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


          <div className="mb-6">

            <h2 className="text-3xl font-bold text-white">
              Create your account
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Join us and start building your game library.
            </p>

          </div>


          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            autoComplete="name"
            className="
              mb-3
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

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
            className="
              mb-3
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


          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="new-password"
            className="
              mb-3
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

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            autoComplete="new-password"
            className="
              mb-3
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

          <button
            type="submit"
            disabled={registerMutation.isPending}
            className="
              mt-3
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
            {registerMutation.isPending
              ? "Creating..."
              : "Register"}
          </button>

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


          <p className="mt-6 text-center text-sm text-slate-400">

            Already have an account?{" "}

            <Link
              to="/login"
              className="
                font-semibold
                text-emerald-400
                transition
                hover:text-emerald-300
                hover:drop-shadow-[0_0_8px_rgba(16,185,129,0.7)]
              "
            >
              Login
            </Link>

          </p>

        </form>

      </div>
    </div>
  );
}

export default RegisterPage;