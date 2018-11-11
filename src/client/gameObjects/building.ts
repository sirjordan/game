import ActiveObject = require('activeObject');
import Point2d = require('common/point2d');
import Player = require('common/player');
import Size = require('common/size');
import Camera = require('common/camera');

class Building extends ActiveObject {
    constructor(id: number, ctx: CanvasRenderingContext2D, center: Point2d, size: Size, player: Player) {
        super(id, ctx, center, size, player)
    }

    draw(camera: Camera): void {
        this.rect.draw(camera);

        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.fillStyle = this.player.color;
        this.ctx.strokeStyle = this.player.color;
        this.ctx.lineWidth = 1;
        this.ctx.rect(this.center.x - camera.position.x - this.size.width / 2, this.center.y - camera.position.y - this.size.height / 2, this.size.width, this.size.height);
        this.ctx.stroke();
        this.ctx.fill();
        this.ctx.restore();
    }

    isPointInside(point: Point2d): boolean {
        return this.rect.isPointInside(point);
    }
}

export = Building;