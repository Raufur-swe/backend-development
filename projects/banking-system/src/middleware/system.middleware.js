import jwt from "jsonwebtoken"
import userModel from "../models/User.model.js"

const systemMiddleware = async (req, res, next) => {
    const token = req.cookies?.token || req.headers?.authorization?.split(" ")[1] // first check token from cookies and headers
    
    //if token missiing
    if (!token) {
        return res.status(401).json({
            message : "Unauthorize access"
        })
    }
    // if got any token
    try {
        const decode = jwt.verify(token , process.env.JWT_SECRET) // verify the token
        
        const user = await userModel.findById(decode.userId).select("+systemUser") // find the user from db based on token
        if(!user.systemUser){ // check if the user is system user or not
            return res.status(403).json({
                message : "Forbidden access"
            })
        }
        req.user = user ; // set the user
        return next()
    } catch (err) {
        return res.status(401).json({
            message : "Unauthorize access"
        })
    }
}
export default systemMiddleware