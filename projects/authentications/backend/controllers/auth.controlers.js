import TryCatch from "../middlewars/TryCatch.middleware.js"
import sanitize from "mongo-sanitize"

const authController ={

    // signup 
   register : TryCatch(async(req ,res)=>{
    const {email , name ,password} = sanitize(req.body)
    res.json({
        email,
        name,
        password
    })
   })
}

export default authController