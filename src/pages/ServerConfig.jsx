import { useState, useEffect } from "react";
import { Box, Paper, Typography, TextField, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function ServerConfig() {
  const [ip, setIP] = useState("");
  const [port, setPort] = useState("5000");
  const navigate = useNavigate();

  useEffect(() => {
    setIP(localStorage.getItem("server_ip") || "");
    setPort(localStorage.getItem("server_port") || "5000");
  }, []);

  const save = () => {
    localStorage.setItem("server_ip", ip);
    localStorage.setItem("server_port", port);

    // Go directly to dashboard
    navigate("/dashboard");
  };

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        bgcolor: "#121212",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper
        sx={{
          p: 4,
          bgcolor: "#1E1E1E",
          width: 400,
          textAlign: "center",
        }}
      >
        <Typography variant="h5" sx={{ mb: 3 }}>
          Connect to AUV Server
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

        <Button
          variant="contained"
          fullWidth
          onClick={save}
        >
          Connect
        </Button>
      </Paper>
    </Box>
  );
}
