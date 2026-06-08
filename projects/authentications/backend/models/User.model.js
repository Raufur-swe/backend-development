import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
  email : {
        type : String ,
        required :[true , "email is required"],
        match : [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ , "invalid email adress"],
        trim : true,
        unique : true,
        lowercase : true,
    },

    name:{
        type :String,
        required : true ,  
    },
    password :{
        type :String,
           required :[true , "password requires"],
        minlength : [6 , "password should contain more then 6 carecter "],
    }

} , {
    timestamps:true
})

export const userModel = mongoose.model("user" , userSchema)