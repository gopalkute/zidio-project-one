import mongoose from "mongoose";

const dataSetSchema = new mongoose.Schema({
    fileUploadId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FileUpload',
        required: true,
        validate: {
            validator: async function (value) {
                const isExist = await mongoose.model('FileUpload').findById(value);
                return !!isExist;
            },
            message: "This file haven't uploaded yet."
        }
    },
    sheetName: {
        type: String,
        required: true
    },
    headers: {
        type: [String],
        required: true
    },
    columnTypes: [
        {
            name: String,
            type: {
                type: String,
                enum: ['numeric', 'string', 'date', 'boolean']
            }
        }
    ],
    data: {
        type: Array,
        required: true
    },
    totalRows: {
        type: Number,
        required: true
    },
}, { timestamps: true });

const DataSet = mongoose.model('DataSet', dataSetSchema);
export default DataSet;