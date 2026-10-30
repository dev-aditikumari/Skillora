import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../services/operations/authAPI";
import { apiConnector } from "../services/apiConnector";
import { categoriesEndpoints } from "../services/api";
import { toSlug } from "../utils/slug";

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
    <img src={user.image} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
  ) : (
    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-semibold">
      {user?.firstName?.[0] || "?"}
    </div>
  );

  return (
    <nav className="relative h-[57px] border-b px-4 md:px-6 flex items-center justify-between bg-white">
      <Link to="/" className="text-xl font-bold" onClick={closeMenu}>Skillora</Link>

      {/* desktop */}
      <div className="hidden md:flex items-center gap-5">
        <div className="relative group">
          <span className="cursor-pointer">Catalog</span>
          <div className="absolute left-0 top-full z-20 hidden group-hover:block pt-2">
            <div className="flex flex-col bg-white border rounded-lg shadow-lg p-2 min-w-48">
              {categories.length === 0 ? (
                <p className="p-2 text-gray-400">No categories</p>
              ) : (
                categories.map((cat) => (
                  <Link key={cat._id} to={`/catalog/${toSlug(cat.name)}`}
                    className="p-2 rounded hover:bg-gray-100">
                    {cat.name}
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>

        {!token ? (
          <>
            <Link to="/login" className="hover:text-indigo-600">Login</Link>
            <Link to="/signup"
              className="bg-indigo-600 text-white px-4 py-1.5 rounded hover:bg-indigo-700">
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
              className="border px-3 py-1 rounded hover:bg-gray-100">
              Logout
            </button>
          </>
        )}
      </div>

      {/* mobile toggle */}
      <button
        className="md:hidden border rounded px-3 py-1"
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
              <Link to="/login" onClick={closeMenu}>Login</Link>
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