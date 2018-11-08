import Point2d = require('common/point2d');
import Size = require('common/size');
import Raster = require('gameObjects/raster');
import Rect = require('gameObjects/rect');
import Texture = require('texture');

class TerrainObjectsFactory {
    private ctx: CanvasRenderingContext2D;
    private textureSprite: HTMLImageElement;

    constructor(ctx: CanvasRenderingContext2D, textureSprite: HTMLImageElement) {
        this.ctx = ctx;
        this.textureSprite = textureSprite;
    }

    texture(textureNumber: number, position: Point2d, size: number): Rect {
        try {
            return new Texture(textureNumber, this.textureSprite, this.ctx, position, new Size(size, size));
        } catch (error) {
            console.error(error);
            return new Raster(this.ctx, position, new Size(size, size), '#0f0b04');
        }

        switch (textureNumber) {
            case 0:
                return new Raster(this.ctx, position, new Size(size, size), '#66440b');
            case 1:
                return new Raster(this.ctx, position, new Size(size, size), '#3d3321');
            default:
                return new Raster(this.ctx, position, new Size(size, size), '#0f0b04');
        }
    }
}

export = TerrainObjectsFactory;