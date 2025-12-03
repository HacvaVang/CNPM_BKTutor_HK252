import { useState, useEffect } from "react";
import { API_URL } from "../services/api.js";
import { useParams, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Button,
} from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

export default function SubjectMaterialPage() {
  const { subjectCode } = useParams();
  const navigate = useNavigate();

  const [tab, setTab] = useState("Lý thuyết");
  const [materials, setMaterials] = useState({ "Lý thuyết": [], "Bài tập": [] });
  const [subjectName, setSubjectName] = useState("");

  useEffect(() => {
    // Lấy tên môn học
    fetch(`${API_URL}/subject/${subjectCode}`)
      .then(r => r.json())
      .then(data => setSubjectName(data.subject_name || "Môn học"));

    // Lấy tài liệu
    fetch(`${API_URL}/materials/${subjectCode}`)
      .then(r => r.json())
      .then(data => setMaterials(data));
  }, [subjectCode]);

  const currentList = materials[tab] || [];

  return (
    <Box sx={{ width: "100vw", minHeight: "100vh", backgroundColor: "#f5f5f5", overflowX: "hidden" }}>
      {/* SAME APPBAR */}
      <AppBar className="header-nav" position="static">
        <Toolbar>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexGrow: 1 }}>
            <img src="/bk-logo.png" alt="BK Logo" style={{ width: 50, height: 50 }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>BK Tutor</Typography>
            <Typography component="a" href="/" sx={{ color: "white", textDecoration: "none", fontWeight: 500 }}>Trang chủ</Typography>
            <Typography component="a" href="#" sx={{ color: "white", textDecoration: "none", fontWeight: 500 }}>Bảng điều khiển</Typography>
            <Typography component="a" href="#" sx={{ color: "white", textDecoration: "none", fontWeight: 500 }}>Danh sách giảng viên</Typography>
            <Typography component="a" href="#" sx={{ color: "white", textDecoration: "none", fontWeight: 500 }}>Danh sách lớp</Typography>
            <Typography component="a" href="#" sx={{ color: "white", textDecoration: "none", fontWeight: 500 }}>Tài liệu học tập</Typography>
            <Typography sx={{ color: "white", fontWeight: 700, borderBottom: "3px solid white", pb: 1 }}>
              Tài liệu học tập
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button variant="outlined" sx={{ color: "white", borderColor: "white", "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" } }}>
              Ngôn ngữ (VN)
            </Button>
            <Button variant="contained" sx={{ backgroundColor: "white", color: "#0099ff", fontWeight: 600 }} onClick={() => navigate("/login")}>
              Đăng xuất
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* NO GRAY BOX ANYMORE – Content directly on #f5f5f5 background */}
      <Box sx={{ maxWidth: "lg", mx: "auto", mt: 4, px: { xs: 2, sm: 4 }, pb: 8 }}>
        {/* Title */}
        <Typography variant="h4" sx={{ color: "#0099ff", fontWeight: 600, mb: 4 }}>
          Tài liệu {subjectName} ({subjectCode})
        </Typography>

        {/* Tabs – exactly like your picture */}
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

        {/* Mở rộng tất cả */}
        <Typography sx={{ textAlign: "right", color: "#0099ff", fontWeight: 500, cursor: "pointer", mb: 3 }}>
          Mở rộng tất cả
        </Typography>

        {/* Danh sách tài liệu – white cards on light background */}
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