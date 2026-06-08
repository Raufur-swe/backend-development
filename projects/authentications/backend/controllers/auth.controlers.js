import { codec } from "zod"
import { registrationSchema } from "../config/zod.js"
import TryCatch from "../middlewars/TryCatch.middleware.js"
import sanitize from "mongo-sanitize"

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
        message:  "Invalid credentials",
        errors
    });
}

        const { name, email, password } = validation.data
        res.json({
            email,
            name,
            password
        })

    })
}

export default authController