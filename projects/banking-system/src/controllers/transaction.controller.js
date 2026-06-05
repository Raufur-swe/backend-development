import mongoose from "mongoose"
import accountModel from "../models/account.model.js"
import transactionModel from "../models/transaction.model.js"
import ledgerModel from "../models/ledger.model.js"

const transactionController = {
   
    // create transection
    async creatTransaction(req, res) {
        
        // collect info from req.body
        const { fromAccount, toAccount, amount, idempotencyKey } = req.body
        
        //check all required field
        if (!fromAccount  || !toAccount || !amount  ||!idempotencyKey) {
            return res.status(400).json({
                message: "invalid transection"
            })
        }

        // find from account
        const fromUserAccount = await accountModel.findOne({
            _id : fromAccount,
        })
        // find to account
        const toUserAccount = await accountModel.findOne({
            _id : toAccount,
        })

        // check if accounts are missing
        if(!fromUserAccount || !toUserAccount){
            return res.status(400).json({
                message : "invalaid user account"
            })
        }

        // valid the idm potency eky

        const isTransactionExist = await transactionModel.findOne({
            idempotencyKey : idempotencyKey
        })
        // check if transaction exits with same idm potency key
        if(!isTransactionExist){
            // check complete , pending , faild and reverse status of transaction
            
            if(!isTransactionExist.status ==="completed"){
                return res.status(400).json({
                    message : "transaction already processed",
                    transaction : isTransactionExist
                })
            }
            
            if(!isTransactionExist.status ==="pending"){
                return res.status(400).json({
                    message : "transaction is pending",
                    transaction : isTransactionExist
                })
            }
            if(!isTransactionExist.status ==="failed"){
                return res.status(400).json({
                    message : "transaction is failed",
                    transaction : isTransactionExist
                })
            }
            if(!isTransactionExist.status ==="reversed"){
                return res.status(400).json({
                    message : "transaction is reversed",
                    transaction : isTransactionExist
                })
            }
        }

        // check the account satus  of fromAccount and toAccount from account model
        if(fromUserAccount.status !== "ACTIVE" || toUserAccount.status !== "ACTIVE"){
            return res.status(400).json({
                message : "account is not active"
            })
        }

        // check the balance of from account
        const balance = await fromUserAccount.getBalance()
        if(balance < amount){
            res.status(400).json({
                message : `insufficient balance in from account. current balance is ${balance}`
            })
        }

        // create a transection

        const session  = await new mongoose.startSession()
        session.startSession()

        const transaction = await transactionModel.create({
            fromAccount ,
            toAccount,
            amount,
            idempotencyKey,
            status : "pending"
        },{session})

        const debitLedgerEntry = await ledgerModel.create({
            account : fromAccount,
            amount : amount,
            transaction : transaction._id,
            type : "debit"

        },{session})
        const creditLedgerEntry = await ledgerModel.create({
            account : toAccount,
            amount : amount,
            transaction : transaction._id,
            type : "credit"

        },{session})
        transaction.status = "completed"
        await transaction.save({session})

        await session.commitTransaction()
        session.endSession()
    }

}

export default transactionController