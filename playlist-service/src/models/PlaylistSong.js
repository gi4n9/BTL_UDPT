const mongoose = require("mongoose");

// id
// name
// user_id
// is_public
// created_at
// updated_at

const playlistSongSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    user_id: {
        type: String,
        required: true,
        ref: "User"
    },
    is_public: {
        type: Boolean,
        default: false
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
})

const PlaylistSong = mongoose.model("PlaylistSong", playlistSongSchema);

module.exports = PlaylistSong;
