import Map = require('map/map');
import Size = require('common/size');
import Point2d = require('common/point2d');
import TerrainObjectsFactory = require('terrainObjectsFactory');

class Terrain {
    private ctx: CanvasRenderingContext2D;
    private map: Map;
    // Used to remember the last camera position
    private lastCamera: Point2d;
    private objectsFactory: TerrainObjectsFactory;

    constructor(ctx: CanvasRenderingContext2D, map: Map, objectsFactory: TerrainObjectsFactory) {
        this.ctx = ctx;
        this.map = map;
        this.objectsFactory = objectsFactory;
    }

    public size(): Size {
        // Size of the terrain in pixels
        return new Size(this.map.size().width * this.map.rasterSize, this.map.size().height * this.map.rasterSize);
    }

    public draw(camera: Point2d, force: boolean = false) {
        // Optimizing the draw() and render only if the camera changes its position
        if (!force && this.lastCamera && camera.equals(this.lastCamera)) {
            return;
        }

        let maxRight = this.ctx.canvas.width;
        let maxTop = this.ctx.canvas.height;
        let rasterSize = this.map.rasterSize;

        this.ctx.clearRect(0, 0, maxRight, maxTop);

        let startPos = new Point2d((camera.x % rasterSize) * - 1, (camera.y % rasterSize) * -1);
        let pos = startPos.clone();

        let row = Math.floor(camera.y / rasterSize);
        let col = Math.floor(camera.x / rasterSize);
        let startCol = col;

        // Go to the end of the screen Y
        for (let i = 1; i <= Math.ceil(maxTop / rasterSize) + 1; i++) {
            // No more map rows
            if (!this.map.objects[row]) break;

            // Go to the end of the screen X
            for (let j = 1; j <= Math.ceil(maxRight / rasterSize); j++) {
                // No more map columns
                if (!(this.map.objects[row][col] >= 0)) break;

                let rasterCode = this.map.objects[row][col];
                let terrainObject = this.objectsFactory.create(rasterCode, pos, rasterSize);

                terrainObject.draw(camera);

                col++;
                pos.x = startPos.x + (j * rasterSize);
            }

            col = startCol;
            row++;
            pos.x = startPos.x;
            pos.y = startPos.y + (i * rasterSize);
        }

        this.lastCamera = camera.clone();
    }
}

export = Terrain;