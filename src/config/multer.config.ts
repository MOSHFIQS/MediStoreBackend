import multer from "multer";
import AppError from "../errorHelpers/AppError";

const allowedExtensions = ["jpg", "jpeg", "png", "webp", "gif","pdf"];

const storage = multer.memoryStorage();

const fileFilter: multer.Options["fileFilter"] = (req, file, cb) => {
    const extension = file.originalname.split(".").pop()?.toLowerCase();

    if (!extension || !allowedExtensions.includes(extension)) {
        return cb(new AppError(400, "Only specify files are allowed"));
    }

    cb(null, true);
};

export const multerUpload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
});