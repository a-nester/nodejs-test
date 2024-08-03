import { isHttpError } from "http-errors";
// import { HttpError } from "http-errors";

export const errorHandler = (error, req, res, next) => {
  if (isHttpError(error) === true) {
    // if (error instanceof HttpError) {
    res.status(error.status).send({
      status: error.status,
      message: error.message,
      data: error,
    });
    return;
  }

  // console.error(error);

  res.status(500).send({
    status: 500,
    message: "Something went wrong",
    data: error.message,
  });
};
