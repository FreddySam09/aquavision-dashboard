// components/BatteryGraph.jsx
import { Line } from "react-chartjs-2";
import { useEffect, useState } from "react";
import Chart from "chart.js/auto";

const BatteryGraph = ({ battery }) => {
  const [batteryData, setBatteryData] = useState([]);

  useEffect(() => {
    setBatteryData((prev) => [...prev.slice(-19), battery]);
  }, [battery]);

  return (
    <Line
      data={{
        labels: batteryData.map((_, i) => i),
        datasets: [{ data: batteryData, borderColor: "cyan", tension: 0.3 }]
      }}
      options={{
        scales: { y: { beginAtZero: true, max: 100 } },
        plugins: { legend: { display: false } }
      }}
    />
  );
};

export default BatteryGraph;
