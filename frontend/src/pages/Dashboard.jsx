import React, { useEffect, useState } from "react";
import api from "../api";
import { useAuth } from "../auth/AuthContext";

const Dashboard = () => {
  const { token } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return;
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    api
      .get("/dashboard/summary/")
      .then((res) => setData(res.data))
      .catch(() => setError("Could not load dashboard data"));
  }, [token]);

  if (error) return <div className="alert alert-danger mt-3">{error}</div>;
  if (!data) return <div className="mt-3">Loading...</div>;

  const { goals_count, tasks_total, tasks_status = {}, goals_by_category = {} } = data;

  return (
    <div className="mt-3">
      <h2 className="mb-3">Dashboard</h2>
      <div className="row">
        <div className="col-md-3">
          <div className="card text-bg-primary mb-3">
            <div className="card-body">
              <h5 className="card-title">Total Goals</h5>
              <p className="display-6">{goals_count}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-bg-success mb-3">
            <div className="card-body">
              <h5 className="card-title">Tasks Done</h5>
              <p className="display-6">{tasks_status.done || 0}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-bg-warning mb-3">
            <div className="card-body">
              <h5 className="card-title">In Progress</h5>
              <p className="display-6">{tasks_status.doing || 0}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-bg-secondary mb-3">
            <div className="card-body">
              <h5 className="card-title">To Do</h5>
              <p className="display-6">{tasks_status.todo || 0}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">Goals by Category</h5>
              {!Object.keys(goals_by_category).length && <p className="text-muted">No data yet.</p>}
              {Object.entries(goals_by_category).map(([cat, total]) => (
                <div key={cat} className="d-flex justify-content-between">
                  <span>{cat}</span>
                  <strong>{total}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">Tasks Total</h5>
              <p className="mb-0">Total tasks: {tasks_total}</p>
              <small className="text-muted">Breakdown shown above.</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
