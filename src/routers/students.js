import { Router } from "express";
import {
  getStudentsByIdController,
  getStudentsController,
} from "../controllers/students";

const router = Router();

router.get("/students", getStudentsController());
router.get("/students/:studentId", getStudentsByIdController());

export default router;
