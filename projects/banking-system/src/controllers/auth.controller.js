import userModel from "../models/User.model.js"
import jwt from "jsonwebtoken"

const authController = {
    // signup
    async signup(req, res) {
        const { email, name, password } = req.body

        // search by emai
        const isExist = await userModel.findOne({
            email: email
        })
        if (isExist) {
            return res.status(422).json({
                message: "email already exists",
                status: "failed"
            })
        }
        // creating user
        const user = await userModel.create({
            email,
            name,
            password
        })
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "3d" })

        res.cookie("token", token)

        res.status(201).json({
            user: {
                _id: user._id,
                email: user.email,
                name: user.name
            },
            token
        })
    },

    //  login
    async login(req, res) {
        const { email, password } = req.body

        //check email exit
        const user = await userModel.findOne({ email }).select("+password") // in user model pass select is false
        if (!user) {
            return res.status(401).json({
                message: "invalid credentials"
            })
        }

        // check pass
        const isValidPassword = await user.comparePassword(password)
        if (!isValidPassword) {
            return res.status(401).json({
                message: "invalid credentials"
            })
        }

        //token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "3d" })
        res.cookie("token", token)
        res.status(200).json({ // 200 for login
            user: {
                _id: user._id,
                email: user.email,
                name: user.name
            },
            token
        })
    }
}



export default authController