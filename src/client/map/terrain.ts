import Map = require('map/map');
import Size = require('common/size');
import Point2d = require('common/point2d');
import Camera = require('common/camera');
import TerrainObjectsFactory = require('terrainObjectsFactory');

class Terrain {
    public map: Map;
    private ctx: CanvasRenderingContext2D;
    // Used to remember the last camera position
    private lastCameraPosition: Point2d;
    private objectsFactory: TerrainObjectsFactory;

    constructor(ctx: CanvasRenderingContext2D, map: Map, objectsFactory: TerrainObjectsFactory) {
        this.ctx = ctx;
        this.map = map;
        this.objectsFactory = objectsFactory;
    }

    public draw(camera: Camera) {
        // Optimizing the draw() and render only if the camera changes its position
        if (this.lastCameraPosition && camera.position.equals(this.lastCameraPosition)) {
            return;
        }

        let maxRight = this.ctx.canvas.width;
        let maxTop = this.ctx.canvas.height;
        let rasterSize = this.map.rasterSize;

        this.ctx.clearRect(0, 0, maxRight, maxTop);

        let startPos = new Point2d((camera.position.x % rasterSize) * - 1, (camera.position.y % rasterSize) * -1);
        let pos = startPos.clone();

        let row = Math.floor(camera.position.y / rasterSize);
        let col = Math.floor(camera.position.x / rasterSize);
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

        this.lastCameraPosition = camera.position.clone();
    }

    reDraw(camera: Camera){
        // Force the terrain to redraw
        this.lastCameraPosition = null;
        this.draw(camera);
    }
}

export = Terrain;