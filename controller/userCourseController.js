const UserCourseModel = require("../models/userCourseModel");
const CourseModel = require("../models/course-models");

// گرفتن همه دوره‌های کاربر
const GetUserCourses = async (req, res) => {
  try {
    const userId = req.userData.id;  // از middleware احراز هویت
    const courses = await UserCourseModel.GetUserCourses(userId);

    res.send({
      count: courses.length,
      courses: courses,
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// افزودن دوره به لیست کاربر
const EnrollCourse = async (req, res) => {
  try {
    const userId = req.userData.id;
    const courseId = Number(req.params.courseId);

    // بررسی وجود دوره
    const course = await CourseModel.GetCourse(courseId);
    if (!course) {
      return res.status(404).send({ error: "Course not found" });
    }

    await UserCourseModel.EnrollCourse(userId, courseId);

    res.status(201).send({
      message: "Course added to your list successfully",
      courseId: courseId,
    });
  } catch (error) {
    if (error.message.includes("already enrolled")) {
      return res.status(400).send({ error: error.message });
    }
    res.status(500).send({ error: error.message });
  }
};

// حذف دوره از لیست کاربر
const UnenrollCourse = async (req, res) => {
  try {
    const userId = req.userData.id;
    const courseId = Number(req.params.courseId);

    await UserCourseModel.UnenrollCourse(userId, courseId);

    res.send({
      message: "Course removed from your list successfully",
      courseId: courseId,
    });
  } catch (error) {
    if (error.message.includes("not found")) {
      return res.status(404).send({ error: error.message });
    }
    res.status(500).send({ error: error.message });
  }
};

// به‌روزرسانی پیشرفت دوره
const UpdateProgress = async (req, res) => {
  try {
    const userId = req.userData.id;
    const courseId = Number(req.params.courseId);
    const { progress } = req.body;

    // اعتبارسنجی progress
    if (typeof progress !== "number" || progress < 0 || progress > 100) {
      return res.status(400).send({
        error: "Progress must be a number between 0 and 100",
      });
    }

    await UserCourseModel.UpdateProgress(userId, courseId, progress);

    res.send({
      message: "Progress updated successfully",
      courseId: courseId,
      progress: progress,
    });
  } catch (error) {
    if (error.message.includes("not found")) {
      return res.status(404).send({ error: error.message });
    }
    res.status(500).send({ error: error.message });
  }
};

module.exports = {
  GetUserCourses,
  EnrollCourse,
  UnenrollCourse,
  UpdateProgress,
};