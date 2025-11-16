import { useEffect, useState } from "react";
import api from "../services/api";
import ProjectCard from "../components/ProjectCard";
import { FiSearch, FiTrendingUp } from "react-icons/fi";
import "./Home.css";

function Home() {
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    api.get("/projects")
      .then((res) => setProjects(res.data.projects || res.data))
      .catch((err) => console.log(err));
  }, []);

  const filteredProjects = projects.filter(project =>
    project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.techStack?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="home-container">
      <div className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Welcome to <span className="gradient-text">IdeaVault</span>
          </h1>
          <p className="hero-subtitle">
            Showcase your projects. Explore ideas. Collaborate with developers.
          </p>
          <div className="search-container">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
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
