//components/PlayCanvas.jsx
import { Box } from "@mui/material";

const PlayCanvas = () => {
  return (
    <Box p={3} bgcolor="black">
      <iframe
        src="https://your-playcanvas-url.com"
        width="100%"
        height="50px"
        style={{ borderRadius: "16px", border: "none" }}
      ></iframe>
    </Box>
  );
};

export default PlayCanvas;
