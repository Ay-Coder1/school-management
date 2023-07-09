const AsyncHandler = require("express-async-handler");
const Admin = require("../../model/Staff/Admin");
const Program = require("../../model/Academic/Program");
const Subject = require("../../model/Academic/Subject");

//@desc Create Subject
//@route POST /api/v1/subjects/:programID
//@access Private
exports.createSubject = AsyncHandler(async (req, res) => {
  const { name, description, academicTerm } = req.body;
  //find the program
  const programFound = await Program.findById(req.params.programID);
  if (!programFound) {
    throw new Error("Program not found");
  }

  //check if exists
  const subjectFound = await Subject.findOne({ name });
  if (subjectFound) {
    throw new Error("Subject already exists");
  }
  //create
  const subjectCreated = await Subject.create({
    name,
    description,
    academicTerm,
    createdBy: req.userAuth._id,
  });
  //push to the program
  programFound.subjects.push(subjectCreated._id);
  //save
  await programFound.save();
  res.status(201).json({
    status: "success",
    message: "Subject created successfully",
    data: subjectCreated,
  });
});

//@desc Get All Subjects
//@route GET /api/v1/sujects
//@access Private
exports.getSubjects = AsyncHandler(async (req, res) => {
  const subjects = await Subject.find();

  res.status(201).json({
    status: "success",
    message: "Subject fetched successfully",
    data: subjects,
  });
});

//@desc Get Single Subject
//@route GET /api/v1/subjects/:id
//@access Private
exports.getSingleSubject = AsyncHandler(async (req, res) => {
  const subject = await Subject.findById(req.params.id);

  res.status(201).json({
    status: "success",
    message: "Subject fetched successfully",
    data: subject,
  });
});

//@desc Update Subject
//@route PUT /api/v1/subjects/:id
//@access Private
exports.updateSubject = AsyncHandler(async (req, res) => {
  const { name, description, academicTerm } = req.body;
  //check
  const subjectFound = await Subject.findOne({ name });
  if (subjectFound) {
    throw new Error("Subject already exists");
  }
  const subject = await Subject.findByIdAndUpdate(
    req.params.id,
    {
      name,
      description,
      academicTerm,
      createdBy: req.userAuth._id,
    },
    {
      new: true,
    }
  );

  res.status(201).json({
    status: "success",
    message: "Subject updated successfully",
    data: subject,
  });
});

//@desc Delete Subject
//@route DELETE /api/v1/subjects/:id
//@access Private
exports.deleteSubject = AsyncHandler(async (req, res) => {
  await Subject.findByIdAndDelete(req.params.id);

  res.status(201).json({
    status: "success",
    message: "Subject deleted successfully",
  });
});
