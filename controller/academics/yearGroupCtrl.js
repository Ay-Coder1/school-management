const AsyncHandler = require("express-async-handler");
const Admin = require("../../model/Staff/Admin");
const Program = require("../../model/Academic/Program");
const Subject = require("../../model/Academic/Subject");
const YearGroup = require("../../model/Academic/YearGroup");

//@desc Create Year Group
//@route POST /api/v1/year-groups
//@access Private
exports.createYearGroup = AsyncHandler(async (req, res) => {
  const { name, academicYear } = req.body;

  //check if exists
  const yearGroupFound = await YearGroup.findById(req.params.programID);
  if (yearGroupFound) {
    throw new Error("Year Group/Graduation already exists");
  }

  //create
  const yearGroupCreated = await YearGroup.create({
    name,
    academicYear,
    createdBy: req.userAuth._id,
  });

  //find Admin
  const admin = await Admin.findById(req.userAuth._id);
  if (!admin) {
    throw new Error("Admin not found");
  }
  //push year group into the admin
  admin.yearGroups.push(yearGroupCreated._id);
  //save
  await admin.save();
  res.status(201).json({
    status: "success",
    message: "Year group created successfully",
    data: yearGroupCreated,
  });
});

//@desc Get All Year Groups
//@route GET /api/v1/year-groups
//@access Private
exports.getYearGroups = AsyncHandler(async (req, res) => {
  const yearGroups = await YearGroup.find();

  res.status(201).json({
    status: "success",
    message: "Year group fetched successfully",
    data: yearGroups,
  });
});

//@desc Get Single Year Group
//@route GET /api/v1/year-groups/:id
//@access Private
exports.getSingleYearGroup = AsyncHandler(async (req, res) => {
  const yearGroup = await YearGroup.findById(req.params.id);

  res.status(201).json({
    status: "success",
    message: "Year group fetched successfully",
    data: yearGroup,
  });
});

//@desc Update Year Group
//@route PUT /api/v1/year-groups/:id
//@access Private
exports.updateYearGroup = AsyncHandler(async (req, res) => {
  const { name, academicYear } = req.body;
  //check
  const yearGroupFound = await YearGroup.findOne({ name });
  if (yearGroupFound) {
    throw new Error("Year group already exists");
  }
  const yearGroup = await YearGroup.findByIdAndUpdate(
    req.params.id,
    {
      name,
      academicYear,
      createdBy: req.userAuth._id,
    },
    {
      new: true,
    }
  );

  res.status(201).json({
    status: "success",
    message: "Year group updated successfully",
    data: yearGroup,
  });
});

//@desc Delete Year Group
//@route DELETE /api/v1/year-groups/:id
//@access Private
exports.deleteYearGroup = AsyncHandler(async (req, res) => {
  await YearGroup.findByIdAndDelete(req.params.id);

  res.status(201).json({
    status: "success",
    message: "Year group deleted successfully",
  });
});
