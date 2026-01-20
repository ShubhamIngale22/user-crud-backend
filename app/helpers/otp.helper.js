const bcrypt = require("bcrypt");

module.exports.generateOtp =() => {
    return Math.floor(100000 + Math.random()*900000).toString();
};

// module.exports.getOtpExpiry =() => {
//     return Date.now() + 10 * 60 * 1000 ;
// };


module.exports.hashOtp = async (otp) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(otp, salt);
};

module.exports.compareOtp = async (enteredOtp, hashedOtp) => {
    return await bcrypt.compare(enteredOtp, hashedOtp);
};
