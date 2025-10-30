import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';

const ProfileImageUpload = ({
  userId,
  avatarUrl,
}: {
  userId: string;
  avatarUrl?: string;
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (avatarUrl) {
      setPreview(avatarUrl);
    }
  }, [avatarUrl]);

  const uploadFile = async (file: File) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', userId);

      const res = await axios.post('/api/profile/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.status !== 200) {
        toast.error('Failed to upload image');
        return;
      }

      setFile(null);
      setPreview(res.data?.imageUrl);
      toast.success('Profile image updated successfully', {
        duration: 4000,
        position: 'top-center',
      });

      console.log('Upload response:', res.data);
    } catch (err) {
      console.error('Error uploading file:', err);
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];

    if (selectedFile) {
      setFile(selectedFile);
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreview(objectUrl);
    }

    // Upload immediately after drop
    uploadFile(selectedFile);

    () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    maxFiles: 1,
    onDrop,
  });

  return (
    <div
      {...getRootProps()}
      className="border-dashed border-2 p-4 rounded-lg text-center cursor-pointer"
    >
      <input {...getInputProps()} />
      {preview ? (
        <img
          src={preview}
          alt="Preview"
          className="mx-auto w-32 h-32 rounded-full object-cover"
        />
      ) : (
        <p>Drag & drop your profile photo here, or click to select</p>
      )}
    </div>
  );
};

export default ProfileImageUpload;
