// server.js
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const Admin = require("./models/Admin");
dotenv.config();

const app = express();

app.use("/uploads", express.static("uploads"));

// Middleware
app.use(cors());
app.use(express.json());

// Test Route
app.get("/", (req, res) => {
  res.send("Barber Booking API is running...");
});

// Connect to MongoDB and Start Server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });


// داخل server.js
const verifyRoutes = require("./routes/verify");
app.use("/api/verify", verifyRoutes);

const appointmentRoutes = require("./routes/appointments");
app.use("/api/appointments", appointmentRoutes);

const adminRoutes = require("./routes/admin");
app.use("/api/admin", adminRoutes);

const adminBarbersRoutes = require("./routes/adminBarbers");
app.use("/api/admin/barbers", adminBarbersRoutes);

const adminServicesRoutes = require("./routes/adminServices");
app.use("/api/admin/services", adminServicesRoutes);

const adminAppointmentsRoutes = require("./routes/adminAppointments");
app.use("/api/admin/appointments", adminAppointmentsRoutes);

app.use("/api/public", require("./routes/public.routes"));

const startCronJobs = require("./cron/startCronJobs");
startCronJobs();
