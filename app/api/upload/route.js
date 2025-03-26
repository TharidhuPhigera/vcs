import cloudinary from "cloudinary";
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";

// Cloudinary Configuration
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
  api: {
    bodyParser: false, // Handle file uploads manually
  },
};

export const POST = async (req) => {
  try {
    // Parse form data
    const formData = await req.formData();
    const file = formData.get("file");

    // Validate file type
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp", "video/mp4", "video/mov"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Only images and videos are allowed" }, { status: 400 });
    }

    // Generate a unique file name
    const fileName = `${randomUUID()}-${file.name}`;

    // Convert file to buffer
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // Upload file to Cloudinary
    const uploadPromise = new Promise((resolve, reject) => {
      const uploadStream = cloudinary.v2.uploader.upload_stream(
        { public_id: fileName, folder: "cargo_images" }, 
        (error, result) => {
          if (error) reject(error);
          else resolve(result.secure_url); // Get Cloudinary URL
        }
      );

      uploadStream.end(fileBuffer);
    });

    const imageUrl = await uploadPromise;

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json({ error: "File upload failed" }, { status: 500 });
  }
};