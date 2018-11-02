import Point2d = require('common/point2d');
import Size = require('common/size');
import Raster = require('gameObjects/raster');

class TerrainObjectsFactory {
    private ctx: CanvasRenderingContext2D;

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
    }

    create(rasterCode: number, position: Point2d, size: number): Raster {
        switch (rasterCode) {
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