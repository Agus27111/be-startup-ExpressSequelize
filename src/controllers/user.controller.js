const userModel = require("../models/user.model");
const sequelize = require("../utils/db.connection");
const { signinValidation, signupValidation } = require("../middleware/joi");
const { Op } = require("sequelize");
const { encrypt, compare } = require("../middleware/bcrypt");
const { generateAccessToken, generateRefreshToken } = require("../middleware/jwt");
const { sendMail } = require("../middleware/mail");

const createUser = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const { name, email, password, role } = req.body;

        const { error: signupError } = signupValidation.validate(req.body);
        if (signupError) {
            signupError.isJoi = true;
            return next(signupError);
        }

        const isExists = await userModel.findOne({ where: { email } });
        if (isExists) {
            return res.status(400).json({
                errors: ["Email already exists"],
            });
        }

        const hashPassword = await encrypt(password);
        const user = await userModel.create({
            name,
            email,
            password: hashPassword,
            role,
            expireTime: new Date(),
        }, { transaction: t });

        const result = await sendMail(user.email, user.userId);
        if (!result) {
            await t.rollback();
            return res.status(500).json({
                errors: ["Send email failed"],
                message: "Register Failed",
                data: null,
            });
        } else {
            await t.commit();
            return res.status(201).json({
                message: "User created successfully",
                data: user,
            });
        }
    } catch (error) {
        await t.rollback();
        next(new Error("controllers/userController.js:createUser - " + error.message));
    }
}

const setActivateUser = async (req, res, next) => {
    try {
        const user_id = req.params.id;
        const user = await userModel.findOne({
            where: {
                userId: user_id,
                isActive: false,
                expireTime: {
                    [Op.gte]: new Date(),
                },
            },
        });
        if (!user) {
            return res.status(404).json({
                errors: ["User not found or expired"],
                message: "Activate User Failed",
                data: null,
            });
        } else {
            user.isActive = true;
            user.expireTime = null;
            await user.save();
            return res.status(200).json({
                errors: [],
                message: "User activated successfully",
                data: {
                    name: user.name,
                    email: user.email,
                },
            });
        }
    } catch (error) {
        next(new Error("controllers/userController.js:setActivateUser - " + error.message));
    }
}

const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const { error: signinError } = signinValidation.validate(req.body);
        if (signinError) {
            signinError.isJoi = true;
            return next(signinError);
        }

        const user = await userModel.findOne({
            where: { email, isActive: true },
        });

        if (!user) throw new Error("User not found");

        const isMatch = await compare(password, user.password);
        if (!isMatch) throw new Error("Invalid password");

        const token = generateAccessToken({
            name: user.name,
            email: user.email,
            role: user.role,
        });

        const refreshToken = generateRefreshToken({
            name: user.name,
            email: user.email,
            role: user.role,
        });

        return res.status(200).json({
            errors: [],
            message: "Login successful",
            data: {
                token,
                refreshToken,
            },
        });
    } catch (error) {
        next(new Error("controllers/userController.js:loginUser - " + error.message));
    }
}

module.exports = {
    createUser,
    setActivateUser,
    loginUser
}
