const Account = require("../models/account.model");
const Transaction = require("../models/transaction.model");
const LedgerModel = require("../models/ledger.model");

// Create a new Transaction
// 1. validate the request body
// 2. validate idempotency key
// 3. check account status
// 4. Derive sender balance from Ledger
// 5. Create the transaction
// 6. Create a debit ledger entry
// 7. Create a credit ledger entry
// 8. Mark transaction completed
// 9. Commit MongoDB session
// 10. Send email notification to sender and receiver 
const createTransaction = async (req, res) => {
  const { fromAccount, toAccount, amount, idempotencyKey } = req.body;
  if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    // 1. validate the request body
    const [isfromAccountidexsist, istoAccountidexsist] = await Promise.all([
      Account.findOne({ _id: fromAccount }),
      Account.findOne({ _id: toAccount }),
    ]);
    if (!isfromAccountidexsist || !istoAccountidexsist) {
      return res.status(404).json({ message: "Account not found" });
    }
    // 2. validate idempotency key
    const isidempotencyKeyExist = await Transaction.findOne({ idempotencyKey });

    if (isidempotencyKeyExist) {
      const response = {
        Pending: { code: 200, message: "Transaction is pending" },
        Completed: { code: 200, message: "Transaction completed" },
        Failed: { code: 400, message: "Transaction failed" },
        Reversed: { code: 200, message: "Transaction reversed" },
      };
      const { status } = isidempotencyKeyExist;
      return res
        .status(response[status].code)
        .json({ message: response[status].message });
    }
    // 3. check account status
    if (
      isfromAccountidexsist.status !== "Active" ||
      isfromAccountidexsist.status !== "Active"
    ) {
      return res.status(400).json({ message: "Account is not active" });
    }
    const balance = await isfromAccountidexsist.getBalance();
    if (balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    var session = await mongoose.startSession();
    session.startTransaction();
//  Create the transaction
    const transaction = await Transaction.create(
      {
        fromAccount,
        toAccount,
        amount,
        idempotencyKey,
        status: "Pending",
      },
      {
        session,
      },
    );
    // Create Credit ledger entry 
    const creditLedgerEntry = await LedgerModel.create(
      {
        account: toAccount,
        type: "CREDIT",
        amount,
        transaction: transaction._id,
      },
      {
        session,
      },
    );
    // Create Debit ledger entry 

    const debitLedgerEntry = await LedgerModel.create(
      {
        account: fromAccount,
        type: "DEBIT",
        amount,
        transaction: transaction._id,
      },
      {
        session,
      },
    );
    // Transaction Completed 
    transaction.status ="Completed"
    // Commited MongoDB session
    await transaction.save({ session });
    await session.commitTransaction();
    session.endSession();
  } catch (e) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { createTransaction };
