import ISubscriber = require('common/contracts/iSubscriber');
import INotifier = require('common/contracts/iNotifier');
import Point2d = require('common/point2d');
import Player = require('common/player');
import Size = require('common/size');
import Camera = require('common/camera');
import ISelectable = require('contracts/iSelectable');
import IMovable = require('contracts/IMovable');
import IGameObject = require('contracts/iGameObject');
import IOwnedObject = require('contracts/iOwnedObject');
import SelectRect = require('selectRect');

class Unit implements IOwnedObject, ISelectable, IMovable, INotifier {
    public id: number;
    public size: Size;
    public player: Player;
    // Centered position of the unit
    public position: Point2d;
    // The unit's base rect
    private rect: SelectRect;
    private ctx: CanvasRenderingContext2D;
    private movementsQueue: Array<Point2d>;
    private nextStep: Point2d;
    private velocity: Point2d;
    private speed: number;
    // List of subscriber that are notified when the object state updates
    private stateUpdateSubscribers: Array<ISubscriber> = new Array<ISubscriber>();

    constructor(id: number, ctx: CanvasRenderingContext2D, center: Point2d, size: Size, speed: number, player: Player) {
        this.id = id;
        this.player = player;
        this.ctx = ctx;
        this.size = size;
        this.position = center;
        this.speed = speed;
        this.movementsQueue = new Array<Point2d>();
        this.rect = new SelectRect(ctx, Point2d.zero(), size, 'green', 'black', 2);
        this.positionRect();
    }

    subscribe(subscriber: ISubscriber): void {
        this.stateUpdateSubscribers.push(subscriber);
    }

    getRect(): SelectRect {
        return this.rect;
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
            if (this.position.x === this.nextStep.x && this.position.y === this.nextStep.y) {
                this.nextStep = this.movementsQueue.shift().clone();
            }

            this.velocity = this.position.calcVelocity(this.nextStep, this.speed);
        }

        this.position.add(this.velocity);

        // If the position is closer than a velocity unit, the next step will jump over the position
        if (Math.abs(this.position.x - this.nextStep.x) < Math.abs(this.velocity.x))
            this.position.x = this.nextStep.x;

        if (Math.abs(this.position.y - this.nextStep.y) < Math.abs(this.velocity.y))
            this.position.y = this.nextStep.y;

        this.positionRect();
        this.notifyStateUpdate();

        // Step is over
        if (this.isPointInside(this.nextStep))
            this.nextStep = null;
    }

    isPointInside(other: Point2d) {
        return this.position.x === other.x && this.position.y === other.y;
    }

    stop() {
        // TODO: Implement
    }

    isSelected(): boolean {
        return this.rect.isSelected();
    }

    draw(camera: Camera): void {
        this.rect.draw(camera);

        this.ctx.beginPath();
        this.ctx.arc(this.position.x - camera.position.x, this.position.y - camera.position.y, this.size.height / 2, 0, 2 * Math.PI);
        this.ctx.lineWidth = 1;
        this.ctx.fillStyle = this.player.color;
        this.ctx.fill();
        this.ctx.stroke();
    }

    select(): void {
        this.rect.select();
    }

    unSelect(): void {
        this.rect.unSelect();
    }

    private positionRect(): void {
        this.rect.position = new Point2d((this.position.x - this.size.width / 2), (this.position.y - this.size.height / 2))
    }

    private notifyStateUpdate() {
        // Notify the subscribers, that the state has been updated
        this.stateUpdateSubscribers.forEach(sc => {
            sc.notify(this);
        });
    }
}

export = Unit;