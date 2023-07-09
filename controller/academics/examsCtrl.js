const AsyncHandler = require("express-async-handler");
const Exam = require("../../model/Academic/Exam");
const Teacher = require("../../model/Staff/Teacher");

//@desc Create Exams
//@route POST /api/v1/exams
//@access Private Teacher only

exports.createExam = AsyncHandler(async (req, res) => {
  const {
    name,
    description,
    subject,
    program,
    academicTerm,
    duration,
    examDate,
    examTime,
    examType,
    classLevel,
    academicYear,
  } = req.body;

  //find teacher
  const teacherFound = await Teacher.findById(req.userAuth?._id);
  if (!teacherFound) {
    throw new Error("Teacher not found");
  }
  //exam exists
  const examExists = await Exam.findOne({ name });
  if (examExists) {
    throw new Error("Exam already exists");
  }
  //creat
  const examCreated = new Exam({
    name,
    description,
    subject,
    program,
    academicTerm,
    duration,
    examDate,
    examTime,
    examType,
    classLevel,
    createdBy: req.userAuth?._id,
    academicYear,
  });
  //pust the exam into teacher
  teacherFound.examsCreated.push(examCreated._id);
  //save exam
  await examCreated.save();
  //save teacher
  await teacherFound.save();
  res.status(201).json({
    status: "success",
    message: "Exam created",
    data: examCreated,
  });
});

//@desc Get All Exams
//@route GET /api/v1/exams
//@access Private
exports.getExams = AsyncHandler(async (req, res) => {
  const exams = await Exam.find().populate({
    path: "questions",
    populate: {
      path: "createdBy",
    },
  });

  res.status(201).json({
    status: "success",
    message: "Exams fetched successfully",
    data: exams,
  });
});

//@desc Get Single Exam
//@route GET /api/v1/exams/:id
//@access Private
exports.getExam = AsyncHandler(async (req, res) => {
  const exam = await Exam.findById(req.params.id);

  res.status(201).json({
    status: "success",
    message: "Exam fetched successfully",
    data: exam,
  });
});

//@desc Update Exam
//@route PUT /api/v1/exams/:id
//@access Private
exports.updateExam = AsyncHandler(async (req, res) => {
  const {
    name,
    description,
    subject,
    program,
    academicTerm,
    duration,
    examDate,
    examTime,
    examType,
    createdBy,
    classLevel,
    academicYear,
  } = req.body;
  //check
  const examFound = await Exam.findOne({ name });
  if (examFound) {
    throw new Error(`${name} already exists`);
  }
  const examUpdated = await Exam.findByIdAndUpdate(
    req.params.id,
    {
      name,
      description,
      subject,
      program,
      academicTerm,
      duration,
      examDate,
      examTime,
      examType,
      createdBy,
      classLevel,
      academicYear,
    },
    {
      new: true,
    }
  );

  res.status(201).json({
    status: "success",
    message: "Exam updated successfully",
    data: examUpdated,
  });
});
