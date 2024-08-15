export const registerUserController = async (req, res) => {
  const user = await registerUser(req.body);
};
