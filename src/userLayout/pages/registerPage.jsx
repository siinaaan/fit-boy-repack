import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser,getUsers } from "../api/authApi";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

function RegisterPage() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("")

  const registerMutation = useMutation({
    mutationFn: async (userData) => {
      const users = await getUsers();

      const existingUser = users.find(
        (user) => user.email.trim().toLowerCase() === userData.email.trim().toLowerCase()
      );
      if(existingUser){
        throw new Error("User already exists");
      }
      return registerUser(userData);
    },

    onSuccess: () => {
      toast.success("Account created successfully")
      navigate("/login");
    },

    onError: (error) => {
      console.log(error);
      setError(error.message);
      toast.error(error.message)
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

    if(formData.password !== formData.confirmPassword){
      setError("Password doesn't match");
      toast.error("Password doesn't match");
      return;
    }
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
        
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
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

            {error &&(
          <div className="w-80 rounded-md px-4 py-3 text-red-500">
            {error}</div>
        )}
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