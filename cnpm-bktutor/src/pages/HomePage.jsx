import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Button,
  Typography,
  Grid,
  Paper,
  AppBar,
  Toolbar,
} from '@mui/material';
import './HomePage.css';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <Box className="home-page">
      {/* Header Navigation */}
      <AppBar position="sticky" className="header-nav">
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}>
            <img src="/bk-logo.png" alt="BK Logo" style={{ width: 50, height: 50 }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              BK Tutor
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Typography
              component="a"
              href="#"
              sx={{
                color: 'white',
                textDecoration: 'none',
                fontWeight: 500,
                cursor: 'pointer',
                '&:hover': { opacity: 0.8 },
              }}
            >
              Trang chủ
            </Typography>
            <Typography
              component="a"
              href="#"
              sx={{
                color: 'white',
                textDecoration: 'none',
                fontWeight: 500,
                cursor: 'pointer',
                '&:hover': { opacity: 0.8 },
              }}
            >
              Bảng điều khiển
            </Typography>
            <Typography
              component="a"
              href="#"
              sx={{
                color: 'white',
                textDecoration: 'none',
                fontWeight: 500,
                cursor: 'pointer',
                '&:hover': { opacity: 0.8 },
              }}
            >
              Khóa học của tôi
            </Typography>
            <Typography
              component="a"
              href="#"
              sx={{
                color: 'white',
                textDecoration: 'none',
                fontWeight: 500,
                cursor: 'pointer',
                '&:hover': { opacity: 0.8 },
              }}
            >
              Đăng kí lớp học
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, marginLeft: 4 }}>
            <Button
              variant="outlined"
              sx={{
                color: 'white',
                borderColor: 'white',
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
              }}
              onClick={() => navigate('/login')}
            >
              Ngôn ngữ (VN)
            </Button>
            <Button
              variant="contained"
              sx={{ backgroundColor: 'white', color: '#0099ff', fontWeight: 600 }}
              onClick={() => navigate('/login')}
            >
              Đăng nhập
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box className="hero-section">
        <Box className="hero-overlay"></Box>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Grid container spacing={4} alignItems="center" sx={{ minHeight: 500 }}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Box
                  sx={{
                    background: 'white',
                    padding: 1,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <img
                    src="/bk-logo.png"
                    alt="BK Logo"
                    style={{ width: 80, height: 80 }}
                  />
                </Box>
              </Box>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  color: 'white',
                  mb: 2,
                  textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
                }}
              >
                BK Tutor Program
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  color: '#e0e7ff',
                  fontWeight: 500,
                }}
              >
                TRƯỜNG ĐẠI HỌC BÁCH KHOA
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="/team-background.jpg"
                alt="BK Tutor Team"
                sx={{
                  width: '100%',
                  height: 400,
                  objectFit: 'cover',
                  borderRadius: 2,
                  opacity: 0.95,
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Introduction Section */}
      <Container maxWidth="lg">
        <Paper
          elevation={2}
          sx={{
            p: 5,
            mt: 5,
            mb: 5,
            backgroundColor: 'white',
            borderRadius: 2,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              color: '#0099ff',
              fontWeight: 600,
              mb: 4,
            }}
          >
            Giới thiệu:
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography
              variant="body1"
              sx={{
                fontSize: '1.05rem',
                lineHeight: 1.8,
                color: '#333',
                textAlign: 'justify',
              }}
            >
              BK Tutor Program là hệ thống hỗ trợ quản lý chương trình Tutor-Mentor tại
              Trường Đại học Bách Khoa – ĐHQG TP.HCM (HCMUT), được thiết kế nhằm nâng
              cao hiệu quả học tập và phát triển kỹ năng cho sinh viên.
            </Typography>

            <Typography
              variant="body1"
              sx={{
                fontSize: '1.05rem',
                lineHeight: 1.8,
                color: '#333',
                textAlign: 'justify',
              }}
            >
              BK Tutor Program hướng đến một môi trường học tập hiệu dạt, thân thiện
              và đề mở rộng, góp phần nâng cao chất lượng đào tạo và trải nghiệm học
              tập của sinh viên.
            </Typography>
          </Box>
        </Paper>
      </Container>

      {/* Call to Action Section */}
      <Box
        sx={{
          py: 6,
          textAlign: 'center',
          backgroundColor: '#f5f5f5',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              sx={{
                backgroundColor: '#0099ff',
                color: 'white',
                px: 5,
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: '#0077cc',
                  boxShadow: '0 4px 12px rgba(0, 153, 255, 0.3)',
                },
              }}
              onClick={() => navigate('/login')}
            >
              Đăng nhập
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{
                color: '#0099ff',
                borderColor: '#0099ff',
                px: 5,
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: '#f0f8ff',
                  borderColor: '#0099ff',
                },
              }}
              onClick={() => navigate('/register')}
            >
              Đăng ký
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}