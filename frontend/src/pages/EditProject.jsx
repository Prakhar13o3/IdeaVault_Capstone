import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import "./EditProject.css";

function EditProject() {
  const { id } = useParams(); // URL project id
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    techStack: "",
    category: "",
    tags: "",
    githubLink: "",
    liveDemo: ""
  });

  const [loading, setLoading] = useState(true);

  // Fetch existing project details for pre-fill
  useEffect(() => {
    api
      .get(`/projects/${id}`)
      .then((res) => {
        setFormData(res.data.project || res.data);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  }, [id]);

  // For input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Submit edit project
  const handleSubmit = (e) => {
    e.preventDefault();

    api
      .put(`/projects/${id}`, formData)
      .then(() => {
        alert("Project Updated Successfully!");
        navigate(`/project/${id}`);
      })
      .catch((err) => console.log(err));
  };

  if (loading) {
    return <h2 className="edit-loading">Loading project...</h2>;
  }

  return (
    <div className="edit-container">
      <form className="edit-box" onSubmit={handleSubmit}>
        <h1>Edit Project</h1>

        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Project Title"
          required
        />

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Project Description"
          required
        />

        <input
          name="techStack"
          value={formData.techStack}
          onChange={handleChange}
          placeholder="Tech Stack"
        />

        <input
          name="category"
          value={formData.category}
          onChange={handleChange}
          placeholder="Category"
        />

        <input
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          placeholder="Tags"
        />

        <input
          name="githubLink"
          value={formData.githubLink}
          onChange={handleChange}
          placeholder="GitHub Link"
        />

        <input
          name="liveDemo"
          value={formData.liveDemo}
          onChange={handleChange}
          placeholder="Live Demo URL"
        />

        <button className="edit-btn" type="submit">
          Update Project
        </button>
      </form>
    </div>
  );
}

export default EditProject;
