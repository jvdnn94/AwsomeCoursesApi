const CourseModel = require("../models/course-models");

const GetCourses = (req, res) => {
  CourseModel.GetCourses().then((courses) => {
    res.send(courses);
  });
};

const GetCourse = (req, res) => {
  CourseModel.GetCourse(Number(req.params.courseID)).then((result) => {
    if (!result)
      return res.status(404).send("There is not found a Course by this ID");
    res.send(result);
  });
};

const PostCourse = (req, res) => {
  if (!req.body.Title || req.body.Title.length < 2)
    return res.status(400).send("Correct Name is required!");
  CourseModel.InsertCourse(req.body.Title).then((result) => {
    res.send(result);
  });
};

//در کد آپدیت تابع اجرای آپدیت درون تابع احراز  اعتبار سنجی 
//  قرار دارد(بر خلاف دوره آموزشی) تا در صورت عدم
//  اعتبار آپدیت انجام نشود و کد با خطا مواجه نگردد

const PutCourse = (req, res) => {
  CourseModel.GetCourse(Number(req.params.courseID)).then((result) => {
    if (!result)
      return res.status(404).send("Course with given Id not found!!");

    if (!req.body.Title || req.body.Title.length < 2)
      return res.status(400).send("Correct Name is required!");

    CourseModel.UpdateCourse(Number(req.params.courseID), req.body.Title).then(
      (result) => {
        res.send(result);
      },
    );
  });
};
//در این نسخه تابع حذف بیرون تابع اعتبار سنجی است .با توجه
//  به نامتقارن بودن تابع نود منتظر احراز نمیماند و حتی
//  در صورت عدم احراز بازم دیلیت را انجام میدهد که خطاا خواهد داد

// const DeleteCourse = (req, res) => {
//   CourseModel.GetCourse(Number(req.params.courseID)).then((result) => {
//     if (!result)
//       return res.status(404).send("Course with given Id not found!!");
//   });

//   CourseModel.DeleteCourse(Number(req.params.courseID)).then((result) => {
//     res.send(result);
//   });
// };

const DeleteCourse = (req, res) => {
  CourseModel.GetCourse(Number(req.params.courseID)).then((result) => {
    if (!result) {
      return res.status(404).send("Course with given Id not found!!");
    }

    // انجام حذف (داخل همان then قرار گرفت)
    CourseModel.DeleteCourse(Number(req.params.courseID)).then(
      (deleteResult) => {
        res.send(deleteResult);
      },
    );
  });
};

module.exports = {
  GetCourses,
  GetCourse,
  PostCourse,
  PutCourse,
  DeleteCourse,
};
