const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
var multer = require("multer");
var upload = multer();
const path = require("path");
const errorMiddleware = require("./middleware/error");

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};

// Gloabal middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(upload.array());

// Route Imports
const rootRoute = require("./routes/rootRoute");
app.use("/api/v1", rootRoute);

app.use(express.static(path.join(__dirname, "../frontend/build")));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
});

// Middleware for error
app.use(errorMiddleware);

module.exports = app;
