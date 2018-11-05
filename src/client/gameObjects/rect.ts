import Size = require('common/size');
import Point2d = require('common/point2d');
import IGameObject = require('contracts/iGameObject');
import Camera = require('common/camera');

class Rect implements IGameObject {
    public size: Size;
    public position: Point2d;
    protected ctx: CanvasRenderingContext2D;
    protected fill: string;
    protected stroke: string;
    protected strokewidth: number;

    constructor(ctx: CanvasRenderingContext2D, topLeft: Point2d, size: Size, fill?: string, stroke?: string, strokewidth?: number) {
        this.position = topLeft;
        this.ctx = ctx;
        this.size = size;
        this.fill = fill;
        this.stroke = stroke || fill;
        this.strokewidth = strokewidth || 1;
    }

    draw(camera: Camera): void{
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.fillStyle = this.fill;
        this.ctx.strokeStyle = this.stroke;
        this.ctx.lineWidth = this.strokewidth;
        this.ctx.rect(this.position.x - camera.position.x, this.position.y - camera.position.y, this.size.width, this.size.height);
        this.ctx.stroke();

        if (this.fill) 
            this.ctx.fill();
        
        this.ctx.restore();
    }

    isPointInside(point: Point2d): boolean {
        return (
            point.x >= this.position.x &&
            point.x <= this.position.x + this.size.width &&
            point.y >= this.position.y &&
            point.y <= this.position.y + this.size.height);
    }
}

export = Rect;