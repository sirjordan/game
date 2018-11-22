import Point2d = require('common/point2d');
import Raster = require('gameObjects/raster');
import Rect = require('gameObjects/rect');
import StaticMapSlice = require('./staticMapSlice');
import Settings = require('settings');
import Sprite = require('assets/sprite');

class TerrainObjectsFactory {
    private ctx: CanvasRenderingContext2D;
    private textures: Sprite;
    private obsticles: Sprite;

    constructor(ctx: CanvasRenderingContext2D, textures: Sprite, obsticles: Sprite) {
        this.ctx = ctx;
        this.textures = textures;
        this.obsticles = obsticles;
    }

    texture(textureNumber: number, position: Point2d): Rect {
        if (textureNumber <= 0)
            return this.default(position);

        try {
            return new StaticMapSlice(textureNumber, this.textures, this.ctx, position);
        } catch (error) {
            console.error(error);
            return this.default(position);
        }
    }

    obsticle(obsticleNumber: number, position: Point2d): Rect {
        if (obsticleNumber <= 0)
            return null;

        try {
            return new StaticMapSlice(obsticleNumber, this.obsticles, this.ctx, position);
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    default(position: Point2d): Rect {
        return new Raster(this.ctx, position, Settings.RASTER_SIZE, '#0f0b04');
    }
}

export = TerrainObjectsFactory;