import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useResources } from "../context/ResourceContext";

export default function NavBar() {
  // bring in states and logout function
  const { token, user, logout } = useResources();

  const handleLogout = () => {
    logout();
    useNavigate("/");
  };

  return (
    //   classnames: navbar, nav-logo, nav-links, nav-link, nav-link-active
    <nav className="navbar">
      <div className="nav-logo">
        <NavLink to="/">AppTrack</NavLink>
      </div>
      <div className="nav-links">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "nav-link-active" : "nav-link"
          }
        >
          Dashboard
              </NavLink>
              
        <NavLink
          to="/log"
          className={({ isActive }) =>
            isActive ? "nav-link-active" : "nav-link"
          }
        >
          Status Log
              </NavLink>
              
        <NavLink
          to="/manage"
          className={({ isActive }) =>
            isActive ? "nav-link-active" : "nav-link"
          }
        >
          {token ? "Manage / Add" : "Login"}
              </NavLink>
              
      </div>
    </nav>
  );
}
