const express = require("express");
const {
  adminRegisterTeacher,
  loginTeacher,
  getAllTeachersAdmin,
  getTeacherByAdmin,
  getTeacherProfile,
  teacherUpdateProfile,
  adminUpdateTeacher,
} = require("../../controller/staff/teacherCtrl");
const advancedResults = require("../../middlewares/advancedResult");
const Teacher = require("../../model/Staff/Teacher");
const roleRestriction = require("../../middlewares/roleRestriction");
const isAuthenticated = require("../../middlewares/isAuthenticated");
const Admin = require("../../model/Staff/Admin");

const teacherRouter = express.Router();

teacherRouter.post(
  "/admin/register",
  isAuthenticated(Admin),
  roleRestriction("admin"),
  adminRegisterTeacher
);
teacherRouter.post("/login", loginTeacher);
teacherRouter.get(
  "/admin",
  isAuthenticated(Admin),
  roleRestriction("admin"),
  advancedResults(Teacher, {
    path: "examsCreated",
    populate: {
      path: "questions",
    },
  }),
  getAllTeachersAdmin
);
teacherRouter.get(
  "/profile",
  isAuthenticated(Teacher),
  roleRestriction("teacher"),
  getTeacherProfile
);
teacherRouter.put(
  "/teacher-update-profile",
  isAuthenticated(Teacher),
  roleRestriction("teacher"),
  teacherUpdateProfile
);
teacherRouter.get(
  "/:teacherID/admin",
  isAuthenticated(Admin),
  roleRestriction("admin"),
  getTeacherByAdmin
);
teacherRouter.put(
  "/:teacherID/update/admin",
  isAuthenticated(Admin),
  roleRestriction("admin"),
  adminUpdateTeacher
);

module.exports = teacherRouter;
