import { Box, Typography, Button, Grid } from "@mui/material";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <Box
      sx={{
        width: "100vw",
        minHeight: "100vh",
        bgcolor: "#121212",
        color: "#fff",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        p: 3,
      }}
    >
      <img
        src="/icon.png" // ✅ Direct Image Reference
        alt="AUV in Action"
        style={{ width: "10%", maxHeight: "500px", objectFit: "cover", borderRadius: "10px" }}
      />

      {/* 🔵 Hero Text Section */}
      <Box sx={{ textAlign: "center", mt: 3 }}>
        <Typography variant="h3" sx={{ fontWeight: 700 }}>MARINEER</Typography>
        <Typography variant="h6" sx={{ fontWeight: 400, maxWidth: "800px", mt: 1 }}>
          Explore the future of underwater robotics with our AUV system designed for environmental monitoring and ocean exploration.
        </Typography>
        <Button
          component={Link}
          to="/dashboard"
          variant="contained"
          sx={{ mt: 3, bgcolor: "#fff", color: "#121212", fontWeight: 600, mb: 3 }}
        >
          Go to Dashboard
        </Button>
      </Box>

      <img
        src="src/assets/interior.png" // ✅ Direct Image Reference
        alt="AUV in Action"
        style={{ width: "60%", maxHeight: "800px", objectFit: "cover", borderRadius: "10px", marginTop: "21px" }}
      />

      {/* 🔵 Additional Content */}
      <Box sx={{ width: "80%", mt: 8 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>Why Our AUV?</Typography>
        <Typography variant="body1" sx={{ mt: 1, opacity: 0.8 }}>
          Our AUV is built with cutting-edge technology to ensure seamless underwater navigation, real-time data collection, and sustainability.
        </Typography>
      </Box>

      {/* 🔵 Features Section */}
      <Grid container spacing={3} sx={{ width: "80%", mt: 5 }}>
        {[
          { title: "Edge Computing", img: "src/assets/electronics.png", desc: "Autonomous path planning and obstacle avoidance." },
          { title: "Real-time Precision", img: "src/assets/radar.jpg", desc: "Live telemetry with underwater insights." },
          { title: "Modular Power", img: "src/assets/power.png", desc: "AI-based plastic waste identification." },
          { title: "Thrust & Navigation", img: "src/assets/thruster.png", desc: "Battery-efficient and sustainable operations." },
        ].map((feature, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Box
              sx={{
                bgcolor: "#1E1E1E",
                p: 3,
                textAlign: "center",
                borderRadius: "8px",
                borderColor: "white",
                border: 1
              }}
            >
              <img
                src={feature.img} // ✅ Direct Path Reference
                alt={feature.title}
                style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "8px" }}
              />
              <Typography variant="h5" sx={{ fontWeight: 600, mt: 2 }}>{feature.title}</Typography>
              <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>{feature.desc}</Typography>
              <Button variant="outlined" sx={{ mt: 2, color: "#fff", borderColor: "#fff" }}>
                Learn More
              </Button>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Home;