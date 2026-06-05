import mongoose from "mongoose"
import ledgerModel from './ledger.model.js'

// account model is the main model of the banking system. it is used to store the information of the user and their account status. it is also used to link the user with their transactions and ledger entries. it is a reference for the user to know their account status and transactions.
const accountSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user", // user model ref beacause account must be for a user,
        require: [true, "Account must be associated with a user"],
        index: true // for fast searching a user by id
    },
    status: {
        type: String,
        enum: {
            values: ["ACTIVE", "FROSED", "CLOSED"],
            message: "Status can be eitiher ACTIVE , FROSED, CLOSED",
        },
        default: "ACTIVE"
    },
    currency: {
        type: String,
        require: [true, "Currency is required for creating an account"],
        default: "TK"
    }
}, {
    timestamps: true
})

accountSchema.index({ user: 1, status: 1 }) // for fast searching a user by id and status


// get balance of the account by aggregating the ledger entries of the account. it is a virtual field that is not stored in the database but calculated on the fly when requested. it is used to show the current balance of the account to the user. it is also used to check if the account has sufficient balance for a transaction.
accountSchema.methods.getBalance = async function () {
    const balanceData = await ledgerModel.aggregate([
        { $match: { account: this._id } },
        {
            $group: {
                _id: null,
                totalDebit: {
                    $sum: {
                        $cond: [
                            { $eq: ["$type", "debit"] },
                            "$amount",
                            0
                        ]
                    }
                },
                totalCredit: {
                    $sum: {
                        $cond: [
                            { $eq: ["$type", "credit"] },
                            "$amount",
                            0
                        ]
                    }
                }
            }
        },
        { $project: {
            _id: 0,
            balance: { $subtract: ["$totalCredit", "$totalDebit"] }
        } }
    ])
    if(balanceData.length === 0) {
        return 0
    }
    return balanceData[0].balance
}

const accountModel = mongoose.model("account", accountSchema)
export default accountModel