import { SORT_ORDER } from "../constants/index.js";
import { StudentsCollection } from "../db/models/student.js";
import { calculatePaginationData } from "../utils/calculatePaginationData.js";

export const getAllStudents = async ({
  page = 1,
  perPage = 10,
  sortBy = "_id",
  sortOrder = SORT_ORDER.ASC,
  filter = {},
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const studentsQuery = StudentsCollection.find();

  if (filter.gender) {
    studentsQuery.where("gender").equals(filter.gender);
  }
  if (filter.maxAge) {
    studentsQuery.where("maxAge").lte(filter.maxAge);
  }
  if (filter.minAge) {
    studentsQuery.where("minAge").gte(filter.minAge);
  }
  if (filter.maxAvgMark) {
    studentsQuery.where("maxAvgMark").lte(filter.maxAvgMark);
  }
  if (filter.minAvgMark) {
    studentsQuery.where("minAvgMark").gte(filter.minAvgMark);
  }

  const [studentsCount, students] = await Promise.all([
    StudentsCollection.find().merge(studentsQuery).countDocuments(),

    studentsQuery
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder })
      .exec(),
  ]);

  const paginationData = calculatePaginationData(studentsCount, perPage, page);

  return {
    data: students,
    ...paginationData,
  };
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
