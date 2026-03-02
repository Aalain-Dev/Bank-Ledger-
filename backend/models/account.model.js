const mongoose = require("mongoose");

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
const Account = mongoose.model("Account", accountSchema);

module.exports = Account;