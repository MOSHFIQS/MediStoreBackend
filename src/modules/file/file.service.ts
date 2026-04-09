import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { deleteFileFromCloudinary, uploadFileToCloudinary } from "../../config/cloudinary.config";

const uploadImage = async (files: Express.Multer.File[] | undefined) => {
    if (!files || files.length === 0) {
        throw new AppError(status.BAD_REQUEST, "No file uploaded");
    }

    // single file
    if (files.length === 1) {
        const uploaded = await uploadFileToCloudinary(
            files[0].buffer,
            files[0].originalname
        );

        return {
            url: uploaded.secure_url,
        };
    }

    // multiple files
    const uploadedImages = await Promise.all(
        files.map(async (file) => {
            const uploaded = await uploadFileToCloudinary(
                file.buffer,
                file.originalname
            );

            return {
                url: uploaded.secure_url,
            };
        })
    );

    return uploadedImages;
};

const deleteImage = async (urls: string | string[]) => {
    if (!urls) {
        throw new AppError(status.BAD_REQUEST, "Image URL is required");
    }

    if (Array.isArray(urls)) {
        await Promise.all(urls.map((url) => deleteFileFromCloudinary(url)));
        return null;
    }

    await deleteFileFromCloudinary(urls);
    return null;
};

export const FileService = {
    uploadImage,
    deleteImage,
};