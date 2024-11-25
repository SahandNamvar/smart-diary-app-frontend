import React from "react";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
);

const LineChart = ({ moodTrends }) => {
  const data = {
    labels: moodTrends.map((item) => item.date),
    datasets: [
      {
        label: "Sentiment Score",
        data: moodTrends.map((item) => item.sentiment_score),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.4)",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <div style={{ height: "300px" }}>
      <Line data={data} options={options} />
    </div>
  );
};

export default LineChart;
