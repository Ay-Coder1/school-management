const express = require("express");
const {
  admiinRegisterCtrl,
  adminLoginCtrl,
  adminAllCtrl,
  getAdminProfileCtrl,
  adminUpdateCtrl,
  adminDeleteCtrl,
  adminSuspendTeacherCtrl,
  adminUnsuspendTeacherCtrl,
  adminWithdrawTeacherCtrl,
  adminUnwithdrawTeacherCtrl,
  adminPublishExamCtrl,
  adminUnpublishExamCtrl,
} = require("../../controller/staff/adminCtrl");
const advancedResults = require("../../middlewares/advancedResult");
const Admin = require("../../model/Staff/Admin");
const isAuthenticated = require("../../middlewares/isAuthenticated");
const roleRestriction = require("../../middlewares/roleRestriction");

const adminRouter = express.Router();

//register
adminRouter.post("/register", admiinRegisterCtrl);

//Login
adminRouter.post("/login", adminLoginCtrl);

//Get all
adminRouter.get(
  "/",
  isAuthenticated(Admin),
  roleRestriction("admin"),
  advancedResults(Admin),
  adminAllCtrl
);

//single
adminRouter.get(
  "/profile",
  isAuthenticated(Admin),
  roleRestriction("admin"),
  getAdminProfileCtrl
);

//update
adminRouter.put(
  "/update",
  isAuthenticated(Admin),
  roleRestriction("admin"),
  adminUpdateCtrl
);

//delete
adminRouter.delete(
  "/:id",
  isAuthenticated(Admin),
  roleRestriction("admin"),
  adminDeleteCtrl
);

//suspend teacher
adminRouter.put(
  "/suspend/teacher/:id",
  isAuthenticated(Admin),
  roleRestriction("admin"),
  adminSuspendTeacherCtrl
);

//unsuspend teacher
adminRouter.put(
  "/unsuspend/teacher/:id",
  isAuthenticated(Admin),
  roleRestriction("admin"),
  adminUnsuspendTeacherCtrl
);

//withdraw teacher
adminRouter.put(
  "/withdraw/teacher/:id",
  isAuthenticated(Admin),
  roleRestriction("admin"),
  adminWithdrawTeacherCtrl
);

//unwithdraw teacher
adminRouter.put(
  "/unwithdraw/teacher/:id",
  isAuthenticated(Admin),
  roleRestriction("admin"),
  adminUnwithdrawTeacherCtrl
);

//publish exam results teacher
adminRouter.put(
  "/publish/exam/:id",
  isAuthenticated(Admin),
  roleRestriction("admin"),
  adminPublishExamCtrl
);

//unpublish exam result teacher
adminRouter.put(
  "/unpublish/exam/:id",
  isAuthenticated(Admin),
  roleRestriction("admin"),
  adminUnpublishExamCtrl
);

module.exports = adminRouter;
