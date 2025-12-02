import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import "./ProjectDetails.css";

function ProjectDetails() {
  const { id } = useParams(); // URL se :id nikalna
  const [project, setProject] = useState(null); // project data
  const [loading, setLoading] = useState(true); // loading state
  const [error, setError] = useState(null); // error
  const { user: authUser } = useContext(AuthContext);
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [msgStatus, setMsgStatus] = useState("");

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

        {/* Leave message button - only show if viewer is not the owner */}
        {authUser && authUser.id !== project.userId && (
          <div className="leave-message">
            {!showMessageForm ? (
              <button className="pd-btn" onClick={() => setShowMessageForm(true)}>Leave a message</button>
            ) : (
              <div className="message-form">
                <textarea value={messageText} onChange={(e) => setMessageText(e.target.value)} placeholder="Write a message to the project owner..."></textarea>
                <div className="message-actions">
                  <button className="pd-btn" onClick={async () => {
                    if (!messageText.trim()) {
                      setMsgStatus('Message cannot be empty');
                      return;
                    }
                    try {
                      setMsgStatus('Sending...');
                      const response = await api.post('/messages', {
                        toUserId: project.userId,
                        projectId: project.id,
                        content: messageText.trim()
                      });
                      setMsgStatus('✓ Message sent successfully!');
                      setMessageText('');
                      setTimeout(() => {
                        setShowMessageForm(false);
                        setMsgStatus('');
                      }, 1500);
                    } catch (err) {
                      const errMsg = err.response?.data?.message || err.message || 'Failed to send message';
                      setMsgStatus(`✗ ${errMsg}`);
                    }
                  }}>Send</button>
                  <button className="pd-btn secondary" onClick={() => {
                    setShowMessageForm(false);
                    setMessageText('');
                    setMsgStatus('');
                  }}>Cancel</button>
                </div>
                {msgStatus && <p className="msg-status">{msgStatus}</p>}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectDetails;
