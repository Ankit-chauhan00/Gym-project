"use client";

import { upload } from "@imagekit/next";
import { useRef, useState } from "react";

interface Props {
  onUpload: (url: string) => void;
}

const ImageUpload = ({ onUpload }: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const authenticator = async () => {
    const response = await fetch("/api/upload-auth");

    if (!response.ok) {
      throw new Error("Auth failed");
    }

    return response.json();
  };

  const handleUpload = async () => {
    const fileInput = fileInputRef.current;

    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
      return;
    }

    const file = fileInput.files[0];

    try {
      setUploading(true);
      setProgress(0);

      const auth = await authenticator();

      const res = await upload({
        file,
        fileName: file.name,

        publicKey: auth.publicKey,
        signature: auth.signature,
        expire: auth.expire,
        token: auth.token,

        onProgress: (event) => {
          setProgress((event.loaded / event.total) * 100);
        },
      });

      if (!res.url) {
        throw new Error("Image upload failed");
      }

      onUpload(res.url);
      
      // clear selected file name
      if(fileInputRef.current){
        fileInputRef.current.value = ""
      }

      setProgress(100);

      setTimeout(() => {
        setUploading(false);
      }, 500);
    } catch (error) {
      console.log(error);

      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        accept="image/png,image/jpeg,image/webp"
        ref={fileInputRef}
        className="w-full rounded-xl border border-gray-700 p-3"
      />

      <button
        type="button"
        onClick={handleUpload}
        disabled={uploading}
        className="rounded-xl bg-red-500 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {uploading ? "Uploading..." : "Upload Image"}
      </button>

      {uploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-white">Uploading...</p>

            <span className="text-sm text-gray-400">{Math.round(progress)}%</span>
          </div>

          <div className="h-3 w-full overflow-hidden rounded-full bg-gray-800">
            <div
              className="h-full rounded-full bg-red-500 transition-all duration-300"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
