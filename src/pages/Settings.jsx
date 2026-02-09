import { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const navigate = useNavigate();

  const [ip, setIP] = useState("");
  const [port, setPort] = useState("5000");

  useEffect(() => {
    setIP(localStorage.getItem("server_ip") || "");
    setPort(localStorage.getItem("server_port") || "5000");
  }, []);

  const save = () => {
    localStorage.setItem("server_ip", ip);
    localStorage.setItem("server_port", port);
  };

  const disconnect = () => {
    localStorage.removeItem("server_ip");
    localStorage.removeItem("server_port");
    navigate("/connect");
  };

  return (
    <Box
      sx={{
        width: "100vw",
        minHeight: "100vh",
        bgcolor: "#121212",
        color: "#fff",
        p: 4,
        boxSizing: "border-box",
      }}
    >
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
        Settings
      </Typography>

      <Grid container spacing={3} sx={{ maxWidth: "1000px" }}>
        {/* Subscription Card */}
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 3,
              bgcolor: "#1E1E1E",
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              Subscription
            </Typography>

            <Typography variant="body2" color="gray">
              Current Plan
            </Typography>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Free Tier
            </Typography>

            <Button variant="contained">
              Upgrade to Pro
            </Button>
          </Paper>
        </Grid>

        {/* Server Connection Card */}
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 3,
              bgcolor: "#1E1E1E",
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              AUV Server
            </Typography>

            <TextField
              label="Server IP"
              fullWidth
              value={ip}
              onChange={(e) => setIP(e.target.value)}
              sx={{ mb: 2 }}
            />

            <TextField
              label="Port"
              fullWidth
              value={port}
              onChange={(e) => setPort(e.target.value)}
              sx={{ mb: 3 }}
            />

            <Box sx={{ display: "flex", gap: 2 }}>
              <Button variant="contained" onClick={save}>
                Update Server
              </Button>

              <Button
                variant="outlined"
                color="error"
                onClick={disconnect}
              >
                Disconnect
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
