import { BrowserRouter, Routes, Route } from "react-router-dom";
import EditProject from "./pages/EditProject";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Inbox from "./pages/Inbox";
import ProjectDetails from "./pages/ProjectDetails";
import AddProject from "./pages/AddProject";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { AuthProvider } from "./context/AuthContext";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/:id" element={<Dashboard />} />
              <Route path="/inbox" element={<Inbox />} />
              <Route path="/add-project" element={<AddProject />} />
              <Route path="/project/:id" element={<ProjectDetails />} />
              <Route path="/edit-project/:id" element={<EditProject />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
