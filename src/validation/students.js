import Joi from "joi";

export const createStudentSchema = Joi.object({
  name: Joi.string().min(3).max(30).required().messages({
    "string.base": "Username should be a string",
    "string.min": "Username should have at least {#limit} characters",
    "string.max": "Username should have at most {#limit} characters",
    "any.required": "Username is required",
  }),
  email: Joi.string().email().required(),
  age: Joi.number().integer().min(6).max(16).required(),
  gender: Joi.string().valid("male", "femail", "other").required(),
  avgMark: Joi.number().min(2).max(12).required(),
  onDuty: Joi.boolean(),
});

export const updateStudencSchema = Joi.object({
  name: Joi.string().min(3).max(30),
  email: Joi.string().email(),
  age: Joi.number().integer().min(6).max(16),
  gender: Joi.string().valid("male", "female", "other"),
  avgMark: Joi.number().min(2).max(12),
  onDuty: Joi.boolean(),
});
