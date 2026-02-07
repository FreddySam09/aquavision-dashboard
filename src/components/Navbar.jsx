//components/Navbar.jsx
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Button,
  Chip,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navItemStyle = {
  position: "relative",
  mx: 1,
  color: "#e0e0e0",
  textTransform: "none",
  fontWeight: 500,
  "&::after": {
    content: '""',
    position: "absolute",
    left: 0,
    bottom: -4,
    width: "0%",
    height: "2px",
    backgroundColor: "#90caf9",
    transition: "width 0.3s ease",
  },
  "&:hover::after": {
    width: "100%",
  },
};

const activeStyle = {
  "&::after": {
    width: "100%",
  },
};

const Navbar = () => {
  const { logout, user } = useAuth();

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: "rgba(18,18,18,0.85)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* LEFT: BRAND */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              letterSpacing: 1,
              mr: 4,
            }}
          >
            AquaVision
          </Typography>

          <Button
            component={NavLink}
            to="/"
            sx={navItemStyle}
            style={({ isActive }) => (isActive ? activeStyle : {})}
          >
            Home
          </Button>

          <Button
            component={NavLink}
            to="/dashboard"
            sx={navItemStyle}
            style={({ isActive }) => (isActive ? activeStyle : {})}
          >
            Dashboard
          </Button>

          <Button
            component={NavLink}
            to="/services"
            sx={navItemStyle}
            style={({ isActive }) => (isActive ? activeStyle : {})}
          >
            Services
          </Button>

          <Button
            component={NavLink}
            to="/settings"
            sx={navItemStyle}
            style={({ isActive }) => (isActive ? activeStyle : {})}
          >
            Settings
          </Button>
        </Box>

        {/* RIGHT: STATUS + USER */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Chip
            label="AUV • Connected"
            size="small"
            sx={{
              backgroundColor: "rgba(76,175,80,0.15)",
              color: "#81c784",
              fontWeight: 500,
            }}
          />

          <Typography variant="body2" color="gray">
            {user?.role?.toUpperCase()}
          </Typography>

          <Button
            size="small"
            variant="outlined"
            color="inherit"
            onClick={logout}
            sx={{
              borderColor: "rgba(255,255,255,0.2)",
              "&:hover": {
                borderColor: "#f44336",
                color: "#f44336",
              },
            }}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
