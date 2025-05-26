const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const startCronJobs = require("./cornJobs");
const { createConversationTables } = require("./models/ConversationModal");
// const cookieParser = require('cookie-parser');

const authRoutes = require("./routes/auth/auth-routes");
// const orderRoutes = require("./routes/employee/order-routes");
const defaultOrderRoutes = require("./routes/employee/default-order-routes");
const menuRoutes = require("./routes/admin/menu-routes");
const placeOrderRoutes = require("./routes/employee/place-order-routes");
const conversationRoutes = require("./routes/chat/chat-routes");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// db.query('SHOW TABLES', (err, results) => {
//   if (err) {
//     console.error('❌ Failed to fetch tables:', err);
//     return;
//   }

//   // Extract table names from the result
//   const tables = results.map(row => Object.values(row)[0]);
//   console.log('✅ Tables in database:', tables);
// });
createConversationTables();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("DB connected");
  })
  .catch((err) => {
    console.log("DB connection error", err);
  });

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
app.use(express.json());
// app.use(cookieParser());
app.use("/api/alive", async (req, res) => {
  res.json({ message: "Server is alive" });
});
app.use("/api/auth", authRoutes);
app.use("/api/default-order", defaultOrderRoutes);
// app.use("/api/order", orderRoutes);
app.use("/api/meals", menuRoutes);
app.use("/api/place-order", placeOrderRoutes);
app.use("/api/conversations", conversationRoutes);

// startCronJobs();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
