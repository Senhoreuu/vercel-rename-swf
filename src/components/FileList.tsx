import React from 'react';
import { FileWithNewName } from '../types/file';
import { FileIcon, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface FileListProps {
  files: FileWithNewName[];
  onRemoveFile: (id: string) => void;
  onUpdateNewName: (id: string, newName: string) => void;
}

export const FileList: React.FC<FileListProps> = ({
  files,
  onRemoveFile,
  onUpdateNewName,
}) => {
  const getStatusIcon = (status: FileWithNewName['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'renaming':
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-3">
      {files.map((file) => (
        <div
          key={file.id}
          className="bg-dark-200 p-4 rounded-lg shadow-sm border border-dark-300 flex items-center gap-4"
        >
          <FileIcon className="w-8 h-8 text-blue-500 flex-shrink-0" />
          <div className="flex-grow min-w-0">
            <div className="text-sm text-gray-400 truncate">{file.file.name}</div>
            <input
              type="text"
              value={file.newName}
              onChange={(e) => onUpdateNewName(file.id, e.target.value)}
              className="mt-1 block w-full rounded-md border-dark-300 bg-dark-300 text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="New file name"
            />
            {file.errorMessage && (
              <p className="text-sm text-red-500 mt-1">{file.errorMessage}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon(file.status)}
            <button
              onClick={() => onRemoveFile(file.id)}
              className="p-1 hover:bg-dark-300 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}