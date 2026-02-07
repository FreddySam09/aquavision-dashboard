//components/AuvHealthGraph.jsx
import { Box, Typography } from "@mui/material";

const AuvHealthGraph = ({ healthStatus }) => {
  if (!healthStatus) return null;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <img src="src/assets/auv-shadow.png" alt="AUV" style={{ width: "400px", marginBottom: "10px" }} />

      {/* Status Indicators */}
      <Box sx={{ display: "flex", gap: 2.5 }}>
        {Object.entries(healthStatus).map(([part, status]) => (
          <Box key={part} sx={{ textAlign: "center" }}>
            <Box
              sx={{
                width: "22px",
                height: "22px",
                borderRadius: "50%",
                borderColor: "white",
                bgcolor:
                  status === "good" ? "green" :
                  status === "warning" ? "yellow" :
                  "red",
              }}
            />
            <Typography variant="body2" sx={{ mt: 1 }}>{part.toUpperCase()}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default AuvHealthGraph;