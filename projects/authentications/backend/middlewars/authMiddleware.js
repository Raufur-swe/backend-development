import jwt from "jsonwebtoken"
import { redisClient } from "../index.js";
import { json } from "zod/mini";
import { userModel } from "../models/User.model.js";

export const isAuth  = async(req , res , next)=>{
   
  try {
      // check access token
    const token = req.cookies.accessToken;

    if (!token) {
        res.status(403).json({
            message : "please login"
        })
    }

    // verify jwt data

    const decodeData = jwt.verify(token , process.env.JWT_SECRET);
    if (!decodeData) {
        return res.status(400).json({
            message : "token expired"
        })
    }

    //cache user data in redis

    const casheUser = await redisClient.get(`user:${decodeData}`)
    if(casheUser){
        req.user = JSON.parse(casheUser);
        return next()
    }

    //check login user

    const user = await userModel.findById(decodeData.id).select("-password");
    if (!user) {
        return res.status(400).json({
            message : "no such a user with this id"
        })
    }
    await redisClient.setEx(`user:${user._id}` , 3000 , JSON.stringify(user))
    req.user = user
    next()
  } catch (error) {
    res.status(500).json({
        message :"internal server error"
    })
  }
}