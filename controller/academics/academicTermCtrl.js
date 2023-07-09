const AsyncHandler = require("express-async-handler");
const AcademicTerm = require("../../model/Academic/AcademicTerm");

const Admin = require("../../model/Staff/Admin");

//@desc Create Academic Term
//@route POST /api/v1/academic-terms
//@access Private
exports.createAcademicTerm = AsyncHandler(async (req, res) => {
  const { name, description, duration } = req.body;
  //check if exists
  const academicTerm = await AcademicTerm.findOne({ name });
  if (academicTerm) {
    throw new Error("Academic term already exists");
  }
  //create
  const academicTermCreated = await AcademicTerm.create({
    name,
    description,
    duration,
    createdBy: req.userAuth._id,
  });
  //push academic into admin
  const admin = await Admin.findById(req.userAuth._id);
  admin.academicTerm.push(academicTermCreated._id);
  await admin.save();
  res.status(201).json({
    status: "success",
    message: "Academic term created successfully",
    data: academicTermCreated,
  });
});

//@desc Get All Academic Terms
//@route GET /api/v1/academic-terms
//@access Private
exports.getAcademicTerms = AsyncHandler(async (req, res) => {
  const academicTerms = await AcademicTerm.find();

  res.status(201).json({
    status: "success",
    message: "Academic terms fetched successfully",
    data: academicTerms,
  });
});

//@desc Get Single Academic Term
//@route GET /api/v1/academic-terms/:id
//@access Private
exports.getSingleAcademicTerm = AsyncHandler(async (req, res) => {
  const academicTerm = await AcademicTerm.findById(req.params.id);

  res.status(201).json({
    status: "success",
    message: "Academic term fetched successfully",
    data: academicTerm,
  });
});

//@desc Update Academic Term
//@route PUT /api/v1/academic-terms/:id
//@access Private
exports.updateAcademicTerm = AsyncHandler(async (req, res) => {
  const { name, description, duration } = req.body;
  //check
  const academicTermFound = await AcademicTerm.findOne({ name });
  if (academicTermFound) {
    throw new Error("Academic term already exists");
  }
  const academicTerm = await AcademicTerm.findByIdAndUpdate(
    req.params.id,
    {
      name,
      description,
      duration,
      createdBy: req.userAuth._id,
    },
    {
      new: true,
    }
  );

  res.status(201).json({
    status: "success",
    message: "Academic term updated successfully",
    data: academicTerm,
  });
});

//@desc Delete Academic Term
//@route DELETE /api/v1/academic-terms/:id
//@access Private
exports.deleteAcademicTerm = AsyncHandler(async (req, res) => {
  await AcademicTerm.findByIdAndDelete(req.params.id);

  res.status(201).json({
    status: "success",
    message: "Academic term deleted successfully",
  });
});
