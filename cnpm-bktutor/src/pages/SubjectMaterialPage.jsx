import { useState, useEffect } from "react";
import { API_URL } from "../services/api.js";
import { useParams, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Button,
  IconButton,
} from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import NotificationsIcon from '@mui/icons-material/Notifications';
import MessageIcon from '@mui/icons-material/Message';
import SettingsIcon from '@mui/icons-material/Settings';
import CheckIcon from '@mui/icons-material/Check';
import { useContext } from "react";
import { IdentityContext } from "../services/IdentityContext";

export default function SubjectMaterialPage() {
  const { subjectCode } = useParams();
  const navigate = useNavigate();

  const [tab, setTab] = useState("Lý thuyết");
  const [materials, setMaterials] = useState({ "Lý thuyết": [], "Bài tập": [] });
  const [subjectName, setSubjectName] = useState("");

  // --- Identity / notifications / messages state ---
  const [notifAnchor, setNotifAnchor] = useState(null);
  const [messageAnchor, setMessageAnchor] = useState(null);
  const Notiopen = Boolean(notifAnchor);
  const MessageOpen = Boolean(messageAnchor);
  const [notifications, setNotifications] = useState([]);
  const [messages, setMessages] = useState([]);
  const { identity } = useContext(IdentityContext);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch subject name
    fetch(`${API_URL}/subject/${subjectCode}`)
      .then(r => r.json())
      .then(data => setSubjectName(data.subject_name || "Môn học"));

    // Fetch materials
    fetch(`${API_URL}/materials/${subjectCode}`)
      .then(r => r.json())
      .then(data => setMaterials(data));
  }, [subjectCode]);

  // --- Identity / Notifications / Messages functions ---
  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/logout`, { method: "GET", credentials: "include" });
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const fetchidentity = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/identity`, { method: "GET", credentials: "include" });
      const data = await res.json();
      setIdentity(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/notifications`, { method: "GET", credentials: "include" });
      const data = await res.json();
      setNotifications(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/messages`, { method: "GET", credentials: "include" });
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const groupedMessages = messages.reduce((acc, msg) => {
    if (!acc[msg.to]) acc[msg.to] = [];
    acc[msg.to].push(msg);
    return acc;
  }, {});

  const handleNotifClick = (event) => {
    setNotifAnchor(event.currentTarget);
    fetchNotifications();
  };
  const handleNotifClose = () => setNotifAnchor(null);
  const handleMessageClick = (event) => {
    setMessageAnchor(event.currentTarget);
    fetchMessages();
  };
  const handleMessageClose = () => setMessageAnchor(null);

  useEffect(() => {
    fetchidentity();
  }, []);

  const currentList = materials[tab] || [];

  return (
    <Box sx={{ width: "100vw", minHeight: "100vh", backgroundColor: "#f5f5f5", overflowX: "hidden" }}>
      {/* --- AppBar from HomePage --- */}
      <AppBar className="header-nav">
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}>
            <img src="/bk-logo.png" alt="BK Logo" style={{ width: 50, height: 50, cursor: 'pointer' }} onClick={() => navigate('/adminhome')}/>
            <Typography variant="h6" sx={{ fontWeight: 600, cursor: 'pointer' }} onClick={() => navigate('/adminhome')}>
              BK Tutor
            </Typography>

            <Typography
              component="a"
              href="#"
              sx={{ color: 'white', textDecoration: 'none', fontWeight: 500, cursor: 'pointer', '&:hover': { opacity: 0.8 } }}
              onClick={() => navigate('/adminhome')}
            >
              Trang chủ
            </Typography>

            <Typography
              component="a"
              href="#"
              sx={{ color: 'white', textDecoration: 'none', fontWeight: 500, cursor: 'pointer', '&:hover': { opacity: 0.8 } }}
              onClick={() => navigate('/calendar')}
            >
              Lịch
            </Typography>

            <Box sx={{
              bgcolor: 'rgba(255,255,255,0.25)',
              color: 'white',
              px: 2.5,
              py: 1,
              borderRadius: 2,
              fontWeight: 600,
              fontSize: '1rem',
              backdropFilter: 'blur(4px)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              cursor: 'default',
              userSelect: 'none',
            }}>
              Tài liệu
            </Box>

            <Typography
              component="a"
              href="#"
              sx={{ color: 'white', textDecoration: 'none', fontWeight: 500, cursor: 'pointer', '&:hover': { opacity: 0.8 } }}
            >
              Các lớp học của tôi
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, marginLeft: 4 }}>
            {/* Notifications */}
            <IconButton sx={{ color: 'white' }} onClick={handleNotifClick}>
              <NotificationsIcon />
            </IconButton>

            {/* Messages */}
            <IconButton sx={{ color: 'white' }} onClick={handleMessageClick}>
              <MessageIcon />
            </IconButton>

            <Typography alignContent="center"
              component="a"
              href="#"
              sx={{ color: 'white', textDecoration: 'none', fontWeight: 500, cursor: 'pointer', '&:hover': { opacity: 0.8 } }}
              onClick={() => navigate('/userinfo')}
            >  
              {identity?.name || "Unknown"}
            </Typography>

            <Button sx={{ backgroundColor: 'white', color: '#0099ff', fontWeight: 600 }} onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* --- Page Content --- */}
      <Box sx={{ maxWidth: "lg", mx: "auto", mt: 4, px: { xs: 2, sm: 4 }, pb: 8 }}>
        {/* Title */}
        <Typography variant="h4" sx={{ color: "#0099ff", fontWeight: 600, mb: 4 }}>
          Tài liệu {subjectName} ({subjectCode})
        </Typography>

        {/* Tabs */}
        <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
          {["Lý thuyết", "Bài tập"].map((t) => (
            <Button
              key={t}
              onClick={() => setTab(t)}
              sx={{
                bgcolor: tab === t ? "#0099ff" : "#f0f0f0",
                color: tab === t ? "white" : "#555",
                borderRadius: 2,
                px: 5,
                py: 1.5,
                fontSize: "1.1rem",
                fontWeight: 600,
                textTransform: "none",
                boxShadow: "none",
                "&:hover": { bgcolor: tab === t ? "#007acc" : "#e0e0e0" },
              }}
            >
              {t}
            </Button>
          ))}
        </Box>

        {/* Expand All */}
        <Typography sx={{ textAlign: "right", color: "#0099ff", fontWeight: 500, cursor: "pointer", mb: 3 }}>
          Mở rộng tất cả
        </Typography>

        {/* Materials List */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {currentList.length > 0 ? (
            currentList.map((item, idx) => (
              <Box
                key={idx}
                sx={{
                  bgcolor: "white",
                  border: "1px solid #ddd",
                  borderRadius: 2,
                  p: "14px 24px",
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  cursor: "pointer",
                  transition: "border 0.2s",
                  "&:hover": { borderColor: "#0099ff" },
                }}
                onClick={() => window.open(item.file_url, "_blank")}
              >
                <ArrowForwardIosIcon sx={{ fontSize: 18, color: "#0099ff" }} />
                <Typography sx={{ fontSize: "1.1rem", color: "#333", fontWeight: 500 }}>
                  {item.title}
                </Typography>
              </Box>
            ))
          ) : (
            <Box sx={{ bgcolor: "white", p: 6, borderRadius: 2, textAlign: "center" }}>
              <Typography color="text.secondary" variant="h6">
                Chưa có tài liệu nào trong mục này.
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
