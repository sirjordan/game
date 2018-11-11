import Point2d = require('common/point2d');
import Camera = require('common/camera');
import Size = require('common/size');
import IGameObject = require('contracts/iGameObject');

class Circle implements IGameObject {
    protected size: Size;
    protected position: Point2d;
    protected ctx: CanvasRenderingContext2D;
    protected fill: string;
    protected stroke: string;
    protected strokewidth: number;
    protected radius: number;

    constructor(ctx: CanvasRenderingContext2D, center: Point2d, radius: number, stroke: string, fill?: string, strokewidth?: number) {
        this.ctx = ctx;
        this.position = center;
        this.radius = radius;
        this.fill = fill;
        this.stroke = stroke;
        this.strokewidth = strokewidth || 1;
    }

    getSize(): Size {
        return this.size;
    }

    setPosition(point: Point2d): void {
        this.position = point;
    }
    
    getPosition(): Point2d {
        return this.position;
    }

    draw(camera: Camera): void {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(this.position.x - camera.position.x, this.position.y - camera.position.y, this.radius, 0, 2 * Math.PI);
        this.ctx.lineWidth = this.strokewidth;
        this.ctx.fillStyle = this.fill;
        this.ctx.strokeStyle = this.stroke;

        if (this.fill)
            this.ctx.fill();

        this.ctx.stroke();
        this.ctx.restore();
    }

    isPointInside(point: Point2d): boolean {
        throw new Error("Method not implemented.");
    }
}

export = Circle;