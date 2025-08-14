import multer, { FileFilterCallback, diskStorage, DiskStorageOptions } from 'multer';
import path from 'path';
import { Request } from 'express';

// Type for file filter callback
type FileFilterCallbackType = (error: Error | null, acceptFile: boolean) => void;

// Disk storage configuration with types
const storage = diskStorage({
  destination: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) => {
    cb(null, 'uploads/');
  },
  
  filename: (
    req: Request, 
    file: Express.Multer.File, 
    cb: (error: Error | null, filename: string) => void
  ) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  }
} as DiskStorageOptions);

// File filter with proper typing
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
): void => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  allowedTypes.includes(file.mimetype) 
    ? cb(null, true) 
    : cb(new Error('Invalid file type'));
};

// Typed Multer configuration
export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});