import Size = require('common/size');
import Settings = require('settings');
import IContentLoad = require('iContentLoad');

class Sprite implements IContentLoad {
    private _slice: Size;
    private loaded: boolean;
    private _content: HTMLImageElement;
    private name: string;

    constructor(name: string, slice: Size) {
        this._slice = slice;
        this.loaded = false;
        this.name = name;
    }

    load(loadComplete: () => void): void {
        this._content = new Image();
        this._content.src = Settings.SPRTIES_LOCATION + '/' + this.name;
        this._content.onload = () => {
            this.loaded = true;
            loadComplete();
        };
    }

    content(): HTMLImageElement {
        if (this.loaded) {
            return this._content;
        } else {
            throw new Error('Content of [' + this.name + '] is not loaded!');
        }
    }

    slice(): Size {
        return this._slice;
    }
}

export = Sprite;