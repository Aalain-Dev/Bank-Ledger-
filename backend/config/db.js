const mongoose = require("mongoose")

const connecttodb = async () => {
    try {
        var connect = mongoose.connect(process.env.MONGO_URI)
        if (connect) {
            console.log("Database Connected")
        }
    }
    catch (e) {
        console.log(e)
        process.exit(1);
    }
}

module.exports = connecttodb