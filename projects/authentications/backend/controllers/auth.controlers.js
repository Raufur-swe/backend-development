import { codec, json } from "zod"
import { loginSchema, registrationSchema } from "../config/zod.js"
import TryCatch from "../middlewars/TryCatch.middleware.js"
import sanitize from "mongo-sanitize"
import { redisClient } from "../index.js"
import mongoose from "mongoose"
import { userModel } from "../models/User.model.js"
import bcrypt from "bcrypt"
import crypto from "crypto"
import sendMail from "../config/sendMail.js"
import { getOtpHtml, getVerifyEmailHtml } from "../config/html.js"

const authController = {

    // signup 
    register: TryCatch(async (req, res) => {
        // make a senirized body
        const sanitizedBody = sanitize(req.body)

        //creat valoidations
        const validation = registrationSchema.safeParse(sanitizedBody)

        // since we have email , pass and name in regiterschema we donot need this line cont{} = req.boy

        if (!validation.success) {
            const errors = validation.error.issues.map((issue) => ({
                field: issue.path.join(".") || "unknown",
                message: issue.message,
                code: issue.code
            }));

            return res.status(400).json({
                message: "Invalid credentials",
                errors
            });
        }


        const { name, email, password } = validation.data

        //impliments rate limits
        const rateLlimitKey = `register-rate-limit:${req.ip}:${email}`
        if (await redisClient.get(rateLlimitKey)) {
            return res.status(429).json({
                message: "Too many request , try again later"
            })
        }

        // find existing email
        const existUser = await userModel.findOne({ email })
        if (existUser) {
            return res.status(400).json({
                message: "email already exists"
            })
        }

        //hash password
        const hashPassword = await bcrypt.hash(password, 10)

        //create a verify token

        const verifyToken = crypto.randomBytes(32).toString("hex")

        const verifyKey = `verify${verifyToken}`

        const dataStore = JSON.stringify({
            name,
            email,
            password: hashPassword,
        })

        // send data and key to raddis for just 3min
        await redisClient.set(verifyKey, dataStore, { EX: 300 });

        // sending email

        const subject = "Verify your email"
        const html = getVerifyEmailHtml({ email, token: verifyToken })

        await sendMail({ email, subject, html })

        await redisClient.set(rateLlimitKey, "true", { EX: 60 })

        res.json({
            message: "A verification link hasbeen send to your email , it will expire in 5 min"

        })

    }),

    // verifyUser
    verifyUSer: TryCatch(async (req, res) => {

        //recive token from url
        const { token } = req.params;

        if (!token) {
            return res.status(400).json({
                message: "verification token required"
            })
        }

        // verify token
        const verifyKey = `verify${token}`

        // check link is expired or not
        const userDataJson = await redisClient.get(verifyKey);

        if (!userDataJson) {
            return res.status(400).json({
                message: "verification Link expireds"
            })
        }



        // parse the user json data

        const userData = JSON.parse(userDataJson)


        // find existing email
        const existUser = await userModel.findOne({ email: userData.email })
        if (existUser) {
            return res.status(400).json({
                message: "email already exists"
            })
        }

        // const newUser

        const newUser = await userModel.create({
            name: userData.name,
            email: userData.email,
            password: userData.password
        })

        // del the verifi link after registration
        await redisClient.del(verifyKey)

        console.log(newUser)

        return res.status(201).json({
            message: "registration successful",
            user: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email
            }
        })

    }),

    //loginUser by otp

    loginUser: TryCatch(async(req, res) => {
        // make a senirized body
        const sanitizedBody = sanitize(req.body)

        //creat valoidations
        const validation = loginSchema.safeParse(sanitizedBody)

        // since we have email , pass and name in regiterschema we donot need this line cont{} = req.boy

        if (!validation.success) {
            const errors = validation.error.issues.map((issue) => ({
                field: issue.path.join(".") || "unknown",
                message: issue.message,
                code: issue.code
            }));

            return res.status(400).json({
                message: "Invalid credentials",
                
            });
        }
        const { email, password } = validation.data


        // seting ret limit
        const rateLlimitKey = `register-rate-limit:${req.ip}:${email}`
        if (await redisClient.get(rateLlimitKey)) {
            return res.status(429).json({
                message: "Too many request , try again later"
            })
        }
        

        // check email
        const user = await userModel.findOne({ email })

        if (!user) {
            return res.status(401).json({
                message: "Invalid cradentials"
            })
        }
        //check passs
        const comparePassword = await bcrypt.compare(password, user.password)
        if (!comparePassword) {
            return res.status(401).json({
                message: "Invalid cradentials"
            })
        }


        //create otp

        const otp = Math.floor(100000 + Math.random()*900000).toString()

        const otpKey = `otp:${email}`;

        await redisClient.set(otpKey , JSON.stringify(otp),{
            EX : 300
        })

        //sending mail
        const subject = "OTP verificaton"
        const html = getOtpHtml({email , otp : otp})
        await sendMail({email , subject ,html})
        
        
        await redisClient.set(rateLlimitKey , "true" ,{EX:60})


        
        res.json({
            message: "A OTP  send to your email , it will expire in 5 min"

        })

    }),

    // verify otp

    verifyOtp : TryCatch(async(req , res)=>{
        const {email , otp} = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                message : "Provide all details"
            })
        }

        const otpKey = `otp : ${email}`

        const storedOtpString = await redisClient.get(otpKey);

        if (!storedOtpString) {
            return res.status(400).json({
                message : "otp experied",
            })
        }

        const storedOtp = JSON.parse(storedOtpString)

        if(storedOtp !== otp){
             return res.status(400).json({
                message : "invalid otp",
            })
        }

        await redisClient.del(otpKey);

        let user = await userModel.findOne({email})
    })
}

export default authController