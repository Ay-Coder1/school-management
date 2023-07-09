const express = require("express");

const {
  createSubject,
  getSubjects,
  getSingleSubject,
  updateSubject,
  deleteSubject,
} = require("../../controller/academics/subjectCtrl");
const Admin = require("../../model/Staff/Admin");
const isAuthenticated = require("../../middlewares/isAuthenticated");
const roleRestriction = require("../../middlewares/roleRestriction");

const subjectRouter = express.Router();

subjectRouter.post(
  "/:programID",
  isAuthenticated(Admin),
  roleRestriction("admin"),
  createSubject
);
subjectRouter.get(
  "/",
  isAuthenticated(Admin),
  roleRestriction("admin"),
  getSubjects
);
subjectRouter.get(
  "/:id",
  isAuthenticated(Admin),
  roleRestriction("admin"),
  getSingleSubject
);
subjectRouter.put(
  "/:id",
  isAuthenticated(Admin),
  roleRestriction("admin"),
  updateSubject
);
subjectRouter.delete(
  "/:id",
  isAuthenticated(Admin),
  roleRestriction("admin"),
  deleteSubject
);

module.exports = subjectRouter;
