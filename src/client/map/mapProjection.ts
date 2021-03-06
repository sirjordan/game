import IGameObject = require('gameObjects/contracts/iGameObject');
import ActiveObject = require('gameObjects/activeObject');
import Raster = require('gameObjects/raster');
import Unit = require('gameObjects/unit');
import Objects = require('gameObjects/objects');
import Rect = require('gameObjects/rect');
import ISubscriber = require('../messaging/iSubscriber');
import Point2d = require('common/point2d');
import Size = require('common/size');
import Camera = require('common/camera');
import Map = require('map');
import Settings = require('settings');

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
        this.createInitialProjections(objects.getActiveObjects());
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
            this.cameraProjection = this.projectCamera(camera);

        this.lastCameraPosition = camera.position.clone();
        this.cameraProjection.draw(camera);
    }

    notify(context: any) {
        // Update the projection when the context object canges its state
        // TODO: Use notify for this.objects, when the objects uncrease or decrease
        let updatedUnit = <Unit>context;
        this.objectProjections[updatedUnit.getId()] = this.project(updatedUnit);
    }

    calcAbsolutePosition(relativePosition: Point2d) {
        let ratioX = (relativePosition.x - this.border.getPosition().x) / this.background.getSize().width;
        let ratioY = (relativePosition.y - this.border.getPosition().y) / this.background.getSize().height;

        let x = ratioX * this.map.sizeInPixels().width;
        let y = ratioY * this.map.sizeInPixels().height;

        let absolute = new Point2d(x, y);

        return absolute;
    }

    private createInitialProjections(units: Array<ActiveObject>) {
        units.forEach(u => {
            this.objectProjections[u.getId()] = this.project(u);
            u.subscribe(this);
        });
    }

    private project(obj: ActiveObject): IGameObject {
        return new Raster(this.ctx, this.calcRelativePosition(obj.getPosition()), this.scaleSize(obj.getSize()), obj.getPlayer().color);
    }

    private projectCamera(camera: Camera): Rect {
        return new Raster(this.ctx, this.calcRelativePosition(camera.position), this.scaleSize(camera.size), '', Settings.MAIN_COLOR);
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

        let size = new Size(this.background.getSize().width * scaledW, this.background.getSize().height * scaledH);

        // Get centered position
        let x = (this.background.getSize().width - size.width) / 2;
        let y = (this.background.getSize().height - size.height) / 2;

        return new Raster(this.ctx, new Point2d(x, y), size, 'black', MapProjection.borderColor, 1);
    }

    private scaleSize(size: Size): Size {
        let ratioX = size.width / this.map.sizeInPixels().width;
        let ratioY = size.height / this.map.sizeInPixels().height;

        return new Size(this.border.getSize().width * ratioX, this.border.getSize().height * ratioY);
    }

    private calcRelativePosition(absolutePosition: Point2d): Point2d {
        let ratioX = absolutePosition.x / this.map.sizeInPixels().width;
        let ratioY = absolutePosition.y / this.map.sizeInPixels().height;

        let x = ratioX * this.border.getSize().width;
        let y = ratioY * this.border.getSize().height;

        return new Point2d(x, y).add(this.border.getPosition());
    }
}

export = MapProjection;