const AsyncHandler = require("express-async-handler");
const Admin = require("../../model/Staff/Admin");
const ClassLevel = require("../../model/Academic/ClassLevel");

//@desc Create Class Level
//@route POST /api/v1/class-levels
//@access Private
exports.createClassLevel = AsyncHandler(async (req, res) => {
  const { name, description } = req.body;
  //check if exists
  const classLevel = await ClassLevel.findOne({ name });
  if (classLevel) {
    throw new Error("Class level already exists");
  }
  //create
  const classLevelCreated = await ClassLevel.create({
    name,
    description,
    createdBy: req.userAuth._id,
  });
  //push class into admin
  const admin = await Admin.findById(req.userAuth._id);
  admin.classLevels.push(classLevelCreated._id);
  //save
  await admin.save();
  res.status(201).json({
    status: "success",
    message: "Class level created successfully",
    data: classLevelCreated,
  });
});

//@desc Get All Class Levels
//@route GET /api/v1/class-levels
//@access Private
exports.getClassLevels = AsyncHandler(async (req, res) => {
  const classLevels = await ClassLevel.find();

  res.status(201).json({
    status: "success",
    message: "Class levels fetched successfully",
    data: classLevels,
  });
});

//@desc Get Single Class Level
//@route GET /api/v1/class-levels/:id
//@access Private
exports.getSingleClassLevel = AsyncHandler(async (req, res) => {
  const classLevel = await ClassLevel.findById(req.params.id);

  res.status(201).json({
    status: "success",
    message: "Class level fetched successfully",
    data: classLevel,
  });
});

//@desc Update Class Level
//@route PUT /api/v1/class-levels/:id
//@access Private
exports.updateClassLevel = AsyncHandler(async (req, res) => {
  const { name, description } = req.body;
  //check
  const classLevelFound = await ClassLevel.findOne({ name });
  if (classLevelFound) {
    throw new Error("Class level already exists");
  }
  const classLevel = await ClassLevel.findByIdAndUpdate(
    req.params.id,
    {
      name,
      description,
      createdBy: req.userAuth._id,
    },
    {
      new: true,
    }
  );

  res.status(201).json({
    status: "success",
    message: "Class level updated successfully",
    data: classLevel,
  });
});

//@desc Delete Class Level
//@route DELETE /api/v1/class-levels/:id
//@access Private
exports.deleteClassLevel = AsyncHandler(async (req, res) => {
  await ClassLevel.findByIdAndDelete(req.params.id);

  res.status(201).json({
    status: "success",
    message: "Class level deleted successfully",
  });
});
