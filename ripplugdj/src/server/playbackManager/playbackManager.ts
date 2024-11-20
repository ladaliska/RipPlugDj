import { PlaylistManager } from "../playlistManager/playlistManager";

export class SongPlaybackManager {
    private currentSecond = 0;
    private playbackTimer: NodeJS.Timeout | null = null;
    private isPlaying = false;
    private startTime: number = 0;

    constructor(private playlistManager: PlaylistManager) { }

    public startPlayback(onSongEnd: () => void): void {
        const currentSong = this.playlistManager.getCurrentSong();
        if (!currentSong) return;

        const songLength = parseInt(currentSong.length);
        this.isPlaying = true;
        this.currentSecond = 0;
        this.startTime = Date.now();

        this.playbackTimer = setInterval(() => {
            this.currentSecond = Math.floor((Date.now() - this.startTime) / 1000);

            if (this.currentSecond >= songLength) {
                this.stopPlayback();
                onSongEnd();
            }
        }, 1000);
    }

    public stopPlayback(): void {
        if (this.playbackTimer) {
            clearInterval(this.playbackTimer);
            this.playbackTimer = null;
        }
        this.isPlaying = false;
    }

    public getCurrentPlaybackState() {
        const currentSong = this.playlistManager.getCurrentSong();
        return currentSong
            ? {
                code: currentSong.code,
                sec: this.currentSecond,
                currentIndex: this.playlistManager.getCurrentIndex(),
                totalSongs: this.playlistManager.getTotalSongs()
            }
            : null;
    }

    public get isCurrentlyPlaying(): boolean {
        return this.isPlaying;
    }

    public resetPlayback(): void {
        this.stopPlayback();
        this.currentSecond = 0;
        this.startTime = 0;
    }
}