const Teacher = require("../model/Staff/Teacher");

const isTeacher = async (req, res, next) => {
  //find the user
  const userId = req?.userAuth?._id;
  const teacherFound = await Teacher.findById(userId);
  //check if Teacher
  if (teacherFound?.role === "teacher") {
    next();
  } else {
    next(new Error("Access Denied, Teacher only"));
  }
};

module.exports = isTeacher;
