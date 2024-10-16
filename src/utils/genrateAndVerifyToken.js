import jwt from 'jsonwebtoken'


export const genrateToken=({payload,tokenKey=process.env.TOKEN_KEY}={})=>{
    return jwt.sign(payload,tokenKey)
}
export const verifyToken=({token,tokenKey=process.env.TOKEN_KEY}={})=>{
    return jwt.verify(token,tokenKey)
}