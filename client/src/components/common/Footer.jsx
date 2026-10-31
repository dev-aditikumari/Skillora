import { Link } from "react-router-dom";

const year = new Date().getFullYear();

const Footer = () => (
  <footer className="border-t bg-white">
    <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-5 text-sm text-gray-500 sm:flex-row">
      <p>© {year} Skillora</p>
      <Link to="/" className="hover:text-blue-600">Home</Link>
    </div>
  </footer>
);

export default Footer;
