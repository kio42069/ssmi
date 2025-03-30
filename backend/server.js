const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();
const port = 5000;

// PostgreSQL connection setup
const pool = new Pool({
  user: "kiddo42069",
  host: "localhost",
  database: "time_tracker",
  password: "kiddo42069",
  port: 5432,
});

// Middleware
app.use(cors());
app.use(express.json());

// API endpoint to fetch time tracking data
app.get("/api/time-tracking", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM time_tracking ORDER BY last_updated DESC");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});