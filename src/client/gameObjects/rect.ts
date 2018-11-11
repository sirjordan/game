import Size = require('common/size');
import Point2d = require('common/point2d');
import IGameObject = require('contracts/iGameObject');
import Camera = require('common/camera');

class Rect implements IGameObject {
    protected size: Size;
    protected topLeft: Point2d;
    protected ctx: CanvasRenderingContext2D;
    protected fill: string;
    protected stroke: string;
    protected strokewidth: number;

    constructor(ctx: CanvasRenderingContext2D, topLeft: Point2d, size: Size, fill?: string, stroke?: string, strokewidth?: number) {
        this.topLeft = topLeft;
        this.ctx = ctx;
        this.size = size;
        this.fill = fill;
        this.stroke = stroke || fill;
        this.strokewidth = strokewidth || 1;
    }

    getSize(): Size {
        return this.size;
    }

    setPosition(point: Point2d): void {
        this.topLeft = point;
    }
    
    getPosition(): Point2d {
       return this.topLeft;
    }

    draw(camera: Camera): void{
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.fillStyle = this.fill;
        this.ctx.strokeStyle = this.stroke;
        this.ctx.lineWidth = this.strokewidth;
        this.ctx.rect(this.topLeft.x - camera.position.x, this.topLeft.y - camera.position.y, this.size.width, this.size.height);
        this.ctx.stroke();

        if (this.fill) 
            this.ctx.fill();
        
        this.ctx.restore();
    }

    isPointInside(point: Point2d): boolean {
        return (
            point.x >= this.topLeft.x &&
            point.x <= this.topLeft.x + this.size.width &&
            point.y >= this.topLeft.y &&
            point.y <= this.topLeft.y + this.size.height);
    }
}

export = Rect;