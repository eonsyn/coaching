import cloudinary from '@/lib/cloudinary';
import { NextResponse } from 'next/server';
import streamifier from 'streamifier'; // Needed to convert buffer into a readable stream

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get('file');

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  // Wrap the upload_stream in a Promise to use with async/await
  const uploadFromBuffer = (buffer) => {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'questions' }, // optional: organize uploads
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      streamifier.createReadStream(buffer).pipe(uploadStream);
    });
  };

  try {
    const result = await uploadFromBuffer(buffer);
    return NextResponse.json({ url: result.secure_url });
  } catch (err) {
    console.error('Cloudinary Upload Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
