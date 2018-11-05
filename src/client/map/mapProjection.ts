import IGameObject = require('gameObjects/contracts/iGameObject');
import Raster = require('gameObjects/raster');
import Unit = require('gameObjects/unit');
import Objects = require('gameObjects/objects');
import Circle = require('gameObjects/circle');
import Rect = require('gameObjects/rect');
import ISubscriber = require('common/contracts/iSubscriber');
import Point2d = require('common/point2d');
import Size = require('common/size');
import Camera = require('common/camera');
import Map = require('map');

class MapProjection implements ISubscriber {
    /// Projected map as an interactive component
    /// Shows the active objects, current camera position
    /// Player can click and move the camera fast

    private background: Raster;
    private ctx: CanvasRenderingContext2D;
    private static bgColor: string = '#20262e';
    private static borderColor: string = '#2d333b';
    private map: Map;
    private objects: Objects;
    private border: Raster;
    private objectProjections: { [type: string]: IGameObject; } = {};
    private cameraProjection: Rect;
    private lastCameraPosition: Point2d;

    constructor(objects: Objects, map: Map, ctx: CanvasRenderingContext2D, topLeft: Point2d, size: Size) {
        this.ctx = ctx;
        this.background = new Raster(ctx, topLeft, size, MapProjection.bgColor, MapProjection.borderColor, 1);
        this.map = map;
        this.objects = objects;
        this.border = this.createBorder();
        this.createUnitsProjections(objects.getUnits());
    }

    draw(camera: Camera): void {
        this.background.draw(camera);
        this.border.draw(camera);

        // Draw unit's projection on the map
        for (const key in this.objectProjections)
            if (this.objectProjections.hasOwnProperty(key))
                this.objectProjections[key].draw(camera);

        // Draw the camera and update only if camera change its position
        if (this.lastCameraPosition && !this.lastCameraPosition.equals(camera.position))
            this.cameraProjection.draw(camera);
        else
            this.cameraProjection = this.createCameraProjection(camera);
            this.lastCameraPosition = camera.position;

        this.cameraProjection.draw(camera);
    }

    notify(context: any) {
        // Update the projection when the context object canges its state
        // TODO: Use notify for this.objects, when the objects uncrease or decrease
        let updatedUnit = <Unit>context;
        this.objectProjections[updatedUnit.id] = this.createProjection(updatedUnit);
    }

    private createUnitsProjections(units: Array<Unit>) {
        // Create initial units projections
        units.forEach(u => {
            this.objectProjections[u.id] = this.createProjection(u);
            u.subscribe(this);
        });
    }

    private createProjection(unit: Unit): IGameObject {
        return new Raster(this.ctx, this.projectPosition(unit.position), this.scaleSize(unit.getRect().size), unit.player.color);
    }

    private createBorder(): Raster {
        // Get scaled size based on the map ratio
        let w = this.map.size().width,
            h = this.map.size().height,
            scaledW: number,
            scaledH: number;

        if (w >= h) {
            scaledW = 1;
            scaledH = h / w;
        } else {
            scaledW = w / h;
            scaledH = 1;
        }

        let size = new Size(this.background.size.width * scaledW, this.background.size.height * scaledH);

        // Get centered position
        let x = (this.background.size.width - size.width) / 2;
        let y = (this.background.size.height - size.height) / 2;

        return new Raster(this.ctx, new Point2d(x, y), size, 'black', MapProjection.borderColor, 1);
    }

    private createCameraProjection(camera: Camera): Rect {
        return new Raster(this.ctx, this.projectPosition(camera.position), this.scaleSize(camera.size), '', 'orange');
    }

    private scaleSize(size: Size): Size {
        let ratioX = size.width / this.map.sizeInPixels().width;
        let ratioY = size.height / this.map.sizeInPixels().height;

        return new Size(this.border.size.width * ratioX, this.border.size.height * ratioY);
    }

    private projectPosition(point: Point2d): Point2d {
        let ratioX = point.x / this.map.sizeInPixels().width;
        let ratioY = point.y / this.map.sizeInPixels().height;

        let x = this.border.position.x + (ratioX * this.border.size.width);
        let y = this.border.position.y + (ratioY * this.border.size.height);

        return new Point2d(x, y);
    }
}

export = MapProjection;