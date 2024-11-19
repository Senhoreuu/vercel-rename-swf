export interface FileWithNewName {
  file: File;
  newName: string;
  id: string;
  status: 'pending' | 'renaming' | 'success' | 'error';
  errorMessage?: string;
}