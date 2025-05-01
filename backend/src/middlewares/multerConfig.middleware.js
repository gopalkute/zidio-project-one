import multer from "multer";
import path from "path";
import { __uploadsDir, createError, errorCodes } from "../utils/index.js";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + extension);
    }
})

const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        'application/vnd.ms-excel',                                             // .xls
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',    // .xlsx 
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(createError(errorCodes.wrongType, 'excelFile', 'Uploaded file must be an Excel spreadsheet (.xls or .xlsx).'), false)
    }
}

const upload = multer({
    storage, fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB file size limit
    }
})

export default upload;