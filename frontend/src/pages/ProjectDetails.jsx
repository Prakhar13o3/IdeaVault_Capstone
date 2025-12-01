import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import "./ProjectDetails.css";

function ProjectDetails() {
  const { id } = useParams(); // URL se :id nikalna
  const [project, setProject] = useState(null); // project data
  const [loading, setLoading] = useState(true); // loading state
  const [error, setError] = useState(null); // error

  useEffect(() => {
    api
      .get(`/projects/${id}`)
      .then((res) => {
        setProject(res.data.project || res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Project not found");
        setLoading(false);
      });
  }, [id]);

  if (loading) return <h2 className="pd-loading">Loading...</h2>;
  if (error) return <h2 className="pd-error">{error}</h2>;

  return (
    <div className="pd-container">
      <div className="pd-box">
        <h1>{project.title}</h1>

        {project.ownerName && (
          <p className="pd-owner"><strong>By:</strong> {project.ownerName}</p>
        )}

        <p className="pd-desc">{project.description}</p>

        <p>
          <strong>Tech Stack:</strong> {project.techStack}
        </p>

        {project.category && (
          <p>
            <strong>Category:</strong> {project.category}
          </p>
        )}

        {project.tags && (
          <p>
            <strong>Tags:</strong> {project.tags}
          </p>
        )}

        {project.githubLink && (
          <a
            href={project.githubLink}
            target="_blank"
            className="pd-btn"
            rel="noreferrer"
          >
            GitHub
          </a>
        )}

        {project.liveDemo && (
          <a
            href={project.liveDemo}
            target="_blank"
            className="pd-btn live"
            rel="noreferrer"
          >
            Live Demo
          </a>
        )}
      </div>
    </div>
  );
}

export default ProjectDetails;
