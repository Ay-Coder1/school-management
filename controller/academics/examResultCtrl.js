const AsyncHandler = require("express-async-handler");
const ExamResult = require("../../model/Academic/ExamResuts");
const Student = require("../../model/Academic/Student");

//@desc Create Exam Results Checking
//@route POST /api/v1/exam-results/:id/checking
//@access Private - Student only

exports.checkExamResults = AsyncHandler(async (req, res) => {
  //find the student
  const studentFound = await Student.findById(req.userAuth?._id);
  if (!studentFound) {
    throw new Error("No Student Found");
  }
  //find the exam results
  const examResult = await ExamResult.findOne({
    studentID: studentFound?.studentId,
    _id: req.params.id,
  })
    .populate({
      path: "exam",
      populate: {
        path: "questions",
      },
    })
    .populate("classLevel")
    .populate("academicTerm")
    .populate("academicYear");
  //check if exam is published
  if (examResult?.isPublished === false) {
    throw new Error("Exam result is not available, check out later");
  }
  res.json({
    status: "success",
    message: "Exam result",
    data: examResult,
    student: studentFound,
  });
});

//@desc Get all exam results (name, id)
//@route POST /api/v1/exam-results/:id/checking
//@access Private - Student only

exports.getAllExamResults = AsyncHandler(async (req, res) => {
  const results = await ExamResult.find().select("exam").populate("exam");
  res.status(200).json({
    status: "success",
    message: "Exam Results Fetched",
    data: results,
  });
});

//@desc Admin publish exam results
//@route PUT /api/v1/exam-results/:id/admin-publish
//@access Private - Admin only

exports.adminToggleExamResult = AsyncHandler(async (req, res) => {
  //find the exam results
  const examResult = await ExamResult.findById(req.params.id);
  if (!examResult) {
    throw new Error("Exam result not found");
  }
  const publishResult = await ExamResult.findByIdAndUpdate(
    req.params.id,
    {
      isPublished: req.body.publish,
    },
    {
      new: true,
    }
  );
  res.status(200).json({
    status: "success",
    message: "Exam Results Updated",
    data: publishResult,
  });
});
