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
      toast.error('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
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
      className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${
        isDragActive
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-200 bg-gray-50 hover:border-blue-400 hover:bg-blue-50/50'
      }`}
    >
      <input {...getInputProps()} />
      {preview ? (
        <div className="relative inline-block">
          <img
            src={preview}
            alt="Preview"
            className="mx-auto w-40 h-40 rounded-full object-cover shadow-lg border-4 border-white ring-4 ring-blue-100"
          />
          <div className="absolute inset-0 rounded-full bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center">
            <span className="text-white text-sm font-medium opacity-0 hover:opacity-100 transition-opacity">Click to change</span>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-3">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div>
            <p className="text-gray-700 font-semibold">Drag & drop your profile photo</p>
            <p className="text-sm text-gray-500 mt-1">or click to select (PNG, JPG up to 5MB)</p>
          </div>
        </div>
      )}
      {uploading && (
        <div className="absolute inset-0 bg-white/80 rounded-2xl flex items-center justify-center">
          <div className="flex flex-col items-center space-y-2">
            <div className="animate-spin">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <p className="text-sm text-gray-600">Uploading...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileImageUpload;
