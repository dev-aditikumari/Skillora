import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { resetPassword } from "../services/operations/authAPI";
import AuthLayout, { inputClass, primaryButton } from "../components/auth/AuthLayout";

const UpdatePassword = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ password: "", confirmPassword: "" });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    dispatch(resetPassword(formData.password, formData.confirmPassword, id, navigate));
  };

  return (
    <AuthLayout
      title="Choose a new password"
      footer={
        <Link to="/login" className="text-indigo-600 hover:underline">← Back to login</Link>
      }
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <input className={inputClass} type="password" autoComplete="new-password" name="password" placeholder="New password"
          value={formData.password} onChange={handleChange} required />
        <input className={inputClass} type="password" autoComplete="new-password" name="confirmPassword"
          placeholder="Confirm new password" value={formData.confirmPassword}
          onChange={handleChange} required />
        <button type="submit" className={primaryButton}>Reset password</button>
      </form>
    </AuthLayout>
  );
};

export default UpdatePassword;