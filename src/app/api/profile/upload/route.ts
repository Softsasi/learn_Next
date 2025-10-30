import { prisma } from '@/lib/prisma';
import { v2 as cloudinary } from 'cloudinary';
import { NextRequest, NextResponse } from 'next/server';
import streamifier from 'streamifier';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const userId = formData.get('userId') as string | null;

    if (!file || !userId) {
      return NextResponse.json(
        { message: 'File and userId are required' },
        { status: 400 }
      );
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Wrap Cloudinary upload_stream in a Promise
    const uploadToCloudinary = async (buffer: Buffer) => {
      return new Promise<any>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'profiles',
            resource_type: 'auto',
            use_filename: true,
            unique_filename: false,
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result!);
          }
        );

        // Pipe buffer to the stream
        streamifier.createReadStream(buffer).pipe(uploadStream);
      });
    };

    // Perform upload
    const result = await uploadToCloudinary(buffer);

    // Update database record
    await prisma.userProfile.update({
      where: { id: userId },
      data: {
        avatarUrl: result.secure_url,
      },
    });

    return NextResponse.json(
      {
        message: 'Profile updated successfully',
        imageUrl: result.secure_url,
        status: 200,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Upload failed:', error);
    return NextResponse.json(
      { message: 'Upload failed', error },
      { status: 500 }
    );
  }
}
