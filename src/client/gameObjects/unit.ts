import Point2d = require('common/point2d');
import Player = require('common/player');
import Size = require('common/size');
import Camera = require('common/camera');
import IMovable = require('contracts/IMovable');
import ActiveObject = require('activeObject');

class Unit extends ActiveObject implements IMovable {
    private movementsQueue: Array<Point2d>;
    private nextStep: Point2d;
    private velocity: Point2d;
    private speed: number;

    constructor(id: number, ctx: CanvasRenderingContext2D, center: Point2d, size: Size, speed: number, player: Player) {
        super(id, ctx, center, size, player)
        this.speed = speed;
        this.movementsQueue = new Array<Point2d>();
    }

    loadMovements(path: Array<Point2d>) {
        this.movementsQueue = path;
    }

    move() {
        if (!this.nextStep) {
            // Path is over
            if (this.movementsQueue.length === 0)
                return;

            this.nextStep = this.movementsQueue.shift().clone();

            // First step in the movement queue is the current - skip it
            if (this.center.x === this.nextStep.x && this.center.y === this.nextStep.y) {
                this.nextStep = this.movementsQueue.shift().clone();
            }

            this.velocity = this.center.calcVelocity(this.nextStep, this.speed);
        }

        this.setPosition(this.center.add(this.velocity));

        // If the position is closer than a velocity unit, the next step will jump over the position
        if (Math.abs(this.center.x - this.nextStep.x) < Math.abs(this.velocity.x))
            this.center.x = this.nextStep.x;

        if (Math.abs(this.center.y - this.nextStep.y) < Math.abs(this.velocity.y))
            this.center.y = this.nextStep.y;

        this.notifyStateUpdate();

        // Step is over
        if (this.isPointInside(this.nextStep))
            this.nextStep = null;
    }

    isPointInside(other: Point2d) {
        return this.center.equals(other);
    }

    stop() {
        // TODO: Implement
    }

    draw(camera: Camera): void {
        this.rect.draw(camera);

        this.ctx.beginPath();
        this.ctx.arc(this.center.x - camera.position.x, this.center.y - camera.position.y, this.size.height / 2, 0, 2 * Math.PI);
        this.ctx.lineWidth = 1;
        this.ctx.fillStyle = this.player.color;
        this.ctx.fill();
        this.ctx.stroke();
    }
}

export = Unit;