const AsyncHandler = require("express-async-handler");
const Teacher = require("../../model/Staff/Teacher");
const { hashPassword, isPassMatched } = require("../../utils/helpers");
const generateToken = require("../../utils/generateToken");
const Admin = require("../../model/Staff/Admin");

//@desc Admin Register Teacher
//@route POST /api/v1/teachers/admins/register
//@access Private

exports.adminRegisterTeacher = AsyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  //find the admin
  const adminFound = await Admin.findById(req.userAuth._id);
  if (!adminFound) {
    throw new Error("Admin not found");
  }
  //check if teacher already exits
  const teacher = await Teacher.findOne({ email });
  if (teacher) {
    throw new Error("Teacher already employed");
  }
  //hash password
  const hashedPassword = await hashPassword(password);
  //create
  const teacherCreated = await Teacher.create({
    name,
    email,
    password: hashedPassword,
  });
  //push teacher into admin
  adminFound.teachers.push(teacherCreated?._id);
  await adminFound.save();
  //send teacher data
  res.status(201).json({
    status: "success",
    message: "Teacher registered successfully",
    data: teacherCreated,
  });
});

//@desc login a teacher
//@route POST /api/v1/teachers/login
//@access Private

exports.loginTeacher = AsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //find the user
  const teacher = await Teacher.findOne({ email });
  if (!teacher) {
    return res.json({ message: "Invalid login credentials" });
  }
  //verify the password
  const isMatched = await isPassMatched(password, teacher?.password);
  if (!isMatched) {
    return res.json({ message: "Invalid login credentials" });
  } else {
    res.status(200).json({
      status: "success",
      message: "Teacher logged in successfully",
      data: generateToken(teacher._id),
    });
  }
});

//@desc Get all Teachers
//@route GET /api/v1/teachers/admin
//@access Private Admin only

exports.getAllTeachersAdmin = AsyncHandler(async (req, res) => {
  res.status(200).json(res.results);
});

//@desc Get Single Teachers
//@route GET /api/v1/teachers/:teacherID/admin
//@access Private Admin only

exports.getTeacherByAdmin = AsyncHandler(async (req, res) => {
  const teacherID = req.params.teacherID;
  const teacher = await Teacher.findById(teacherID);
  if (!teacher) {
    throw new Error("Teacher not found");
  }
  res.status(200).json({
    status: "success",
    message: "Teacher fetched successfully",
    data: teacher,
  });
});

//@desc Get Teachers Prpfile
//@route GET /api/v1/teachers/profile
//@access Private Teacher only

exports.getTeacherProfile = AsyncHandler(async (req, res) => {
  const teacher = await Teacher.findById(req.userAuth?._id).select(
    "-password -createdAt -updatedAt"
  );

  if (!teacher) {
    throw new Error("Teacher not found");
  }
  res.status(200).json({
    status: "success",
    data: teacher,
    message: "Teacher fetched successfully",
  });
});

//@desc Teacher updating profile
//@route PUT /api/teachers/update-profile
//@access Private Teacher only
exports.teacherUpdateProfile = AsyncHandler(async (req, res) => {
  const { email, name, password } = req.body;
  //if email is taken
  const emailExist = await Teacher.findOne({ email });
  if (emailExist) {
    throw new Error("This email is taken/exist");
  }

  //hash password

  //check if user is updating password
  if (password) {
    //update
    const teacher = await Teacher.findByIdAndUpdate(
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
      data: teacher,
      message: "Teacher updated successfully",
    });
  } else {
    //update
    const teacher = await Teacher.findByIdAndUpdate(
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
      data: teacher,
      message: "Teacher updated successfully",
    });
  }
});

//@desc Admin updating Teacher profile
//@route POST /api/teachers/:teacherID/admin
//@access Private Admin only
exports.adminUpdateTeacher = AsyncHandler(async (req, res) => {
  const { program, classLevel, academicYear, subject } = req.body;
  //if email is taken
  const teacherFound = await Teacher.findById(req.params.teacherID);
  if (!teacherFound) {
    throw new Error("Teacher not found");
  }

  //check if teacher is withdrawn
  if (teacherFound.isWithdrawn) {
    throw new Error("Action denied, teacher is withdraw");
  }

  if (program) {
    //assign a program
    teacherFound.program = program;
    await teacherFound.save();

    res.status(200).json({
      status: "success",
      data: teacherFound,
      message: "Teacher updated successfully",
    });
  }

  //assign class Level
  if (classLevel) {
    teacherFound.classLevel = classLevel;
    await teacherFound.save();

    res.status(200).json({
      status: "success",
      data: teacherFound,
      message: "Teacher updated successfully",
    });
  }

  //assign Academic Year
  if (academicYear) {
    teacherFound.academicYear = academicYear;
    await teacherFound.save();

    res.status(200).json({
      status: "success",
      data: teacherFound,
      message: "Teacher updated successfully",
    });
  }

  //assign Subject
  if (subject) {
    teacherFound.subject = subject;
    await teacherFound.save();

    res.status(200).json({
      status: "success",
      data: teacherFound,
      message: "Teacher updated successfully",
    });
  }
});
