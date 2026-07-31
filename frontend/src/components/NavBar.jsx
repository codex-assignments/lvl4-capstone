import React from "react";
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
    //   classnames: navbar, nav-logo, nav-links, nav-link, nav-link-active, nav-auth, user-menu,user-email, login-btn, logout-btn
    <nav className="navbar">
      <div className="nav-logo">
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
          Status Log
        </NavLink>

        <NavLink
          to="/manage"
          className={({ isActive }) =>
            isActive ? "nav-link-active nav-link" : "nav-link"
          }
        >
          {token ? "Manage / Add" : "Login"}
        </NavLink>

        {/* clickable user email and logout btn, if logged in, otherwise show Sign in directing to auth component */}
        <div className="nav-auth">
          {token ? (
            <div className="user-menu">
              <span className="user-email">{user?.email}</span>
              <button onClick={handleLogout} className="logout-btn">Log out</button>
            </div>
          ) : (
            <NavLink
              to="/manage"
              className="login-btn"
            >
              Sign In
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
}
