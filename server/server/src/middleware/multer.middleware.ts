import multer, { StorageEngine } from 'multer';
import { Request } from 'express';
// import { FileFilterCallback } from 'multer';

// Define the storage engine
const storage: StorageEngine = multer.diskStorage({
  destination: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void): void {
    cb(null, './public/temp'); 
  },
  filename: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void): void {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    console.log(file); 
    cb(null, `${file.fieldname}-${uniqueSuffix}`); // Set the filename
  }
});

// Export the multer upload function
export const upload = multer({ 
  storage
});
