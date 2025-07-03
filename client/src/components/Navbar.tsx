import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ThemeSwitch from "./ThemeSwitch";
import { Menu, X } from "lucide-react"; // Icons

const NavBar = () => {
  const { user, logout, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false); // Toggle mobile menu

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = isLoggedIn
    ? [
        { name: "Home", path: "/" },
        { name: "Create Post", path: "/create-post" },
        { name: "Profile", path: "/profile" }
      ]
    : [
        { name: "Home", path: "/" },
        { name: "Sign Up", path: "/signup" },
        { name: "Login", path: "/login" }
      ];

  return (
    <nav className="bg-base-300 shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Left: Logo / Theme */}
        <div className="flex items-center gap-4">
          <ThemeSwitch />
        </div>

        {/* Hamburger (Mobile) */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="focus:outline-none">
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Menu items (Desktop) */}
        <div className="hidden md:flex items-center gap-4">
          {navItems.map((item) => (
            <Link key={item.name} to={item.path} className="hover:underline">
              {item.name}
            </Link>
          ))}
          {isLoggedIn && (
            <>
              <span>Hi, {user?.username || "User"}</span>
              <button onClick={handleLogout} className="btn btn-sm">
                Logout
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {isOpen && (
        <div className="md:hidden bg-base-200 px-4 pb-4 flex flex-col gap-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className="hover:underline"
            >
              {item.name}
            </Link>
          ))}
          {isLoggedIn && (
            <>
              <span>Hi, {user?.username || "User"}</span>
              <button onClick={() => { handleLogout(); setIsOpen(false); }} className="btn btn-sm">
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default NavBar;
