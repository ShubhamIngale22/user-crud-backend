const mongoose=require("mongoose");

const excelUploadSchema = new mongoose.Schema(
    {
        uploadId:{
            type:String,
            required:true,
            unique:true
        },
        fileName:{
            type:String,
            required: true
        },
        totalRows:{
            type:Number,
            required:true
        },
    },
    {timestamps:true}
);

module.exports =mongoose.model("ExcelUpload",excelUploadSchema);
