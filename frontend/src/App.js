import React, { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

function App() {
  const [data, setData] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = () => {
      axios
        .get("http://localhost:5000/api/time-tracking")
        .then((response) => {
          setData(response.data);

          // Prepare data for the pie chart
          const chartData = response.data.map((row) => ({
            name: row.window_name,
            value: row.time_spent,
          }));
          setChartData(chartData);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds) => {
    if (seconds >= 3600) {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      return `${hours}h ${minutes}m`;
    } else if (seconds >= 60) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const COLORS = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"];

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        background: "linear-gradient(135deg, #a8e6ff, #fbc2eb)",
        minHeight: "100vh",
        color: "#333",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          color: "#ffffff",
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
          marginBottom: "20px",
        }}
      >
        Time Tracking Data
      </h1>
      <div
        style={{
          background: "rgba(255, 255, 255, 0.8)",
          borderRadius: "15px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
          padding: "20px",
          marginBottom: "20px",
        }}
      >
        <table
          border="1"
          cellPadding="10"
          style={{
            borderCollapse: "collapse",
            width: "100%",
            borderRadius: "10px",
            overflow: "hidden",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
          }}
        >
          <thead>
            <tr style={{ background: "#36A2EB", color: "#fff" }}>
              <th>Window Name</th>
              <th>Time Spent</th>
              <th>Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr
                key={row.window_name}
                style={{
                  background: "rgba(255, 255, 255, 0.9)",
                  color: "#333",
                  textAlign: "center",
                }}
              >
                <td>{row.window_name}</td>
                <td>{formatTime(row.time_spent)}</td>
                <td>{new Date(row.last_updated).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2
        style={{
          textAlign: "center",
          color: "#ffffff",
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
        }}
      >
        Time Spent by Window
      </h2>
      {chartData.length > 0 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
            background: "rgba(255, 255, 255, 0.8)",
            borderRadius: "15px",
            padding: "20px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
          }}
        >
          <PieChart width={600} height={400}>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={150}
              fill="#8884d8"
              label={({ name, value }) => `${name}: ${formatTime(value)}`}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [formatTime(value), name]}
              contentStyle={{
                whiteSpace: "pre-wrap", // Ensures text wraps in the tooltip
                textAlign: "left",
                background: "#ffffff",
                borderRadius: "10px",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
              }}
            />
            <Legend />
          </PieChart>
        </div>
      )}
    </div>
  );
}

export default App;