import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { useEffect, useState } from "react";

Chart.register(...registerables);

const DepthGraph = ({ y }) => {
  const [depthData, setDepthData] = useState([]);

  useEffect(() => {
    // ✅ Keep last 20 depth values
    setDepthData((prev) => [...prev.slice(-40), { x: depthData.length, y }]);
  }, [y]);

  const data = {
    datasets: [
      {
        label: "AUV Depth (m)",
        data: depthData,
        backgroundColor: "rgba(0, 200, 255, 0.3)", // Light blue for water effect
        borderColor: "#00eaff", // Neon cyan for visibility
        borderWidth: 2,
        pointRadius: 4,
        fill: true,
        tension: 0.3, // Smooth curve effect
      },
    ],
  };

  const options = {
    scales: {
      x: { type: "linear", display: false }, // No need to show time axis
      y: {
        min: -20, // Water surface at 0
        max: 20, // Depth increases negatively
        reverse: false, // Flips graph so deeper is downward
        ticks: { stepSize: 5 },
        grid: { color: "#333", borderDash: [5, 5] },
      },
    },
    plugins: { legend: { display: false } },
  };

  return <Line data={data} options={options} />;
};

export default DepthGraph;