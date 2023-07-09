const AsyncHandler = require("express-async-handler");
const Student = require("../../model/Academic/Student");
const { hashPassword, isPassMatched } = require("../../utils/helpers");
const generateToken = require("../../utils/generateToken");
const Exam = require("../../model/Academic/Exam");
const ExamResult = require("../../model/Academic/ExamResuts");
const Admin = require("../../model/Staff/Admin");

//@desc Admin Register Student
//@route POST /api/v1/students/admins/register
//@access Private Admin only

exports.adminRegisterStudent = AsyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  //find the admin
  const adminFound = await Admin.findById(req.userAuth._id);
  if (!adminFound) {
    throw new Error("Admin not found");
  }
  //check if teacher already exits
  const student = await Student.findOne({ email });
  if (student) {
    throw new Error(`${email} already exists `);
  }
  //hash password
  const hashedPassword = await hashPassword(password);
  //create
  const studentCreated = await Student.create({
    name,
    email,
    password: hashedPassword,
  });
  //push student into admin
  adminFound.students.push(studentCreated?._id);
  await adminFound.save();
  //send student data
  res.status(201).json({
    status: "success",
    message: "Student registered successfully",
    data: studentCreated,
  });
});

//@desc login student
//@route POST /api/v1/students/login
//@access Private

exports.loginStudent = AsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //find the user
  const student = await Student.findOne({ email });
  if (!student) {
    return res.json({ message: "Invalid login credentials" });
  }
  //verify the password
  const isMatched = await isPassMatched(password, student?.password);
  if (!isMatched) {
    return res.json({ message: "Invalid login credentials" });
  } else {
    res.status(200).json({
      status: "success",
      message: "Student logged in successfully",
      data: generateToken(student?._id),
    });
  }
});

//@desc Get Student Prpfile
//@route GET /api/v1/students/profile
//@access Private Student only

exports.getStudentProfile = AsyncHandler(async (req, res) => {
  const student = await Student.findById(req.userAuth?._id)
    .select("-password -createdAt -updatedAt")
    .populate("examResults");
  if (!student) {
    throw new Error("Student not found");
  }
  //get student profile
  const studentProfile = {
    name: student?.name,
    email: student?.email,
    currentClassLevel: student?.currentClassLevel,
    program: student?.program,
    dateAdmitted: student?.dateAdmitted,
    isSuspended: student?.isSuspended,
    iswitdrawn: student?.iswitdrawn,
    studentId: student?.studentId,
    prefectName: student?.prefectName,
  };
  //get student exam results
  const examResults = student?.examResults;
  //current exam
  const currentExamResult = examResults[examResults.length - 1];

  //check if exam is published
  const isPublished = currentExamResult?.isPublished;
  console.log(currentExamResult);
  res.status(200).json({
    status: "success",
    data: {
      studentProfile,
      currentExamResult: isPublished ? currentExamResult : [],
    },
    message: "Student fetched successfully",
  });
});

//@desc Get all Student
//@route GET /api/v1/students/admin
//@access Private Admin only

exports.getAllStudentsByAdmin = AsyncHandler(async (req, res) => {
  const students = await Student.find();
  res.status(200).json({
    status: "success",
    message: "Student fetched successfully",
    data: students,
  });
});

//@desc Get Single Student
//@route GET /api/v1/students/:studentID/admin
//@access Private Admin only

exports.getStudentByAdmin = AsyncHandler(async (req, res) => {
  const studentID = req.params.studentID;
  //find the student
  const student = await Student.findById(studentID);
  if (!student) {
    throw new Error("Student not found");
  }
  res.status(200).json({
    status: "success",
    message: "Student fetched successfully",
    data: student,
  });
});

//@desc Student updating profile
//@route PUT /api/students/update-profile
//@access Private Student only

exports.studentUpdateProfile = AsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //if email is taken
  const emailExist = await Student.findOne({ email });
  if (emailExist) {
    throw new Error("This email is taken/exist");
  }

  //hash password

  //check if user is updating password
  if (password) {
    //update
    const student = await Student.findByIdAndUpdate(
      req.userAuth._id,
      {
        email,
        password: await hashPassword(password),
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      status: "success",
      data: student,
      message: "Student updated successfully",
    });
  } else {
    //update
    const student = await Student.findByIdAndUpdate(
      req.userAuth._id,
      {
        email,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      status: "success",
      data: student,
      message: "Student updated successfully",
    });
  }
});

//@desc Admin Updating Students eg: Assigning classes....
//@route PUT /api/students/:studentID/update/admin
//@access Private Admin only

exports.adminUpdateStudent = AsyncHandler(async (req, res) => {
  const {
    classLevels,
    academicYear,
    program,
    name,
    email,
    prefectName,
    isSuspended,
    iswitdrawn,
  } = req.body;
  //find the student by id
  const studentFound = await Student.findById(req.params.studentID);
  if (!studentFound) {
    throw new Error("Student not found");
  }

  //update
  const studentUpdated = await Student.findByIdAndUpdate(
    req.params.studentID,
    {
      $set: {
        name,
        email,
        academicYear,
        program,
        prefectName,
        isSuspended,
        iswitdrawn,
      },

      $addToSet: {
        classLevels,
      },
    },
    {
      new: true,
    }
  );
  //send response
  res.status(200).json({
    status: "success",
    data: studentUpdated,
    message: "Student updated successfully",
  });
});

//@desc Student taking Exams
//@route PUT /api/v1/students/:examID/write
//@access Private Student only

exports.writeExam = AsyncHandler(async (req, res) => {
  //get student
  const studentFound = await Student.findById(req.userAuth?._id);
  if (!studentFound) {
    throw new Error("Student not found");
  }
  //get exam
  const examFound = await Exam.findById(req.params.examID)
    .populate("questions")
    .populate("academicTerm");
  if (!examFound) {
    throw new Error("Exam not found");
  }

  //get questions
  const questions = examFound?.questions;
  //get students questions
  const studentAnswers = req.body.answers;

  //check if student answered all questions
  if (studentAnswers.length !== questions.length) {
    throw new Error("You have not answered all the questions");
  }

  //check if student has already taken the exams
  const studentFoundInResults = await ExamResult.findOne({
    student: studentFound?._id,
  });
  if (studentFoundInResults) {
    throw new Error("You have already written this exam");
  }

  //check if student is suspended/withdraw
  if (studentFound.iswitdrawn || studentFound.isSuspended) {
    throw new Error("You are suspended/withdraw, you can't take this exam");
  }

  //Build report object
  let correctAnswers = 0;
  let wrongAnswers = 0;
  let totalQuestions = 0;
  let status = ""; //failed/passed
  let remarks = "";
  let grade = 0;
  let score = 0;
  let answeredQuestions = [];

  //check for answers
  for (let i = 0; i < questions.length; i++) {
    //find the question
    const question = questions[i];
    //check if the answer is correct
    if (question.correctAnswer === studentAnswers[i]) {
      correctAnswers++;
      score++;
      question.isCorrect = true;
    } else {
      wrongAnswers++;
    }
  }

  //calculate report
  totalQuestions = questions.length;
  grade = (correctAnswers / questions.length) * 100;
  answeredQuestions = questions.map((question) => {
    return {
      question: question.question,
      correctAnswer: question.correctAnswer,
      isCorrect: question.isCorrect,
    };
  });

  //calculate reports
  if (grade >= 50) {
    status = "Pass";
  } else {
    status = "Fail";
  }

  //remarks
  if (grade >= 80) {
    remarks = "Excellent";
  } else if (grade >= 70) {
    remarks = "Very Good";
  } else if (grade >= 60) {
    remarks = "Good";
  } else if (grade >= 50) {
    remarks = "Fair";
  } else {
    remarks = "Poor";
  }

  // //Generate Exam Results
  const examResults = await ExamResult.create({
    studentID: studentFound?.studentId,
    exam: examFound?._id,
    grade,
    score,
    status,
    remarks,
    classLevel: examFound?.classLevel,
    academicTerm: examFound?.academicTerm,
    academicYear: examFound?.academicYear,
    answeredQuestions: answeredQuestions,
  });

  // //push the results into student
  studentFound.examResults.push(examResults?._id);
  // //save
  await studentFound.save();

  //Promoting student

  if (
    examFound.academicTerm.name === "3rd term" &&
    status === "Pass" &&
    studentFound?.currentClassLevel === "Level 100"
  ) {
    //promote student to level 200
    studentFound.classLevels.push("Level 200");
    studentFound.currentClassLevel = "Level 200";
    await studentFound.save();
  }

  //promote student to level 300
  if (
    examFound.academicTerm.name === "3rd term" &&
    status === "Pass" &&
    studentFound?.currentClassLevel === "Level 200"
  ) {
    studentFound.classLevels.push("Level 300");
    studentFound.currentClassLevel = "Level 300";
    await studentFound.save();
  }

  //promote student to level 400
  if (
    examFound.academicTerm.name === "3rd term" &&
    status === "Pass" &&
    studentFound?.currentClassLevel === "Level 300"
  ) {
    studentFound.classLevels.push("Level 400");
    studentFound.currentClassLevel = "Level 400";
    await studentFound.save();
  }

  //promote student to graduate
  if (
    examFound.academicTerm.name === "3rd term" &&
    status === "Pass" &&
    studentFound?.currentClassLevel === "Level 400"
  ) {
    studentFound.isGraduated = true;
    studentFound.yearGraduated = new Date();
    await studentFound.save();
  }

  res.status(200).json({
    status: "success",
    data: "You have submitted exam, Check later for the results.",
  });
});
