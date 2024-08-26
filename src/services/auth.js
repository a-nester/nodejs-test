import bcrypt from "bcrypt";
import createHttpError from "http-errors";
import { randomBytes } from "crypto";

import { UsersCollection } from "../db/models/user.js";
import { SessionCollection } from "../db/models/session.js";
import { FIFTEEN_MINUTES, ONE_DAY, SMTP } from "../constants/index.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/sendMail.js";
import { env } from "../utils/env.js";

export const registerUser = async (payload) => {
  const user = await UsersCollection.findOne({ email: payload.email });
  if (user) throw createHttpError(409, "Email in use");

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  return await UsersCollection.create({
    ...payload,
    parrword: encryptedPassword,
  });
};

export const loginUser = async (payload) => {
  const user = await UsersCollection.findOne({ email: payload.email });

  if (!user) {
    throw createHttpError(404, "User not found");
  }
  const isEqual = bcrypt.compare(payload.password, user.password);
  console.log("payload.pas", payload.password);
  console.log("user.pas", user.password);

  if (!isEqual) {
    throw createHttpError(401, "Unauthorized");
  }

  await SessionCollection.deleteOne({ userId: user._id });

  const accessToken = randomBytes(30).toString("base64");
  const refreshToken = randomBytes(30).toString("base64");

  return await SessionCollection.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refressTokenValidUntil: new Date(Date.now() + ONE_DAY),
  });
};

export const logoutUser = async (sessionId) => {
  await SessionCollection.deleteOne({ _id: sessionId });
};

export const createSession = () => {
  const accessToken = randomBytes(30).toString("base64");
  const refreshToken = randomBytes(30).toString("base64");

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refressTokenValidUntil: new Date(Date.now + ONE_DAY),
  };
};

export const refreshUsersSession = async ({ sessionId, refreshToken }) => {
  const session = await SessionCollection.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) {
    throw createHttpError(401, "Session not found");
  }

  const isSessionTokenExpired =
    Date.now() > new Date(session.refressTokenValidUntil);

  if (isSessionTokenExpired) {
    throw createHttpError(401, "Session token expired");
  }

  const newSession = createSession();

  await SessionCollection.deleteOne({ _id: sessionId, refreshToken });

  return await SessionCollection.create({
    userId: session.userId,
    ...newSession,
  });
};

export const requestResetToken = async (email) => {
  const user = await UsersCollection.findOne({ email });
  if (!user) {
    throw createHttpError(404, "User not found");
  }

  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    env("JWT_SECRET"),
    { expiresIn: "15m" }
  );

  await sendEmail({
    from: env(SMTP.SMTP_FROM),
    to: email,
    subject: "Reset your password",
    html: `<p>Click <a href="${resetToken}">here</a> to reset your password!</p>`,
  });
};
