import ISelectable = require('contracts/iSelectable');
import IOwnedObject = require('contracts/iOwnedObject');
import Point2d = require('common/point2d');
import Player = require('common/player');
import Size = require('common/size');
import Camera = require('common/camera');
import SelectRect = require('selectRect');

class Building implements IOwnedObject, ISelectable {
    public player: Player;
    public position: Point2d;
    public size: Size;

    private rect: SelectRect;
    private ctx: CanvasRenderingContext2D;

    constructor(ctx: CanvasRenderingContext2D, center: Point2d, size: Size, player: Player) {
        this.ctx = ctx;
        this.position = center;
        this.size = size;
        this.player = player;
        this.rect = new SelectRect(ctx, center, size);
    }

    draw(camera: Camera): void {
        this.rect.draw(camera);

        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.fillStyle = this.player.color;
        this.ctx.strokeStyle = this.player.color;
        this.ctx.lineWidth = 1;
        this.ctx.rect(this.position.x - camera.position.x, this.position.y - camera.position.y, this.size.width, this.size.height);
        this.ctx.stroke();
        this.ctx.fill();
        this.ctx.restore();
    }

    isPointInside(point: Point2d): boolean {
        return this.rect.isPointInside(point);
    }

    isSelected(): boolean {
        throw new Error("Method not implemented.");
    }

    select(): void {
        throw new Error("Method not implemented.");
    }

    unSelect(): void {
        throw new Error("Method not implemented.");
    }

    getRect(): SelectRect {
        return this.rect;
    }
}

export = Building;