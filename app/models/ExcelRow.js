const mongoose = require("mongoose");

const excelRowSchema = new mongoose.Schema(
    {
        uploadId: {
            type: String,
            required: true,
            index:true
        },
        data: {
            type: Object,
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("ExcelRow", excelRowSchema);
