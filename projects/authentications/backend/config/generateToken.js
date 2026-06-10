import jwt from "jsonwebtoken"
import { redisClient } from "../index.js"

export const genarateToken = async(id , res)=>{

    //access token
    const accessToken = jwt.sign({id} , process.env.JWT_SECRET,{
        expiresIn : "1m"    
    })

    // refresh token
    const refreshToken = jwt.sign({id},process.env.REFRESH_TOKEN,{
        expiresIn : "7d"
    })

    const refreshTokenKey = `refresh_token : ${id}`

    await redisClient.setEx(refreshTokenKey , 7*24*60*60 , refreshToken);

//set access token in cookie
    res.cookie("accessToken" , accessToken,{
        httpOnly : true, // access cookie only from backend
        // secure : true, // works only https
         sameSite : "strict", // prevent csrf attack
         maxAge : 1*60*1000
    })

//set refresh token in cookie
    res.cookie("refreshToken" , refreshToken,{
         maxAge : 7 * 24 * 60 * 60 * 1000,
         httpOnly : true,
          sameSite : "none",
           // secure : true, // works only https
    })
    return(accessToken , refreshToken)
}