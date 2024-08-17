import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";
import sharp from 'sharp';

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

export const POST = async (req: Request) => {
    try {
        const data = await req.formData();
        const image = data.get("image");

        if (!image || !(image instanceof File)) {
            return NextResponse.json(
                { error: "No image file provided" },
                { status: 400 }
            );
        }

        const fileBuffer = await image.arrayBuffer();
        const mime = image.type;
        const maxSizeInBytes = 1 * 1024 * 1024; // 1 MB

        let processedBuffer = Buffer.from(fileBuffer);

        // Check image size and compress if necessary
        if (fileBuffer.byteLength > maxSizeInBytes) {
            processedBuffer = await sharp(fileBuffer)
                .resize({ width: 1024, height: 1024, fit: 'inside' })
                .jpeg({ quality: 80 }) // Adjust quality as needed
                .toBuffer();
        }

        const base64Data = processedBuffer.toString("base64");
        const encoding = "base64";
        const fileUri = `data:${mime};${encoding},${base64Data}`;

        const uploadToCloudinary = () => {
            return new Promise((resolve, reject) => {
                cloudinary.uploader.upload(fileUri, {
                    invalidate: true
                })
                    .then((result) => {
                        // console.log(result);
                        resolve(result);
                    })
                    .catch((error) => {
                        console.log(error);
                        reject(error);
                    });
            });
        };

        const result: any = await uploadToCloudinary();
        // console.log(result);
        let imageUrl = result.secure_url;

        return NextResponse.json(
            { success: true, imageUrl: imageUrl },
            { status: 200 }
        );
    } catch (error) {
        console.log("server err", error);
        return NextResponse.json({ err: "Internal Server Error" }, { status: 500 });
    }
};