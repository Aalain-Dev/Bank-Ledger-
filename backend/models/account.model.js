const mongoose = require("mongoose");
const ledgerModel = require("./ledger.model");
const accountSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Account must be associated with user"],
      ref: "User",
      index: true,
    },
    status: {
      type: String,
      enum: {
        values: ["Active", "Frozen", "Closed"],
        message: "Status must be either Active, Frozen, or Closed",
      },
      default: "Active",
    },
    currency: {
      type: String,
      required: [true, "Currency is required"],
      default: "INR",
    },
  },
  {
    timestamps: true,
  },
);

accountSchema.index({
  user: 1,
  status: 1,
});
accountSchema.methods.getBalance = async () => {
  // This function fetched the data from the ledger collection and calculates the balance by summing up the credit and debit transactions for the account. It uses MongoDB's aggregation framework to perform this calculation efficiently.
 const balancedata = await ledgerModel.aggregate([
  {
    $match: {
      account: this._id,
    },
  },
  {
    $group: {
      _id: null,
      totalDebit: {
        $sum: { $cond: [{ $eq: ["$type", "DEBIT"] }, "$amount", 0] },
      },
      totalCredit: {
        $sum: { $cond: [{ $eq: ["$type", "CREDIT"] }, "$amount", 0] },
      },
    },
  },
  {
    $project: {
      balance: { $subtract: ["$totalCredit", "$totalDebit"] },
    },
  },
]);

};
const Account = mongoose.model("Account", accountSchema);

module.exports = Account;
