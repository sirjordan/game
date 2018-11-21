import IContentLoad = require('./iContentLoad');

class ContentLoader {
    private completed: number;
    private loaded: number;
    private whenAllComplete: () => any;
    
    constructor() {
        this.completed = 0;
    }

    load(contentLoad: IContentLoad): ContentLoader {
        this.loaded++;
        contentLoad.load(this.loadComplete);

        return this;
    }

    complete(callback: () => any) {
        // Happens when all loaded functions are completed
        this.whenAllComplete = callback;
    }

    private loadComplete(): void {
        this.completed++;

        if (this.completed === this.loaded) {
            this.whenAllComplete();
        }
    }
}

export = ContentLoader;