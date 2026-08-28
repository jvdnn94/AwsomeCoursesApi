const express = require("express");
const router = express.Router();
const userCourseController = require("../controller/userCourseController");
const Auth = require("../middleware/auth");

// همه مسیرها نیاز به احراز هویت دارند
router.use(Auth);


router.get("/", userCourseController.GetUserCourses);

router.post("/:courseId", userCourseController.EnrollCourse);

router.delete("/:courseId", userCourseController.UnenrollCourse);

// به‌روزرسانی پیشرفت
router.put("/:courseId/progress", userCourseController.UpdateProgress);

module.exports = router;