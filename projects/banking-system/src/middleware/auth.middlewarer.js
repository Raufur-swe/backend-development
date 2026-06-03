// creating a middle ware for check valided user before creating a account

import jwt from "jsonwebtoken"
import userModel from "../models/User.model.js"

const authMiddleware = async (req ,res ,next)=>{
    const token = req.cookies.token || req.headers?.authorization.split(" ")[ 1 ] // first check token from cookies and headers
    
    //if token missiing
    if (!token) {
        return res.status(401).json({
            message : "Unauthorize access"
        })
    }
    // if got any token
    try {
        const decode = jwt.verify(token , process.env.JWT_SECRET) // verify the token
        
        const user = await userModel.findById(decode.userId) // find the user from db based on token
        req.user = user ; // set the user
        return next()
    } catch (err) {
        return res.status(401).json({
            message : "Unauthorize access"
        })
    }
}

export default authMiddleware