import { registerUser } from "../services/auth.js";

export const registerUserController = async (req, res) => {
  const user = await registerUser(req.body);
};
