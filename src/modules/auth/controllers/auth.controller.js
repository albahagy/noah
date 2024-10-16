import { nanoid } from "nanoid";
import { userModel } from "../../../../DB/models/user.model.js";
import { sendMail } from "../../../utils/email.js";
import { genrateToken, verifyToken } from "../../../utils/genrateAndVerifyToken.js";
import { comparePass, hashPass } from "../../../utils/hashAndCompare.js";
import fs from "fs";
import path from "path";
import { log } from "console";
import jwt from "jsonwebtoken";
export const signUp = async (req, res, next) => {
    try {
        const { name, email, mobileNumber, password } = req.body;
        req.body.password = hashPass({ password: req.body.password, salt: 8 })
        // Create the new channel
        await userModel.create({ name, email, mobileNumber, password: req.body.password })
        // Send the response
        res.status(201).json({ status: "true", message: 'SignUp successfully' })
    } catch (err) {
        // Handle duplicate key error
        if (err.code === 11000) {
            return next(new Error('Email or mobileNumber is alerady exist', { cause: 409 }));
        }
        // Handle other errors
        return next(err);
    }
}
export const login = async (req, res, next) => {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email, isDeleted: false })
    if (!user) {
        return next(new Error('wronge email or password', { cause: 409 }))
    }
    if (!comparePass({ password, hashPassword: user.password })) {
        return next(new Error('wronge email or password', { cause: 409 }))
    }
    await userModel.updateOne({ email: user.email }, { status: 'online' })
    const token = genrateToken({ payload: { _id: user._id } })
    res.status(200).json({ status: "true", message: 'Login successfully', token })
}

export const logOut = async (req, res, next) => {
    console.log(req.body);
    
    const { Authorization } = req.body
    if (!Authorization) {
        return next(new Error("please login hamada", { cause: 401 }))
    }
    if (!Authorization || !Authorization.toLowerCase().startsWith('bearer ')) {
        return next(new Error("invalid token", { cause: 401 }))
    }
    const realToken = Authorization.split(' ')[1]
    const payload = jwt.verify(realToken, process.env.TOKEN_KEY)
    const { _id } = payload;
    if (!_id) {
        return next(new Error("invalid paylod", { cause: 401 }))
    }
    const user = await userModel.findOne({ _id }).select('-password')
    if (!user) {
        return next(new Error("user not found", { cause: 401 }))
    }
    if (user.isDeleted) {
        return next(new Error("user is deleted", { cause: 401 }))
    }
    user.status = 'offline'
    await user.save()
    res.status(200).json({ status: "true", message: 'LogOut successfully' })
}

export const uplodeProfile = async (req, res, next) => {
    try {
        const { _id } = req.user
        if (!req?.file) {
            return next(new Error('Image is required', { cause: 409 }));
        }
        // Create the new Category
        const OpenImage = `${process.env.IMAGE_URI}${req?.file?.finalDest}`
        await userModel.updateOne({ _id }, { image: { OpenImage, DeleteImage: req?.file?.path } })
        // Send the response
        return res.status(200).json({ status: "true", message: 'Image uploaded successfully' });
    } catch (err) {

        if (req.file.path) {
            const imagePath = path.resolve(req.file.path); // Remove leading slash
            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.error('Error deleting image file:', err);
                    return res.status(500).json({ status: "false", message: 'Error deleting image file' });
                }
            });
        }
        // Handle other errors
        return next(err);
    }
}


export const updateProfileImage = async (req, res, next) => {
    const { _id, image } = req.user;
    console.log(req.file);
    if (!req?.file) {
        return next(new Error('Image is required', { cause: 409 }));
    }
    if (image?.DeleteImage) {
        const imagePath = path.resolve(image.DeleteImage); // Remove leading slash
        fs.unlink(imagePath, (err) => {
            if (err) {
                console.error('Error deleting image file:', err);
                return res.status(500).json({ status: "false", message: 'Error deleting image file' });
            }
        });
    }
    const OpenImage = `${process.env.IMAGE_URI}${req?.file?.finalDest}`
    await userModel.updateOne({ _id }, { image: { OpenImage, DeleteImage: req?.file?.path } })
    res.status(200).json({ status: "true", message: 'Image updated successfully' })
}


export const updateAccount = async (req, res, next) => {
    const { name } = req.body;
    await userModel.updateOne(
        { _id: req.user._id },
        { name }
    )
    res.status(200).json({ status: "true", message: 'Name updated successfully' })
}
export const updatePass = async (req, res, next) => {
    const { password, newPassword } = req.body
    if (password == newPassword) {
        return next(new Error('Old password and new password must be different'))
    }
    const userData = await userModel.findOne({ _id: req.user._id })
    if (!comparePass({ password: password, hashPassword: userData.password })) {
        return next(new Error('Password is not true'))
    }
    await userModel.updateOne({ _id: req.user._id }, { password: hashPass({ password: newPassword, salt: 8 }), status: "offline" })
    res.status(200).json({ status: "true", message: 'Password updated  successfully' })

}
export const getAccountdata = async (req, res, next) => {
    const userData = await userModel.findById(req.user._id).select('-password -isDeleted -createdAt -updatedAt -__v')
    res.status(200).json({ status: "true", data: userData })
}
export const getUsers = async (req, res, next) => {
    const usersData = await userModel.find({ isDeleted: false , email: { $ne: 'admin@gmail.com' }}).select('-password -isDeleted -createdAt -updatedAt -__v')
    res.status(200).json({ status: "true", data: usersData })
}
export const getAnotherAccountdata = async (req, res, next) => {
    const { _id } = req.params
    const user = await userModel.findOne({ isDeleted: false, _id }).select('name email mobileNumber')
    if (!user) {
        return next(new Error('User not found', { cause: 409 }))
    }
    res.status(200).json({ status: "true", data: user })
}
export const updateAccountUser = async (req, res, next) => {
    const { name, _id } = req.body;
    const user = await userModel.findOneAndUpdate(
        { _id, isDeleted: false },
        { name }
    )
    if (!user) {
        return next(new Error('User not found', { cause: 404 }))
    }
    res.status(200).json({ status: "true", message: 'Name updated successfully' })
}
export const updatePassUser = async (req, res, next) => {
    const { password, _id } = req.body
    const user = await userModel.findOneAndUpdate({ _id, isDeleted: false }, { password: hashPass({ password: password, salt: 8 }), status: "offline" })
    if (!user) {
        return next(new Error('User not found', { cause: 404 }))
    }
    res.status(200).json({ status: "true", message: 'Password updated successfully' })
}
export const deleteAccount = async (req, res, next) => {
    const { _id } = req.body
    const user = await userModel.findOneAndUpdate({ _id, isDeleted: false }, { isDeleted: true, status: "offline" })
    if (!user) {
        return next(new Error('User not found', { cause: 404 }))
    }
    res.status(200).json({ status: "true", message: 'User deleted successfully' })
}

// export const sendCodeForForgetPass = async (req, res, next) => {
//     const { email } = req.body;
//     const user = await userModel.findOne({ email, isDeleted: false })
//     if (!user) {
//         return next(new Error('email is not found', { cause: 404 }));
//     }
//     if (!user.confirmEmail) {
//         return next(new Error('confirm your email', { cause: 404 }));
//     }

//     const code = nanoid()
//     sendMail({ to: email, subject: "forget password", html: `<h1>code : ${code}</h1>` })
//     await userModel.updateOne({ email }, { code })
//     res.status(200).json({ message: 'cheack your email' })
// }

// export const ForgetPass = async (req, res, next) => {
//     const { email, code } = req.body;
//     const user = await userModel.findOne({ email, isDeleted: false })
//     if (!user) {
//         return next(new Error('email is not found', { cause: 404 }));
//     }
//     if (user.code != code || code == null) {
//         return next(new Error('wronge code', { cause: 404 }));
//     }
//     req.body.password = hashPass({ password: req.body.password, salt: 8 })
//     await userModel.updateOne({ email }, { password: req.body.password, status: "offLine", code: null })
//     res.status(200).json({ message: 'done' })
// }

// export const getAccountsforRecoveryMail = async (req, res, next) => {
//     const users = await userModel
//         .find({ recoveryEmail: req.body.recoveryEmail, isDeleted: false })
//         .select('userName email recoveryEmail mobileNumber DOB gender')
//     res.status(200).json({ message: 'done', users })
// }




