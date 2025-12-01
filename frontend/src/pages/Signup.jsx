import { useState, useContext } from "react";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

function Signup() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [msg, setMsg] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    api
      .post("/auth/signup", form)
      .then((res) => {
        // store token and user in context/localStorage
        login(res.data.accessToken, res.data.user);
        setMsg("Signup Successful! Redirecting to Dashboard...");
        setTimeout(() => navigate("/dashboard"), 1500);
      })
      .catch((err) => {
        setMsg(err.response?.data?.message || err.response?.data?.msg || "Signup failed");
      });
  };

  return (
    <div className="signup-container">
      <form className="signup-box" onSubmit={handleSubmit}>
        <h2>Create Account</h2>

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <button type="submit">Signup</button>

        {msg && <p className="msg">{msg}</p>}
      </form>
    </div>
  );
}

export default Signup;
