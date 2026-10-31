import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signUp, sendOtp } from "../services/operations/authAPI";
import AuthLayout, { inputClass, primaryButton } from "../components/auth/AuthLayout";

const VerifyEmail = () => {
  const signupData = useSelector((state) => state.auth.signupData);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [otp, setOtp] = useState("");

  useEffect(() => {
    if (!signupData) navigate("/signup");
  }, [signupData, navigate]);

  if (!signupData) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const { accountType, firstName, lastName, email, password, confirmPassword } = signupData;
    dispatch(
      signUp(accountType, firstName, lastName, email, password, confirmPassword, otp, navigate)
    );
  };

  return (
    <AuthLayout
      title="Verify your email"
      subtitle={`We sent a code to ${signupData.email}`}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          className={`${inputClass} text-center tracking-widest text-lg`}
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={otp}
          placeholder="Enter OTP"
          onChange={(e) => setOtp(e.target.value)}
          required
        />
        <button type="submit" className={primaryButton}>Verify and sign up</button>
        <button
          type="button"
          onClick={() => dispatch(sendOtp(signupData.email, navigate))}
          className="text-sm text-blue-600 hover:underline"
        >
          Resend OTP
        </button>
      </form>
    </AuthLayout>
  );
};

export default VerifyEmail;