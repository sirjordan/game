import ISubscriber = require('common/contracts/iSubscriber');
import INotifier = require('common/contracts/iNotifier');
import Point2d = require('common/point2d');
import Player = require('common/player');
import Size = require('common/size');
import Camera = require('common/camera');
import ISelectable = require('contracts/iSelectable');
import IMovable = require('contracts/IMovable');
import IOwnedObject = require('contracts/iOwnedObject');
import SelectRect = require('selectRect');

class Unit implements IOwnedObject, ISelectable, IMovable, INotifier {
    public id: number;
    public player: Player;

    protected size: Size;
    // Centered position of the unit
    protected center: Point2d;
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
        this.center = center;
        this.speed = speed;
        this.movementsQueue = new Array<Point2d>();
        
        this.rect = new SelectRect(ctx, center.toTopLeft(size), size);
    }

    getSize(): Size {
        return this.size;
    }
    
    setPosition(point: Point2d): void {
        this.center = point;
        this.rect.setPosition(this.center.toTopLeft(this.size));
    }

    getPosition(): Point2d {
        return this.center;
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
        return this.center.x === other.x && this.center.y === other.y;
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
        this.ctx.arc(this.center.x - camera.position.x, this.center.y - camera.position.y, this.size.height / 2, 0, 2 * Math.PI);
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

    private notifyStateUpdate() {
        // Notify the subscribers, that the state has been updated
        this.stateUpdateSubscribers.forEach(sc => {
            sc.notify(this);
        });
    }
}

export = Unit;