const mongoose = require("mongoose");

const connectDatabase = () => {
    mongoose
        .connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => {
            console.log("🗄️  Connected To DB ✅");
        })
        .catch((err) => console.log(err));
};

module.exports = connectDatabase;
