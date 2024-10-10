import path from "path";

import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import morgan from "morgan";

import dbConnection from "./config/database";
import globalError from "./middlewares/errorMiddleware";
import ApiError from "./utils/apiError";

import categoryRoute from "./routes/categoryRoute";
import subCategoryRoute from "./routes/subCategoryRoute";
import brandRoute from "./routes/brandRoute";
import productRoute from "./routes/productRoute";
import userRoute from "./routes/userRoute";
import authRoute from "./routes/authRoute";

// environment variables
dotenv.config();

// connect with db
dbConnection();

// express app
const app = express();

// middlewares
app.use(express.json());

app.use(
  express.static(
    path.join(__dirname.slice(0, __dirname.lastIndexOf("\\")), "uploads")
  )
);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

// mount routes
app.use("/api/v1/categories", categoryRoute);
app.use("/api/v1/subCategories", subCategoryRoute);
app.use("/api/v1/brands", brandRoute);
app.use("/api/v1/products", productRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/auth", authRoute);

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  // create error and send it to global error handling middleware
  next(new ApiError(`Can't find this route ${req.originalUrl}`, 404));
});

// global error handling middleware for express
app.use(globalError);

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

// handling rejection outside express
process.on("unhandledRejection", (err: Error) => {
  console.error(`UnhandledRejection Errors: ${err.name} | ${err.message}`);
  server.close(() => {
    console.log("shutting down....");

    process.exit(1);
  });
});
