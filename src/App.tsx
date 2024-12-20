import {useState} from 'react';
import {Dropzone} from './components/Dropzone';
import {FileList} from './components/FileList';
import {FileWithNewName} from './types/file';
import {toast, Toaster} from 'react-hot-toast';
import {ArrowUpCircle} from 'lucide-react';

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

    const downloadFile = (responseData: { originalName: string; blob: string; file: string }) => {
        const byteCharacters = atob(responseData.blob);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
            const slice = byteCharacters.slice(offset, offset + 1024);
            const byteNumbers = new Array(slice.length);

            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            byteArrays.push(new Uint8Array(byteNumbers));
        }

        const blob = new Blob(byteArrays, { type: 'application/octet-stream' });

        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = responseData.file;
        document.body.appendChild(a);
        a.click();

        window.URL.revokeObjectURL(url);
    }

    const handleUpdateNewName = (id: string, newName: string) => {
        setFiles((prev) =>
            prev.map((file) =>
                file.id === id ? {...file, newName: newName} : file
            )
        );
    };

    const handleSubmit = async () => {
        const invalidFiles = files.filter((file) => !file.newName.trim());
        if (invalidFiles.length > 0) {
            toast.error('Por favor, forneça nomes para todos os arquivos');
            return;
        }

        setFiles((prev) =>
            prev.map((file) => ({...file, status: 'renaming' as const}))
        );

        try {
            const formData = new FormData();
            files.forEach((file) => {
                formData.append('files', file.file);
                formData.append('newNames', file.newName + '.swf');
            });

            const response = await fetch("https://rename-swf-api-production.up.railway.app/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                setFiles((prev) =>
                    prev.map((file) => ({
                        ...file,
                        status: 'error' as const,
                        errorMessage: 'Failed to rename file',
                    }))
                );

                toast.error("Falha ao renomear arquivos", {
                    style: {
                        background: "#2c2e33",
                        color: "#fff",
                    },
                });

                console.error(response.statusText);
                return;
            }

            const finalResponse = await response.json();

            if (finalResponse.responses && Array.isArray(finalResponse.responses)) {
                finalResponse.responses.forEach((fileResponse: {
                    originalName: string;
                    file: string;
                    error: string;
                    blob: string;
                }) => {
                    if (fileResponse.error) {
                        setFiles((prev) =>
                            prev.map((file) => ({
                                ...file,
                                status: "error" as const,
                                errorMessage: fileResponse.error,
                            }))
                        );
                        return;
                    }

                    downloadFile({ originalName: fileResponse.originalName, blob: fileResponse.blob, file: fileResponse.file });
                });
            } else {
                toast.error("Resposta inesperada da888888888 API", {
                    style: {
                        background: "#2c2e33",
                        color: "#fff",
                    },
                });
            }

            setFiles((prev) =>
                prev.map((file) => ({...file, status: "success" as const}))
            );

            toast.success("Arquivos renomeados com sucesso!", {
                style: {
                    background: "#2c2e33",
                    color: "#fff",
                },
            });
        } catch (error) {
            setFiles((prev) =>
                prev.map((file) => ({
                    ...file,
                    status: "error" as const,
                    errorMessage: "Failed to rename file",
                }))
            );
            toast.error("Falha ao renomear arquivos", {
                style: {
                    background: "#2c2e33",
                    color: "#fff",
                },
            });

            console.error(error);
        }
    };

    return (
        <div className="min-h-screen bg-dark-100">
            <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-100">Renomeador de Arquivos SWF</h1>
                    <p className="mt-2 text-gray-400">
                        Dê um nome aos seus arquivos SWF e faça o upload facilmente
                    </p>
                </div>

                <Dropzone onFilesAdded={handleFilesAdded}/>

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
                                <ArrowUpCircle className="w-5 h-5 mr-2"/>
                                Renomear Arquivos
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