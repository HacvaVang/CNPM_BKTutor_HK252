import { useState, useEffect } from "react";
import { API_URL } from "../services/api";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Button,
  Container,
  Select,
  MenuItem,
  InputBase,
  Paper,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import NotificationsIcon from '@mui/icons-material/Notifications';
import MessageIcon from '@mui/icons-material/Message';
import SettingsIcon from '@mui/icons-material/Settings';
import CheckIcon from '@mui/icons-material/Check';
import { useContext } from "react";
import { IdentityContext } from "../services/IdentityContext";


// Styled input for search
const SearchInput = styled(InputBase)(({ theme }) => ({
  backgroundColor: "white",
  borderRadius: theme.shape.borderRadius,
  padding: "10px 16px",
  width: "280px",
  border: "1px solid #ddd",
}));

export default function SubjectListPage() {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [lecturer, setLecturer] = useState("All");
  const itemsPerPage = 5;


  // --- Identity / notifications / messages state ---
  const [notifAnchor, setNotifAnchor] = useState(null);
  const [messageAnchor, setMessageAnchor] = useState(null);
  const Notiopen = Boolean(notifAnchor);
  const MessageOpen = Boolean(messageAnchor);
  const [notifications, setNotifications] = useState([]);
  const [messages, setMessages] = useState([]);
  const { identity } = useContext(IdentityContext);
  const [loading, setLoading] = useState(false);

  // --- Load Subjects ---
  const loadSubjects = () => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (category && category !== "All") params.append("category", category);
    if (lecturer && lecturer !== "All") params.append("lecturer", lecturer);

    fetch(`${API_URL}/subjects?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setPage(0);
        setSubjects(data.subjects || []);
        setCategories(data.categories || []);
        setLecturers(data.lecturers || []);
      })
      .catch(() => {
        setSubjects([]);
        setCategories([]);
        setLecturers([]);
      });
  };

  useEffect(() => {
    loadSubjects();
  }, [search, category, lecturer]);

  const displaySubjects = subjects.slice(
    page * itemsPerPage,
    (page + 1) * itemsPerPage
  );

  const hasNext = (page + 1) * itemsPerPage < subjects.length;
  const hasPrev = page > 0;

  // --- Identity / Notifications / Messages functions ---
  const handleLogout = async () => {
    try {
      await fetch("http://127.0.0.1:8080/logout", {
        method: "GET",
        credentials: "include",
      });
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

  // --- Render ---
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

      {/* --- SubjectListPage Content --- */}
      <Box
        sx={{
          maxWidth: "lg",
          mx: "auto",
          mt: 10,
          mb: 0,
          pt: 4,
          px: 4,
          pb: 0,
          p: 4,
          backgroundColor: "#e0e0e0",
          borderRadius: 3,
        }}
      >
        <Typography variant="h4" sx={{ color: "#0099ff", fontWeight: 600, mb: 4, textAlign: "left" }}>
          Danh sách tài liệu
        </Typography>

        <Box sx={{ display: "flex", gap: 2, mb: 4, flexWrap: "wrap", alignItems: "center" }}>
          <Select value={category} onChange={(e) => setCategory(e.target.value)} displayEmpty sx={{ minWidth: 160, bgcolor: "white" }}>
            <MenuItem value="All">All</MenuItem>
            {categories.map((cat, idx) => <MenuItem key={idx} value={cat}>{cat}</MenuItem>)}
          </Select>

          <SearchInput placeholder="Tìm kiếm" value={search} onChange={(e) => setSearch(e.target.value)} />

          <Select value={lecturer} onChange={(e) => setLecturer(e.target.value)} displayEmpty sx={{ minWidth: 200, bgcolor: "white" }}>
            <MenuItem value="All">Giảng viên</MenuItem>
            {lecturers.map((lec, idx) => <MenuItem key={idx} value={lec}>{lec}</MenuItem>)}
          </Select>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {displaySubjects.length > 0 ? (
            displaySubjects.map((s, idx) => (
              <Paper key={idx} elevation={2} onClick={() => navigate(`/subjectmaterial/${s.subject_code.trim()}`)}
                sx={{ p: 3, borderRadius: 3, cursor: "pointer", transition: "all 0.2s", "&:hover": { boxShadow: 6, transform: "translateY(-2px)" } }}>
                <Typography variant="h6" sx={{ color: "#0099ff", fontWeight: 500, fontStyle: "italic", textAlign: "left" }}>
                  {s.subject_name} ({s.subject_code})
                </Typography>
              </Paper>
            ))
          ) : (
            <Paper sx={{ p: 6, textAlign: "center", borderRadius: 3 }}>
              <Typography color="text.secondary" variant="h6">Không tìm thấy tài liệu nào.</Typography>
            </Paper>
          )}
        </Box>

        {subjects.length > itemsPerPage && (
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 5 }}>
            <Paper elevation={3} sx={{ borderRadius: 3, overflow: "hidden" }}>
              <IconButton disabled={!hasPrev} onClick={() => setPage((p) => p - 1)} sx={{ color: hasPrev ? "#0099ff" : "#ccc" }}>
                <ArrowBackIosNewIcon />
              </IconButton>

              <IconButton disabled={!hasNext} onClick={() => setPage((p) => p + 1)} sx={{ color: hasNext ? "#0099ff" : "#ccc" }}>
                <ArrowForwardIosIcon />
              </IconButton>
            </Paper>
          </Box>
        )}
      </Box>
    </Box>
  );
}
