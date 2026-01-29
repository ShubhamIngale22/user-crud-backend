const XLSX = require("xlsx");
const ExcelRow = require("../models/ExcelRow");
const response = require("../utilities/api_handler");

exports.uploadExcel = async (req, res) => {
    try {
        if (!req.file) {
            return res.json(response.JsonMsg(false, null, "No file uploaded", 400));
        }

        // Read Excel file
        const workbook = XLSX.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Convert to JSON
        const rows = XLSX.utils.sheet_to_json(sheet);

        if (!rows.length) {
            return res.json(response.JsonMsg(false, null, "Empty file", 400));
        }

        // Store rows in MongoDB
        const formattedRows = rows.map((row) => ({
            data: row,
        }));

        await ExcelRow.insertMany(formattedRows);

        return res.json(
            response.JsonMsg(true, { totalRows: rows.length }, "Data stored successfully", 200)
        );
    } catch (err) {
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

