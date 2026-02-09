import { Box, Typography, Paper, Grid, Button, TextField } from "@mui/material";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import { useState } from "react";

// Temporary demo data
const hotspotData = [
  { lat: 13.0827, lng: 80.2707, level: 80, name: "Chennai Port" },
  { lat: 13.05, lng: 80.28, level: 45, name: "Marina Coast" },
  { lat: 13.1, lng: 80.25, level: 60, name: "Fishing Zone" },
];

const getColor = (level) => {
  if (level > 70) return "red";
  if (level > 40) return "orange";
  return "yellow";
};

export default function Services() {
  const [email, setEmail] = useState("");

  const totalHotspots = hotspotData.length;
  const avgPollution =
    hotspotData.reduce((sum, h) => sum + h.level, 0) / totalHotspots;

  const maxHotspot = hotspotData.reduce((prev, curr) =>
    curr.level > prev.level ? curr : prev
  );

  const handleReport = async () => {
    try {
      const ip = localStorage.getItem("server_ip") || "localhost";
      const port = localStorage.getItem("server_port") || "5000";

      const response = await fetch(
        `http://${ip}:${port}/generate_report`
      );

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "AquaVision_Report.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      alert("Report generation failed");
    }
  };


  const handleSupport = () => {
    alert("Support request submitted");
  };

  const handleMaintenance = () => {
    alert("Maintenance scheduled");
  };

  const handleApiAccess = () => {
    alert("API access activated (demo)");
  };

  const handleControl = (action) => {
    alert(`AUV command sent: ${action}`);
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
        AquaVision Services
      </Typography>

      <Grid container spacing={3}>
        {/* MAP */}
        <Grid item xs={12}>
          <Paper
            sx={{
              height: "500px",
              bgcolor: "#1E1E1E",
              overflow: "hidden",
            }}
          >
            <MapContainer
              center={[13.0827, 80.2707]}
              zoom={11}
              style={{ height: "100%", width: "100%" }}
            >
              {/* Dark map tiles */}
              <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
              />

              {hotspotData.map((spot, i) => (
                <CircleMarker
                  key={i}
                  center={[spot.lat, spot.lng]}
                  radius={12}
                  pathOptions={{
                    color: getColor(spot.level),
                    fillColor: getColor(spot.level),
                    fillOpacity: 0.6,
                  }}
                >
                  <Popup>
                    <strong>{spot.name}</strong>
                    <br />
                    Pollution Level: {spot.level}%
                  </Popup>
                </CircleMarker>
              ))}
            </MapContainer>
          </Paper>
        </Grid>

        {/* ANALYTICS CARDS */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, bgcolor: "#1E1E1E" }}>
            <Typography variant="body2" color="gray">
              Total Hotspots
            </Typography>
            <Typography variant="h4">{totalHotspots}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, bgcolor: "#1E1E1E" }}>
            <Typography variant="body2" color="gray">
              Average Pollution
            </Typography>
            <Typography variant="h4">
              {avgPollution.toFixed(1)}%
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, bgcolor: "#1E1E1E" }}>
            <Typography variant="body2" color="gray">
              Most Polluted Zone
            </Typography>
            <Typography variant="h6">
              {maxHotspot.name}
            </Typography>
            <Typography color="error">
              {maxHotspot.level}%
            </Typography>
          </Paper>
        </Grid>

        {/* API ACCESS */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, bgcolor: "#1E1E1E" }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Pollution Hotspot API
            </Typography>
            <Typography variant="body2" color="gray" sx={{ mb: 2 }}>
              Access real-time pollution data through our API.
            </Typography>

            <TextField
              label="Email for API Key"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
            />

            <Button variant="contained" onClick={handleApiAccess}>
              Activate API Access
            </Button>
          </Paper>
        </Grid>

        {/* TECHNICAL SUPPORT */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, bgcolor: "#1E1E1E" }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Technical Support
            </Typography>
            <Typography variant="body2" color="gray" sx={{ mb: 2 }}>
              Request remote diagnostics or operator assistance.
            </Typography>

            <Button
              variant="contained"
              onClick={handleSupport}
              sx={{ mr: 2 }}
            >
              Request Support
            </Button>

            <Button
              variant="outlined"
              color="warning"
              onClick={handleMaintenance}
            >
              Schedule Maintenance
            </Button>
          </Paper>
        </Grid>

        {/* AUV CONTROL */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, bgcolor: "#1E1E1E" }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              AUV Remote Control
            </Typography>

            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Button
                variant="contained"
                onClick={() => handleControl("Seek Shore")}
              >
                Seek Shore
              </Button>

              <Button
                variant="contained"
                color="error"
                onClick={() => handleControl("Emergency Stop")}
              >
                Emergency Stop
              </Button>

              <Button
                variant="outlined"
                onClick={() => handleControl("Resume Mission")}
              >
                Resume Mission
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* REPORT GENERATION */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, bgcolor: "#1E1E1E" }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Mission Report
            </Typography>
            <Typography variant="body2" color="gray" sx={{ mb: 2 }}>
              Generate a report of the current AUV task and detected pollution.
            </Typography>

            <Button variant="contained" onClick={handleReport}>
              Generate Report
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
