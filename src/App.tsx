import React, { useState } from 'react';
import { Dropzone } from './components/Dropzone';
import { FileList } from './components/FileList';
import { FileWithNewName } from './types/file';
import { toast, Toaster } from 'react-hot-toast';
import { ArrowUpCircle } from 'lucide-react';

function App() {
  const [files, setFiles] = useState<FileWithNewName[]>([]);

  const handleFilesAdded = (newFiles: File[]) => {
    const newFileObjects: FileWithNewName[] = newFiles.map((file) => ({
      file,
      newName: file.name.replace('.swf', ''),
      id: crypto.randomUUID(),
      status: 'pending',
    }));
    setFiles((prev) => [...prev, ...newFileObjects]);
  };

  const handleRemoveFile = (id: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== id));
  };

  const handleUpdateNewName = (id: string, newName: string) => {
    setFiles((prev) =>
      prev.map((file) =>
        file.id === id ? { ...file, newName: newName } : file
      )
    );
  };

  const handleSubmit = async () => {
    const invalidFiles = files.filter((file) => !file.newName.trim());
    if (invalidFiles.length > 0) {
      toast.error('Please provide names for all files');
      return;
    }

    setFiles((prev) =>
      prev.map((file) => ({ ...file, status: 'renaming' as const }))
    );

    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('files', file.file);
        formData.append('newNames', file.newName + '.swf');
      });

      await new Promise((resolve) => setTimeout(resolve, 1500));

      setFiles((prev) =>
        prev.map((file) => ({ ...file, status: 'success' as const }))
      );
      toast.success('Files renamed successfully!', {
        style: {
          background: '#2c2e33',
          color: '#fff',
        },
      });
    } catch (error) {
      setFiles((prev) =>
        prev.map((file) => ({
          ...file,
          status: 'error' as const,
          errorMessage: 'Failed to rename file',
        }))
      );
      toast.error('Failed to rename files', {
        style: {
          background: '#2c2e33',
          color: '#fff',
        },
      });
    }
  };

  return (
    <div className="min-h-screen bg-dark-100">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-100">SWF File Renamer</h1>
          <p className="mt-2 text-gray-400">
            Upload your SWF files and rename them easily
          </p>
        </div>

        <Dropzone onFilesAdded={handleFilesAdded} />

        {files.length > 0 && (
          <div className="mt-8 space-y-6">
            <FileList
              files={files}
              onRemoveFile={handleRemoveFile}
              onUpdateNewName={handleUpdateNewName}
            />

            <div className="flex justify-center">
              <button
                onClick={handleSubmit}
                disabled={files.some((f) => f.status === 'renaming')}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowUpCircle className="w-5 h-5 mr-2" />
                Rename Files
              </button>
            </div>
          </div>
        )}
      </div>
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#2c2e33',
            color: '#fff',
          },
        }}
      />
    </div>
  );
}

export default App;