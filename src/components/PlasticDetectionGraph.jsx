import { Line } from "react-chartjs-2";
import { useEffect, useState } from "react";
import Chart from "chart.js/auto";

const PlasticDetectionGraph = ({ auvData }) => {
  const [stateData, setStateData] = useState([]);
  const [stateCounts, setStateCounts] = useState({ y: 0, w: 0, n: 0 });

  // Map auvData to state and value
  const getStateAndValue = () => {
    if (auvData.plastic_detected && auvData.fishes_detected === 0) {
      return { state: "y", value: 2 }; // Plastic only
    }
    if (auvData.plastic_detected && auvData.fishes_detected === 1) {
      return { state: "w", value: 1 }; // Plastic + Fishes
    }
    return { state: "n", value: 0 }; // No plastic or only fishes
  };

  useEffect(() => {
    const { state, value } = getStateAndValue();

    // Update state data (keep last 20 values)
    setStateData(prev => {
      const newData = [...prev, { state, value }].slice(-20);
      return newData;
    });

    // Update state counts
    setStateCounts(prevCounts => ({
      ...prevCounts,
      [state]: prevCounts[state] + 1,
    }));
  }, [auvData.plastic_detected, auvData.fishes_detected]);

  return (
    <div style={{ height: "350px", width: "100%" }}>
      <Line
        data={{
          labels: stateData.map((_, i) => i),
          datasets: [
            {
              data: stateData.map(point => point.value),
              borderColor: "#ffffff", // White line for visibility
              borderWidth: 1,
              fill: false,
              tension: 0,
              pointRadius: 6,
              pointBackgroundColor: stateData.map(point => {
                if (point.state === "y") return "red";
                if (point.state === "w") return "blue";
                return "green";
              }),
            },
          ],
        }}
        options={{
          maintainAspectRatio: false,
          scales: {
            y: {
              min: -0.5,
              max: 2.5,
              ticks: {
                stepSize: 1,
                callback: value => {
                  if (value === 2) return "y (Plastic)";
                  if (value === 1) return "w (Plastic + Fishes)";
                  if (value === 0) return "n (No Plastic)";
                  return "";
                },
              },
            },
            x: {
              display: false, // Hide x-axis like BatteryGraph
            },
          },
          plugins: {
            legend: { display: false },
          },
        }}
      />
      <p style={{ fontWeight: "100", marginTop: "10px", color: "gray", fontSize: "12px", textAlign: "center" }}>
        Plastic (y): {stateCounts.y} | Plastic + Fishes (w): {stateCounts.w} | No Plastic (n): {stateCounts.n}
      </p>
    </div>
  );
};

export default PlasticDetectionGraph;