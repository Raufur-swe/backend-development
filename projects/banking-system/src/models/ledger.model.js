import mongoose from "mongoose";

// ledger model is used to store the information of a transaction that has occurred between two accounts. it is used to link the ledger entries of the from and to accounts. it also stores the status of the transaction and the ammount of the transaction. it is a reference for the user to know their transaction history and status.

// all fields must be immutable because ledger entry should not be changed once created. it is a record of a transaction that has already occurred and should not be altered in any way. if there is any change in the ledger entry it can lead to inconsistencies in the financial records and can cause confusion for auditors and other stakeholders.

const ledgerSchema = new mongoose.Schema({
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
        required: [true, "ledger must asssociated with an account"],
        index: true,
        immutable: true // once a ledger entry is created it cannot be changed

    },
    amount: {
        type: Number,
        required: [true, "Amount is required"],
        immutable: true
    },
    transaction: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "transaction",
        required: [true, "ledger must asssociated with an transection"],
        index: true,
        immutable: true // once a ledger entry is created it cannot be changed
    },
    type :{
        type : String,
        enum:{
            values : ["debit" ,"credit"],
            message : "type can be either credit or debit",
        },
        required : [true , "ledger type is required"],
        immutable : true,
    }
})

// once this model created it can naver be modified because it is a record of a transaction that has already occurred and should not be altered in any way. if there is any change in the ledger entry it can lead to inconsistencies in the financial records and can cause confusion for auditors and other stakeholders. so we are using pre hooks to prevent any update or delete operation on this model.
function preventLedgerModel(){
    throw new Error("Ledger entries are immutable and can not be  modified")
}
ledgerSchema.pre("findOneAndUpdate" , preventLedgerModel)
ledgerSchema.pre("findOneAndDelete" , preventLedgerModel)
ledgerSchema.pre("deleteOne" , preventLedgerModel)
ledgerSchema.pre("remove" , preventLedgerModel)
ledgerSchema.pre("deleteMany" , preventLedgerModel)
ledgerSchema.pre("findOneAndReplace" , preventLedgerModel)
ledgerSchema.pre("updateMany" , preventLedgerModel)
ledgerSchema.pre("updateOne" , preventLedgerModel)

const ledgerModel = mongoose.model("ledger" , ledgerSchema);
export default ledgerModel
