const express = require("express");
const {
  adminRegisterStudent,
  loginStudent,
  getStudentProfile,
  getAllStudentsByAdmin,
  getStudentByAdmin,
  studentUpdateProfile,
  adminUpdateStudent,
  writeExam,
} = require("../../controller/students/studentsCtrl");
const isAuthenticated = require("../../middlewares/isAuthenticated");
const Student = require("../../model/Academic/Student");
const Admin = require("../../model/Staff/Admin");
const roleRestriction = require("../../middlewares/roleRestriction");

const studentRouter = express.Router();

studentRouter.post(
  "/admin/register",
  isAuthenticated(Admin),
  roleRestriction("admin"),
  adminRegisterStudent
);
studentRouter.post("/login", loginStudent);
studentRouter.get(
  "/profile",
  isAuthenticated(Student),
  roleRestriction("student"),
  getStudentProfile
);
studentRouter.get(
  "/admin",
  isAuthenticated(Admin),
  roleRestriction("admin"),
  getAllStudentsByAdmin
);
studentRouter.get(
  "/:studentID/admin",
  isAuthenticated(Admin),
  roleRestriction("admin"),
  getStudentByAdmin
);
studentRouter.put(
  "/update-profile",
  isAuthenticated(Student),
  roleRestriction("student"),
  studentUpdateProfile
);
studentRouter.put(
  "/:studentID/update/admin",
  isAuthenticated(Admin),
  roleRestriction("admin"),
  adminUpdateStudent
);

studentRouter.post(
  "/exam/:examID/write",
  isAuthenticated(Student),
  roleRestriction("student"),
  writeExam
);

module.exports = studentRouter;
