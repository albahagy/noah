import jwt from "jsonwebtoken";
import { userModel } from "../../DB/models/user.model.js";
import { Types } from "mongoose";

export const auth = () => {
    return async (req, res, next) => {
        const { authorization } = req.headers
        if (!authorization) {
            return next(new Error("please login", { cause: 401 }))
        }
        if (!authorization || !authorization.toLowerCase().startsWith('bearer ')) {
            return next(new Error("invalid token", { cause: 401 }))
        }

        const realToken = authorization.split(' ')[1]

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
        if (user.status == 'offline') {
            return next(new Error("please login again", { cause: 401 }))
        }
        req.user = user;
        next()
    }
}