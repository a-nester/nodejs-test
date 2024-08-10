import { Router } from "express";
import {
  createStudentController,
  deleteStudentController,
  getStudentsByIdController,
  getStudentsController,
  patchStudentController,
  upsertStudentController,
} from "../controllers/students.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { validateBody } from "../middlewares/validateBody.js";
import {
  createStudentSchema,
  updateStudencSchema,
} from "../validation/students.js";
import { isValidId } from "../middlewares/isValidObjectId.js";

const router = Router();

router.get("/", ctrlWrapper(getStudentsController));
router.get("/:studentId", isValidId, ctrlWrapper(getStudentsByIdController));
router.post(
  "/",
  validateBody(createStudentController),
  ctrlWrapper(createStudentController)
);
router.delete("/:studentId", isValidId, ctrlWrapper(deleteStudentController));
router.put(
  "/:studentId",
  isValidId,
  validateBody(createStudentSchema),
  ctrlWrapper(upsertStudentController)
);
router.patch(
  "/:studentId",
  isValidId,
  validateBody(updateStudencSchema),
  ctrlWrapper(patchStudentController)
);

export default router;
