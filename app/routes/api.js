const userController = require('../controllers/user.controller');
const verifyOtpMiddleware = require('../middlewares/verifyOtpMiddleware');
const authMiddleware=require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');
const excelController = require("../controllers/excel.controller");
const dashboardController=require("../controllers/dashboard.controller");

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

    api.get('/topDealers/:uploadId',(req, res) => {
        excelController.top5Dealers(req, res);
    });

    api.get('/topZones/:uploadId',(req, res) => {
        excelController.top5Zones(req, res);
    });

    api.get('/topRegions/:uploadId',(req, res) => {
        excelController.top5Regions(req, res);
    });

    api.get('/installationTable',(req, res) => {
        dashboardController.dealerInstallationTable(req, res).then(()=>{});
    });

    api.get('/zone-installations',(req, res) => {
        dashboardController.zoneDealerInstallationsPie(req, res).then(()=>{});
    });

    api.get('/installations-Line-Chart',(req, res) => {
        dashboardController.DealerInstallationsLineChart(req, res).then(()=>{});
    });

    api.get('/top5regionsTable',(req, res) => {
        dashboardController.top5regionsTable(req, res).then(()=>{});
    });

    api.use(authMiddleware);

    api.get('/allUser', (req, res) => {
        userController.allUser(req, res).then(()=>{});
    });
    return api;
}
