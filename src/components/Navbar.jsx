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

const Navbar = ({ connected }) => {
  const { logout, user } = useAuth();
  const storedConnection =
    localStorage.getItem("auv_connected") === "true";

  const isConnected = connected || storedConnection;

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
        {/* LEFT: BRAND + NAV */}
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

          {user && (
            <>
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
            </>
          )}
        </Box>

        {/* RIGHT SIDE */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {user ? (
            <>
              <Chip
                label={
                  isConnected ? "AUV • Connected" : "AUV • Inactive"
                }
                size="small"
                sx={{
                  backgroundColor: isConnected
                    ? "rgba(76,175,80,0.15)"
                    : "rgba(244,67,54,0.15)",
                  color: isConnected ? "#81c784" : "#ef5350",
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
            </>
          ) : (
            <>
              <Button
                component={NavLink}
                to="/login"
                variant="outlined"
                color="inherit"
              >
                Login
              </Button>

              <Button
                component={NavLink}
                to="/signup"
                variant="contained"
              >
                Sign Up
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
