import {
  createStudent,
  deleteStudent,
  getAllStudents,
  getStudentById,
  upsertStudent,
} from "../services/students.js";
import createHttpError from "http-errors";
import { parsePaginationParams } from "../utils/parsePaginationParams.js";
import { parseSortParams } from "../utils/parseSortParams.js";
import { parseFilterParams } from "../utils/parseFilterParams.js";

export const getStudentsController = async (req, res, next) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);

  const students = await getAllStudents({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
  });

  res.json({
    status: 200,
    message: "Successfully found students!",
    data: students,
  });
};

export const getStudentsByIdController = async (req, res, next) => {
  const { studentId } = req.params;
  const student = await getStudentById(studentId);
  // response if contact not found
  if (student === null) {
    // return next(new Error("Student not found"));
    // return next(createHttpError(404, "Student not found"));
    // return next(createHttpError[404]("Student not found"));
    return next(createHttpError.NotFound("Student not found"));
  }
  //response if contact found
  res.send({
    status: 200,
    message: `Successfully found student with id ${studentId}`,
    data: student,
  });
};

export const createStudentController = async (req, res, next) => {
  const student = await createStudent(req.body);

  res.status(201).json({
    status: 201,
    message: `Successfully created a student`,
    data: student,
  });
};

export const deleteStudentController = async (req, res, next) => {
  const { studentId } = req.params;
  const student = await deleteStudent(studentId);

  if (!student) {
    next(createHttpError(404, "Student not found"));
    return;
  }

  res.status(204).send();
};

export const upsertStudentController = async (req, res, next) => {
  const { studentId } = req.params;
  const result = await upsertStudent(studentId, req.body, { upsert: true });

  if (!result) {
    next(createHttpError(404, "Student not found"));
    return;
  }

  const status = result.new ? 201 : 200;

  res.status(status).json({
    status: status,
    message: `Successfuly upserted a student!`,
    data: result.student,
  });
};

export const patchStudentController = async (req, res, next) => {
  const { studentId } = req.params;
  const result = await upsertStudent(studentId, req.body);

  if (!result) {
    next(createHttpError(404, "Student not found"));
    return;
  }

  res.json({
    status: 200,
    message: `Successful patched a student!`,
    data: result.student,
  });
};
