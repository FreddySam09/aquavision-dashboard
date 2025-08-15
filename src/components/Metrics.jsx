import { Box, Typography, LinearProgress } from "@mui/material";

const Metrics = ({ auvData }) => {
  return (
    <Box bgcolor="black" p={3} borderRadius={2}>
      <Typography color="white">🔋 Battery: {auvData ? auvData.battery.toFixed(1) + "%" : "No Data"}</Typography>
      <LinearProgress variant="determinate" value={auvData ? auvData.battery : 0} />
      
      <Typography color="white">🚀 Speed: {auvData ? auvData.speed.toFixed(2) + " m/s" : "No Data"}</Typography>
    </Box>
  );
};

export default Metrics;
