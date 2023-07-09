const express = require("express");

const {
  createClassLevel,
  getClassLevels,
  getSingleClassLevel,
  updateClassLevel,
  deleteClassLevel,
} = require("../../controller/academics/classLevelCtrl");
const isAuthenticated = require("../../middlewares/isAuthenticated");
const roleRestriction = require("../../middlewares/roleRestriction");
const Admin = require("../../model/Staff/Admin");

const classLevelRouter = express.Router();

// academicYearRouter.post("/", isLogin, isAdmin, createAcademicYear);
// academicYearRouter.get("/", isLogin, isAdmin, getAcademicYears);

classLevelRouter
  .route("/", isAuthenticated(Admin), roleRestriction("admin"))
  .post(createClassLevel)
  .get(getClassLevels);

classLevelRouter
  .route("/:id", isAuthenticated(Admin), roleRestriction("admin"))
  .get(getSingleClassLevel)
  .put(updateClassLevel)
  .delete(deleteClassLevel);

// academicYearRouter.get("/:id", isLogin, isAdmin, getSingleAcademicYear);
// academicYearRouter.put("/:id", isLogin, isAdmin, updateAcademicYear);
// academicYearRouter.delete("/:id", isLogin, isAdmin, deleteAcademicYear);

module.exports = classLevelRouter;
