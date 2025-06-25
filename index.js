const express = require("express");
const path = require("path");
const { checkForAutentication } = require("./middlewares/auth");
const cookieParser = require("cookie-parser");
const app = express();
const authRoute = require("./routes/authRoute");
const jobsRoute = require("./routes/jobsRoutes");
const adminRoute = require("./routes/adminRoute");
require("dotenv").config();
const PORT = process.env.PORT || 8000;
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).render("error", {
    message: err.message,
    error: process.env.NODE_ENV === "development" ? err : {},
  });
});
app.use(express.json());
app.use(cookieParser());
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use("/", authRoute);
app.use("/", jobsRoute);
app.use("/", adminRoute);
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
