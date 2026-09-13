const express = require("express");
console.log("🚀 THIS IS THE NEW POSTGRES VERSION!");
const cors = require("cors");
require("dotenv").config();
const Logger = require("./middleware/logger");
const morgan = require("morgan");
const TestDeBug = require("debug")("testDeBugger");
const app = express();
app.use(cors());
const CoursesRoutes = require("./routes/course-route");
const HomeRoute=require("./routes/HomePage-route");
const UserRoute=require("./routes/AuthRoutes");
const TestRoute = require("./routes/test-route");
const UserCourseRoutes = require("./routes/userCourseroute");


app.use(express.json());
app.use(Logger.Log2);
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
if (app.get("env") === "development") app.use(morgan("tiny"));
console.log(app.get("env"));

app.use("/",HomeRoute)
app.use("/api/courses", CoursesRoutes);
app.use("/api/users", UserRoute);
app.use("/api/users/courses", UserCourseRoutes);
app.use("/api/test", TestRoute);


const port = process.env.PORT || process.env.APP_PORT || 3000;

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

TestDeBug("Hellooooo Debuger");
