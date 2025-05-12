import fs from 'fs/promises';
import { createError, errorCodes, parseExcelFile } from "../utils/index.js"
import { DataSet, FileUpload } from "../models/index.js";
import { upload } from '../middlewares/index.js';

export const uploadExcelFileController = (req, res, next) => {
    upload.single('excelFile')(req, res, (err) => {
        if (err) {
            if (err.code === errorCodes.limitFileSize) {
                return res.status(400).json(createError(errorCodes.badRequest, 'excelFile', 'File size exceeds the 10MB limit.'));
            }
            else if (err.code === errorCodes.wrongType) {
                res.status(400).json(createError(errorCodes.badRequest, 'excelFile', err.message));
            }
            else {
                res.status(400).json(createError(errorCodes.badRequest, 'excelFile', 'Unable to upload file.'));
            }
            return;
        }
        processAndSaveExcel(req, res, next);
    });
}

const processAndSaveExcel = async (req, res) => {
    const filePath = req.file?.path;
    try {
        if (!req.file) {
            return res.status(400).json(createError(errorCodes.badRequest, 'excelFile', 'Please provide an excel file to proceed.'))
        }
        const { filename, originalname, size } = req.file;
        let parsedData = parseExcelFile(filePath);

        const fileUpload = new FileUpload({
            userId: req.user.id,
            filename,
            originalName: originalname,
            fileSize: size,
            filePath
        });
        await fileUpload.save();

        const sheets = parsedData.sheetNames.map((sheetName, index) => {
            const sheetData = parsedData.sheets[sheetName];
            return {
                sheetName,
                headers: sheetData.headers,
                columnTypes: sheetData.columnTypes,
                data: sheetData.rows,
                totalRows: sheetData.totalRows
            };
        });
        let defaultSheetIndex = 0;
        for (let i = 0; i < sheets.length; i++) {
            if (sheets[i].totalRows > 0) {
                defaultSheetIndex = i;
                break;
            }
        }

        const dataSet = new DataSet({
            fileUploadId: fileUpload._id,
            sheets,
            defaultSheetIndex,
            totalSheets: parsedData.sheetNames.length,
            sheetNames: parsedData.sheetNames
        });
        await dataSet.save();

        res.status(201).json({
            message: 'File uploaded and processed successfully',
            fileId: fileUpload._id,
            dataSetId: dataSet._id,
            sheets: sheets.map((sheet, index) => ({
                sheetName: sheet.sheetName,
                headers: sheet.headers,
                columnTypes: sheet.columnTypes,
                data: sheet.data,
                totalRows: sheet.totalRows,
            })),
        });
    } catch (error) {
        console.log('upload excel file error: ', error)
        res.status(500).json(createError(errorCodes.serverError, 'serverError', 'An error occured while uploading and parsing excel file.'));
    }
    finally {
        if (filePath) {
            try {
                await fs.unlink(filePath);
            } catch (err) {
                console.warn('Failed to delete file while uploading excelFile:', err);
            }
        }
    }
}