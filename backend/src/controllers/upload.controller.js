import fs from 'fs/promises';
import { createError, errorCodes, parseExcelFile } from "../utils/index.js"
import { DataSet, FileUpload } from "../models/index.js";

export const uploadExcelFile = async (req, res) => {
    const filePath = req.file?.path;
    try {
        if (!req.file) {
            return res.status(400).json(createError(errorCodes.badRequest, 'excelFile', 'Please provide an excel file to proceed.'))
        }
        const { filename, originalname, size } = req.file;
        let parsedData = parseExcelFile(filePath);

        const fileUpload = new FileUpload({
            // userId: req.user.id,
            filename,
            originalName: originalname,
            fileSize: size,
            filePath
        });
        await fileUpload.save();

        const dataSet = new DataSet({
            fileUploadId: fileUpload._id,
            sheetName: parsedData.currentSheet,
            headers: parsedData.headers,
            columnTypes: parsedData.columnTypes,
            data: parsedData.rows,
            totalRows: parsedData.totalRows
        });
        await dataSet.save();

        res.status(201).json({
            message: 'File uploaded and processed successfully',
            fileId: fileUpload._id,
            dataSetId: dataSet._id,
            headers: parsedData.headers,
            columnTypes: parsedData.columnTypes,
            totalRows: parsedData.totalRows,
            sheetNames: parsedData.sheetNames
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