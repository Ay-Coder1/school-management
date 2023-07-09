const express = require("express");

const {
  createAcademicTerm,
  getAcademicTerms,
  getSingleAcademicTerm,
  updateAcademicTerm,
  deleteAcademicTerm,
} = require("../../controller/academics/academicTermCtrl");
const isAuthenticated = require("../../middlewares/isAuthenticated");
const roleRestriction = require("../../middlewares/roleRestriction");
const Admin = require("../../model/Staff/Admin");

const academicTermRouter = express.Router();

// academicYearRouter.post("/", isLogin, isAdmin, createAcademicYear);
// academicYearRouter.get("/", isLogin, isAdmin, getAcademicYears);

academicTermRouter
  .route("/", isAuthenticated(Admin), roleRestriction("admin"))
  .post(createAcademicTerm)
  .get(getAcademicTerms);

academicTermRouter
  .route("/:id", isAuthenticated(Admin), roleRestriction("admin"))
  .get(getSingleAcademicTerm)
  .put(updateAcademicTerm)
  .delete(deleteAcademicTerm);

// academicYearRouter.get("/:id", isLogin, isAdmin, getSingleAcademicYear);
// academicYearRouter.put("/:id", isLogin, isAdmin, updateAcademicYear);
// academicYearRouter.delete("/:id", isLogin, isAdmin, deleteAcademicYear);

module.exports = academicTermRouter;
