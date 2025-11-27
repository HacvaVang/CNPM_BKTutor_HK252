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
  Divider,
  Stack
} from '@mui/material';

import LanguageIcon from '@mui/icons-material/Language'

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
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
      <Box
        sx={{
          minHeight: '100vh',
          minWidth: '100vw',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper elevation={3} sx={{
           p: 4, 
           width: '40%',
           mx: 'auto'
           }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
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
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, textAlign: 'center' }}>
              BKTutor Login
            </Typography>

            <Box sx={{
              backgroundColor: '#f69898ff', 
              borderRadius: 2, 
              height: 40, 
              color: '#582020ff', 
              alignItems: "center", 
              textAlign: "center",
              justifyContent: "center",
              display: "flex"
            }}>
              Your session has timed out. Please log in again.
            </Box>
            
            <Box sx={{width:'100%', my: 2}}>
              <Divider sx={{ borderBottomWidth: 1, borderColor: '#919090ff' }}/>
            </Box>
            <Typography sx= {{color: '#919090ff'}}>
              Login using your account on:
            </Typography>
            <Stack sx={{width:'100%'}}>
              <Button
                variant="outlined"
                sx = {{borderColor: '#919090ff', color: '#919090ff'}}
                fullWidth
                onClick={() => window.location.href="https://localhost:8000/sso/login"}
              >
                <img
                  src="/bk-logo.png"
                  alt="BK Logo"
                  style={{ width: 20, height: 20 }}
                />
                HCMUT Account
              </Button>
              <Button
                variant="outlined"
                sx = {{borderColor: '#919090ff', color: '#919090ff'}}
                fullWidth
                onClick={() => window.location.href="https://localhost:8000/admin"}
              >
                Admin
              </Button>
            </Stack>

            <Box sx={{width:'100%', my: 2}}>
              <Divider sx={{ borderBottomWidth: 1, borderColor: '#919090ff' }}/>
            </Box>

            <Button
              sx = {{borderColor: '#919090ff'}}
              variant='outlined'
              startIcon={<LanguageIcon/>}
            >
              Language
            </Button>
        </Paper>
      </Box>
  );
}