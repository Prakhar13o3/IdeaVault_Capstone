import { useEffect, useState, useContext } from "react";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { FiInbox } from "react-icons/fi";
import "./Inbox.css";

function Inbox() {
  const { token } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    api.get('/messages/inbox')
      .then(res => {
        setMessages(res.data.messages || []);
      })
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  }, [token]);

  if (!token) return <p className="inbox-msg">Please login to view your messages.</p>;
  if (loading) return <p className="inbox-msg">Loading inbox...</p>;

  return (
    <div className="inbox-container">
      <h2><FiInbox /> Inbox</h2>
      {messages.length === 0 ? (
        <p className="inbox-empty">No messages yet.</p>
      ) : (
        <div className="messages-list">
          {messages.map((m) => (
            <div key={m.id} className="message-item">
              <div className="message-header">
                <strong>{m.fromUsername || m.fromUserId}</strong>
                {m.projectTitle && <span className="msg-project">on "{m.projectTitle}"</span>}
                <span className="msg-time">{new Date(m.createdAt).toLocaleString()}</span>
              </div>
              <p className="message-body">{m.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Inbox;
