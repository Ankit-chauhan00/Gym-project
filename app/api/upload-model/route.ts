import cloudinary from "@/lib/cloudinary";
import { UploadApiResponse } from "cloudinary";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ title: "No file uploaded" }, { status: 400 });
    }

    // Optional validations
    const MAX_SIZE = 20 * 1024 * 1024;

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ title: "File too large" }, { status: 400 });
    }

    // checking if the file is in glb format
    if (!file.name.endsWith(".glb")) {
      return NextResponse.json({ title: "Only .glb files allowed" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result: UploadApiResponse = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "raw",
            folder: "models",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result as UploadApiResponse);
          }
        )
        .end(buffer);
    });

    console.log(result.secure_url);

    return NextResponse.json({
      url: result.secure_url,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: "Upload failed",
      },
      {
        status: 500,
      }
    );
  }
}
