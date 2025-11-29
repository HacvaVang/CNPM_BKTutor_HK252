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

// export default function LoginPage() {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch('/api/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ username, password }),
//       });
//       if (response.ok) {
//         const data = await response.json();
//         localStorage.setItem('token', data.token);
//         navigate('/dashboard');
//       } else {
//         setError('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
//       }
//     } catch (err) {
//       setError('Lỗi kết nối. Vui lòng thử lại.');
//     }
//   };

//   return (
//       <Box
//         sx={{
//           minHeight: '100vh',
//           minWidth: '100vw',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//         }}
//       >
//         <Paper elevation={3} sx={{
//            p: 4, 
//            width: '40%',
//            mx: 'auto'
//            }}>
//             <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
//               <Box
//                 sx={{
//                   background: 'white',
//                   padding: 1,
//                   borderRadius: 2,
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                 }}
//               >
//                 <img
//                   src="/bk-logo.png"
//                   alt="BK Logo"
//                   style={{ width: 80, height: 80 }}
//                 />
//               </Box>
//             </Box>
//             <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, textAlign: 'center' }}>
//               BKTutor Login
//             </Typography>

//             {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

//             <form onSubmit={handleLogin} >
//               <TextField
//                 fullWidth
//                 label="Username"
//                 type="text"
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//                 margin="normal"
//                 variant="outlined"
//               />
//               <TextField
//                 fullWidth
//                 label="Password"
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 margin="normal"
//                 variant="outlined"
//               />
//               <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
//                 <input type="checkbox" name="remember" />
//                 Warn me before logging me into other sites
//               </label>
//               <div
//                 style={{
//                   gap: "10px",
//                   display: "flex",
//                   justifyContent: "center"
//                 }}
//               >
//                 <Button
//                   variant="contained"
//                   size="large"
//                   type="submit"
//                   sx={{ mt: 3 }}
//                 >
//                   Login
//                 </Button>
//                 <Button
//                   variant="contained"
//                   size="large"
//                   sx={{ mt: 3 }}
//                   onClick={() => {
//                       setUsername('');
//                       setPassword('');
//                       setError('');
//                     }
//                   }
//                 >
//                   Clear
//                 </Button>
//               </div>
//             </form>
//             <Typography
//               component="a"
//               href="#"
//               sx={{
//                 mt:1,
//                 display: 'block',
//                 color: 'blue',
//                 textDecoration: 'underline',
//                 cursor: 'pointer',
//                 '&:hover': {opacity: 0.8}
//               }}
//             >
//               Change password?
//             </Typography>
//         </Paper>
//       </Box>
//   );
// }

export default function LoginPage() {
  // Không cần useState cho username/password nữa
  const navigate = useNavigate();
  // const [error, setError] = useState(''); // Có thể giữ lại nếu bạn có lỗi khác

  // Hàm này KHÔNG cần gửi Fetch Request nữa, nó chỉ cần Redirect.
const handleSsoLogin = () => {
    // Sử dụng replace để ngăn người dùng quay lại trang login
    window.location.replace('http://localhost:8001/login'); 
};

  return (
    <Box
      // ... (Phần style container giữ nguyên) ...
    >
      <Paper elevation={3} sx={{
          p: 4, 
          width: '40%',
          mx: 'auto'
        }}>
        {/* ... (Phần logo và tiêu đề giữ nguyên) ... */}
        
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, textAlign: 'center' }}>
          BKTutor Login (SSO)
        </Typography>

        {/* ❌ LOẠI BỎ to àn bộ form nhập liệu Username/Password vì SSO không cần */}
        
        <div
          style={{
            gap: "10px",
            display: "flex",
            justifyContent: "center"
          }}
        >
          {/* ✅ Nút này sẽ kích hoạt quy trình SSO Redirect */}
          <Button
            variant="contained"
            size="large"
            onClick={handleSsoLogin} // Gọi hàm Redirect
            sx={{ mt: 3, backgroundColor: 'darkblue' }}
          >
            Đăng nhập bằng Bách Khoa SSO
          </Button>
        </div>
      </Paper>
    </Box>
  );
}