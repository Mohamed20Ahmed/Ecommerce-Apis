"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const morgan_1 = __importDefault(require("morgan"));
const database_1 = __importDefault(require("./config/database"));
const errorMiddleware_1 = __importDefault(require("./middlewares/errorMiddleware"));
const apiError_1 = __importDefault(require("./utils/apiError"));
const categoryRoute_1 = __importDefault(require("./routes/categoryRoute"));
const subCategoryRoute_1 = __importDefault(require("./routes/subCategoryRoute"));
const brandRoute_1 = __importDefault(require("./routes/brandRoute"));
const productRoute_1 = __importDefault(require("./routes/productRoute"));
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const authRoute_1 = __importDefault(require("./routes/authRoute"));
// environment variables
dotenv_1.default.config();
// connect with db
(0, database_1.default)();
// express app
const app = (0, express_1.default)();
// middlewares
app.use(express_1.default.json());
app.use(express_1.default.static(path_1.default.join(__dirname.slice(0, __dirname.lastIndexOf("\\")), "uploads")));
if (process.env.NODE_ENV === "development") {
    app.use((0, morgan_1.default)("dev"));
    console.log(`mode: ${process.env.NODE_ENV}`);
}
// mount routes
app.use("/api/v1/categories", categoryRoute_1.default);
app.use("/api/v1/subCategories", subCategoryRoute_1.default);
app.use("/api/v1/brands", brandRoute_1.default);
app.use("/api/v1/products", productRoute_1.default);
app.use("/api/v1/users", userRoute_1.default);
app.use("/api/v1/auth", authRoute_1.default);
app.all("*", (req, res, next) => {
    // create error and send it to global error handling middleware
    next(new apiError_1.default(`Can't find this route ${req.originalUrl}`, 404));
});
// global error handling middleware for express
app.use(errorMiddleware_1.default);
const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});
// handling rejection outside express
process.on("unhandledRejection", (err) => {
    console.error(`UnhandledRejection Errors: ${err.name} | ${err.message}`);
    server.close(() => {
        console.log("shutting down....");
        process.exit(1);
    });
});
