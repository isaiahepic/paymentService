require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const indexRouter = require("./router/index");
const port = 3000;

// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

const allowedOrigins = ["http://localhost:3848"];
app.use(cors({ allowedHeaders: "*", origin: allowedOrigins }));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", indexRouter);

app.listen(port, () => {
  console.log(`Server connected on http://localhost:${port}`);
});

module.exports = app;
