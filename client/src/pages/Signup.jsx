import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { sendOtp } from "../services/operations/authAPI";
import { setSignUpData } from "../slices/authSlice";
import AuthLayout, { inputClass, primaryButton } from "../components/auth/AuthLayout";

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [type, setType] = useState("Student");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (formData.password.length < 8 || !/[A-Za-z]/.test(formData.password) || !/\d/.test(formData.password)) {
      toast.error("Password must be at least 8 characters with a letter and a number");
      return;
    }
    dispatch(setSignUpData({ ...formData, accountType: type }));
    dispatch(sendOtp(formData.email, navigate));
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start learning or teaching today"
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-indigo-600 hover:underline">Log in</Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-1 rounded-lg bg-slate-100 p-1">
          {["Student", "Instructor"].map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => setType(role)}
              className={`py-1.5 rounded-md text-sm ${
                type === role ? "bg-white shadow-sm font-semibold text-indigo-700" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {role}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <input className={inputClass} type="text" name="firstName" placeholder="First name"
            value={formData.firstName} onChange={handleChange} required />
          <input className={inputClass} type="text" name="lastName" placeholder="Last name"
            value={formData.lastName} onChange={handleChange} required />
        </div>

        <input className={inputClass} type="email" name="email" placeholder="Email"
          value={formData.email} onChange={handleChange} required />
        <input className={inputClass} type="password" autoComplete="new-password" name="password" placeholder="Password (8+ chars, letter and number)" minLength={8}
          value={formData.password} onChange={handleChange} required />
        <input className={inputClass} type="password" autoComplete="new-password" name="confirmPassword"
          placeholder="Confirm password" value={formData.confirmPassword}
          onChange={handleChange} required />

        <button type="submit" className={primaryButton}>Sign up</button>
      </form>
    </AuthLayout>
  );
};

export default Signup;