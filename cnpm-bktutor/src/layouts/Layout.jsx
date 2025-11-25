import { Outlet, Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Button,
  Container,
} from '@mui/material';
import { useState } from 'react';
import './Layout.css';

export default function Layout() {
  const navigate = useNavigate();
  const [openDrawer, setOpenDrawer] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Courses', path: '/courses' },
    { label: 'Profile', path: '/profile' },
  ];

  return (
    <Box className="layout">
      {/* Header */}
      <AppBar position="sticky" sx={{ background: 'linear-gradient(90deg, #0099ff 0%, #0077cc 100%)' }}>
        <Toolbar>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              flexGrow: 1,
              cursor: 'pointer',
            }}
            onClick={() => navigate('/')}
          >
            <img src="/bk-logo.png" alt="BK Logo" style={{ width: 50, height: 50 }} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              BK Tutor
            </Typography>
          </Box>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
            {navItems.map((item) => (
              <Typography
                key={item.path}
                component={Link}
                to={item.path}
                sx={{
                  color: 'white',
                  textDecoration: 'none',
                  fontWeight: 500,
                  '&:hover': { opacity: 0.8 },
                }}
              >
                {item.label}
              </Typography>
            ))}
          </Box>

          <Button
            variant="contained"
            color="inherit"
            sx={{ ml: 2, backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
            onClick={handleLogout}
          >
            Đăng xuất
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main Container */}
      <Box sx={{ display: 'flex', flexGrow: 1 }}>
        {/* Sidebar */}
        <Drawer
          variant="permanent"
          sx={{
            width: 250,
            '& .MuiDrawer-paper': {
              width: 250,
              boxSizing: 'border-box',
              backgroundColor: '#f5f5f5',
            },
          }}
        >
          <Box sx={{ p: 2 }}>
            <List>
              {navItems.map((item) => (
                <ListItem
                  button
                  key={item.path}
                  component={Link}
                  to={item.path}
                  sx={{
                    mb: 1,
                    borderRadius: 1,
                    '&:hover': {
                      backgroundColor: '#e3f2fd',
                    },
                  }}
                >
                  <ListItemText primary={item.label} />
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>

        {/* Content */}
        <Box className="main-content">
          <Container maxWidth="lg" sx={{ py: 3 }}>
            <Outlet />
          </Container>
        </Box>
      </Box>
    </Box>
  );
}