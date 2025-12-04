import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

// Simple nav with conditional links based on auth state.
const NavBar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          Career Tracker
        </Link>
        <div>
          {isAuthenticated ? (
            <>
              <Link className="btn btn-outline-light me-2" to="/goals">
                Goals
              </Link>
              <Link className="btn btn-outline-light me-2" to="/dashboard">
                Dashboard
              </Link>
              <button className="btn btn-light" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="btn btn-outline-light me-2" to="/login">
                Login
              </Link>
              <Link className="btn btn-light" to="/register">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
