const express = require("express");
const router = express.Router();
const {
    AddNewSong,
    getAllSongs,
    songByCategory,
    deleteSong,
    getCurrentPlayingSong,
} = require("../controllers/PlaylistCotroller");

router.route("/addNewSong").post(AddNewSong); //? Add New Song
router.route("/songs").get(getAllSongs); //? Get All Songs
router.route("/songs/:lang").get(songByCategory); //? get Songs by Category
router.route("/song/delete/:id").delete(deleteSong); // ? Delete Song
router.route("/currentSong/:id").get(getCurrentPlayingSong); //? get Song by _id

module.exports = router;
