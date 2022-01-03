const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const mongoose = require("mongoose");
require("dotenv").config();
const colors = require("colors");
const uuid = require("uuid").v4;
const fs = require("fs");
const path = require("path");
const getMP3Duration = require("get-mp3-duration");
const cors = require("cors");
//* Setup
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
global.appRoot = path.resolve(__dirname);
app.get("/", (req, res) => {
    res.send("<h1>Hallow Welcome To, ShitiFy Rest API</h1>");
});
app.use("/uploads", express.static("uploads"));

mongoose
    .connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("🗄️  Connected To DB ✅".magenta);
    })
    .catch((err) => console.log(err));

const playlistSchema = new mongoose.Schema({
    name: String,
    artist: String,
    image: String,
    duration: String,
    language: String,
    songUrl: String,
    isSaved: Boolean,
    isPlaying: Boolean,
});

const Playlist = mongoose.model("Playlist", playlistSchema);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const uniqueFileName = `${uuid()}${path.extname(file.originalname)}`;
        cb(null, uniqueFileName);
    },
});
const handleMultiPartData = multer({ storage }).single("AudioFile");

app.post("/api/v1/song/upload", (req, res) => {
    let filePath;

    handleMultiPartData(req, res, async (err) => {
        filePath = `/${req.file.path.replace(/\\/g, "/")}`;

        //? Get Song Duration
        const buffer = fs.readFileSync(
            `${appRoot.replace(/\\/g, "/")}/${filePath}`
        );
        const duration = getMP3Duration(buffer);

        var ms = duration,
            min = Math.floor((ms / 1000 / 60) << 0),
            sec = Math.floor((ms / 1000) % 60);

        const data = {
            ...req.body,
            duration: `${min + ":" + sec}`,
            songUrl: `${process.env.APP_URL}${filePath}`,
            isSaved: false,
            isPlaying: false,
        };
        const AddNewSong = await Playlist.create(data);

        res.status(200).json({
            message: "Song Added Sucessfuly",
            data,
        });
    });
});

//? Get All Songs
app.get("/api/v1/songs", async (req, res) => {
    res.status(200).json(await Playlist.find());
});

//? get Songs by Category
app.get("/api/v1/songs/:lang", async (req, res) => {
    res.status(200).json(
        await Playlist.find({ language: `${req.params.lang}` })
    );
});

//? Update Song
// app.put("/api/v1/song/update/:id", async (req, res) => {
//     let updateSong = await Playlist.findById(req.params.id);
//     const id = req.params.id;

//     updateSong = Playlist.findByIdAndUpdate(id, req.body, {
//         new: true,
//         useFindAndModify: true,
//         runValidators: true,
//     });

//     res.json({ ...req.body });
// });

app.listen(process.env.PORT || 5000, () =>
    console.log(
        "🚀 Listening On 👉".yellow,
        `http://localhost:${process.env.PORT || 5000}`.blue
    )
);
