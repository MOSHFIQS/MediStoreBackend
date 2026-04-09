import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import status from "http-status";
import { envVars } from "./env";
import AppError from "../errorHelpers/AppError";

cloudinary.config({
    cloud_name: envVars.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
    api_key: envVars.CLOUDINARY.CLOUDINARY_API_KEY,
    api_secret: envVars.CLOUDINARY.CLOUDINARY_API_SECRET,
});

const allowedExtensions = ["jpg", "jpeg", "png", "webp", "gif","pdf"];

export const uploadFileToCloudinary = async (
    buffer: Buffer,
    fileName: string,
): Promise<UploadApiResponse> => {

    if (!buffer || !fileName) {
        throw new AppError(
            status.BAD_REQUEST,
            "File buffer and file name are required"
        );
    }

    const extension = fileName.split(".").pop()?.toLowerCase();

    if (!extension || !allowedExtensions.includes(extension)) {
        throw new AppError(
            status.BAD_REQUEST,
            "Only specify files are allowed"
        );
    }

    const fileNameWithoutExtension = fileName
        .split(".")
        .slice(0, -1)
        .join(".")
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");

    const uniqueName =
        Math.random().toString(36).substring(2) +
        "-" +
        Date.now() +
        "-" +
        fileNameWithoutExtension;

    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: "medi-store/images",
                public_id: uniqueName,
                resource_type: "image",
            },
            (error, result) => {
                if (error || !result) {
                    return reject(
                        new AppError(
                            status.INTERNAL_SERVER_ERROR,
                            "Failed to upload image to Cloudinary"
                        )
                    );
                }
                resolve(result);
            }
        );

        stream.end(buffer);
    });
};

export const deleteFileFromCloudinary = async (url: string) => {
    try {
        const regex = /\/v\d+\/(.+?)(?:\.[a-zA-Z0-9]+)+$/;
        const match = url.match(regex);

        if (match?.[1]) {
            const publicId = match[1];

            await cloudinary.uploader.destroy(publicId, {
                resource_type: "image",
            });
        }
    } catch {
        throw new AppError(
            status.INTERNAL_SERVER_ERROR,
            "Failed to delete image from Cloudinary"
        );
    }
};

export const cloudinaryUpload = cloudinary;