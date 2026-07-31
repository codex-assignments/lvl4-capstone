import React from "react";
import Logo from "../assets/Logo";
import { NavLink, useNavigate } from "react-router";
import { useResources } from "../context/ResourceContext";

export default function NavBar() {
  // bring in states and logout function
  const { token, user, logout } = useResources();
const navigate = useNavigate();
    
  const handleLogout = () => {
      logout();
    //   hooks can't be called inside event handlers
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="nav-logo">
        <Logo size={36} color="primary" />
        <NavLink to="/">AppTrack</NavLink>
      </div>
      <div className="nav-links">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "nav-link-active nav-link" : "nav-link"
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/log"
          className={({ isActive }) =>
            isActive ? "nav-link-active nav-link" : "nav-link"
          }
        >
          Applications
        </NavLink>

        {/* clickable user email and logout btn, if logged in, otherwise show Sign in directing to auth component */}
        <div className="nav-auth">
          {token ? (
            <div className="user-menu">
              <span className="user-email">{user?.email}</span>
              <button onClick={handleLogout} className="logout-btn">
                Log out
              </button>
            </div>
          ) : (
            <NavLink to="/login" className="login-btn">
              Login / Manage
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
}
