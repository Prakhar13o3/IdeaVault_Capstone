import { useEffect, useState } from "react";
import api from "../services/api";
import ProjectCard from "../components/ProjectCard";
import { FiSearch, FiTrendingUp } from "react-icons/fi";
import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    api.get("/projects")
      .then((res) => setProjects(res.data.projects || res.data))
      .catch((err) => console.log(err));
  }, []);

  // Show all projects (search removed from hero for a cleaner look)
  const filteredProjects = projects;

  return (
    <div className="home-container">
      <div className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Welcome to <span className="gradient-text">IdeaVault</span>
          </h1>
          <p className="hero-subtitle">
            Share your best project ideas, discover inspiring work, and
            collaborate with builders around the world.
          </p>
          <div className="hero-actions">
            <Link to="/add-project" className="hero-cta">Add Your Project</Link>
            <Link to="/dashboard" className="hero-secondary">Browse Projects</Link>
          </div>
        </div>
        <div className="hero-bg"></div>
      </div>

      <div className="projects-section">
        <div className="section-header">
          <h2 className="section-title">
            <FiTrendingUp /> Latest Projects
          </h2>
          <span className="project-count">{filteredProjects.length} projects</span>
        </div>

        <div className="projects-grid">
          {filteredProjects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
