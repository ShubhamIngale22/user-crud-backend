const response = require('../utilities/api_handler');
const error = require('../helpers/messages');
const userService = require('../services/users');
const bcrypt = require("bcrypt");

module.exports = {
    addUser: (req, res) => {

        if (!req.body || !req.body.name || !req.body.email || !req.body.phone || !req.body.password) {
            return res.json(response.JsonMsg(false, null, error.EMPTY_STRING, 404));
        }
        const {name, email, phone, password} = req.body;

        return userService.getUser({$or:[{email: email}, {phone:phone}]}).then((userData) => {
            if (userData) {
                let msg = userData.email === email
                    ? error.EMAIL_EXISTS
                    : error.PHONE_EXISTS;

                return Promise.reject({ key: 'msg', msg });
            }
        }).then(() => {
            let data = {
                name: name,
                email: email,
                phone: phone,
                password: password
            }


            return userService.addUser(data).then((result) => {
                if (result) {
                    return res.json(response.JsonMsg(true, result, 'User added successfully!', 200));
                } else {
                    return Promise.reject({key: 'msg', msg: 'Unable to add user!'});
                }
            }).catch((err) => {
                return Promise.reject(err);
            });
        }).catch((err) => {
            if (err && err.key === 'msg') {
                return res.json(response.JsonMsg(false, null, err.msg, 404));
            } else {
                return res.json(response.JsonMsg(false, null, err.message, 404));
            }
        });
    },

    allUser: (req, res) => {

        return userService.allUser({})
            .then((userData) => {
                if (userData && userData.length>0) {
                    return res.json(response.JsonMsg(true, userData, 'Users fetched successfully!', 200));
                }
                return Promise.reject({ key: 'msg', msg: 'No user added' });
            })
            .catch((err) => {
                if (err && err.key === 'msg') {
                    return res.json(response.JsonMsg(false, null, err.msg, 404));
                }
                return res.json(response.JsonMsg(false, null, err.message, 404));
            });
    },

    getUser: (req, res) => {

        if (!req.params || !req.params.id) {
            return res.json(response.JsonMsg(false, null, error.EMPTY_STRING, 404));
        }

        return userService.getUser({ _id: req.params.id })
            .then((userData) => {
                if (!userData) {
                    return Promise.reject({ key: 'msg', msg: 'User not found!' });
                }
                return res.json(response.JsonMsg(true, userData, 'User fetched successfully!', 200));
            })
            .catch((err) => {
                if (err && err.key === 'msg') {
                    return res.json(response.JsonMsg(false, null, err.msg, 404));
                }
                return res.json(response.JsonMsg(false, null, err.message, 404));
            });
    },


    updateUser: (req, res) => {

        if (!req.params || !req.params.id || !req.body) {
            return res.json(response.JsonMsg(false, null, error.EMPTY_STRING, 404));
        }

        const userId = req.params.id;

        return userService.getUser({ _id: userId }).then((userData) => {
            if (!userData) {
                return Promise.reject({ key: 'msg', msg: 'User not found!' });
            }
        }).then(() => {
            let query = { _id: userId }
            let update = {$set: {
                name: req.body.name,
                role: req.body.role,
            }}
            return userService.updateUser(query, update).then((updatedUser) => {
                console.log(updatedUser)
                if (updatedUser) {
                    return res.json(response.JsonMsg(true, updatedUser, 'User updated successfully!', 200));
                } else {
                    return Promise.reject({ key: 'msg', msg: 'Unable to update data.' });
                }
            }).catch((err) => {
                return Promise.reject(err);
            });
        }).catch((err) => {
            if (err && err.key === 'msg') {
                return res.json(response.JsonMsg(false, null, err.msg, 404));
            }
            return res.json(response.JsonMsg(false, null, err.message, 404));
        });
    },


    deleteUser: (req, res) => {

        if (!req.params || !req.params.id) {
            return res.json(response.JsonMsg(false, null, error.EMPTY_STRING, 404));
        }

        const userId = req.params.id;

        return userService.getUser({ _id: userId }).then((userData) => {
            if (!userData) {
                return Promise.reject({ key: 'msg', msg: 'User not found!' });
            }
        }).then(() => {
            let query = { _id: userId }
            return userService.deleteUser(query).then((deleteUser) => {
                console.log(deleteUser)
                if (deleteUser) {
                    return res.json(response.JsonMsg(true, deleteUser, 'User deleted successfully!', 200));
                } else {
                    return Promise.reject({ key: 'msg', msg: 'Unable to delete data.' });
                }
            }).catch((err) => {
                return Promise.reject(err);
            });
        }).catch((err) => {
            if (err && err.key === 'msg') {
                return res.json(response.JsonMsg(false, null, err.msg, 404));
            }
            return res.json(response.JsonMsg(false, null, err.message, 404));
        });
    },


    loginUser: (req, res) => {

        if (!req.body || (!req.body.email && !req.body.phone) || !req.body.password) {
            return res.json(response.JsonMsg(false, null, error.EMPTY_STRING, 404));
        }
        const {email, phone, password} = req.body;
        return userService.getUser({$or:[email ? { email:email }: null ,phone ? {phone:phone}: null].filter(Boolean)})
            .then((userData) => {
                if (!userData) {
                    return Promise.reject({ key: 'msg', msg: 'User not found!' });
                }
                return bcrypt.compare(password,userData.password)
                    .then((isMatch) =>{
                        if(!isMatch){
                            return Promise.reject({ key: 'msg', msg: 'Invalid password!' });
                        }
                        userData = userData.toObject();
                        delete userData.password;
                        return res.json(response.JsonMsg(true,userData,'login successful',200));
                    })

            })
            .catch((err) => {
                if (err && err.key === 'msg') {
                    return res.json(response.JsonMsg(false, null, err.msg, 404));
                }
                return res.json(response.JsonMsg(false, null, err.message, 404));
            });
    }
}
