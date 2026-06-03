import mongoose, { mongo } from "mongoose";
import bcrypt from "bcryptjs";

const userShema = new mongoose.Schema({
    email :{
        type : String,
        required : [true , "email is requirde "],
        trim : true ,
        lowercase : true ,
        match : [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ , "invalid email adress"],
        unique : [true , "email already exist"]
    },
    name : {
        type : String ,
        required : [true , "name is requirde"]
    },

    password :{
        type : String,
        required :[true , "password requires"],
        minlength : [6 , "password should contain more then 6 carecter "],
        select : false
    }
    
},{
    timestamps : true
}) 

// convert pass in hash and save in  dataabase 
userShema.pre("save" , async function(next){
    if(!this.isModified("password")){
        return next()
    }
    const hash = await bcrypt.hash(this.password , 10)
    this.password = hash
})

// compare hash pass from db and orginal  req body pass
userShema.methods.comparePassword = async function (password){
    return await bcrypt.compare(password, this.password)
}

const userModel = mongoose.model("user" , userShema)
export default userModel