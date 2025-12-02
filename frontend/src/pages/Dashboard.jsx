import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import ProjectCard from "../components/ProjectCard";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { FiPlus, FiGrid, FiTrendingUp, FiUser, FiSearch } from "react-icons/fi";
import "./Dashboard.css";

function Dashboard() {
  const { token, user: authUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id: openedId } = useParams();

  const [openedUser, setOpenedUser] = useState(null);

  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({ total: 0, web: 0, mobile: 0 });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(""); // "" = All, "web", "mobile"
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    totalProjects: 0,
    totalPages: 0,
    hasMore: false,
    limit: 10
  });

  const filteredProjects = projects.filter(project =>
    project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.techStack?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    // Fetch projects with pagination and filtering
    const params = new URLSearchParams({
      page: currentPage.toString(),
      limit: "10"
    });

    if (selectedCategory) {
      params.append("category", selectedCategory);
    }

    api
      .get(`/projects?${params.toString()}`)
      .then((res) => {
        const projectsData = res.data.projects || res.data;
        setProjects(projectsData);

        // Set pagination data if available
        if (res.data.pagination) {
          setPagination(res.data.pagination);
        }

        // Calculate stats from all projects (we need to fetch total stats separately or calculate from metadata)
        const total = res.data.pagination?.totalProjects || projectsData.length;
        const web = projectsData.filter(p => p.category?.toLowerCase().includes('web')).length;
        const mobile = projectsData.filter(p => p.category?.toLowerCase().includes('mobile') || p.category?.toLowerCase().includes('app')).length;
        setStats({ total, web, mobile });
      })
      .catch((err) => console.log(err));
  }, [token, navigate, currentPage, selectedCategory]);

  useEffect(() => {
    // If a specific user's dashboard is opened, fetch their info
    if (openedId) {
      api.get(`/users/${openedId}`)
        .then((res) => setOpenedUser(res.data.user))
        .catch((err) => console.log(err));
    } else {
      // if no openedId, show authenticated user's dashboard (if available)
      if (authUser) setOpenedUser(authUser);
      else setOpenedUser(null);
    }
  }, [openedId, authUser]);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-title">
            <FiUser /> {openedUser ? `Welcome to ${openedUser.username}'s Dashboard` : 'Welcome to Your Dashboard'}
          </h1>
          <p className="dashboard-subtitle">{openedUser ? `Projects and Stats` : 'Manage and showcase your amazing projects'}</p>
        </div>
        <button
          className="add-project-btn"
          onClick={() => navigate("/add-project")}
        >
          <FiPlus /> Add New Project
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <FiGrid />
          </div>
          <div className="stat-content">
            <h3>{stats.total}</h3>
            <p>Total Projects</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FiTrendingUp />
          </div>
          <div className="stat-content">
            <h3>{stats.web}</h3>
            <p>Web Projects</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FiPlus />
          </div>
          <div className="stat-content">
            <h3>{stats.mobile}</h3>
            <p>Mobile Projects</p>
          </div>
        </div>
      </div>

      <div className="projects-section">
        {/* My Projects - always show for logged-in user */}
        {authUser && !openedId && (
          <>
            <div className="section-header">
              <h2 className="section-title">
                <FiUser /> My Projects
              </h2>
              <span className="results-count">{projects.filter(p => p.userId === authUser.id).length} projects</span>
            </div>

            <div className="project-grid">
              {projects.filter(p => p.userId === authUser.id).length > 0 ? (
                projects.filter(p => p.userId === authUser.id).map((p) => (
                  <ProjectCard key={p.id} project={p} />
                ))
              ) : (
                <div className="no-projects">
                  <h3>You haven't added any projects yet</h3>
                  <p>Start by creating your first project to showcase your work.</p>
                  <button className="add-first-btn" onClick={() => navigate("/add-project")}>
                    <FiPlus /> Add Your First Project
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {/* Other user's projects - show when viewing another user's dashboard */}
        {openedId && openedUser && (
          <>
            <div className="section-header">
              <h2 className="section-title">
                <FiUser /> {openedUser.username}'s Projects
              </h2>
              <span className="results-count">{projects.filter(p => p.userId === openedId).length} projects</span>
            </div>

            <div className="project-grid">
              {projects.filter(p => p.userId === openedId).length > 0 ? (
                projects.filter(p => p.userId === openedId).map((p) => (
                  <ProjectCard key={p.id} project={p} />
                ))
              ) : (
                <div className="no-projects">
                  <h3>No projects by this user</h3>
                  <p>This user hasn't added any projects yet.</p>
                </div>
              )}
            </div>
          </>
        )}

        <div className="section-header">
          <h2 className="section-title">
            <FiGrid /> All Projects
          </h2>
          <span className="results-count">{filteredProjects.length} projects</span>
        </div>

        <div className="filters-section">
          <div className="search-bar">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search your projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="category-filters">
            <button
              className={`filter-btn ${selectedCategory === "" ? "active" : ""}`}
              onClick={() => {
                setSelectedCategory("");
                setCurrentPage(1);
              }}
            >
              All
            </button>
            <button
              className={`filter-btn ${selectedCategory === "web" ? "active" : ""}`}
              onClick={() => {
                setSelectedCategory("web");
                setCurrentPage(1);
              }}
            >
              Web
            </button>
            <button
              className={`filter-btn ${selectedCategory === "mobile" ? "active" : ""}`}
              onClick={() => {
                setSelectedCategory("mobile");
                setCurrentPage(1);
              }}
            >
              Mobile
            </button>
          </div>
        </div>

        <div className="project-grid">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))
          ) : (
            <div className="no-projects">
              <h3>No projects found</h3>
              <p>Try adjusting your search or add a new project to get started.</p>
              <button className="add-first-btn" onClick={() => navigate("/add-project")}>
                <FiPlus /> Add Your First Project
              </button>
            </div>
          )}
        </div>

        {pagination.totalPages > 1 && (
          <div className="pagination-controls">
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="pagination-info">
              Page {currentPage} of {pagination.totalPages}
            </span>
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
              disabled={currentPage === pagination.totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
