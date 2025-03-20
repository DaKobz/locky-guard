
import { registerPlugin } from '@capacitor/core';

export interface FileReaderPlugin {
  readFile(options: { path: string }): Promise<{ data: string }>;
}

const FileReader = registerPlugin<FileReaderPlugin>('FileReader');

export default FileReader;
