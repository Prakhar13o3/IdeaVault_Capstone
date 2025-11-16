import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaCheck } from "react-icons/fa";
import "./AddProject.css";

function AddProject() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    techStack: "",
    category: "",
    githubLink: "",
    liveDemo: "",
    tags: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/projects", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        navigate("/dashboard");
      }, 2000);
    } catch (err) {
      alert(err.response?.data?.message || err.response?.data?.msg || "Error adding project");
    } finally {
      setLoading(false);
    }
  };

  const handleAddAnother = () => {
    setForm({
      title: "",
      description: "",
      techStack: "",
      category: "",
      githubLink: "",
      liveDemo: "",
      tags: "",
    });
    setSuccess(false);
  };

  if (!token) {
    navigate("/login");
    return null;
  }

  return (
    <div className="add-container">
      <form className="add-box" onSubmit={handleSubmit}>
        <h2>
          {success ? (
            <>
              <FaCheck className="success-icon" /> Project Added Successfully!
            </>
          ) : (
            <>
              <FaPlus className="add-icon" /> Add New Project
            </>
          )}
        </h2>

        {!success && (
          <>
            <input
              name="title"
              placeholder="Project Title"
              value={form.title}
              onChange={handleChange}
              required
            />

            <textarea
              name="description"
              placeholder="Project Description"
              value={form.description}
              onChange={handleChange}
              required
            />

            <input
              name="techStack"
              placeholder="Tech Stack (React, Node, etc.)"
              value={form.techStack}
              onChange={handleChange}
              required
            />

            <input
              name="category"
              placeholder="Category (Web, App, AI, etc.)"
              value={form.category}
              onChange={handleChange}
            />

            <input
              name="githubLink"
              placeholder="GitHub Link"
              value={form.githubLink}
              onChange={handleChange}
              type="url"
            />

            <input
              name="liveDemo"
              placeholder="Live Demo URL"
              value={form.liveDemo}
              onChange={handleChange}
              type="url"
            />

            <input
              name="tags"
              placeholder="Tags (comma separated)"
              value={form.tags}
              onChange={handleChange}
            />

            <button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <div className="spinner-small"></div>
                  Adding Project...
                </>
              ) : (
                <>
                  <FaPlus className="btn-icon" /> Add Project
                </>
              )}
            </button>
          </>
        )}

        {success && (
          <div className="success-actions">
            <button
              type="button"
              className="add-another-btn"
              onClick={handleAddAnother}
            >
              <FaPlus className="btn-icon" /> Add Another Project
            </button>
            <button
              type="button"
              className="view-dashboard-btn"
              onClick={() => navigate("/dashboard")}
            >
              View Dashboard
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

export default AddProject;
