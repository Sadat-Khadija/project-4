import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api";
import { useAuth } from "../auth/AuthContext";

const emptyTask = { title: "", status: "todo" };
const emptyResource = { title: "", url: "", type: "article" };

const GoalDetail = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const [goal, setGoal] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [resources, setResources] = useState([]);
  const [taskForm, setTaskForm] = useState(emptyTask);
  const [resourceForm, setResourceForm] = useState(emptyResource);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return;
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    loadGoal();
    loadTasks();
    loadResources();
  }, [token]);

  const loadGoal = async () => {
    try {
      const res = await api.get(`/goals/${id}/`);
      setGoal(res.data);
    } catch (err) {
      setError("Could not load goal");
    }
  };

  const loadTasks = async () => {
    try {
      const res = await api.get(`/tasks/?goal=${id}`);
      setTasks(res.data);
    } catch (err) {
      setError("Could not load tasks");
    }
  };

  const loadResources = async () => {
    try {
      const res = await api.get(`/resources/?goal=${id}`);
      setResources(res.data);
    } catch (err) {
      setError("Could not load resources");
    }
  };

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    try {
      // Create task tied to this goal.
      await api.post("/tasks/", { ...taskForm, goal: id });
      setTaskForm(emptyTask);
      loadTasks();
    } catch {
      setError("Could not add task");
    }
  };

  const handleResourceSubmit = async (e) => {
    e.preventDefault();
    try {
      // Save resource link for this goal.
      await api.post("/resources/", { ...resourceForm, goal: id });
      setResourceForm(emptyResource);
      loadResources();
    } catch {
      setError("Could not add resource");
    }
  };

  const updateTaskStatus = async (taskId, status) => {
    try {
      // Update task status to reflect progress.
      await api.patch(`/tasks/${taskId}/`, { status });
      loadTasks();
    } catch {
      setError("Could not update task status");
    }
  };

  if (!goal) return <div className="mt-3">Loading goal...</div>;

  return (
    <div className="mt-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>{goal.title}</h2>
        <Link to="/goals" className="btn btn-secondary">
          Back to Goals
        </Link>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row">
        <div className="col-md-4">
          <div className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">Goal Info</h5>
              <p className="mb-1">{goal.description || "No description"}</p>
              <small className="text-muted">
                Category: {goal.category || "General"} <br />
                Target: {goal.target_date || "None"}
              </small>
            </div>
          </div>
          <div className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">Add Resource</h5>
              <form onSubmit={handleResourceSubmit}>
                <div className="mb-2">
                  <label className="form-label">Title</label>
                  <input
                    className="form-control"
                    value={resourceForm.title}
                    onChange={(e) => setResourceForm({ ...resourceForm, title: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-2">
                  <label className="form-label">URL</label>
                  <input
                    className="form-control"
                    value={resourceForm.url}
                    onChange={(e) => setResourceForm({ ...resourceForm, url: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Type</label>
                  <select
                    className="form-select"
                    value={resourceForm.type}
                    onChange={(e) => setResourceForm({ ...resourceForm, type: e.target.value })}
                  >
                    <option value="article">Article</option>
                    <option value="video">Video</option>
                    <option value="course">Course</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <button className="btn btn-primary w-100">Add Resource</button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">Tasks</h5>
              {!tasks.length && <p className="text-muted">No tasks yet.</p>}
              {tasks.map((task) => (
                <div key={task.id} className="border rounded p-2 mb-2">
                  <div className="d-flex justify-content-between">
                    <strong>{task.title}</strong>
                    <span className="badge bg-secondary">{task.status}</span>
                  </div>
                  <div className="mt-2">
                    {["todo", "doing", "done"].map((status) => (
                      <button
                        key={status}
                        className={`btn btn-sm me-2 ${task.status === status ? "btn-primary" : "btn-outline-primary"}`}
                        onClick={() => updateTaskStatus(task.id, status)}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">Add Task</h5>
              <form onSubmit={handleTaskSubmit}>
                <div className="mb-2">
                  <label className="form-label">Title</label>
                  <input
                    className="form-control"
                    value={taskForm.title}
                    onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    value={taskForm.status}
                    onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value })}
                  >
                    <option value="todo">To Do</option>
                    <option value="doing">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>
                <button className="btn btn-primary w-100">Add Task</button>
              </form>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Resources</h5>
              {!resources.length && <p className="text-muted">No resources yet.</p>}
              {resources.map((res) => (
                <div key={res.id} className="mb-2">
                  <a href={res.url} target="_blank" rel="noreferrer">
                    {res.title}
                  </a>
                  <small className="text-muted ms-2">({res.type})</small>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalDetail;
