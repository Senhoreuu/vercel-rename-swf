import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';

interface DropzoneProps {
  onFilesAdded: (files: File[]) => void;
}

export const Dropzone: React.FC<DropzoneProps> = ({ onFilesAdded }) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const swfFiles = acceptedFiles.filter((file) =>
        file.name.toLowerCase().endsWith('.swf')
      );
      onFilesAdded(swfFiles);
    },
    [onFilesAdded]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/x-shockwave-flash': ['.swf'],
    },
    maxFiles: 5
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
        isDragActive
          ? 'border-blue-500 bg-dark-200'
          : 'border-dark-300 hover:border-blue-500 hover:bg-dark-200'
      }`}
    >
      <input {...getInputProps()} />
      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <p className="text-lg font-medium text-gray-200">
        {isDragActive
          ? 'Drop your SWF files here'
          : 'Drag & drop SWF files here, or click to select files'}
      </p>
      <p className="text-sm text-gray-400 mt-2">Apenas arquivos .swf são suportados</p>
    </div>
  );
}