require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const tmRoutes = require("./routes/tmRoutes");

const app = express();

connectDB();

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: ["http://localhost:5173", "https://personal-task-manager-cvpq.onrender.com"],
  credentials: true,
}));

app.use("/api", tmRoutes);

app.listen(PORT, () => {
  console.log(`Port is running in :${PORT}`);
});
