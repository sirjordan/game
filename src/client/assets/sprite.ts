import Size = require('common/size');
import Settings = require('settings');
import IContentLoad = require('iContentLoad');

class Sprite implements IContentLoad {
    private _slice: Size;
    private loaded: boolean;
    private _content: HTMLImageElement;
    private src: string;

    constructor(src: string, slice: Size) {
        this._slice = slice;
        this.loaded = false;
        this.src = src;
    }

    static textures(): Sprite {
        return new Sprite(Settings.SPRTIES_LOCATION + '/' + 'textures.jpg', new Size(100, 100));
    }

    static obsticles(): Sprite {
        return new Sprite(Settings.SPRTIES_LOCATION + '/' + 'obsticles.png', new Size(100, 100));
    }

    load(loadComplete: () => void): void {
        this._content = new Image();
        this._content.src = this.src;
        this._content.onload = () => {
            this.loaded = true;
            loadComplete();
        };
    }

    content(): HTMLImageElement {
        if (this.loaded) {
            return this._content;
        } else {
            throw new Error('Content of [' + this.src + '] is not loaded!');
        }
    }

    sliceSize(): Size {
        return this._slice;
    }

    size(): Size {
        return new Size(this._content.width, this._content.height);
    }
}

export = Sprite;