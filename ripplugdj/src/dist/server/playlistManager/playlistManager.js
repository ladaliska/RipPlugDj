export class PlaylistManager {
    constructor() {
        this.playlist = [];
        this.currentIndex = 0;
    }
    addSong(song) {
        song.order = this.playlist.length;
        this.playlist.push(song);
    }
    getCurrentSong() {
        return this.playlist[this.currentIndex] || null;
    }
    getUpcomingSongs() {
        return this.playlist.slice(this.currentIndex + 1);
    }
    moveToNextSong() {
        if (this.currentIndex < this.playlist.length - 1) {
            this.currentIndex++;
            return true;
        }
        return false;
    }
    getCurrentPlaylistTitles() {
        return this.getUpcomingSongs().map(song => song.title);
    }
    getCurrentIndex() {
        return this.currentIndex;
    }
    getTotalSongs() {
        return this.playlist.length;
    }
}
