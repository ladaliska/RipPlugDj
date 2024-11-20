import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import * as url from "url";
import ytdl from "ytdl-core";
import path from "path";
import { PlaylistManager } from "./playlistManager/playlistManager";
import { SongPlaybackManager } from "./playbackManager/playbackManager";
import { Feed } from "./types/types";
import { SocketEvents } from "./types/events";

const __dirname = url.fileURLToPath(new URL("..", import.meta.url));

class PlugDjServer {
    private app: express.Application;
    private server: http.Server;
    private io: Server;

    private playlistManager: PlaylistManager;
    private playbackManager: SongPlaybackManager;

    constructor() {
        this.app = express();
        this.playlistManager = new PlaylistManager();
        this.playbackManager = new SongPlaybackManager(this.playlistManager);

        this.setupServer();
    }

    private setupServer(): void {
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

    private setupRoutes(): void {
        const staticPath = path.join(__dirname, 'public');

        this.app.use(express.static(staticPath));

        this.app.get('/', (req, res) => {
            res.sendFile(path.join(__dirname, 'index.html'));
        });

        this.app.get('/test', (req, res) => {
            res.sendFile(path.join(__dirname, 'test.html'));
        });
    }

    private setupSocketEvents(): void {
        this.io.on('connection', (socket) => {
            socket.on(SocketEvents.Ready, () => {
                this.sendPlaylist(socket);
                this.sendCurrentSong(socket);
            });

            socket.on(SocketEvents.Insert, async (url: string) => {
                await this.insertSong(url);
            });

            socket.on(SocketEvents.Skip, () => this.skipSong());
        });
    }

    private async insertSong(url: string): Promise<void> {
        try {
            const data = await ytdl.getBasicInfo(url);
            const song: Feed = {
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
        } catch (error) {
            console.error('Failed to insert song:', error);
        }
    }

    private skipSong(): void {
        this.playbackManager.stopPlayback();
        this.startNextSong();
    }

    private startNextSong(): void {
        if (this.playlistManager.moveToNextSong()) {
            this.playbackManager.startPlayback(() => {
                this.startNextSong();
            });

            this.broadcastCurrentSong();
            this.broadcastPlaylist();
        } else {
            this.io.emit(SocketEvents.Empty);
        }
    }

    private broadcastCurrentSong(): void {
        const currentSongState = this.playbackManager.getCurrentPlaybackState();
        if (currentSongState) {
            this.io.emit(SocketEvents.Song, currentSongState);
        }
    }

    private sendCurrentSong(socket: Socket): void {
        const currentSongState = this.playbackManager.getCurrentPlaybackState();
        if (currentSongState) {
            socket.emit(SocketEvents.Song, currentSongState);
        } else {
            socket.emit(SocketEvents.Empty);
        }
    }

    private broadcastPlaylist(): void {
        const playlist = this.playlistManager.getCurrentPlaylistTitles();
        this.io.emit(SocketEvents.Playlist, playlist);
    }

    private sendPlaylist(socket: Socket): void {
        const playlist = this.playlistManager.getCurrentPlaylistTitles();
        socket.emit(SocketEvents.Playlist, playlist);
    }

    public async start(): Promise<void> {
        try {
            const port = 3000;

            this.server.listen(port, () => {
                console.log(`Server listening on *:${port}`);
            });
        } catch (error) {
            console.error('Failed to start server:', error);
            process.exit(1);
        }
    }
}

async function initServer() {
    const server = new PlugDjServer();
    await server.start();
}

initServer().catch(console.error);