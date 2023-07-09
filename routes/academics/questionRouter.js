const express = require("express");
const isAuthenticated = require("../../middlewares/isAuthenticated");
const roleRestriction = require("../../middlewares/roleRestriction");
const Teacher = require("../../model/Staff/Teacher");
const {
  createQuestion,
  getQuestions,
  getQuestion,
  updateQuestion,
} = require("../../controller/academics/questionsCtrl");

const questionRouter = express.Router();

questionRouter.post(
  "/:examID",
  isAuthenticated(Teacher),
  roleRestriction("teacher"),
  createQuestion
);
questionRouter.get(
  "/",
  isAuthenticated(Teacher),
  roleRestriction("teacher"),
  getQuestions
);
questionRouter.get(
  "/:id",
  isAuthenticated(Teacher),
  roleRestriction("teacher"),
  getQuestion
);
questionRouter.put(
  "/:id",
  isAuthenticated(Teacher),
  roleRestriction("teacher"),
  updateQuestion
);

module.exports = questionRouter;
