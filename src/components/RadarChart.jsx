//components/RadarChart.jsx
import { Box } from "@mui/material";
import { useEffect, useState, useRef } from "react";

const RadarChart = ({ auvData }) => {
  const [spots, setSpots] = useState([]);

  // Track previous values to detect transitions
  const prevCollectRef = useRef(false);
  const prevDetectRef = useRef(false);

  useEffect(() => {
    const prevCollect = prevCollectRef.current;
    const prevDetect = prevDetectRef.current;

    const nowCollect = auvData.plastic_collection;
    const nowDetect = auvData.plastic_detected;
    const fish = auvData.fishes_detected;

    // ============================
    // 1️⃣ RECORD THE MOMENT OF DETECTION
    // ============================
    const detectionJustHappened =
      prevDetect === false && nowDetect === true;

    const fishOnlyJustHappened =
      prevDetect === false && nowDetect === false && fish === 1;

    if (detectionJustHappened || fishOnlyJustHappened) {
      let color = "blue"; // fish-only default

      if (nowDetect && fish === 0) color = "red";       // Plastic only
      if (nowDetect && fish === 1) color = "white";     // Plastic + fish
      if (!nowDetect && fish === 1) color = "blue";     // Fish only

      const newSpot = {
        id: Date.now(),
        x: auvData.x,
        z: auvData.z,
        baseColor: color,  // initial color
        finalColor: color, // changes to green later for plastic cases
        type: color,       // track type for conversion later
      };

      setSpots((prev) => [...prev, newSpot]);
      console.log("📍 Logged detection spot:", newSpot);
    }

    // ============================
    // 2️⃣ WHEN COLLECTION JUST FINISHED → TURN PLASTIC SPOTS GREEN
    // ============================
    const collectionJustFinished =
      prevCollect === true && nowCollect === false;

    if (collectionJustFinished) {
      setSpots((prev) =>
        prev.map((spot) =>
          spot.type === "red" || spot.type === "white"
            ? { ...spot, finalColor: "green" }
            : spot
        )
      );
      console.log("🟢 Plastic collected → Converted red/white to green");
    }

    prevCollectRef.current = nowCollect;
    prevDetectRef.current = nowDetect;
  }, [auvData.plastic_collection, auvData.plastic_detected, auvData.fishes_detected]);

  const getPosition = (val) => 50 + val * 2 + "%";

  // Heatmap glow colors
  const colorMap = {
    red: "radial-gradient(circle, rgba(255,0,0,0.45), rgba(255,0,0,0.05))",
    blue: "radial-gradient(circle, rgba(0,150,255,0.45), rgba(0,150,255,0.05))",
    white: "radial-gradient(circle, rgba(255,255,255,0.45), rgba(255,255,255,0.05))",
    green: "radial-gradient(circle, rgba(0,255,0,0.45), rgba(0,255,0,0.05))",
  };

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
      {/* Grid */}
      <Box sx={{ width: 200, height: 200, border: "1px dashed #555", borderRadius: "50%", position: "absolute" }} />
      <Box sx={{ width: 150, height: 150, border: "1px dashed #555", borderRadius: "50%", position: "absolute" }} />
      <Box sx={{ width: 100, height: 100, border: "1px dashed #555", borderRadius: "50%", position: "absolute" }} />

      {/* STATIC HEATMAP SPOTS */}
      {spots.map((spot) => (
        <Box
          key={spot.id}
          sx={{
            position: "absolute",
            left: getPosition(spot.x),
            top: getPosition(spot.z),
            width: 35,
            height: 35,
            borderRadius: "50%",
            transform: "translate(-50%, -50%)",
            background: colorMap[spot.finalColor],
            boxShadow: "0 0 12px rgba(255,255,255,0.15)",
            pointerEvents: "none",
          }}
        />
      ))}

      {/* AUV Dot */}
      <Box
        sx={{
          width: 12,
          height: 12,
          borderRadius: "50%",
          bgcolor: "cyan",
          position: "absolute",
          left: getPosition(auvData.x),
          top: getPosition(auvData.z),
          transform: "translate(-50%, -50%)",
          border: "2px solid white",
        }}
      />

      {/* Center */}
      <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "#fff", position: "absolute" }} />
    </Box>
  );
};

export default RadarChart;
