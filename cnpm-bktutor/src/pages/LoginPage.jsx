import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
} from '@mui/material';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        navigate('/dashboard');
      } else {
        setError('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
      }
    } catch (err) {
      setError('Lỗi kết nối. Vui lòng thử lại.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, textAlign: 'center' }}>
            BKTutor Login
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <form onSubmit={handleLogin}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              variant="outlined"
            />
            <Button
              fullWidth
              variant="contained"
              size="large"
              type="submit"
              sx={{ mt: 3 }}
            >
              Login
            </Button>
          </form>

          <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
            Không có tài khoản?{' '}
            <Typography
              component="span"
              onClick={() => navigate('/register')}
              sx={{
                color: '#0099ff',
                cursor: 'pointer',
                fontWeight: 600,
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              Đăng ký tại đây
            </Typography>
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}