const AsyncHandler = require("express-async-handler");
const Admin = require("../../model/Staff/Admin");
const generateToken = require("../../utils/generateToken");
const verifyToken = require("../../utils/verifyToken");
const bcrypt = require("bcryptjs");
const { hashPassword, isPassMatched } = require("../../utils/helpers");

//@desc Register admin
//@route POST /api/admins/register
//@access Private
const admiinRegisterCtrl = AsyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  //Check if email exists
  const adminFound = await Admin.findOne({ email });
  if (adminFound) {
    throw Error("Admin Exists");
  }

  const user = await Admin.create({
    name,
    email,
    password: await hashPassword(password),
  });
  res.status(201).json({
    status: "success",
    data: user,
    message: "Admin registered successfully.",
  });
});

//@desc Login admin
//@route POST /api/admins/login
//@access Private
const adminLoginCtrl = AsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //find user
  const user = await Admin.findOne({ email });
  if (!user) {
    return res.json({ message: "Invalid login credentials" });
  }
  //verify password
  const isMatched = await isPassMatched(password, user.password);
  if (!isMatched) {
    return res.json({ message: "Invalid login credentials" });
  } else {
    return res.json({
      data: generateToken(user._id),
      message: "Admin logged in successfully.",
    });
  }
});

//@desc Get All admin
//@route POST /api/admins
//@access Private
const adminAllCtrl = AsyncHandler(async (req, res) => {
  const admins = await Admin.find();
  res.status(200).json(res.results);
});

//@desc Get sigle admin
//@route POST /api/admins/:id
//@access Private
const getAdminProfileCtrl = AsyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.userAuth._id)
    .select("-password -createdAt -updatedAt")
    .populate("academicYear")
    .populate("academicTerm")
    .populate("programs")
    .populate("yearGroups")
    .populate("classLevels")
    .populate("teachers")
    .populate("students");
  if (!admin) {
    throw new Error("Admin Not Found");
  } else {
    res.status(200).json({
      status: "success",
      data: admin,
      message: "Admin Profile fetched successfully.",
    });
  }
});

//@desc update admin
//@route POST /api/admins/:id
//@access Private
const adminUpdateCtrl = AsyncHandler(async (req, res) => {
  const { email, name, password } = req.body;
  //if email is taken
  const emailExist = await Admin.findOne({ email });
  if (emailExist) {
    throw new Error("This email is taken/exist");
  }

  //hash password

  //check if user is updating password
  if (password) {
    //update
    const admin = await Admin.findByIdAndUpdate(
      req.userAuth._id,
      {
        email,
        password: await hashPassword(password),
        name,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      status: "success",
      data: admin,
      message: "Admin updated successfully",
    });
  } else {
    //update
    const admin = await Admin.findByIdAndUpdate(
      req.userAuth._id,
      {
        email,
        name,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      status: "success",
      data: admin,
      message: "Admin updated successfully",
    });
  }
});

//@desc Delete admin
//@route DELETE /api/admins/:id
//@access Private
const adminDeleteCtrl = async (req, res) => {
  await Admin.findByIdAndDelete(req.params.id);

  res.status(201).json({
    status: "success",
    message: "Admin deleted successfully",
  });
};

//@desc admin suspend teacher
//@route POST /api/admins/suspend/teacher/:id
//@access Private
const adminSuspendTeacherCtrl = (req, res) => {
  try {
    res.status(201).json({
      status: "success",
      data: "admin suspend teacher",
    });
  } catch (error) {
    res.json({
      status: "failed",
      error: error.message,
    });
  }
};

//@desc admin unsuspend teacher
//@route POST /api/admins/unsuspend/teacher/:id
//@access Private
const adminUnsuspendTeacherCtrl = (req, res) => {
  try {
    res.status(201).json({
      status: "success",
      data: "admin unsuspend teacher",
    });
  } catch (error) {
    res.json({
      status: "failed",
      error: error.message,
    });
  }
};

//@desc admin withdraw teacher
//@route POST /api/admins/withdraw/teacher/:id
//@access Private
const adminWithdrawTeacherCtrl = (req, res) => {
  try {
    res.status(201).json({
      status: "success",
      data: "admin withdraw teacher",
    });
  } catch (error) {
    res.json({
      status: "failed",
      error: error.message,
    });
  }
};

//@desc admin unwithdraw teacher
//@route POST /api/admins/unwithdraw/teacher/:id
//@access Private
const adminUnwithdrawTeacherCtrl = (req, res) => {
  try {
    res.status(201).json({
      status: "success",
      data: "admin unwithdraw teacher",
    });
  } catch (error) {
    res.json({
      status: "failed",
      error: error.message,
    });
  }
};

//@desc publish exam
//@route POST /api/admins/publish/exam/:id
//@access Private
const adminPublishExamCtrl = (req, res) => {
  try {
    res.status(201).json({
      status: "success",
      data: "admin publish exam",
    });
  } catch (error) {
    res.json({
      status: "failed",
      error: error.message,
    });
  }
};

//@desc publish exam
//@route POST /api/admins/publish/exam/:id
//@access Private
const adminUnpublishExamCtrl = (req, res) => {
  try {
    res.status(201).json({
      status: "success",
      data: "admin unpublish exam",
    });
  } catch (error) {
    res.json({
      status: "failed",
      error: error.message,
    });
  }
};

module.exports = {
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
};
