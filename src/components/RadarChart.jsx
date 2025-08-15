import { Box } from "@mui/material";

const RadarChart = ({ auvData }) => {
  return (
    <Box
      sx={{
        width: 250,
        height: 250,
        borderRadius: "50%",
        bgcolor: "#1E1E1E",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        border: "2px solid #444",
      }}
    >
      {/* Grid Circles */}
      <Box sx={{ width: 200, height: 200, borderRadius: "50%", border: "1px dashed #555", position: "absolute" }} />
      <Box sx={{ width: 150, height: 150, borderRadius: "50%", border: "1px dashed #555", position: "absolute" }} />
      <Box sx={{ width: 100, height: 100, borderRadius: "50%", border: "1px dashed #555", position: "absolute" }} />

      {/* AUV Position */}
      <Box
        sx={{
          width: 12,
          height: 12,
          borderRadius: "50%",
          bgcolor: "cyan",
          position: "absolute",
          left: 50 + auvData.x * 2 + "%",
          top: 50 + auvData.z * 2 + "%",
          transform: "translate(-50%, -50%)",
          border: "2px solid #fff",
        }}
      />

      {/* Center Dot */}
      <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "#fff", position: "absolute" }} />
    </Box>
  );
};

export default RadarChart;