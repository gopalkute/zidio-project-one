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
    sheets: [{
        sheetName: {
            type: String,
            required: true
        },
        headers: {
            type: [String],
            trim: true
        },
        columnTypes: [{
            name: String,
            type: {
                type: String,
                enum: ['numeric', 'string', 'date', 'boolean'],
                default: 'String'
            }
        }],
        data: {
            type: Array,
            default: []
        },
        totalRows: {
            type: Number,
            default: 0
        }
    }],
    defaultSheetIndex: {
        type: Number,
        default: 0
    },
    totalSheets: {
        type: Number,
        default: 1
    },
    sheetNames: [{
        type: String
    }]
}, { timestamps: true });

const DataSet = mongoose.model('DataSet', dataSetSchema);
export default DataSet;