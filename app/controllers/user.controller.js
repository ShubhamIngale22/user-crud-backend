const response = require('../utilities/api_handler');
const error = require('../helpers/messages');
const userService = require('../services/users');
const bcrypt = require("bcrypt");
const otpHelper = require('../helpers/otp.helper');
const dateHelper= require('../helpers/date.helper');
const jwtHelper = require('../helpers/jwt.helper');

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

        if (!req.body || !req.body.emailOrPhone || !req.body.password) {
            return res.json(response.JsonMsg(false, null, error.EMPTY_STRING, 404));
        }
        const {password, emailOrPhone} = req.body;
        let query= {$or: [{email: emailOrPhone}, {phone: emailOrPhone}]};
        return userService.getUser(query,true)
            .then((userData) => {
                if (!userData) {
                    return Promise.reject({ key: 'msg', msg: 'User not found!' });
                }
                return bcrypt.compare(password,userData.password)
                    .then((isMatch) =>{
                        if(!isMatch){
                            return Promise.reject({ key: 'msg', msg: 'Invalid password!' });
                        }
                        const token = jwtHelper.generateToken({
                            userId: userData._id,
                            email: userData.email,
                            role: userData.role
                        });
                        userData = userData.toObject();
                        delete userData.password;
                        return res.json(response.JsonMsg(true,{ user: userData, token: token },'login successful',200));
                    })

            })
            .catch((err) => {
                if (err && err.key === 'msg') {
                    return res.json(response.JsonMsg(false, null, err.msg, 401));
                }
                return res.json(response.JsonMsg(false, null, err.message, 400));
            });
    },


    forgotPassword: (req, res) => {

        if (!req.body || !req.body.emailOrPhone) {
            return res.json(response.JsonMsg(false, null, error.EMPTY_STRING, 400));
        }
        const {emailOrPhone} = req.body;
        let query ={$or:[{email:emailOrPhone},{phone:emailOrPhone}]};
        return userService.getUser(query)
            .then(async (userData) => {
                if (!userData) {
                    return Promise.reject({ key: 'msg', msg: 'User not found!' });
                }
                const otp = otpHelper.generateOtp();
                const expiry = dateHelper.addMinutes(10);
                const expiryTime=dateHelper.formatIST(expiry);

                const hashedOtp = await otpHelper.hashOtp(otp);

                let updateData = {
                    resetOtp: hashedOtp,
                    resetOtpExpire: expiry,
                    isOtpVerified: false
                };

                return userService.updateUserWithSave(query,updateData)
                    .then(()=>{
                        console.log("Reset Password OTP :",otp);
                        console.log("OTP expires at (IST):", dateHelper.formatIST(expiry));
                        return res.json(response.JsonMsg(true,{ otpExpiresAt: expiryTime },'OTP send successfully to your registered email/phone',200));

                    });
            })
            .catch((err) => {
                if (err && err.key === 'msg') {
                    return res.json(response.JsonMsg(false, null, err.msg, 404));
                }
                return res.json(response.JsonMsg(false, null, err.message, 400));
            });
    },

    verifyOtp: (req, res) => {

        if (!req.body || !req.body.emailOrPhone || !req.body.otp) {
            return res.json(response.JsonMsg(false, null, error.EMPTY_STRING, 400));
        }

        const { emailOrPhone, otp } = req.body;
        let query = { $or: [{ email: emailOrPhone }, { phone: emailOrPhone }] };

        return userService.getUser(query)
            .then(async (userData) => {

                if (!userData) {
                    return Promise.reject({ key: 'msg', msg: 'User not found!' });
                }

                if (!userData.resetOtp) {
                    return Promise.reject({ key: 'msg', msg: 'OTP not found!' });
                }

                const isMatch = await otpHelper.compareOtp(otp, userData.resetOtp);

                if (!isMatch) {
                    return Promise.reject({ key: 'msg', msg: 'Invalid OTP!' });
                }
                if (dateHelper.isExpired(userData.resetOtpExpire)) {
                    return Promise.reject({ key: 'msg', msg: 'OTP expired!' });
                }

                let updateData = {
                    isOtpVerified: true
                };

                return userService.updateUserWithSave(query, updateData)
                    .then(() => {
                        return res.json(response.JsonMsg(true, null, 'OTP verified successfully', 200));
                    });
            })
            .catch((err) => {
                if (err && err.key === 'msg') {
                    return res.json(response.JsonMsg(false, null, err.msg, 400));
                }
                return res.json(response.JsonMsg(false, null, err.message, 400));
            });
    },

    resetPassword: (req, res) => {

        if (!req.body || !req.body.newPassword || !req.body.confirmPassword) {
            return res.json(response.JsonMsg(false, null, error.EMPTY_STRING, 400));
        }
        const { newPassword, confirmPassword } = req.body;
        if (newPassword !== confirmPassword) {
            return res.json(response.JsonMsg(false, null, 'Confirm password is incorrect!', 400));
        }
        const userData = req.user;
        let updateData = {
            password: newPassword,
            resetOtp: null,
            resetOtpExpire: null,
            isOtpVerified: false
        };
        return userService.updateUserWithSave({ _id: userData._id }, updateData)
            .then((updatedUser) => {
                if (!updatedUser) {
                    return Promise.reject({ key: 'msg', msg: 'Unable to update password.' });
                }
                let userObj = updatedUser.toObject();
                delete userObj.password;
                return res.json(response.JsonMsg(true,userObj,'Password updated successfully!',200));
            })
            .catch((err) => {
                if (err && err.key === 'msg') {
                    return res.json(response.JsonMsg(false, null, err.msg, 400));
                }
                return res.json(response.JsonMsg(false, null, err.message, 400));
            });
        },
}
