import { getAllStudents } from "../services/students";

export const getStudentsController = async (req, res) => {
  const students = await getAllStudents();
  res.json({
    status: 200,
    message: "Successfully found students!",
    data: students,
  });
};

export const getStudentsByIdController = async (req, res) => {
  const { studentId } = req.params;
  const student = await getStudentById(studentId);
  // response if contact not found
  if (!student) {
    res.status(404).json({
      message: "Student not found",
    });
    return;
  }
  //response if contact found
  res.json({
    status: 200,
    message: `Successfully found student with id ${studentId}`,
    data: student,
  });
};
