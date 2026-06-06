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
        if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
            return res.status(400).json({
                message: "invalid transection"
            })
        }

        // find from account
        const fromUserAccount = await accountModel.findOne({
            _id: fromAccount,
        })
        // find to account
        const toUserAccount = await accountModel.findOne({
            _id: toAccount,
        })

        // check if accounts are missing
        if (!fromUserAccount || !toUserAccount) {
            return res.status(400).json({
                message: "invalaid user account"
            })
        }

        // valid the idm potency eky

        const isTransactionExist = await transactionModel.findOne({
            idempotencyKey: idempotencyKey
        })
        // check if transaction exits with same idm potency key
        if (!isTransactionExist) {
            // check complete , pending , faild and reverse status of transaction

            if (!isTransactionExist.status === "completed") {
                return res.status(400).json({
                    message: "transaction already processed",
                    transaction: isTransactionExist
                })
            }

            if (!isTransactionExist.status === "pending") {
                return res.status(400).json({
                    message: "transaction is pending",
                    transaction: isTransactionExist
                })
            }
            if (!isTransactionExist.status === "failed") {
                return res.status(400).json({
                    message: "transaction is failed",
                    transaction: isTransactionExist
                })
            }
            if (!isTransactionExist.status === "reversed") {
                return res.status(400).json({
                    message: "transaction is reversed",
                    transaction: isTransactionExist
                })
            }
        }

        // check the account satus  of fromAccount and toAccount from account model
        if (fromUserAccount.status !== "ACTIVE" || toUserAccount.status !== "ACTIVE") {
            return res.status(400).json({
                message: "account is not active"
            })
        }

        // check the balance of from account
        const balance = await fromUserAccount.getBalance()
        if (balance < amount) {
            res.status(400).json({
                message: `insufficient balance in from account. current balance is ${balance}`
            })
        }

        // create a transection

        const session = await new mongoose.startSession()
        session.startSession()

        const transaction = await transactionModel.create({
            fromAccount,
            toAccount,
            amount,
            idempotencyKey,
            status: "pending"
        }, { session })

        const debitLedgerEntry = await ledgerModel.create({
            account: fromAccount,
            amount: amount,
            transaction: transaction._id,
            type: "debit"

        }, { session })
        const creditLedgerEntry = await ledgerModel.create({
            account: toAccount,
            amount: amount,
            transaction: transaction._id,
            type: "credit"

        }, { session })
        transaction.status = "completed"
        await transaction.save({ session })

        await session.commitTransaction()
        session.endSession()
    },

    //initial funds
   async initialFundsTransaction(req, res) {
    const { toAccount, amount, idempotencyKey } = req.body;

    if (!toAccount || !amount || !idempotencyKey) {
        return res.status(400).json({
            message: "Invalid transaction"
        });
    }

    // Find receiver account
    const toUserAccount = await accountModel.findById(toAccount);

    if (!toUserAccount) {
        return res.status(400).json({
            message: "Invalid user account"
        });
    }

    // Find system account
    const fromUserAccount = await accountModel.findOne({
        user: req.user._id
    });

    if (!fromUserAccount) {
        return res.status(400).json({
            message: "System account not found"
        });
    }

    // Check duplicate idempotency key
    const existingTransaction = await transactionModel.findOne({
        idempotencyKey
    });

    if (existingTransaction) {
        return res.status(400).json({
            message: "Transaction already processed",
            transaction: existingTransaction
        });
    }

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        // Create transaction
        const transaction = new transactionModel({
            fromAccount: fromUserAccount._id,
            toAccount,
            amount,
            idempotencyKey,
            status: "pending"
        });

        await transaction.save({ session });

        // Debit entry
        await ledgerModel.create([{
            account: fromUserAccount._id,
            amount,
            transaction: transaction._id,
            type: "debit"
        }], { session });

        // Credit entry
        await ledgerModel.create([{
            account: toAccount,
            amount,
            transaction: transaction._id,
            type: "credit"
        }], { session });

        // Complete transaction
        transaction.status = "completed";

        await transaction.save({ session });

        await session.commitTransaction();

        return res.status(201).json({
            success: true,
            message: "Initial funds transaction completed successfully",
            transaction
        });

    } catch (error) {

        await session.abortTransaction();

        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });

    } finally {

        await session.endSession();

    }
}

}

export default transactionController