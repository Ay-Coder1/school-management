const express = require("express");

const Admin = require("../../model/Staff/Admin");
const isAuthenticated = require("../../middlewares/isAuthenticated");
const roleRestriction = require("../../middlewares/roleRestriction");
const {
  getYearGroups,
  createYearGroup,
  deleteYearGroup,
  updateYearGroup,
  getSingleYearGroup,
} = require("../../controller/academics/yearGroupCtrl");

const yearGroupRouter = express.Router();

yearGroupRouter.route("/").post(createYearGroup).get(getYearGroups);
yearGroupRouter
  .route("/:id", isAuthenticated(Admin), roleRestriction("admin"))
  .get(getSingleYearGroup)
  .put(updateYearGroup)
  .delete(deleteYearGroup);

module.exports = yearGroupRouter;
