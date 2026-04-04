import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, Image as ImageIcon, X } from 'lucide-react';

export default function CraftUploadPanel() {
  const [preview, setPreview] = useState(null);

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setPreview(URL.createObjectURL(file));
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
  });

  const removeImage = (e) => {
    e.stopPropagation();
    setPreview(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_0_40px_rgba(168,85,247,0.08)] backdrop-blur-xl transition-all duration-300 hover:shadow-[0_0_60px_rgba(236,72,153,0.18)]"
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-white">Upload Your Craft</h2>
        <span className="rounded-full bg-purple-500/20 px-3 py-1 text-xs font-medium uppercase tracking-wide text-purple-300">
          AI Story Generator
        </span>
      </div>

      <div
        {...getRootProps()}
        className={`relative flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-colors duration-300 ${
          isDragActive
            ? 'border-pink-400 bg-pink-400/5'
            : 'border-purple-400/30 hover:border-pink-400/60 hover:bg-white/5'
        }`}
      >
        <input {...getInputProps()} />

        {preview ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: [0.9, 1.05, 1], opacity: 1 }}
            className="group relative h-full w-full overflow-hidden rounded-lg p-2"
          >
            <img
              src={preview}
              alt="Craft preview"
              className="h-full w-full rounded-lg object-contain"
            />
            <button
              onClick={removeImage}
              className="absolute right-4 top-4 rounded-full bg-black/60 p-2 text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 hover:bg-black/80"
            >
              <X size={18} />
            </button>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center text-center p-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mb-4 rounded-full bg-purple-500/20 p-4"
            >
              <UploadCloud className="h-8 w-8 text-purple-400" />
            </motion.div>
            <p className="text-base font-medium text-white">
              Drag & drop your craft image here
            </p>
            <p className="mt-2 text-sm text-gray-400">
              High-resolution photos work best for AI analysis
            </p>
            <div className="mt-6 flex items-center gap-2 text-xs text-gray-500">
              <ImageIcon size={14} /> PNG, JPG, WEBP up to 10MB
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
