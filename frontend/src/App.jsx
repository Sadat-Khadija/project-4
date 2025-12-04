import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Goals from "./pages/Goals";
import Dashboard from "./pages/Dashboard";
import GoalDetail from "./pages/GoalDetail";

const App = () => {
  return (
    <>
      <NavBar />
      <div className="container">
        <Routes>
          {/* Redirect root to dashboard once authenticated */}
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/goals"
            element={
              <PrivateRoute>
                <Goals />
              </PrivateRoute>
            }
          />
          <Route
            path="/goals/:id"
            element={
              <PrivateRoute>
                <GoalDetail />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </>
  );
};

export default App;
