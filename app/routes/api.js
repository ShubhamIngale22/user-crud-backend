const userController = require('../controllers/user.controller');
const verifyOtpMiddleware = require('../middlewares/verifyOtpMiddleware');
const authMiddleware=require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');
const excelController = require("../controllers/excel.controller");

module.exports = (app, express) => {
    let api = express.Router();

    api.post('/addUser', (req, res) => {
        userController.addUser(req, res);
    });

    api.get('/getUser/:id', (req, res) => {
        userController.getUser(req, res);
    });

    api.put('/updateUser/:id', (req, res) => {
        userController.updateUser(req, res);
    });

    api.delete('/deleteUser/:id', (req, res) => {
        userController.deleteUser(req, res);
    });

    api.post('/loginUser', (req, res) => {
        userController.loginUser(req, res);
    });

    api.post('/forgotPassword', (req, res) => {
        userController.forgotPassword(req, res);
    });

    api.post('/verifyOtp', (req, res) => {
        userController.verifyOtp(req, res);
    });

    api.post('/resetPassword',verifyOtpMiddleware, (req, res) => {
        userController.resetPassword(req, res);
    });

    api.post('/uploadExcel', upload.single('file'), (req, res) => {
        excelController.uploadExcel(req, res).then(()=>{});
    });

    api.get('/excel/uploads',(req, res) => {
        excelController.getUploads(req, res).then(()=>{});
    });

    api.get('/excel/data/:uploadId',(req, res) => {
        excelController.getRowsByUploadId(req, res).then(()=>{});
    });

    // api.get("/excel/uploads", excelController.getUploads);
    // api.get("/excel/data/:uploadId", excelController.getRowsByUploadId);


    // api.get('/displayExcel' ,(req, res) => {
    //     excelController.getExcelData(req, res);
    // });
    // api.get("/displayExcel", excelController.getExcelData);

    api.use(authMiddleware);

    api.get('/allUser', (req, res) => {
        userController.allUser(req, res).then(()=>{});
    });

    return api;
}
