var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from "express";
import http from "http";
import { Server } from "socket.io";
import * as url from "url";
import ytdl from "ytdl-core";
import path from "path";
import { PlaylistManager } from "./playlistManager/playlistManager";
import { SongPlaybackManager } from "./playbackManager/playbackManager";
import { SocketEvents } from "./types/events";
const __dirname = url.fileURLToPath(new URL("..", import.meta.url));
class PlugDjServer {
    constructor() {
        this.app = express();
        this.playlistManager = new PlaylistManager();
        this.playbackManager = new SongPlaybackManager(this.playlistManager);
        this.setupServer();
    }
    setupServer() {
        this.server = http.createServer(this.app);
        this.io = new Server(this.server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"],
            },
        });
        this.setupRoutes();
        this.setupSocketEvents();
    }
    setupRoutes() {
        const staticPath = path.join(__dirname, 'public');
        this.app.use(express.static(staticPath));
        this.app.get('/', (req, res) => {
            res.sendFile(path.join(__dirname, 'index.html'));
        });
        this.app.get('/test', (req, res) => {
            res.sendFile(path.join(__dirname, 'test.html'));
        });
    }
    setupSocketEvents() {
        this.io.on('connection', (socket) => {
            socket.on(SocketEvents.Ready, () => {
                this.sendPlaylist(socket);
                this.sendCurrentSong(socket);
            });
            socket.on(SocketEvents.Insert, (url) => __awaiter(this, void 0, void 0, function* () {
                yield this.insertSong(url);
            }));
            socket.on(SocketEvents.Skip, () => this.skipSong());
        });
    }
    insertSong(url) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield ytdl.getBasicInfo(url);
                const song = {
                    title: data.videoDetails.title,
                    code: data.videoDetails.videoId,
                    length: data.videoDetails.lengthSeconds,
                    order: 0
                };
                this.playlistManager.addSong(song);
                this.broadcastPlaylist();
                if (!this.playbackManager.isCurrentlyPlaying) {
                    this.startNextSong();
                }
            }
            catch (error) {
                console.error('Failed to insert song:', error);
            }
        });
    }
    skipSong() {
        console.log('Skipping song');
        this.playbackManager.stopPlayback();
        console.log('Stopped playback');
        this.startNextSong();
        console.log('Started next song');
        console.log(this.playlistManager.getCurrentPlaylistTitles());
    }
    startNextSong() {
        console.log('Starting next song');
        if (this.playlistManager.moveToNextSong()) {
            this.playbackManager.startPlayback(() => {
                this.startNextSong();
            });
            this.broadcastCurrentSong();
            this.broadcastPlaylist();
        }
        else {
            this.io.emit(SocketEvents.Empty);
        }
    }
    broadcastCurrentSong() {
        const currentSongState = this.playbackManager.getCurrentPlaybackState();
        if (currentSongState) {
            this.io.emit(SocketEvents.Song, currentSongState);
        }
    }
    sendCurrentSong(socket) {
        const currentSongState = this.playbackManager.getCurrentPlaybackState();
        if (currentSongState) {
            socket.emit(SocketEvents.Song, currentSongState);
        }
        else {
            socket.emit(SocketEvents.Empty);
        }
    }
    broadcastPlaylist() {
        const playlist = this.playlistManager.getCurrentPlaylistTitles();
        this.io.emit(SocketEvents.Playlist, playlist);
    }
    sendPlaylist(socket) {
        const playlist = this.playlistManager.getCurrentPlaylistTitles();
        socket.emit(SocketEvents.Playlist, playlist);
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const port = 3000;
                this.server.listen(port, () => {
                    console.log(`Server listening on *:${port}`);
                });
            }
            catch (error) {
                console.error('Failed to start server:', error);
                process.exit(1);
            }
        });
    }
}
function initServer() {
    return __awaiter(this, void 0, void 0, function* () {
        const server = new PlugDjServer();
        yield server.start();
    });
}
initServer().catch(console.error);
