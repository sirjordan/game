import IContentLoad = require('./iContentLoad');

class ContentLoader {
    private completed: number;
    private loaded: number;
    private whenAllComplete: () => any;
    
    constructor() {
        this.completed = 0;
        this.loaded = 0;
    }

    load(contentLoad: IContentLoad): ContentLoader {
        this.loaded++;
        contentLoad.load(this.loadComplete);

        return this;
    }

    complete(callback: () => any) {
        // Executes when all loaded stuff are completed
        this.whenAllComplete = callback;
    }

    private loadComplete = () => {
        this.completed++;

        if (this.completed === this.loaded) {
            this.whenAllComplete();
        }
    }
}

export = ContentLoader;