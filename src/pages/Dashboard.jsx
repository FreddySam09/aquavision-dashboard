import { Box, Typography, Paper, Grid, Button } from "@mui/material";
import RadarChart from "../components/RadarChart";
import BatteryGraph from "../components/BatteryGraph";
import DepthGraph from "../components/DepthGraph";
import PlasticDetectionGraph from "../components/PlasticDetectionGraph";                              m,.\

import AuvHealthGraph from "../components/AuvHealthGraph";
import WebSocketClient from "../components/WebSocketClient";
import { useState } from "react";

const Dashboard = () => {
  const [auvData, setAuvData] = useState({
    battery: 100,
    speed: 0.1,
    x: 0,
    y: 0,
    z: 0,
    plastic_detected: false,
    plastic_collection: false,
    fishes_detected: 0,
    health_status: {
      motor: "good",
      sensors: "good",
      camera: "warning",
      thrusters: "critical",
    },
  });

  // Determine the plastic collection status based on Flask server state
  const getPlasticStatus = () => {
    if (auvData.plastic_collection && auvData.fishes_detected === 0) {
      return { text: "Collecting Plastic...", color: "limegreen" };
    }
    if (auvData.plastic_detected && auvData.fishes_detected === 1) {
      return { text: "Waiting for Aquatic Life", color: "cyan" };
    }
    return { text: "Collected", color: "gray" };
  };

  const plasticStatus = getPlasticStatus();

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        bgcolor: "#121212",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        overflowX: "hidden",
        alignItems: "center",
        p: 2,
        boxSizing: "border-box",
      }}
    >
      {/* 🔵 Logo */}
      <Box sx={{ textAlign: "center", width: "100%", mb: 2 }}>
        <img src="/logo.png" alt="AUV Logo" style={{ height: "100px" }} />
      </Box>

      {/* 🔵 Full-width PlayCanvas Simulation */}
      <Paper sx={{ p: 2, bgcolor: "#1E1E1E", width: "1395px", mb: 2, height: "900px" }}>
        <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>Live Simulation</Typography>
        <iframe
          src="/playcanvas/auv-sim3/index.html"
          title="PlayCanvas Simulation"
          style={{ width: "100%", height: "550px", border: "none" }}
        />
      </Paper>

      {/* 🔵 Grid Layout for Radar + Position */}
      <Grid container spacing={2} sx={{ width: "1440px", mb: 2 }}>
        {/* 🟢 Radar Chart */}
        <Grid item xs={6}>
          <Paper
            sx={{
              p: 2,
              bgcolor: "#1E1E1E",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>AUV Data</Typography>
            <RadarChart auvData={auvData} />
            <Typography variant="body2" sx={{ mt: 2 }}>Speed: {auvData.speed.toFixed(2)} m/s</Typography>
            <Typography variant="body2">X: {auvData.x.toFixed(2)}</Typography>
            <Typography variant="body2">Y: {auvData.y.toFixed(2)}</Typography>
            <Typography variant="body2">Z: {auvData.z.toFixed(2)}</Typography>
          </Paper>
        </Grid>

        {/* 🆕 AUV Position Graph */}
        <Grid item xs={6}>
          <Paper sx={{ p: 2, bgcolor: "#1E1E1E", height: "380px" }}>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>AUV Depth Level</Typography>
            <DepthGraph x={auvData.x} y={auvData.y} z={auvData.z} />
          </Paper>
        </Grid>
      </Grid>

      {/* 🔋 Battery Graph & Plastic Detection Graph in Columns */}
      <Grid container spacing={2} sx={{ width: "1440px", mb: 2 }}>
        {/* 🔋 Battery Graph */}
        <Grid item xs={6}>
          <Paper sx={{ p: 2, bgcolor: "#1E1E1E", height: "400px" }}>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>Battery Level</Typography>
            <BatteryGraph battery={auvData.battery} />
          </Paper>
        </Grid>

        {/* 🆕 Plastic Detection Graph */}
        <Grid item xs={6}>
          <Paper sx={{ p: 2, bgcolor: "#1E1E1E", height: "400px" }}>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>Plastic Detection</Typography>
            <PlasticDetectionGraph auvData={auvData} />
          </Paper>
        </Grid>
      </Grid>

      {/* 🆕 AUV Health Graph & Plastic Collection Status */}
      <Grid container spacing={2} sx={{ width: "1440px", mb: 2 }}>
        {/* 🟢 AUV Health Graph */}
        <Grid item xs={6}>
          <Paper sx={{ p: 2, bgcolor: "#1E1E1E", height: "280px" }}>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>AUV Health Status</Typography>
            <AuvHealthGraph healthStatus={auvData.health_status} />
          </Paper>
        </Grid>

        {/* 🆕 Plastic Collection Status */}
        <Grid item xs={6}>
          <Paper
            sx={{
              p: 2,
              bgcolor: "#1E1E1E",
              height: "200px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              flexDirection: "column",
              height: "280px",
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              Plastic Collection Status
            </Typography>
            <Typography
              variant="h6"
              sx={{
                mt: 2,
                color: plasticStatus.color,
                fontWeight: "bold",
              }}
            >
              {plasticStatus.text}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* 🔴 Control Buttons at Bottom */}
      <Box sx={{ display: "flex", justifyContent: "center", gap: 3, width: "100%", mt: 2 }}>
        <Button variant="contained" sx={buttonStyle}>Seek Shore</Button>
        <Button variant="contained" sx={buttonStyle}>Emergency Alert</Button>
        <Button variant="contained" sx={buttonStyle}>Tank Clearance</Button>
        <Button variant="contained" sx={buttonStyle}>Battery Swap</Button>
      </Box>

      {/* WebSocket */}
      <WebSocketClient onDataReceived={setAuvData} />
    </Box>
  );
};

// ✅ Button Styling (Sleek, Modern)
const buttonStyle = {
  bgcolor: "#333",
  color: "#fff",
  fontWeight: "bold",
  fontFamily: "Poppins",
  textTransform: "none",
  fontSize: "16px",
  p: "12px 24px",
  borderRadius: "8px",
  "&:hover": {
    bgcolor: "#555",
  },
};

export default Dashboard;