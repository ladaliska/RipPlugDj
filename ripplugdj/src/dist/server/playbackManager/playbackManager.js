export class SongPlaybackManager {
    constructor(playlistManager) {
        this.playlistManager = playlistManager;
        this.currentSecond = 0;
        this.playbackTimer = null;
        this.isPlaying = false;
        this.startTime = 0;
    }
    startPlayback(onSongEnd) {
        const currentSong = this.playlistManager.getCurrentSong();
        if (!currentSong)
            return;
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
    stopPlayback() {
        if (this.playbackTimer) {
            clearInterval(this.playbackTimer);
            this.playbackTimer = null;
        }
        this.isPlaying = false;
    }
    getCurrentPlaybackState() {
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
    get isCurrentlyPlaying() {
        return this.isPlaying;
    }
    resetPlayback() {
        this.stopPlayback();
        this.currentSecond = 0;
        this.startTime = 0;
    }
}
