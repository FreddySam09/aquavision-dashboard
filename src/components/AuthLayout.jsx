//components/AuthLayout.jsx
import { Box } from "@mui/material";

const AuthLayout = ({ children }) => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(circle at top, #1a1a1a 0%, #0b0b0b 60%)",
        px: 2,
      }}
    >
      {children}
    </Box>
  );
};

export default AuthLayout;
