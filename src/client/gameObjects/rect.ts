import Size = require('common/size');
import Point2d = require('common/point2d');
import IGameObject = require('contracts/iGameObject');
import Camera = require('common/camera');

abstract class Rect implements IGameObject {
    public size: Size;
    public position: Point2d;
    protected ctx: CanvasRenderingContext2D;
    protected fill: string;
    protected stroke: string;
    protected strokewidth: number;

    constructor(ctx: CanvasRenderingContext2D, topLeft: Point2d, size: Size, fill: string, stroke?: string, strokewidth?: number) {
        this.position = topLeft;
        this.ctx = ctx;
        this.size = size;
        this.fill = fill;
        this.stroke = stroke || fill;
        this.strokewidth = strokewidth || 1;
    }

    abstract draw(camera: Camera): void;

    isPointInside(point: Point2d): boolean {
        return (
            point.x >= this.position.x &&
            point.x <= this.position.x + this.size.width &&
            point.y >= this.position.y &&
            point.y <= this.position.y + this.size.height);
    }
}

export = Rect;