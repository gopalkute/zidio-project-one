import express from "express";
import { upload } from "../middlewares/index.js";
import { uploadExcelFile } from "../controllers/index.js";

const uploadRouter = express.Router();

uploadRouter.post('/excel', upload.single('excelFile'), uploadExcelFile);

export default uploadRouter;        