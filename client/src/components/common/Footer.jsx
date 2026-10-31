import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Logo from "./Logo";

const Footer = () => {
  const token = useSelector((state) => state.auth.token);
  return (
  <footer className="border-t bg-white">
    <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-8 text-sm text-slate-500 sm:flex-row">
      <div className="flex items-center gap-3">
        <Logo />
        <span className="hidden sm:inline">Learn without limits</span>
      </div>
      <nav className="flex gap-5">
        <Link to="/" className="hover:text-indigo-600">Home</Link>
        {token ? (
          <Link to="/dashboard/my-profile" className="hover:text-indigo-600">Dashboard</Link>
        ) : (
          <>
            <Link to="/signup" className="hover:text-indigo-600">Sign up</Link>
            <Link to="/login" className="hover:text-indigo-600">Log in</Link>
          </>
        )}
      </nav>
      <p>© {new Date().getFullYear()} Skillora. All rights reserved.</p>
    </div>
  </footer>
  );
};

export default Footer;
