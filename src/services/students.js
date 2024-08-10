import { StudentsCollection } from "../db/models/student.js";

export const getAllStudents = async () => {
  const students = await StudentsCollection.find();
  return students;
};

export const getStudentById = async (studentId) => {
  try {
    const student = await StudentsCollection.findById(studentId);
    console.log("!!! Stud !!!", student);

    return student;
  } catch (error) {
    return null;
  }
};

export const createStudent = async (payload) => {
  // const { name, email, age, gender, avgMark, onDuty } = payload;
  const student = await StudentsCollection.create(payload);
  return student;
};

export const deleteStudent = async (studentId) => {
  console.log("student", studentId);
  const student = await StudentsCollection.findOneAndDelete({
    _id: studentId,
  });

  return student;
};

export const upsertStudent = async (studentId, payload, options = {}) => {
  const rawResult = await StudentsCollection.findOneAndUpdate(
    {
      _id: studentId,
    },
    payload,
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    }
  );

  if (!rawResult || !rawResult.value) {
    return null;
  }

  return {
    student: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};
