const userService=require('../services/users');
const response=require('../utilities/api_handler')
const error = require("../helpers/messages");

module.exports=(req,res,next)=>{
    let {emailOrPhone} = req.body;
    if(!emailOrPhone){
        return res.json(response.JsonMsg(false,null,error.EMPTY_STRING,400));
    }
    let query={$or:[{email:emailOrPhone},{phone:emailOrPhone}]};

    return userService.getUser(query)
        .then((userData)=>{
            if(!userData){
                return res.json(response.JsonMsg(false,null,'user not found',404));
            }
            if(!userData.isOtpVerified){
                return res.json(response.JsonMsg(false,null,'OTP is not verified',400));
            }

            req.user=userData;
            return next();
        })
        .catch((err)=>{
            return res.json(response.JsonMsg(false,null,'err.message',400));
        });
};
