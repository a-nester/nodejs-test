import dotenv from "dotenv";

dotenv.config();

export const env = (name, defaultValue) => {
  const value = process.env[name];
  if (value) {
    return value;
  }
  if (defaultValue) {
    return defaultValue;
  }
  //   return value ? value : defaultValue;
  throw new Error(`Missing: process.env['${name}'].`);
};
