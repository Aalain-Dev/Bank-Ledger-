const mongoose = require("mongoose");

const ledgerSchema = new mongoose.Schema({
account:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    required: [true, "Ledger entry must be associated with an account"],
    index: true,
    immutable: true,
},
amount:{
    type:Number,
    required: [true, "Amount is required"],
    immutable: true,

},
transaction:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Transaction",
    index: true,
    immutable: true,
},
type:{
    type:String,
    enum:{
        values:["DEBIT","CREDIT"]
    },
    required: [true, "Ledger entry type is required"],
    immutable: true,
}
})

const preventmodification =()=>{
    throw new Error("Ledger Entries Cannot Be Modified Or Deleted");
}

ledgerSchema.pre("findOneAndDelete", preventmodification);
ledgerSchema.pre("findOneAndUpdate", preventmodification);
ledgerSchema.pre("updateOne", preventmodification);
ledgerSchema.pre("deleteOne", preventmodification);
ledgerSchema.pre("deleteMany", preventmodification);
ledgerSchema.pre("updateMany", preventmodification);
ledgerSchema.pre("update", preventmodification);
ledgerSchema.pre("findOneAndRemove", preventmodification);
ledgerSchema.pre("remove", preventmodification);

const Ledger = mongoose.model("Ledger", ledgerSchema);

module.exports = Ledger;