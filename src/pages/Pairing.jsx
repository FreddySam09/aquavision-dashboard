//pages/Pairing.jsx
import {
  Box,
  Typography,
  LinearProgress,
  Fade,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";

const steps = [
  "Initializing communication interface",
  "Synchronizing AUV telemetry",
  "Verifying payload status",
  "Connection established",
];

const Pairing = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => prev + 1);
    }, 900);

    const finish = setTimeout(() => {
      navigate("/dashboard");
    }, 3600);

    return () => {
      clearInterval(interval);
      clearTimeout(finish);
    };
  }, []);

  return (
    <AuthLayout>
      <Box
        sx={{
          width: "100%",
          maxWidth: 420,
          p: 4,
          borderRadius: 2,
          backgroundColor: "rgba(24,24,24,0.9)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
          textAlign: "center",
        }}
      >
        <Typography variant="h6" fontWeight={600} mb={1}>
          Pairing with AUV
        </Typography>

        <Typography variant="body2" color="gray" mb={3}>
          Please wait while the system establishes a secure link
        </Typography>

        <LinearProgress sx={{ mb: 3 }} />

        <Fade in timeout={600}>
          <Typography variant="body2">
            {steps[Math.min(step, steps.length - 1)]}
          </Typography>
        </Fade>

        <Typography
          variant="caption"
          color="gray"
          display="block"
          mt={3}
        >
          AUV ID: AV-001 • Mode: SIMULATION
        </Typography>
      </Box>
    </AuthLayout>
  );
};

export default Pairing;
