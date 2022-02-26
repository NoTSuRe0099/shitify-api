const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");
const connectDatabase = require("./config/database");
const router = require("./routes/routes");

//? <----------- CONFIGURATION ----------->
dotenv.config({ path: "./config/config.env" });
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
global.appRoot = path.resolve(__dirname);
app.use("/api/v1", router);

//? <----------- Connect Database ----------->
connectDatabase();

app.get("/", (req, res) => {
    res.send("<h1>Hallow Welcome To, ShitiFy Rest API</h1>");
});
app.use("/uploads", express.static("uploads"));

app.listen(process.env.PORT || 5000, () =>
    console.log(
        "🚀 Listening On 👉",
        `http://localhost:${process.env.PORT || 5000}`
    )
);
