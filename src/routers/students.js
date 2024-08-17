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
import { authenticate } from "../middlewares/authenticate.js";
import { checkRoles } from "../middlewares/checkRoles.js";
import { ROLES } from "../constants/index.js";

const router = Router();

router.use(authenticate);

router.get("/", checkRoles(ROLES.TEACHER), ctrlWrapper(getStudentsController));
router.get(
  "/:studentId",
  checkRoles(ROLES.TEACHER, ROLES.PARENT),
  isValidId,
  ctrlWrapper(getStudentsByIdController)
);
router.post(
  "/register",
  checkRoles(ROLES.TEACHER),
  validateBody(createStudentSchema),
  ctrlWrapper(createStudentController)
);
router.delete(
  "/:studentId",
  checkRoles(ROLES.TEACHER),
  isValidId,
  ctrlWrapper(deleteStudentController)
);
router.put(
  "/:studentId",
  checkRoles(ROLES.TEACHER),
  isValidId,
  validateBody(createStudentSchema),
  ctrlWrapper(upsertStudentController)
);
router.patch(
  "/:studentId",
  checkRoles(ROLES.TEACHER, ROLES.PARENT),
  isValidId,
  validateBody(updateStudencSchema),
  ctrlWrapper(patchStudentController)
);

export default router;
