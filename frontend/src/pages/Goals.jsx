import React, { useEffect, useState } from "react";
import api from "../api";
import { useAuth } from "../auth/AuthContext";
import { Link } from "react-router-dom";

const emptyGoal = { title: "", description: "", category: "", target_date: "" };

const Goals = () => {
  const { token } = useAuth();
  const [goals, setGoals] = useState([]);
  const [form, setForm] = useState(emptyGoal);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return;
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    fetchGoals();
  }, [token]);

  const fetchGoals = async () => {
    try {
      const res = await api.get("/goals/");
      setGoals(res.data);
    } catch (err) {
      setError("Failed to load goals");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Create a new goal, then refresh the list.
      await api.post("/goals/", form);
      setForm(emptyGoal);
      fetchGoals();
    } catch (err) {
      setError("Could not create goal");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this goal?")) return;
    try {
      // Delete the goal, then remove it locally to avoid refetch.
      await api.delete(`/goals/${id}/`);
      setGoals((prev) => prev.filter((g) => g.id !== id));
    } catch (err) {
      setError("Could not delete goal");
    }
  };

  return (
    <div>
      <h2 className="mb-3">Your Goals</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="row">
        <div className="col-md-5">
          <div className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">Add Goal</h5>
              <form onSubmit={handleSubmit}>
                <div className="mb-2">
                  <label className="form-label">Title</label>
                  <input
                    className="form-control"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-2">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows="2"
                  />
                </div>
                <div className="mb-2">
                  <label className="form-label">Category</label>
                  <input
                    className="form-control"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Target Date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="target_date"
                    value={form.target_date}
                    onChange={handleChange}
                  />
                </div>
                <button className="btn btn-primary" disabled={loading}>
                  {loading ? "Saving..." : "Save Goal"}
                </button>
              </form>
            </div>
          </div>
        </div>
        <div className="col-md-7">
          <div className="list-group">
            {goals.map((goal) => (
              <div key={goal.id} className="list-group-item list-group-item-action d-flex justify-content-between align-items-start">
                <div>
                  <h5 className="mb-1">
                    <Link to={`/goals/${goal.id}`}>{goal.title}</Link>
                  </h5>
                  <small className="text-muted">
                    {goal.category || "General"} {goal.target_date && `· Target: ${goal.target_date}`}
                  </small>
                  {goal.description && <p className="mb-1">{goal.description}</p>}
                </div>
                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(goal.id)}>
                  Delete
                </button>
              </div>
            ))}
            {!goals.length && <div className="text-muted">No goals yet. Add one!</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Goals;
