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

  return (
    <Box sx={{ width: "100vw", minHeight: "100vh", backgroundColor: "#f5f5f5", overflowX: "hidden", }}>
      {/* AppBar */}
      <AppBar className="header-nav" position="static">
        <Toolbar>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexGrow: 1 }}>
            <img src="/bk-logo.png" alt="BK Logo" style={{ width: 50, height: 50 }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              BK Tutor
            </Typography>

            <Typography component="a" href="/" sx={{ color: "white", textDecoration: "none", fontWeight: 500 }}>
              Trang chủ
            </Typography>
            <Typography component="a" href="#" sx={{ color: "white", textDecoration: "none", fontWeight: 500 }}>
              Bảng điều khiển
            </Typography>
            <Typography component="a" href="#" sx={{ color: "white", textDecoration: "none", fontWeight: 500 }}>
              Khóa học của tôi
            </Typography>
            <Typography component="a" href="#" sx={{ color: "white", textDecoration: "none", fontWeight: 500 }}>
              Đăng kí lớp học
            </Typography>

            <Typography
              sx={{
                color: "white",
                textDecoration: "none",
                fontWeight: 700,
                borderBottom: "3px solid white",
                pb: 1,
              }}
            >
              Tài liệu học tập
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="outlined"
              sx={{
                color: "white",
                borderColor: "white",
                "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
              }}
            >
              Ngôn ngữ (VN)
            </Button>
            <Button
              variant="contained"
              sx={{ backgroundColor: "white", color: "#0099ff", fontWeight: 600 }}
              onClick={() => navigate("/login")}
            >
              Đăng xuất
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Grey box container for all non-AppBar content */}
      <Box
        sx={{
          maxWidth: "lg",
          mx: "auto",
          mt: 4,
          mb: 0,      // remove bottom margin
          pt: 4,
          px: 4,
          pb: 0,      // remove bottom padding
          p: 4,
          backgroundColor: "#e0e0e0",
          borderRadius: 3,
        }}
      >
        {/* Title */}
        <Typography variant="h4" sx={{ color: "#0099ff", fontWeight: 600, mb: 4, textAlign: "left" }}>
          Danh sách tài liệu
        </Typography>

        {/* Filters Row */}
        <Box sx={{ display: "flex", gap: 2, mb: 4, flexWrap: "wrap", alignItems: "center" }}>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            displayEmpty
            sx={{ minWidth: 160, bgcolor: "white" }}
          >
            <MenuItem value="All">All</MenuItem>
            {categories.map((cat, idx) => (
              <MenuItem key={idx} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </Select>

          <SearchInput
            placeholder="Tìm kiếm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Select
            value={lecturer}
            onChange={(e) => setLecturer(e.target.value)}
            displayEmpty
            sx={{ minWidth: 200, bgcolor: "white" }}
          >
            <MenuItem value="All">Giảng viên</MenuItem>
            {lecturers.map((lec, idx) => (
              <MenuItem key={idx} value={lec}>
                {lec}
              </MenuItem>
            ))}
          </Select>
        </Box>

        {/* Subject Cards */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {displaySubjects.length > 0 ? (
            displaySubjects.map((s, idx) => (
              <Paper
                key={idx}
                elevation={2}
                onClick={() => navigate(`/subjectmaterial/${s.subject_code.trim()}`)}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  "&:hover": { boxShadow: 6, transform: "translateY(-2px)" },
                }}
              >
                <Typography variant="h6" sx={{
                    color: "#0099ff",
                    fontWeight: 500,
                    fontStyle: "italic",
                    textAlign: "left",
                  }}>
                  {s.subject_name} ({s.subject_code})
                </Typography>
              </Paper>
            ))
          ) : (
            <Paper sx={{ p: 6, textAlign: "center", borderRadius: 3 }}>
              <Typography color="text.secondary" variant="h6">
                Không tìm thấy tài liệu nào.
              </Typography>
            </Paper>
          )}
        </Box>

        {/* Pagination */}
        {subjects.length > itemsPerPage && (
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 5 }}>
            <Paper elevation={3} sx={{ borderRadius: 3, overflow: "hidden" }}>
              <IconButton
                disabled={!hasPrev}
                onClick={() => setPage((p) => p - 1)}
                sx={{ color: hasPrev ? "#0099ff" : "#ccc" }}
              >
                <ArrowBackIosNewIcon />
              </IconButton>

              <IconButton
                disabled={!hasNext}
                onClick={() => setPage((p) => p + 1)}
                sx={{ color: hasNext ? "#0099ff" : "#ccc" }}
              >
                <ArrowForwardIosIcon />
              </IconButton>
            </Paper>
          </Box>
        )}
      </Box>
    </Box>
  );
}
