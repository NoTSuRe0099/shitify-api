const mongoose = require("mongoose");

const playlistSchema = new mongoose.Schema(
    {
        name: String,
        artist: String,
        image: String,
        duration: String,
        language: String,
        songUrl: {
            type: String,
            get: (songUrl) => {
                return `${process.env.APP_URL}${songUrl}`;
            },
        },
        isSaved: Boolean,
        isPlaying: Boolean,
    },
    { timestamps: true, toJSON: { getters: true } }
);

module.exports = mongoose.model("Playlist", playlistSchema);
