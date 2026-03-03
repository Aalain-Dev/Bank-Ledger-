const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  fromAccount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    required: [true, "From account is required"],
    index: true,
  },
  toAccount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    required: [true, "To account is required"],
    index: true,
  },
  status: {
    type: String,
    enum: {
      value: ["Pending", "Completed", "Failed", "Reversed"],
      message: "Status must be either Pending, Completed, Failed, or Reversed",
    },
    default: "Pending",
  },
  ammount:{
    type: Number,
    required: [true, "Ammount is required"],
    min: [0.01, "Ammount must be at least 0.01"],
  },
  idempotencyKey: {
    type:String,
    required: [true, "Idempotency key is required"],
    index: true,
    unique: true,
  }
},
{
    timestamps: true,
}
);
const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
