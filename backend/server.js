const dotenv = require("dotenv");
// config
if (process.env.NODE_ENV !== "PRODUCTION")
  dotenv.config({ path: "backend/config/config.env" });
const app = require("./app");
const cloudinary = require("cloudinary");
const connectDatabase = require("./config/dbConfig");

// Uncaught error
process.on("uncaughtException", (err) => {
  console.log(`Error : ${err.message}`);
  console.log("Shutting down server due to uncaught exception");
  server.close(() => {
    process.exit(1);
  });
});

// Connecting to Database
connectDatabase();

// Configuring Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// console.log("Cloudinary connected");

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`Server is listening to http://localhost:${PORT}`);
});

// Unhandled promise rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error : ${err.message}`);
  console.log("Shutting down server due to unhandled promise rejection");
  server.close(() => {
    process.exit(1);
  });
});
