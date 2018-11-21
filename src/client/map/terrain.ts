import Map = require('map/map');
import Point2d = require('common/point2d');
import Camera = require('common/camera');
import TerrainFactory = require('terrainFactory');
import Settings = require('settings');

class Terrain {
    public map: Map;
    private ctx: CanvasRenderingContext2D;
    // Used to remember the last camera position
    private lastCameraPosition: Point2d;
    private terrainObjects: TerrainFactory;

    constructor(ctx: CanvasRenderingContext2D, map: Map, terrainObjects: TerrainFactory) {
        this.ctx = ctx;
        this.map = map;
        this.terrainObjects = terrainObjects;
    }

    public draw(camera: Camera) {
        // Optimizing the draw() and render only if the camera changes its position
        if (this.lastCameraPosition && camera.position.equals(this.lastCameraPosition)) {
            return;
        }

        let maxRight = this.ctx.canvas.width;
        let maxTop = this.ctx.canvas.height;
        let rasterSize = Settings.RASTER_SIZE; //this.map.rasterSize;

        this.ctx.clearRect(0, 0, maxRight, maxTop);

        let startPos = new Point2d((camera.position.x % rasterSize.width) * - 1, (camera.position.y % rasterSize.height) * -1);
        let pos = startPos.clone();

        let row = Math.floor(camera.position.y / rasterSize.height);
        let col = Math.floor(camera.position.x / rasterSize.width);
        let startCol = col;

        // Go to the end of the screen Y
        for (let i = 1; i <= Math.ceil(maxTop / rasterSize.height) + 1; i++) {
            // No more map rows
            if (!this.map.textures[row]) break;

            // Go to the end of the screen X
            for (let j = 1; j <= Math.ceil(maxRight / rasterSize.width); j++) {
                // No more map columns
                if (!(this.map.textures[row][col] >= 0)) break;

                let rasterCode = this.map.textures[row][col];
                let terrainObject = this.terrainObjects.texture(rasterCode, pos);

                terrainObject.draw(camera);

                col++;
                pos.x = startPos.x + (j * rasterSize.width);
            }

            col = startCol;
            row++;
            pos.x = startPos.x;
            pos.y = startPos.y + (i * rasterSize.height);
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