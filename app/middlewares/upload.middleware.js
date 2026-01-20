const multer = require('multer');
const dateHelper=require('../helpers/date.helper')

const path = require('path');

const storage=multer.diskStorage({
        destination:(req,file,cb)=> {
            cb(null, 'uploads/');
        },
        filename: (req,file,cb)=> {
            const timeStamp=dateHelper.nowIST().format('DD-MM-YYYY_hh-mm-ss');
            cb(null,`${timeStamp}${path.extname(file.originalname)}`);
            // cb(null,Date.now()+path.extname(file.originalname));
        }
});

const fileFilter=(req,file,cb)=>{
    const allowedTypes = [
        'application/vnd.ms-excel',                                     // .xls
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' // .xlsx
    ];

    if(allowedTypes.includes(file.mimetype)){
        cb(null,true)
    }else{
        cb(new Error("Only excel files are allowed"),false);
    }
};

const upload=multer({storage,fileFilter})
module.exports=upload;
