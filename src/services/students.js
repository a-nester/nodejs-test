import { StudentsCollection } from "../db/models/student.js";

export const getAllStudents = async () => {
  const students = await StudentsCollection.find();
  return students;
};

export const getStudentById = (studentId) =>
  StudentsCollection.findById(studentId);
