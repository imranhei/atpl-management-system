const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
// const startCronJobs = require("./cornJobs");
const { createChatTables } = require("./models/Chat");
const { app, server } = require("./lib/socket");
// const cookieParser = require('cookie-parser');

// const authRoutes = require("./routes/auth/auth-routes");
// const orderRoutes = require("./routes/employee/order-routes");
// const defaultOrderRoutes = require("./routes/employee/default-order-routes");
// const menuRoutes = require("./routes/admin/menu-routes");
// const placeOrderRoutes = require("./routes/employee/place-order-routes");
const conversationRoutes = require("./routes/chat/chat-routes");

dotenv.config();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["POST", "PUT", "GET", "OPTIONS", "DELETE"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
    credentials: true,
  })
);

// Routes
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));
// app.use(cookieParser());
app.use("/api/alive", async (req, res) => {
  res.json({ message: "Server is alive" });
});
// app.use("/api/auth", authRoutes);
// app.use("/api/default-order", defaultOrderRoutes);
// app.use("/api/order", orderRoutes);
// app.use("/api/meals", menuRoutes);
// app.use("/api/place-order", placeOrderRoutes);
app.use("/api/chat", conversationRoutes);

// startCronJobs();

const startServer = async () => {
  try {
    await createChatTables(); // ideally this should ensure DB connection works
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to initialize DB or start server:', err);
    process.exit(1);
  }
};

startServer();