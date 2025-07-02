import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NavBar = () => {
  const { user, logout, isLoggedIn } = useAuth();
  const navigate = useNavigate();

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
    <nav style={{ padding: "1rem", borderBottom: "1px solid #ccc" }}>
      {navItems.map((item) => (
        <Link
          key={item.name}
          to={item.path}
          style={{ marginRight: "1rem", textDecoration: "none" }}
        >
          {item.name}
        </Link>
      ))}
      {isLoggedIn && (
        <>
          <span style={{ marginRight: "1rem" }}>Hi, {user}</span>
          <button onClick={handleLogout}>Logout</button>
        </>
      )}
    </nav>
  );
};

export default NavBar;
