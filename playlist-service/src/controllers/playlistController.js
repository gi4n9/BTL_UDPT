const Playlist = require("../models/Playlist");
const PlaylistSong = require("../models/PlaylistSong");

class PlaylistController {
    static async createPlaylist(req, res) {
        const { name, user_id, is_public } = req.body;
        const playlist = new Playlist({ name, user_id, is_public });
        await playlist.save();
        res.status(201).json(playlist);
    }

    static async getPlaylist(req, res) {
        const { id } = req.params;
        const playlist = await Playlist.findById(id);
        res.status(200).json(playlist);
    }

    static async updatePlaylist(req, res) {
        const { id } = req.params;
        const { name, user_id, is_public } = req.body;
        const playlist = await Playlist.findByIdAndUpdate(id, { name, user_id, is_public }, { new: true });
        res.status(200).json(playlist);
    }

    static async deletePlaylist(req, res) {
        const { id } = req.params;
        await Playlist.findByIdAndDelete(id);
        res.status(200).json({ message: "Playlist deleted successfully" });
    }

    static async addSongToPlaylist(req, res) {
        const { playlist_id, song_id } = req.body;
        const playlist = await Playlist.findById(playlist_id);
        playlist.songs.push(song_id);
        await playlist.save();
        res.status(200).json(playlist);
    }

    static async removeSongFromPlaylist(req, res) {
        const { playlist_id, song_id } = req.body;
        const playlist = await Playlist.findById(playlist_id);
        playlist.songs = playlist.songs.filter(id => id !== song_id);
        await playlist.save();
        res.status(200).json(playlist);
    }

    static async getSongsFromPlaylist(req, res) {
        const { id } = req.params;
        const playlist = await Playlist.findById(id);
        res.status(200).json(playlist.songs);
    }

    static async getPlaylistsByUser(req, res) {
        const { user_id } = req.params;
        const playlists = await Playlist.find({ user_id });
        res.status(200).json(playlists);
    }

    static async getPublicPlaylists(req, res) {
        const playlists = await Playlist.find({ is_public: true });
        res.status(200).json(playlists);
    }


}

module.exports = PlaylistController;
