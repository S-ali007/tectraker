const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();

// middleware

app.use(cors({ origin: "*" }));

app.use(express.json({ limit: "16kb" }));
app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
  })
);
app.use(express.static("public"));
app.use(cookieParser());

// routes
const userRouter = require("./routes/user.routes.js");
const projectsRoute = require("./routes/projects.routes.js");

// route declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/project", projectsRoute);

module.exports = {
  app,
};
