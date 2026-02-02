const XLSX = require("xlsx");
const ExcelRow = require("../models/ExcelRow");
const response = require("../utilities/api_handler");
const {v4:uuidv4}=require("uuid");
const ExcelUpload = require("../models/ExcelUpload");
const chartService=require("../services/charts");
const error = require("../helpers/messages");

exports.uploadExcel = async (req, res) => {
    try {
        if (!req.file) {
            return res.json(response.JsonMsg(false, null, "No file uploaded", 400));
        }

        // Read Excel file
        const workbook = XLSX.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(sheet);

        const uploadId=uuidv4();

        if (!rows.length) {
            return res.json(response.JsonMsg(false, null, "Empty file", 400));
        }

        await ExcelUpload.create({
            uploadId,
            fileName:req.file.originalname,
            totalRows:rows.length
        });

        // Store rows in MongoDB
        const formattedRows = rows.map((row) => ({
            uploadId,
            data: row
        }));
        await ExcelRow.insertMany(formattedRows);

        return res.json(
            response.JsonMsg(true, {uploadId }, "Data stored successfully", 200)
        );
    } catch (err) {
        return res.json(response.JsonMsg(false, null, err.message, 500));
    }
};

exports.getUploads= async (req,res)=>{
    try{
        const uploads= await ExcelUpload.find()
            .sort({createdAt : -1})
            .lean();

        return res.json(response.JsonMsg(true,uploads, "Upload list fetched successfully", 200));

    }catch (err) {
        return res.json(response.JsonMsg(false, null, err.message, 500));
    }
};

exports.getExcelData = async (req, res) => {
    try {
        const rows = await ExcelRow.find().lean();

        return res.json(
            response.JsonMsg(true, rows, "Data fetched successfully", 200)
        );
    } catch (err) {
        return res.json(response.JsonMsg(false, null, err.message, 500));
    }
};

exports.getRowsByUploadId = async (req, res) => {
    try {
        const {uploadId} =req.params;
        const rows = await ExcelRow.find({uploadId}).lean();

        return res.json(
            response.JsonMsg(true, rows, "Data fetched successfully", 200)
        );
    } catch (err) {
        return res.json(response.JsonMsg(false, null, err.message, 500));
    }
};

exports.top5Dealers = (req, res) => {
    const { uploadId } = req.params;

    chartService.getTop5Dealers(uploadId)
        .then(result => {
            const labels = result.map(item => item._id);
            const data = result.map(item => item.count);

            return res.json(
                response.JsonMsg(true, { labels, data }, "Top 5 dealers fetched", 200)
            );
        })
        .catch(err => {
            return res.json(
                response.JsonMsg(false, null, err.message, 500)
            );
        });
};

exports.top5Zones = (req, res) => {
    const { uploadId } = req.params;

    chartService.getTop5Zones(uploadId)
        .then(result => {
            const labels = result.map(item => item._id);
            const data = result.map(item => item.count);

            return res.json(
                response.JsonMsg(true, { labels, data }, "Top 5 zones fetched", 200)
            );
        })
        .catch(err => {
            return res.json(
                response.JsonMsg(false, null, err.message, 500)
            );
        });
};

exports.top5Regions = (req, res) => {
    const { uploadId } = req.params;

    chartService.getTop5Regions(uploadId)
        .then(result => {
            const labels = result.map(item => item._id);
            const data = result.map(item => item.count);

            return res.json(
                response.JsonMsg(true, { labels, data }, "Top 5 regions fetched", 200)
            );
        })
        .catch(err => {
            return res.json(
                response.JsonMsg(false, null, err.message, 500)
            );
        });
};




