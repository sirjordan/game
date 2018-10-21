class Utils {
    static lerp(v0: number, v1: number, t: number): number {
        return v0 + t * (v1 - v0);
    }

    static calcCanvasSize(rightPanel: HTMLElement, bottomPanel: HTMLElement): Size {
        let rightPanelOffset = this.calcOffset(rightPanel);
        let bottomPanelOffset = this.calcOffset(bottomPanel);
        return new Size(rightPanelOffset.left, bottomPanelOffset.top);
    }

    static calcOffset(el) {
        // Calculates the TopLeft of Html element
        var _x = 0;
        var _y = 0;
        while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
            _x += el.offsetLeft - el.scrollLeft;
            _y += el.offsetTop - el.scrollTop;
            el = el.offsetParent;
        }

        return { top: _y, left: _x };
    }
}

class Map {
    public objects: number[][];

    constructor() {
        this.objects = [
            [0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
            [0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0],
            [0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0],
            [0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0],
            [0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0],

        ];
    }
}

class Terrain {
    private ctx: CanvasRenderingContext2D;
    private rasterSize: number;
    private map: Map;

    constructor(ctx: CanvasRenderingContext2D, map: Map, ) {
        this.ctx = ctx;
        this.rasterSize = 50;   // TODO: Take it based on the client display resolution
        this.map = map;
    }

    public draw(camera: Point2d) {
        let maxRight = this.ctx.canvas.height;
        let maxTop = this.ctx.canvas.width;

        this.ctx.clearRect(0, 0, maxRight, maxTop);

        let startPos = new Point2d((camera.x % this.rasterSize) * - 1, (camera.y % this.rasterSize) * -1);
        let pos = startPos.clone();

        let row = Math.floor(camera.x / this.rasterSize);
        let col = Math.floor(camera.y / this.rasterSize);

        // Go to the end of the screen X
        while (row < Math.ceil(maxRight / this.rasterSize)) {
            // No map rows
            if (!this.map.objects[row]) break;

            // Go to the end of the screen Y
            while (col < Math.ceil(maxTop / this.rasterSize)) {
                // No map columns
                if (!(this.map.objects[row][col] >= 0)) break;

                let el = this.map.objects[row][col];
                let terrainObject = this.createTerrainObject(el, pos);
                terrainObject.draw();

                col++;
                pos.x = startPos.x + (col * this.rasterSize);
            }

            col = 0;
            row++;
            pos.x = startPos.x;
            pos.y = startPos.y + (row * this.rasterSize);
        }
    }

    private createTerrainObject(signature: number, position: Point2d): Rect {
        switch (signature) {
            case 0:
                return new Rect(this.ctx, position, this.rasterSize, this.rasterSize, 'green', 'black', 1);
            case 1:
                return new Rect(this.ctx, position, this.rasterSize, this.rasterSize, 'gray', 'black', 1);
            default:
                return new Rect(this.ctx, position, this.rasterSize, this.rasterSize, 'black', 'black', 1);
        }
    }
}

class Game {
    private objects: ObjectPool;
    private gameLayer: HTMLCanvasElement;
    private bgLayer: HTMLCanvasElement;
    private rightPanel: HTMLElement;
    private bottomPanel: HTMLElement;
    private camera: Point2d;
    private terrain: Terrain;

    constructor(gameLayerId: string, bgLayerId: string, rightPanelId: string, bottomPanelId: string) {
        if (!gameLayerId) throw new Error('Missing argument: gameLayerId');
        if (!rightPanelId) throw new Error('Missing argument: rightPanelId');
        if (!rightPanelId) throw new Error('Missing argument: rightPanelId');
        if (!bottomPanelId) throw new Error('Missing argument: bottomPanelId');

        this.objects = new ObjectPool();
        this.gameLayer = <HTMLCanvasElement>document.getElementById(gameLayerId);
        this.bgLayer = <HTMLCanvasElement>document.getElementById(bgLayerId);
        this.rightPanel = document.getElementById(rightPanelId);
        this.bottomPanel = document.getElementById(bottomPanelId);
        this.camera = new Point2d(0, 0);

        this.setStageSize();

        document.onkeypress = (ev) => this.keyPress(ev);
        this.gameLayer.onclick = (args) => this.leftClick(args);
        this.gameLayer.oncontextmenu = (args) => this.rightClick(args);
    }

    public start(): void {
        let bgCtx = this.bgLayer.getContext('2d');
        let map = new Map();
        this.terrain = new Terrain(bgCtx, map);
        this.terrain.draw(this.camera);

        let gameCtx = this.gameLayer.getContext("2d");
        let factory = new ObjectFactory(gameCtx, this.objects);

        let u_1 = factory.createUnit(new Point2d(20, 20), 25, 25, "blue", "red", 2);
        u_1.draw();

        let u_2 = factory.createUnit(new Point2d(20, 80), 25, 25, "green", "yellow", 2);
        u_2.draw();
    };

    private keyPress(ev: KeyboardEvent): void {
        // TODO: Replace the key with some other

        let cameraSpeed = 5;
        switch (ev.key) {
            case 'd':
                this.camera.x += cameraSpeed;
                break;
            case 'a':
                if (this.camera.x > 0) {
                    this.camera.x -= cameraSpeed;
                    break;
                }
            case 'w':
                if (this.camera.y > 0) {
                    this.camera.y -= cameraSpeed;
                    break;
                }
            case 's':
                this.camera.y += cameraSpeed;
                break;
        }

        this.terrain.draw(this.camera);
    }

    private leftClick(args: MouseEvent): void {
        let mousePosition = new Point2d(args.clientX, args.clientY);

        // Check if any selectable object is at the mouse click position
        for (const obj of this.objects.selectable) {
            if (obj.isPointInside(mousePosition)) {
                if (!obj.selected) {
                    // Unselect all other objects and reset the selection
                    this.objects.selectable.forEach(el => {
                        el.unSelect();
                    });

                    // Select the only clicked obj
                    obj.select();

                    break;
                }
            } else {
                if (obj.selected) {
                    obj.unSelect();
                }
            }
        }
    }

    private rightClick(args: MouseEvent): void {
        args.preventDefault();

        // Move selected objects
        let mousePosition = new Point2d(args.clientX, args.clientY)
        this.objects.units.forEach(u => {
            if (u.selected) {
                let path = this.getPath(u.position, mousePosition);
                u.move(path);
            }
        });
    }

    private getPath(from: Point2d, to: Point2d): Array<Point2d> {
        let path = new Array<Point2d>();

        // TODO: Make req to the server and get the path
        path.push(from);
        path.push(new Point2d(to.x, from.y));
        path.push(to);

        return path;
    }

    private setStageSize(): void {
        let canvasSize = Utils.calcCanvasSize(this.rightPanel, this.bottomPanel);
        this.gameLayer.width = canvasSize.width;
        this.gameLayer.height = canvasSize.height;
        this.bgLayer.width = canvasSize.width;
        this.bgLayer.height = canvasSize.height;
    }
}

interface IGameObject {
    position: Point2d;
}

interface IMovable extends IGameObject {
    speed: number;
    move(path: Array<Point2d>);
    stop(): void;
}

interface ISelectable extends IGameObject, IShape {
    selected: boolean;
    select(): void;
    unSelect(): void;
}

interface IUnit extends ISelectable, IMovable { }

interface IShape {
    draw(): void;
    isPointInside(point: Point2d): boolean;
}

class ObjectPool {
    public selectable: Array<ISelectable>;
    public units: Array<IUnit>;

    constructor() {
        this.selectable = new Array<ISelectable>();
        this.units = new Array<Unit>();
    }

    addSelectable(obj: ISelectable) {
        this.selectable.push(obj);
    }

    addUnit(obj: IUnit) {
        this.units.push(obj);
        this.addSelectable(obj);
    }
}

class ObjectFactory {
    private ctx: CanvasRenderingContext2D;
    private objectPool: ObjectPool;

    constructor(ctx: CanvasRenderingContext2D, objectPool: ObjectPool) {
        this.ctx = ctx;
        this.objectPool = objectPool;
    }

    createRect(position: Point2d, width: number, height: number, fill: string, stroke: string, strokewidth: number): IShape {
        let r = new Rect(this.ctx, position, width, height, fill, stroke, strokewidth);
        this.objectPool.addSelectable(r);
        return r;
    }

    createUnit(position: Point2d, width: number, height: number, fill: string, stroke: string, strokewidth: number): IUnit {
        let u = new Unit(this.ctx, position, width, height, fill, stroke, strokewidth);
        this.objectPool.addUnit(u);
        return u;
    }
}

abstract class Shape {
    protected ctx: CanvasRenderingContext2D;
    public position: Point2d;

    constructor(ctx: CanvasRenderingContext2D, position: Point2d) {
        this.ctx = ctx;
        this.position = position;
    }

    abstract draw(): void;
    abstract clear(): void;
    abstract isPointInside(point: Point2d): boolean;
}

class Rect extends Shape implements ISelectable {
    private originalStroke: string;
    selected: boolean
    width: number;
    height: number;
    fill: string;
    stroke: string;
    strokewidth: number;

    constructor(ctx: CanvasRenderingContext2D, topLeft: Point2d, width: number, height: number, fill: string, stroke: string, strokewidth: number) {
        super(ctx, topLeft);
        this.width = width;
        this.height = height;
        this.fill = fill;
        this.stroke = stroke;
        this.strokewidth = strokewidth;
        this.selected = false;
    }

    draw(): void {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.fillStyle = this.fill;
        this.ctx.strokeStyle = this.stroke;
        this.ctx.lineWidth = this.strokewidth;
        this.ctx.rect(this.position.x, this.position.y, this.width, this.height);
        this.ctx.stroke();
        this.ctx.fill();
        this.ctx.restore();
    }

    clear(): void {
        this.ctx.clearRect(
            this.position.x - this.strokewidth,
            this.position.y - this.strokewidth,
            this.position.x + this.width + this.strokewidth,
            this.position.y + this.height + this.strokewidth);
    }

    isPointInside(point: Point2d): boolean {
        return (
            point.x >= this.position.x &&
            point.x <= this.position.x + this.width &&
            point.y >= this.position.y &&
            point.y <= this.position.y + this.height);
    }

    select(): void {
        this.originalStroke = this.stroke;
        this.stroke = 'orange';
        this.draw();
        this.selected = true;
    }

    unSelect(): void {
        this.stroke = this.originalStroke;
        this.draw();
        this.selected = false;
    }
}

class Unit extends Rect implements IMovable {
    speed: number;

    constructor(ctx: CanvasRenderingContext2D, position: Point2d, width: number, height: number, fill: string, stroke: string, strokewidth: number) {
        super(ctx, position, width, height, fill, stroke, strokewidth);
        this.speed = 3;
    }

    move(path: Array<Point2d>) {
        let that = this;

        // The first path step must be the current
        let startPoint = path.shift().clone();
        let endPoint = path.shift().clone();

        let velocity = startPoint.calcVelocity(endPoint, that.speed);

        function update() {
            // Step over
            if (that.isPointInside(endPoint)) {
                // Path over
                if (path.length === 0) {
                    return;
                }

                startPoint = endPoint;
                endPoint = path.shift().clone();

                velocity = startPoint.calcVelocity(endPoint, that.speed);
            }

            that.clear();
            that.position.x += velocity.x;
            that.position.y += velocity.y;
            that.draw();

            requestAnimationFrame(update);
        }
        update();
    }

    stop() {
        // Implement
    }
}

class Point2d {
    public x: number;
    public y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    clone(): Point2d {
        return new Point2d(this.x, this.y);
    }

    distanceTo(other: Point2d): number {
        return Math.sqrt(Math.pow(this.x - other.x, 2) + Math.pow(this.y - other.y, 2));
    }

    calcVelocity(other: Point2d, magnitude: number): Point2d {
        let delta = magnitude / this.distanceTo(other);
        let offsetX = Utils.lerp(this.x, other.x, delta) - this.x;
        let offsetY = Utils.lerp(this.y, other.y, delta) - this.y;

        return new Point2d(offsetX, offsetY);
    }
}

class Size {
    public width: number;
    public height: number;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
    }
}