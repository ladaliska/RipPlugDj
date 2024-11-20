import { Feed } from "../types/types";

export class PlaylistManager {
    private playlist: Feed[] = [];
    private currentIndex = 0;

    public addSong(song: Feed): void {
        song.order = this.playlist.length;
        this.playlist.push(song);
    }

    public getCurrentSong(): Feed | null {
        return this.playlist[this.currentIndex] || null;
    }

    public getUpcomingSongs(): Feed[] {
        return this.playlist.slice(this.currentIndex + 1);
    }

    public moveToNextSong(): boolean {
        if (this.currentIndex < this.playlist.length - 1) {
            this.currentIndex++;
            return true;
        }
        return false;
    }

    public getCurrentPlaylistTitles(): string[] {
        return this.getUpcomingSongs().map(song => song.title);
    }

    public getCurrentIndex(): number {
        return this.currentIndex;
    }

    public getTotalSongs(): number {
        return this.playlist.length;
    }
}