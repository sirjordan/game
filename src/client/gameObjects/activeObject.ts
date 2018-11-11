import IActiveObject = require('contracts/iActiveObject');
import ISubscriber = require('common/contracts/iSubscriber');
import Point2d = require('common/point2d');
import Player = require('common/player');
import Size = require('common/size');
import Camera = require('common/camera');
import ISelectable = require('contracts/iSelectable');
import SelectRect = require('selectRect');
import IGameObject = require('contracts/iGameObject');
import INotifier = require('common/contracts/iNotifier');

abstract class ActiveObject implements IActiveObject, ISelectable, INotifier, IGameObject {
    protected id: number;
    protected player: Player;
    protected size: Size;
    protected ctx: CanvasRenderingContext2D;
    protected center: Point2d;
    // The objects's base rect
    protected rect: SelectRect;
    // List of subscriber that are notified when the object state updates
    protected stateUpdateSubscribers: Array<ISubscriber> = new Array<ISubscriber>();

    constructor(id: number, ctx: CanvasRenderingContext2D, center: Point2d, size: Size, player: Player) {
        this.id = id;
        this.player = player;
        this.ctx = ctx;
        this.size = size;
        this.center = center;
        this.rect = new SelectRect(ctx, center.toTopLeft(size), size);
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

    getPlayer(): Player {
        return this.player;
    }

    getId(): number {
        return this.id;
    }

    getSize(): Size {
        return this.size;
    }

    subscribe(subscriber: ISubscriber): void {
        this.stateUpdateSubscribers.push(subscriber);
    }

    protected notifyStateUpdate() {
        // Notify the subscribers, that the state has been updated
        this.stateUpdateSubscribers.forEach(sc => {
            sc.notify(this);
        });
    }

    setPosition(point: Point2d): void {
        this.center = point;
        this.rect.setPosition(this.center.toTopLeft(this.size));
    }

    getPosition(): Point2d {
        return this.center;
    }

    abstract draw(camera: Camera): void;

    abstract isPointInside(point: Point2d): boolean;
}

export = ActiveObject;