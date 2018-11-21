import Point2d = require('common/point2d');
import Size = require('common/size');
import Raster = require('gameObjects/raster');
import Rect = require('gameObjects/rect');
import Texture = require('texture');
import Settings = require('settings');

class TerrainFactory {
    private ctx: CanvasRenderingContext2D;
    private textureSprite: HTMLImageElement;

    constructor(ctx: CanvasRenderingContext2D, textureSprite: HTMLImageElement) {
        this.ctx = ctx;
        this.textureSprite = textureSprite;
    }

    texture(textureNumber: number, position: Point2d): Rect {
        if (textureNumber <= 0)
            return this.default(position);

        try {
            return new Texture(textureNumber, this.textureSprite, this.ctx, position);
        } catch (error) {
            console.error(error);
            return this.default(position);
        }
    }

    obsticle(obsticleNumber: number, position: Point2d): Rect {
        throw new Error('not implemented');
    }

    default(position: Point2d): Rect {
        return new Raster(this.ctx, position, Settings.RASTER_SIZE, '#0f0b04');
    }
}

export = TerrainFactory;