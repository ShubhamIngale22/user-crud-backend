const mongoose = require("mongoose");

const excelRowSchema = new mongoose.Schema(
    {
        data: {
            type: Object,
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("ExcelRow", excelRowSchema);
