import { Link, useNavigate } from "react-router-dom";

import {
  getUser,
  isAuthenticated,
  logoutUser,
} from "../services/authService";

function Navbar() {
  const navigate = useNavigate();

  const authenticated = isAuthenticated();
  const user = getUser();

  function handleLogout() {
    logoutUser();
    navigate("/login");
  }

  return (
    <header className="navbar">
      <Link to="/" className="navbar-brand">
        Emmvee
      </Link>

      <nav className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/careers">Careers</Link>
        <Link to="/contact">Contact</Link>

        {authenticated && (
          <Link to="/applications">
            My Applications
          </Link>
        )}

        {!authenticated && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}

        {authenticated && user?.role === "ADMIN" && (
          <Link to="/admin">
            Admin Dashboard
          </Link>
        )}

        {authenticated && (
          <button
            type="button"
            className="navbar-logout"
            onClick={handleLogout}
          >
            Logout
          </button>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
