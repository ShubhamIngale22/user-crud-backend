const userController = require('../controllers/user.controller');

module.exports = (app, express) => {
    let api = express.Router();


    api.post('/addUser', (req, res) => {
        userController.addUser(req, res);
    });

    api.get('/allUser', (req, res) => {
        userController.allUser(req, res);
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

    return api;


}
