import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/authApi";
import { Link } from "react-router-dom";

function RegisterPage() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const registerMutation = useMutation({
    mutationFn: registerUser,

    onSuccess: () => {
      alert("Registration success");
      navigate("/login");
    },

    onError: (error) => {
      console.log(error);
      alert("Registration failed");
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

    registerMutation.mutate(formData);
  };

  return (
    <div className="flex flex-col justify-center items-center mt-50">
      <h1 className="text-4xl font-extrabold">Register</h1>

      <form onSubmit={handleSubmit}
      className="flex flex-col  py-13 px-4 w-100 border rounded-md mt-2 gap-2">

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="border rounded-sm py-2 pl-2"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="border rounded-sm py-2 pl-2"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="border rounded-sm py-2 pl-2"
        />

        <button
          type="submit"
          disabled={registerMutation.isPending}
          className="border bg-gray-200 rounded-b-full"
        >
          {registerMutation.isPending
            ? "Creating..."
            : "Register"}
        </button>

        <p>
            Already have an account?{" "}
            <Link to="/login">
              <span className="font-semibold text-blue-500">
                Login
              </span>
            </Link>
        </p>
      </form>
    </div>
  );
}

export default RegisterPage;