import Functions = require('common/functions'); 
import Size = require('size');

class Point2d {
    public x: number;
    public y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    static zero(): Point2d {
        return new Point2d(0, 0);
    }

    clone(): Point2d {
        return new Point2d(this.x, this.y);
    }

    distanceTo(other: Point2d): number {
        return Math.sqrt(Math.pow(this.x - other.x, 2) + Math.pow(this.y - other.y, 2));
    }

    calcVelocity(other: Point2d, magnitude: number): Point2d {
        let delta = magnitude / this.distanceTo(other);
        let offsetX = Functions.lerp(this.x, other.x, delta) - this.x;
        let offsetY = Functions.lerp(this.y, other.y, delta) - this.y;

        return new Point2d(offsetX, offsetY);
    }

    add(point: Point2d): Point2d {
        this.x += point.x;
        this.y += point.y;

        return this;
    }

    substract(point: Point2d): Point2d {
        this.x -= point.x;
        this.y -= point.y;

        return this;
    }

    equals(other: Point2d): boolean {
        return this.x === other.x && this.y === other.y;
    }

    toCenter(size: Size): Point2d{
        return new Point2d(this.x + size.width / 2 , this.y + size.height / 2)
    }

    toTopLeft(size: Size): Point2d{
        return new Point2d(this.x - size.width / 2 , this.y - size.height / 2)
    }
}

export = Point2d;