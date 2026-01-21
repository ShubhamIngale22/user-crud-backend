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
        'text/csv',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];

    if(allowedTypes.includes(file.mimetype)){
        cb(null,true)
    }else{
        cb(new Error("Only excel/csv files are allowed"),false);
    }
};

const upload=multer({storage,fileFilter});
module.exports= upload;
