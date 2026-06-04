import mongoose from "mongoose"

// account model is the main model of the banking system. it is used to store the information of the user and their account status. it is also used to link the user with their transactions and ledger entries. it is a reference for the user to know their account status and transactions.
const accountSchema = new mongoose.Schema({
    user :{
        type : mongoose.Schema.Types.ObjectId,
        ref : "user", // user model ref beacause account must be for a user,
        require : [true , "Account must be associated with a user"],
        index : true // for fast searching a user by id
    },
    status :{
        type : String,
        enum :{
            values : ["ACTIVE" , "FROSED", "CLOSED"],
            message : "Status can be eitiher ACTIVE , FROSED, CLOSED",
        },
        default : "ACTIVE"
    },
    currency :{
        type : String,
        require : [true , "Currency is required for creating an account"],
        default : "TK"
    }
},{
    timestamps : true
})

accountSchema.index({user : 1 , status : 1}) // for fast searching a user by id and status

const accountModel = mongoose.model("account" , accountSchema)
export default accountModel