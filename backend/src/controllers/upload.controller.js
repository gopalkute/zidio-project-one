import fs from 'fs';
import { createError, errorCodes, parseExcelFile } from "../utils/index.js"
import { DataSet, FileUpload } from "../models/index.js";

export const uploadExcelFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json(createError(errorCodes.badRequest, 'excelFile', 'Please provide an excel file to proceed.'))
        }
        const { filename, originalname, size, path: filePath } = req.file;

        console.log(filename, originalname)


        let parsedData;
        try {
            parsedData = parseExcelFile(filePath);
        } catch (error) {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
            throw new Error(`Failed to parse Excel file: ${error.message}`);
        }

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
        if (req.file && req.file.path && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
    }
}