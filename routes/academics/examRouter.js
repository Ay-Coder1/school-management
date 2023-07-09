const express = require("express");
const isAuthenticated = require("../../middlewares/isAuthenticated");
const roleRestriction = require("../../middlewares/roleRestriction");

const {
  createExam,
  getExams,
  getExam,
  updateExam,
} = require("../../controller/academics/examsCtrl");
const Teacher = require("../../model/Staff/Teacher");

const examRouter = express.Router();

examRouter.post(
  "/",
  isAuthenticated(Teacher),
  roleRestriction("teacher"),
  createExam
);
examRouter.get(
  "/",
  isAuthenticated(Teacher),
  roleRestriction("teacher"),
  getExams
);
examRouter.get(
  "/:id",
  isAuthenticated(Teacher),
  roleRestriction("teacher"),
  getExam
);
examRouter.put(
  "/:id",
  isAuthenticated(Teacher),
  roleRestriction("teacher"),
  updateExam
);

module.exports = examRouter;
