const AsyncHandler = require("express-async-handler");
const Admin = require("../../model/Staff/Admin");
const Program = require("../../model/Academic/Program");

//@desc Create Program
//@route POST /api/v1/programs
//@access Private
exports.createProgram = AsyncHandler(async (req, res) => {
  const { name, description } = req.body;
  //check if exists
  const program = await Program.findOne({ name });
  if (program) {
    throw new Error("Program already exists");
  }
  //create
  const programCreated = await Program.create({
    name,
    description,
    createdBy: req.userAuth._id,
  });
  //push class into admin
  const admin = await Admin.findById(req.userAuth._id);
  admin.programs.push(programCreated._id);
  //save
  await admin.save();
  res.status(201).json({
    status: "success",
    message: "Program created successfully",
    data: programCreated,
  });
});

//@desc Get All Programs
//@route GET /api/v1/programs
//@access Private
exports.getPrograms = AsyncHandler(async (req, res) => {
  const programs = await Program.find();

  res.status(201).json({
    status: "success",
    message: "Programs fetched successfully",
    data: programs,
  });
});

//@desc Get Single Program
//@route GET /api/v1/programs/:id
//@access Private
exports.getSingleProgram = AsyncHandler(async (req, res) => {
  const program = await Program.findById(req.params.id);

  res.status(201).json({
    status: "success",
    message: "Program fetched successfully",
    data: program,
  });
});

//@desc Update Program
//@route PUT /api/v1/programs/:id
//@access Private
exports.updateProgram = AsyncHandler(async (req, res) => {
  const { name, description } = req.body;
  //check
  const programFound = await Program.findOne({ name });
  if (programFound) {
    throw new Error("Program already exists");
  }
  const program = await Program.findByIdAndUpdate(
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
    message: "Program updated successfully",
    data: program,
  });
});

//@desc Delete Program
//@route DELETE /api/v1/programs/:id
//@access Private
exports.deleteProgram = AsyncHandler(async (req, res) => {
  await Program.findByIdAndDelete(req.params.id);

  res.status(201).json({
    status: "success",
    message: "Program deleted successfully",
  });
});
