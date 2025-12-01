1. Project Title
   IdeaVault – A Collaborative Platform for Showcasing and Discovering Innovative Projects.
2. Problem Statement
   Students and developers often have creative project ideas but lack a centralized platform to showcase them, gain visibility, or find collaborators. IdeaVault solves this by offering a community-driven web app for sharing, discovering, and teaming up on innovative projects.
3. System Architecture
   Layer Technologies
   Frontend React.js, React Router, Axios, Tailwind CSS
   Backend Node.js, Express.js, Prisma ORM
   Database MySQL (Relational Database)
   Frontend → Backend (API) → Database
   Frontend React.js with React Router for page navigation
   Backend Node.js + Express.js with Prisma ORM
   Database MySQL (Relational Database hosted on PlanetScale/Aiven)
   Authentication JWT-based login/signup system
   Hosting Frontend: Vercel | Backend: Render/Railway | Database: PlanetScale
4. Unique Selling Proposition (USP)
   Unlike typical project repositories, IdeaVault promotes collaboration and innovation. Users can not only display their projects but also connect with peers who share similar interests or wish to join project teams. It merges creativity, learning, and networking into one platform.
5. Key Features
   Category Features
   Authentication & Authorization User registration, login, logout, and role-based access using JWT
   CRUD Operations (with API & Database)
   Searching, Filtering, Sorting, Pagination
   Frontend Routing Pages: Home, Login, Dashboard, Project Details, Profile
   Hosting
   Full Create, Read, Update, Delete operations for projects using RESTful A
   Efficient project browsing and data management with backend-powered qu
   Deployed on Vercel (Frontend) and Render (Backend) with PlanetScale/M
6. Tech Stack
   Authentication JWT (JSON Web Tokens)
   Hosting Vercel (Frontend), Render (Backend), PlanetScale (Database)
7. API Overview
   Endpoint Method Description Access
   /api/auth/signup POST Register new user Public
   /api/auth/login POST Authenticate user Public
   /api/projects GET Fetch all projects (supports pagination, sorting, filt ering)Authenticated
   /api/projects POST Create new project via Prisma ORM & MySQL Authenticated
   /api/projects/:id PUT Update project details Authenticated
   /api/projects/:id DELETE Delete project Admin only
