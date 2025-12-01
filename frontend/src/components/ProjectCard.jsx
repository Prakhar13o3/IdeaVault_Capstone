import { Link, useNavigate } from "react-router-dom";
import { FiEdit, FiExternalLink, FiCode, FiTag, FiUser, FiClock } from "react-icons/fi";
import "./ProjectCard.css";

function ProjectCard({ project }) {
  const navigate = useNavigate();

  // Format the creation date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">{project.title}</h3>
        {project.category && (
          <span className="card-category">{project.category}</span>
        )}
      </div>

      <p className="card-description">
        {project.description.substring(0, 120)}...
      </p>

      {project.ownerName && (
        <div className="card-owner">
          <FiUser className="owner-icon" />
          <span>Owner : {project.ownerName}</span>
        </div>
      )}

      {project.createdAt && (
        <div className="card-date">
          <FiClock className="date-icon" />
          <span>{formatDate(project.createdAt)}</span>
        </div>
      )}

      <div className="card-tech">
        <FiCode className="tech-icon" />
        <span>{project.techStack}</span>
      </div>

      {project.tags && (
        <div className="card-tags">
          <FiTag className="tag-icon" />
          <div className="tags">
            {project.tags.split(',').slice(0, 3).map((tag, index) => (
              <span key={index} className="tag">#{tag.trim()}</span>
            ))}
          </div>
        </div>
      )}

      <div className="card-actions">
        <Link to={`/project/${project.id}`} className="card-btn primary">
          <FiExternalLink /> View Details
        </Link>
        <button 
          onClick={() => navigate(`/edit-project/${project.id}`)} 
          className="card-btn secondary"
        >
          <FiEdit /> Edit
        </button>
      </div>
    </div>
  );
}

export default ProjectCard;
