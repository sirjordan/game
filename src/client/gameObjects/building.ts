import ISelectable = require('contracts/iSelectable');
import IOwnedObject = require('contracts/iOwnedObject');
import Point2d = require('common/point2d');
import Player = require('common/player');
import Size = require('common/size');
import Camera = require('common/camera');
import SelectRect = require('selectRect');

class Building implements IOwnedObject, ISelectable {
    public player: Player;
    protected size: Size;
    protected center: Point2d;
    private rect: SelectRect;
    private ctx: CanvasRenderingContext2D;

    constructor(ctx: CanvasRenderingContext2D, center: Point2d, size: Size, player: Player) {
        this.ctx = ctx;
        this.center = center;
        this.size = size;
        this.player = player;
        this.rect = new SelectRect(ctx, center.toTopLeft(size), size);
    }

    getSize(): Size {
        return this.size;
    }

    setPosition(point: Point2d): void {
        this.center = point;
    }

    getPosition(): Point2d {
        return this.center;
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

    isSelected(): boolean {
        return this.rect.isSelected();
    }

    select(): void {
       this.rect.select();
    }

    unSelect(): void {
       this.rect.unSelect();
    }

    getRect(): SelectRect {
        return this.rect;
    }
}

export = Building;