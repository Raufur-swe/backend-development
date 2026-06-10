import jwt from "jsonwebtoken"

export const genarateToken = async(id , res)=>{

    //access token
    const accessToken = jwt.sign({id} , process.env.JWT_SECRET,{
        expiresIn : "1m"    
    })

    // refresh token
    const refreshToken = jwt.sign({id},process.env.REFRESH_TOKEN,{
        expiresIn : "7d"
    })
}