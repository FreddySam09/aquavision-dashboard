//pages/Signup.jsx
import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Divider,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { authCardStyle } from "../styles/authStyles";
import { useAuth } from "../context/AuthContext";

const Signup = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [role, setRole] = useState("viewer");

  const handleSignup = () => {
    login({
      username: "newuser",
      role: role,
    });
    navigate("/pairing");
  };

  return (
    <AuthLayout>
      <Box sx={authCardStyle}>
        <Typography variant="h5" fontWeight={600} mb={1}>
          Create account
        </Typography>

        <Typography variant="body2" color="gray" mb={3}>
          Register to access AquaVision telemetry dashboards
        </Typography>

        <TextField label="Username" fullWidth sx={{ mb: 2 }} />
        <TextField label="Password" type="password" fullWidth sx={{ mb: 2 }} />
        <TextField
          label="Confirm password"
          type="password"
          fullWidth
          sx={{ mb: 2 }}
        />

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel id="role-label">Role</InputLabel>
          <Select
            labelId="role-label"
            label="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <MenuItem value="viewer">
              Viewer — Read-only access
            </MenuItem>
            <MenuItem value="operator">
              Operator — Control & monitor AUV
            </MenuItem>
            <MenuItem value="admin" disabled>
              Admin — Invite only
            </MenuItem>
          </Select>
        </FormControl>

        <Button
          fullWidth
          size="large"
          variant="contained"
          onClick={handleSignup}
          sx={{ py: 1.3 }}
        >
          Create account
        </Button>

        <Divider sx={{ my: 3, opacity: 0.2 }} />

        <Typography variant="body2" align="center">
          Already registered?{" "}
          <Link to="/login" style={{ color: "#90caf9" }}>
            Login
          </Link>
        </Typography>
      </Box>
    </AuthLayout>
  );
};

export default Signup;
