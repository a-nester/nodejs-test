import { getAllStudents, getStudentById } from "../services/students.js";
import createHttpError from "http-errors";

export const getStudentsController = async (req, res, next) => {
  const students = await getAllStudents();
  res.json({
    status: 200,
    message: "Successfully found students!",
    data: students,
  });
};

export const getStudentsByIdController = async (req, res, next) => {
  const { studentId } = req.params;
  const student = await getStudentById(studentId);
  if (student === null) {
    // return next(createHttpError(404, "Student not found"));
    // return next(createHttpError[404]("Student not found"));
    return next(createHttpError.NotFound("Student not found"));
  }

  // response if contact not found
  // next(new Error("Student not found"));
  // return;
  //response if contact found
  res.send({
    status: 200,
    message: `Successfully found student with id ${studentId}`,
    data: student,
  });
};
