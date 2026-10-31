import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../services/operations/authAPI";
import { apiConnector } from "../services/apiConnector";
import { categoriesEndpoints } from "../services/api";
import { toSlug } from "../utils/slug";
import Logo from "./common/Logo";

const Navbar = () => {
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.profile.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiConnector("GET", categoriesEndpoints.CATEGORIES_API);
        setCategories(response.data.categories);
      } catch (error) {
        console.error("Could not fetch categories", error);
      }
    };
    fetchCategories();
  }, []);

  const closeMenu = () => setMenuOpen(false);
  const handleLogout = () => {
    closeMenu();
    dispatch(logout(navigate));
  };

  const avatar = user?.image ? (
    <img src={user.image} alt="Your profile picture" className="w-8 h-8 rounded-full object-cover" />
  ) : (
    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-semibold">
      {user?.firstName?.[0] || "?"}
    </div>
  );

  return (
    <nav className="sticky top-0 z-40 h-[57px] border-b bg-white/90 px-4 backdrop-blur md:px-6 flex items-center justify-between">
      <Link to="/" onClick={closeMenu} aria-label="Skillora home">
        <Logo />
      </Link>

      {/* desktop */}
      <div className="hidden md:flex items-center gap-5">
        <div className="relative group">
          <span className="cursor-pointer font-medium text-slate-700 hover:text-indigo-600">Catalog</span>
          <div className="absolute left-0 top-full z-20 hidden group-hover:block pt-2">
            <div className="flex flex-col bg-white border rounded-xl shadow-lg p-2 min-w-52">
              {categories.length === 0 ? (
                <p className="p-2 text-gray-400">No categories</p>
              ) : (
                categories.map((cat) => (
                  <Link key={cat._id} to={`/catalog/${toSlug(cat.name)}`}
                    className="p-2 rounded-lg hover:bg-indigo-50 hover:text-indigo-700">
                    {cat.name}
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>

        {!token ? (
          <>
            <Link to="/login" className="font-medium text-slate-700 hover:text-indigo-600">Log in</Link>
            <Link to="/signup"
              className="btn-primary !py-1.5">
              Sign up
            </Link>
          </>
        ) : (
          <>
            <Link to="/dashboard/my-profile" className="flex items-center gap-2 hover:text-indigo-600">
              {avatar}
              <span>{user?.firstName}</span>
            </Link>
            <button onClick={handleLogout}
              className="btn-secondary !px-3 !py-1">
              Logout
            </button>
          </>
        )}
      </div>

      {/* mobile toggle */}
      <button
        className="md:hidden rounded-lg border px-3 py-1 hover:bg-slate-50"
        onClick={() => setMenuOpen((open) => !open)}
        aria-label="Toggle menu"
      >
        {menuOpen ? "✕" : "☰"}
      </button>

      {/* mobile panel */}
      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 z-30 bg-white border-b shadow-md p-4 flex flex-col gap-3">
          <p className="text-xs uppercase text-gray-400">Catalog</p>
          {categories.length === 0 ? (
            <p className="text-gray-400">No categories</p>
          ) : (
            categories.map((cat) => (
              <Link key={cat._id} to={`/catalog/${toSlug(cat.name)}`} onClick={closeMenu}>
                {cat.name}
              </Link>
            ))
          )}
          <hr />
          {!token ? (
            <>
              <Link to="/login" onClick={closeMenu}>Log in</Link>
              <Link to="/signup" onClick={closeMenu}>Sign up</Link>
            </>
          ) : (
            <>
              <Link to="/dashboard/my-profile" onClick={closeMenu}
                className="flex items-center gap-2">
                {avatar}
                <span>{user?.firstName}</span>
              </Link>
              <button onClick={handleLogout} className="text-left text-red-600">Logout</button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;