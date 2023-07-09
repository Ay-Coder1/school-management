const express = require("express");
const {
  createAcademicYear,
  getAcademicYears,
  getSingleAcademicYear,
  updateAcademicYear,
  deleteAcademicYear,
} = require("../../controller/academics/academicYearCtrl");
const isAuthenticated = require("../../middlewares/isAuthenticated");
const roleRestriction = require("../../middlewares/roleRestriction");
const Admin = require("../../model/Staff/Admin");

const academicYearRouter = express.Router();

// academicYearRouter.post("/", isLogin, isAdmin, createAcademicYear);
// academicYearRouter.get("/", isLogin, isAdmin, getAcademicYears);

academicYearRouter
  .route("/", isAuthenticated(Admin), roleRestriction("admin"))
  .post(createAcademicYear)
  .get(getAcademicYears);

academicYearRouter
  .route("/:id", isAuthenticated(Admin), roleRestriction("admin"))
  .get(getSingleAcademicYear)
  .put(updateAcademicYear)
  .delete(deleteAcademicYear);

// academicYearRouter.get("/:id", isLogin, isAdmin, getSingleAcademicYear);
// academicYearRouter.put("/:id", isLogin, isAdmin, updateAcademicYear);
// academicYearRouter.delete("/:id", isLogin, isAdmin, deleteAcademicYear);

module.exports = academicYearRouter;
