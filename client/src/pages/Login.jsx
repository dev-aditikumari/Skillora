import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../services/operations/authAPI";
import AuthLayout, { inputClass, primaryButton } from "../components/auth/AuthLayout";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("expired")) {
      toast.error("Your session expired. Please log in again.");
    }
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(formData.email, formData.password, navigate));
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to continue learning"
      footer={
        <>
          New here?{" "}
          <Link to="/signup" className="font-medium text-indigo-600 hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          Email
          <input
            className={inputClass}
            type="email"
            autoComplete="email"
            name="email"
            value={formData.email}
            placeholder="you@example.com"
            onChange={handleChange}
            required
          />
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          Password
          <input
            className={inputClass}
            type="password"
            autoComplete="current-password"
            name="password"
            value={formData.password}
            placeholder="Your password"
            onChange={handleChange}
            required
          />
        </label>

        <Link to="/forget-password" className="-mt-2 self-end text-sm text-indigo-600 hover:underline">
          Forgot password?
        </Link>

        <button type="submit" className={primaryButton}>Log in</button>
      </form>
    </AuthLayout>
  );
};

export default Login;
