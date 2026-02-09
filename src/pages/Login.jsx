//pages/Login.jsx
import {
  Box,
  TextField,
  Button,
  Typography,
  Divider,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { authCardStyle } from "../styles/authStyles";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    login({
      username: "operator",
      role: "operator", // ← later comes from backend
    });
    const serverIP = localStorage.getItem("server_ip");

    if (!serverIP) {
      navigate("/connect");
    } else {
      navigate("/dashboard");
    }

  };


  return (
    <AuthLayout>
      <Box sx={authCardStyle}>
        <Typography
          variant="h5"
          fontWeight={600}
          letterSpacing={0.5}
          mb={1}
        >
          Welcome back
        </Typography>

        <Typography variant="body2" color="gray" mb={3}>
          Sign in to access the AquaVision system
        </Typography>

        <TextField
          label="Username"
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          sx={{ mb: 3 }}
        />

        <Button
          fullWidth
          size="large"
          variant="contained"
          onClick={handleLogin}
          sx={{
            py: 1.3,
            fontWeight: 500,
          }}
        >
          Login
        </Button>

        <Divider sx={{ my: 3, opacity: 0.2 }} />

        <Typography variant="body2" align="center">
          New to AquaVision?{" "}
          <Link to="/signup" style={{ color: "#90caf9" }}>
            Create an account
          </Link>
        </Typography>
      </Box>
    </AuthLayout>
  );
};

export default Login;
