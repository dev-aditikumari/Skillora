import { useDispatch } from "react-redux";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../services/operations/authAPI";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(formData.email, formData.password, navigate));
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm border rounded-lg p-6 shadow-sm flex flex-col gap-4"
      >
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <p className="text-sm text-gray-500 -mt-2">Log in to continue learning</p>

        <label className="flex flex-col gap-1 text-sm">
          Email
          <input
            className="border p-2 rounded"
            type="email"
            name="email"
            value={formData.email}
            placeholder="you@example.com"
            onChange={handleChange}
            required
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Password
          <input
            className="border p-2 rounded"
            type="password"
            name="password"
            value={formData.password}
            placeholder="Your password"
            onChange={handleChange}
            required
          />
        </label>

        <Link
          to="/forget-password"
          className="text-sm text-indigo-600 hover:underline self-end -mt-2"
        >
          Forgot password?
        </Link>

        <button
          type="submit"
          className="bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
        >
          Log in
        </button>

        <p className="text-sm text-gray-500 text-center">
          New here?{" "}
          <Link to="/signup" className="text-indigo-600 hover:underline">
            Create an account
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;