import multer from "multer";
import { nanoid } from "nanoid";
import fs from "fs";
import path from "path";

export const fileValidation = {
  image: ['image/png', 'image/jpeg']
};

export const uploadFile = ({ customValidation } = {}) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadsDir = path.resolve('uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir);
      }
      cb(null, 'uploads'); // Relative path without leading slash
    },
    filename: (req, file, cb) => {
      const fileName = `${nanoid()}_${file.originalname}`;
      file.finalDest = path.join('uploads', fileName).replace(/\\/g, '/'); // Normalize path for browser access
      cb(null, fileName);
    }
  });

  const fileFilter = (req, file, cb) => {
    if (customValidation.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  };

  return multer({ storage, fileFilter });
};
