const { body } = require("express-validator");
const MSG = require("./messages");
const User = require("../models/User");

exports.createUserValidator = [
    body("name")
        .notEmpty().withMessage(MSG.NAME_REQUIRED)
        .isLength({ min: 3 }).withMessage(MSG.NAME_MIN_LENGTH),

    body("email")
        .notEmpty().withMessage(MSG.EMAIL_REQUIRED)
        .isEmail().withMessage(MSG.EMAIL_INVALID)
        .custom(async (email) => {
            const user = await User.findOne({ email });
            if (user) {
                throw new Error(MSG.EMAIL_EXISTS);
            }
            return true;
        }),

    body("phone")
        .notEmpty().withMessage(MSG.PHONE_REQUIRED)
        .isLength({ min: 10, max: 10 }).withMessage(MSG.PHONE_INVALID)
        .custom(async (phone) => {
            const user = await User.findOne({ phone });
            if (user) {
                throw new Error(MSG.PHONE_EXISTS);
            }
            return true;
        }),

    body("password")
        .notEmpty().withMessage(MSG.PASSWORD_REQUIRED)
        .isLength({ min: 6 }).withMessage(MSG.PASSWORD_MIN_LENGTH),
];
