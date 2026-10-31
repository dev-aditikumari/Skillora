import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { getPasswordResetToken } from "../services/operations/authAPI";
import AuthLayout, { inputClass, primaryButton } from "../components/auth/AuthLayout";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(getPasswordResetToken(email, setEmailSent));
  };

  return (
    <AuthLayout
      title={!emailSent ? "Reset your password" : "Check your email"}
      subtitle={
        !emailSent
          ? "Enter your email and we'll send you a link to reset your password"
          : `We've sent a reset link to ${email}. It expires in 15 minutes`
      }
      footer={
        <Link to="/login" className="text-blue-600 hover:underline">← Back to login</Link>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {!emailSent && (
          <input
            className={inputClass}
            type="email"
            value={email}
            required
            placeholder="Enter email address"
            onChange={(e) => setEmail(e.target.value)}
          />
        )}
        <button type="submit" className={primaryButton}>
          {!emailSent ? "Send reset link" : "Resend email"}
        </button>
      </form>
    </AuthLayout>
  );
};

export default ForgetPassword;