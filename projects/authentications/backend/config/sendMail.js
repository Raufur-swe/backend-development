import { createTransport } from "nodemailer"

const sendMail = async({email , subject , html})=>{
    const transport = createTransport({
        host : "smtp.gmail.com",
        port : 465 ,
        auth:{
            user : "abc",
            pass : "abc",
        }
    })
    await transport.sendMail({
        from : "abc",
        to : email,
        subject ,
        html,
    })
}

export default sendMail