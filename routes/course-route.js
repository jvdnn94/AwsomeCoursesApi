const express = require("express");
const router = express.Router();
const CourseController = require("../controller/course-controller");
const Auth = require("../middleware/auth");
const OptionalAuth = require("../middleware/optionalAuth"); 
const IsAdmin = require("../middleware/isAdmin"); 

// مسیرهای عمومی با احراز هویت اختیاری
router.get("/", OptionalAuth, CourseController.GetCourses);  
router.get("/:courseID", OptionalAuth, CourseController.GetCourse);

// مسیرهای محافظت شده (نیاز به توکن)
router.use(Auth)
router.use(IsAdmin)
router.post("/", CourseController.PostCourse);     
router.put("/:courseID", CourseController.PutCourse);  
router.delete("/:courseID", CourseController.DeleteCourse);

module.exports = router;