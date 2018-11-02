import Point2d = require('common/point2d');
import IGameObject = require('contracts/iGameObject');

class Circle implements IGameObject {
    public position: Point2d;
    protected ctx: CanvasRenderingContext2D;
    protected fill: string;
    protected stroke: string;
    protected strokewidth: number;
    protected radius: number;

    constructor(ctx: CanvasRenderingContext2D, center: Point2d, radius: number, fill: string, stroke?: string, strokewidth?: number) {
        this.ctx = ctx;
        this.position = center;
        this.radius = radius;
        this.fill = fill;
        this.stroke = stroke || fill;
        this.strokewidth = strokewidth || 1;
    }

    draw(camera: Point2d): void {
        this.ctx.beginPath();
        this.ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
        this.ctx.lineWidth = this.strokewidth;
        this.ctx.fillStyle = this.fill;
        this.ctx.fill();
        this.ctx.stroke();
    }

    isPointInside(point: Point2d): boolean {
        throw new Error("Method not implemented.");
    }
}

export = Circle;