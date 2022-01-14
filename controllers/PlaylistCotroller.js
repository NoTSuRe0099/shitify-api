const multer = require("multer");
const Playlist = require("../models/PlaylistModel");
const uuid = require("uuid").v4;
const fs = require("fs");
const path = require("path");
const getMP3Duration = require("get-mp3-duration");

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

exports.AddNewSong = async (req, res) => {
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
            songUrl: `${filePath}`,
            isSaved: false,
            isPlaying: false,
        };
        const AddNewSong = await Playlist.create(data);

        res.status(200).json({
            message: "Song Added Sucessfuly",
            data,
        });
    });
};

//? Get All Songs

exports.getAllSongs = async (req, res) => {
    res.status(200).json(await Playlist.find());
};

//? get Songs by Category

exports.songByCategory = async (req, res) => {
    res.status(200).json(
        await Playlist.find({ language: `${req.params.lang}` })
    );
};

// ? Delete Song

exports.deleteSong = async (req, res) => {
    const song = await Playlist.findById(req.params.id);

    if (song) {
        song.remove();
        res.status(200).json({ message: "Deletes Sucessfully", song });
    } else {
        res.status(500).json({ message: "Song Not Found" });
    }
};

//? get Song by _id

exports.getCurrentPlayingSong = async (req, res) => {
    const song = await Playlist.findById(req.params.id);

    if (!song) {
        res.status(404).json({ message: "song not found" });
    }

    res.status(200).json(song);
};
