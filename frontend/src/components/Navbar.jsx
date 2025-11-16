import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { FiLogOut, FiUser, FiHome, FiGrid, FiLogIn, FiUserPlus } from "react-icons/fi";
import "./Navbar.css";

function Navbar() {
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="nav">
      <div className="nav-brand">
        <h2 className="logo">🚀 IdeaVault</h2>
      </div>

      <div className="nav-links">
        <Link to="/" className="nav-link">
          <FiHome /> Home
        </Link>
        {token ? (
          <>
            <Link to="/dashboard" className="nav-link">
              <FiGrid /> Dashboard
            </Link>
            <button onClick={handleLogout} className="nav-btn logout">
              <FiLogOut /> Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">
              <FiLogIn /> Login
            </Link>
            <Link to="/signup" className="nav-link signup">
              <FiUserPlus /> Signup
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
