import Point2d = require('common/point2d');
import Size = require('common/size');
import Raster = require('gameObjects/raster');
import Rect = require('gameObjects/rect');
import Texture = require('texture');

class TerrainFactory {
    private ctx: CanvasRenderingContext2D;
    private textureSprite: HTMLImageElement;

    constructor(ctx: CanvasRenderingContext2D, textureSprite: HTMLImageElement) {
        this.ctx = ctx;
        this.textureSprite = textureSprite;
    }

    texture(textureNumber: number, position: Point2d, size: number): Rect {
        if (textureNumber <= 0)
            return this.default(position, size);

        try {
            return new Texture(textureNumber, this.textureSprite, this.ctx, position, new Size(size, size));
        } catch (error) {
            console.error(error);
            return this.default(position, size);
        }
    }

    default(position: Point2d, size: number): Rect {
        return new Raster(this.ctx, position, new Size(size, size), '#0f0b04');
    }

    obsticle() {
        throw new Error('not implemented');
    }
}

export = TerrainFactory;