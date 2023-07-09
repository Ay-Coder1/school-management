const express = require("express");

const isAuthenticated = require("../../middlewares/isAuthenticated");
const roleRestriction = require("../../middlewares/roleRestriction");
const Admin = require("../../model/Staff/Admin");
const {
  createProgram,
  getPrograms,
  getSingleProgram,
  updateProgram,
  deleteProgram,
} = require("../../controller/academics/programsCtrl");

const programRouter = express.Router();

programRouter
  .route("/", isAuthenticated(Admin), roleRestriction("admin"))
  .post(createProgram)
  .get(getPrograms);

programRouter
  .route("/:id", isAuthenticated(Admin), roleRestriction("admin"))
  .get(getSingleProgram)
  .put(updateProgram)
  .delete(deleteProgram);

module.exports = programRouter;
