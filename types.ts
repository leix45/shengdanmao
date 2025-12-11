export interface ProcessedImage {
  originalData: string; // Base64 string
  mimeType: string;
  generatedData: string | null; // Base64 string
}

export enum AppStatus {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export interface ProcessingError {
  message: string;
  details?: string;
}

export type HatColor = 'Red' | 'Green' | 'Blue' | 'Gold' | 'Pink' | 'Silver' | 'Black';