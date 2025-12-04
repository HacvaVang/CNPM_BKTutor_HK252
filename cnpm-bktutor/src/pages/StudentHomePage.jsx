import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Paper,
  AppBar,
  Toolbar,
  Button,
  Avatar,
  Divider,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MessageIcon from '@mui/icons-material/Message';
import SettingsIcon from '@mui/icons-material/Settings';
import CheckIcon from '@mui/icons-material/Check';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import SchoolIcon from '@mui/icons-material/School';
import { IdentityContext } from '../services/IdentityContext';   // <-- adjust if needed

export default function UserInfoPage() {
  const navigate = useNavigate();
  const { identity } = useContext(IdentityContext);

  // -----------------------------------------------------------------
  //  Toolbar state (notifications / messages) – copy‑paste from HomePage
  // -----------------------------------------------------------------
  const [notifAnchor, setNotifAnchor] = useState(null);
  const [messageAnchor, setMessageAnchor] = useState(null);
  const Notiopen = Boolean(notifAnchor);
  const MessageOpen = Boolean(messageAnchor);
  const [notifications, setNotifications] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch('http://127.0.0.1:8080/logout', {
        method: 'GET',
        credentials: 'include',
      });
      navigate('/login');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://127.0.0.1:8080/api/notifications', {
        credentials: 'include',
      });
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
      const res = await fetch('http://127.0.0.1:8080/api/messages', {
        credentials: 'include',
      });
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleNotifClick = (e) => {
    setNotifAnchor(e.currentTarget);
    fetchNotifications();
  };
  const handleNotifClose = () => setNotifAnchor(null);
  const handleMessageClick = (e) => {
    setMessageAnchor(e.currentTarget);
    fetchMessages();
  };
  const handleMessageClose = () => setMessageAnchor(null);

  const groupedMessages = messages.reduce((acc, msg) => {
    if (!acc[msg.to]) acc[msg.to] = [];
    acc[msg.to].push(msg);
    return acc;
  }, {});

  // -----------------------------------------------------------------
  //  Load user data from the libcore API (fallback to example)
  // -----------------------------------------------------------------
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (identity?.selfid) {
      fetch(`http://127.0.0.1:7999/user/full?user_id=${identity.selfid}`)
        .then((r) => r.json())
        .then((d) => {
          if (d && d.Name && d.Name !== 'Không tìm thấy') setUser(d);
        })
        .catch(() => {});
    }
  }, [identity]);

  const exampleUser = {
    Code: '231038',
    Name: 'TRẦN LÊ ĐỨC AN',
    Birthday: '12/12/2005',
    Phone_number: '0915485455',
    Email: 'an.tranle@hcmut.edu.vn',
    Email_backup: 'quaktoong@gmail.com',
    Major: 'Khoa Khoa học và Kỹ thuật Máy tính',
    'Ngành/Chuyên ngành': 'Khoa học Máy tính',
    'Thời điểm nhập học': '08/2023',
    'Năm CTĐT': '2023',
    'Buổi học/giảng dạy': 'Sáng',
    'Cơ sở': 'Cơ sở 2',
  };

  const displayUser = user || exampleUser;
  const nameParts = displayUser.Name ? displayUser.Name.trim().split(' ') : [];
  const firstName = nameParts.length ? nameParts.pop() : 'AN';
  const lastName = nameParts.join(' ') || 'TRẦN LÊ ĐỨC';

  // -----------------------------------------------------------------
  //  Render
  // -----------------------------------------------------------------
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f7fa' }}>
      {/* ====================== TOOLBAR (exact copy from HomePage) ====================== */}
      <AppBar sx={{ bgcolor: '#0066cc' }}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}>
            <img
              src="/bk-logo.png"
              alt="BK Logo"
              style={{ width: 50, height: 50, cursor: 'pointer' }}
              onClick={() => navigate('/adminhome')}
            />
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, cursor: 'pointer' }}
              onClick={() => navigate('/adminhome')}
            >
              BK Tutor
            </Typography>

            {/* navigation links – keep the same as HomePage */}
            <Typography component="a" href="#" sx={navLinkStyle}>
              Trang chủ
            </Typography>
            <Typography
              component="a"
              sx={navLinkStyle}
              onClick={() => navigate('/calendar')}
            >
              Lịch
            </Typography>
            <Typography
              component="a"
              sx={navLinkStyle}
              onClick={() => navigate('/subjectlist')}
            >
              Tài liệu
            </Typography>
            <Typography component="a" href="#" sx={navLinkStyle}>
              Các lớp học của tôi
            </Typography>
          </Box>

          {/* Right side icons + name + logout */}
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            {/* ---------- Notifications ---------- */}
            <>
              <IconButton sx={{ color: 'white' }} onClick={handleNotifClick}>
                <NotificationsIcon />
              </IconButton>
              <Menu
                anchorEl={notifAnchor}
                open={Notiopen}
                onClose={handleNotifClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                slotProps={{ paper: { sx: { width: 300, maxHeight: 400, p: 2 } } }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Thông báo</Typography>
                  <Box sx={{ display: 'flex' }}>
                    <Button sx={iconBtnStyle}>
                      <SettingsIcon />
                    </Button>
                    <Button sx={iconBtnStyle}>
                      <CheckIcon />
                    </Button>
                  </Box>
                </Box>
                {loading ? (
                  <Typography color="text.secondary">Loading…</Typography>
                ) : notifications.length === 0 ? (
                  <Typography color="text.secondary">No notifications</Typography>
                ) : (
                  notifications.map((n) => (
                    <Box key={n.id} sx={{ py: 0.5, borderBottom: '1px solid #eee' }}>
                      {n.message} — {n.date}
                    </Box>
                  ))
                )}
              </Menu>
            </>

            {/* ---------- Messages ---------- */}
            <>
              <IconButton sx={{ color: 'white' }} onClick={handleMessageClick}>
                <MessageIcon />
              </IconButton>
              <Menu
                anchorEl={messageAnchor}
                open={MessageOpen}
                onClose={handleMessageClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                slotProps={{ paper: { sx: { width: 300, maxHeight: 400, p: 2 } } }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Tin nhắn</Typography>
                  <Box sx={{ display: 'flex' }}>
                    <Button sx={iconBtnStyle}>
                      <SettingsIcon />
                    </Button>
                    <Button sx={iconBtnStyle}>
                      <CheckIcon />
                    </Button>
                  </Box>
                </Box>
                <Box sx={{ mb: 1, fontWeight: 'bold' }}>
                  {identity?.name || 'Unknown'}
                </Box>
                {loading ? (
                  <Typography color="text.secondary">Loading…</Typography>
                ) : Object.keys(groupedMessages).length === 0 ? (
                  <Typography color="text.secondary">No messages</Typography>
                ) : (
                  Object.entries(groupedMessages).map(([to, msgs]) => (
                    <Box key={to} sx={{ mb: 2, border: '1px solid #ddd', borderRadius: 2 }}>
                      <Box sx={{ p: 1, bgcolor: '#f5f5f5', fontWeight: 'bold' }}>
                        To {to}
                      </Box>
                      {msgs.map((m) => (
                        <Box key={m.id} sx={{ p: 1, borderBottom: '1px solid #eee' }}>
                          {m.message} — {m.date}
                        </Box>
                      ))}
                    </Box>
                  ))
                )}
              </Menu>
            </>

            {/* Name + Logout */}
            <Typography alignContent="center"
              component="a"
              href="#"
              sx={{ color: 'white', textDecoration: 'none', fontWeight: 500, cursor: 'pointer', '&:hover': { opacity: 0.8 } }}
              onClick={() => navigate('/userinfo')}
            >  
              {identity?.name || "Unknown"}
            </Typography>
            <Button
              variant="contained"
              sx={{ bgcolor: 'white', color: '#0099ff', fontWeight: 600 }}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* ====================== BACK BUTTON (inside content) ====================== */}
      <Box sx={{ px: { xs: 2, md: 4 }, pt: 3 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>
          Trở về trang trước
        </Button>
      </Box>

      {/* ====================== USER INFO CARD ====================== */}
      <Box sx={{ maxWidth: 1400, mx: 'auto', px: { xs: 2, md: 4 }, pt: 2 }}>
        <Paper elevation={10} sx={{ borderRadius: 3, overflow: 'hidden' }}>
          {/* Top blue section */}
          <Box
            sx={{
              bgcolor: 'linear-gradient(135deg, #0066cc 0%, #004499 100%)',
              color: 'white',
              p: { xs: 4, md: 7 },
            }}
          >
            <Grid container spacing={5} alignItems="center">
              <Grid item>
                <Avatar
                  sx={{
                    width: 180,
                    height: 180,
                    bgcolor: 'white',
                    color: '#0066cc',
                    fontSize: 80,
                    fontWeight: 'bold',
                    border: '12px solid white',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
                  }}
                >
                  {firstName.charAt(0).toUpperCase()}
                </Avatar>
              </Grid>

              <Grid item xs>
                <Grid container spacing={3}>
                  {[
                    { label: 'Mã số sinh viên', value: displayUser.Code, big: true },
                    { label: 'Họ và tên lót', value: lastName },
                    { label: 'Tên', value: firstName, big: true },
                    { label: 'Ngày sinh', value: displayUser.Birthday || '—' },
                  ].map((i) => (
                    <Grid item xs={6} md={3} key={i.label}>
                      <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                        <Typography variant="subtitle2" sx={{ opacity: 0.9, fontSize: '0.95rem' }}>
                          {i.label}
                        </Typography>
                        <Typography
                          variant={i.big ? 'h3' : 'h6'}
                          fontWeight="bold"
                          sx={{ mt: 0.5, wordBreak: 'break-word' }}
                        >
                          {i.value}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          </Box>

          {/* Contact */}
          <Box sx={{ p: { xs: 4, md: 6 } }}>
            <Typography variant="h6" fontWeight="bold" color="#0066cc" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <EmailIcon /> Thông tin liên lạc
            </Typography>
            <Divider sx={{ mb: 4 }} />
            <Grid container spacing={4}>
              {[
                { icon: <PhoneIcon sx={{ color: '#0066cc' }} />, label: 'Số điện thoại', value: displayUser.Phone_number || '—' },
                { label: 'Email sinh viên', value: displayUser.Email || '—' },
                { label: 'Email liên lạc', value: displayUser.Email_backup || '—' },
                { label: 'Email dự phòng', value: '*' },
              ].map((i, idx) => (
                <Grid item xs={12} sm={6} lg={3} key={idx}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minHeight: 56 }}>
                    {i.icon ? (
                      <Box sx={{ width: 40, height: 40, bgcolor: '#e3f2fd', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {i.icon}
                      </Box>
                    ) : (
                      <Box sx={{ width: 40 }} />
                    )}
                    <Box>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.95rem' }}>
                        {i.label}:
                      </Typography>
                      <Typography fontWeight="600" color="#333">
                        {i.value}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Training info */}
          <Box sx={{ p: { xs: 4, md: 6 }, bgcolor: '#f8fbff' }}>
            <Typography variant="h6" fontWeight="bold" color="#0066cc" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <SchoolIcon /> Thông tin đào tạo
            </Typography>
            <Divider sx={{ mb: 4 }} />
            <Grid container spacing={4}>
              {[
                { label: 'Khoa', value: displayUser.Major },
                { label: 'Ngành/Chuyên ngành', value: displayUser['Ngành/Chuyên ngành'] },
                { label: 'Thời điểm nhập học', value: displayUser['Thời điểm nhập học'] },
                { label: 'Năm CTĐT', value: displayUser['Năm CTĐT'] },
                { label: 'Buổi học/giảng dạy', value: displayUser['Buổi học/giảng dạy'] },
                { label: 'Cơ sở', value: displayUser['Cơ sở'] },
              ].map((i) => (
                <Grid item xs={12} sm={6} md={4} key={i.label}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.95rem' }}>
                      {i.label}
                    </Typography>
                    <Typography fontWeight="600" color="#333" sx={{ fontSize: '1.1rem' }}>
                      {i.value || '—'}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Status */}
          <Box sx={{ p: { xs: 4, md: 6 } }}>
            <Typography variant="h6" fontWeight="bold" color="#0066cc" sx={{ mb: 3 }}>
              Tình trạng học tập
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Typography fontWeight="600" color="success.main" fontSize="1.1rem">
              Sinh viên đang học – Active
            </Typography>
          </Box>

          {/* Note */}
          <Box sx={{ p: { xs: 4, md: 6 }, bgcolor: '#f8fbff' }}>
            <Typography variant="h6" fontWeight="bold" color="#0066cc" sx={{ mb: 3 }}>
              Ghi chú
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Typography color="text.secondary" fontStyle="italic">
              —
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}

/* ---------- reusable small styles ---------- */
const navLinkStyle = {
  color: 'white',
  textDecoration: 'none',
  fontWeight: 500,
  cursor: 'pointer',
  '&:hover': { opacity: 0.8 },
};
const iconBtnStyle = {
  color: '#919090ff',
  minWidth: 'auto',
  '&:hover': { opacity: 0.8 },
};