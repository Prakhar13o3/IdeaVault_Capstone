import { FaGithub, FaTwitter } from "react-icons/fa";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">
          <h3>IdeaVault</h3>
          <p>Showcase your projects. Collaborate with developers.</p>
        </div>
        <div className="footer-links">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer">
            <FaGithub />
          </a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2025 IdeaVault. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
