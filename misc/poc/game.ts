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
            [0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 2, 0, 0, 0, 1, 0, 0, 0, 0, 2],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
            [0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 2],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0],
            [0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 2],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0],
            [0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0],
            [0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 2],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0],
            [0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 1, 0, 2, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0],

        ];
    }
}

class Terrain {
    private ctx: CanvasRenderingContext2D;
    private rasterSize: number;
    private map: Map;
    // Used to remember the last camera position
    private lastCamera: Point2d;

    constructor(ctx: CanvasRenderingContext2D, map: Map, ) {
        this.ctx = ctx;
        this.rasterSize = 50;   // TODO: Take it based on the client display resolution
        this.map = map;
    }

    public maxSize(): Size {
        return new Size(this.map.objects[0].length * this.rasterSize, this.map.objects.length * this.rasterSize);
    }

    public draw(camera: Point2d) {
        // Optimizing the draw() and render only if the camera changes its position
        if (this.lastCamera && camera.x === this.lastCamera.x && camera.y === this.lastCamera.y) {
            return;
        }

        let maxRight = this.ctx.canvas.height;
        let maxTop = this.ctx.canvas.width;

        this.ctx.clearRect(0, 0, maxRight, maxTop);

        let startPos = new Point2d((camera.x % this.rasterSize) * - 1, (camera.y % this.rasterSize) * -1);
        let pos = startPos.clone();

        let row = Math.floor(camera.y / this.rasterSize);
        let col = Math.floor(camera.x / this.rasterSize);
        let startCol = col;

        // Go to the end of the screen X
        for (let i = 1; i <= Math.ceil(maxTop / this.rasterSize) + 1; i++) {
            // No more map rows
            if (!this.map.objects[row]) break;

            // Go to the end of the screen Y
            for (let j = 1; j <= Math.ceil(maxRight / this.rasterSize); j++) {
                // No more map columns
                if (!(this.map.objects[row][col] >= 0)) break;

                let el = this.map.objects[row][col];
                let terrainObject = this.createTerrainObject(el, pos);
                terrainObject.draw(camera);

                col++;
                pos.x = startPos.x + (j * this.rasterSize);
            }

            col = startCol;
            row++;
            pos.x = startPos.x;
            pos.y = startPos.y + (i * this.rasterSize);
        }

        this.lastCamera = camera.clone();
    }

    private createTerrainObject(signature: number, position: Point2d): Raster {
        // TODO: Move to object factory class
        switch (signature) {
            case 0:
                return new Raster(this.ctx, position, this.rasterSize, this.rasterSize, 'green', 'black', 1);
            case 1:
                return new Raster(this.ctx, position, this.rasterSize, this.rasterSize, 'gray', 'black', 1);
            default:
                return new Raster(this.ctx, position, this.rasterSize, this.rasterSize, 'black', 'black', 1);
        }
    }
}

class Game {
    private objects: Objects;
    private gameLayer: HTMLCanvasElement;
    private bgLayer: HTMLCanvasElement;
    private rightPanel: HTMLElement;
    private bottomPanel: HTMLElement;
    private camera: Point2d;
    private terrain: Terrain;
    private stageMax: Size;

    constructor(gameLayerId: string, bgLayerId: string, rightPanelId: string, bottomPanelId: string) {
        if (!gameLayerId) throw new Error('Missing argument: gameLayerId');
        if (!rightPanelId) throw new Error('Missing argument: rightPanelId');
        if (!rightPanelId) throw new Error('Missing argument: rightPanelId');
        if (!bottomPanelId) throw new Error('Missing argument: bottomPanelId');

        this.gameLayer = <HTMLCanvasElement>document.getElementById(gameLayerId);
        this.objects = new Objects(this.gameLayer.getContext("2d"));
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

        let gameCtx = this.gameLayer.getContext("2d");
        let factory = new ObjectFactory(gameCtx);

        this.objects.add(factory.baseUnit(new Point2d(50, 50)));
        this.objects.add(factory.baseUnit(new Point2d(100, 100)));

        this.update();
    };

    private update = () => {
        this.terrain.draw(this.camera);
        this.objects.update();
        this.objects.draw(this.camera);

        requestAnimationFrame(this.update);
    }

    private keyPress(ev: KeyboardEvent): void {
        // TODO: Replace the key with some other

        let cameraSpeed = 5;

        switch (ev.key) {
            case 'd':
                if (this.camera.x + this.stageMax.width < this.terrain.maxSize().width)
                    this.camera.x += cameraSpeed;
                break;
            case 'a':
                if (this.camera.x > 0)
                    this.camera.x -= cameraSpeed;
                break;
            case 'w':
                if (this.camera.y > 0)
                    this.camera.y -= cameraSpeed;
                break;
            case 's':
                if (this.camera.y + this.stageMax.height < this.terrain.maxSize().height)
                    this.camera.y += cameraSpeed;
                break;
        }
    }

    private leftClick(args: MouseEvent): void {
        let mousePosition = new Point2d(args.clientX, args.clientY).add(this.camera);
        let selectable = this.objects.getSelectable();

        // Check if any selectable object is at the mouse click position
        for (const obj of selectable) {
            if (obj.getRect().isPointInside(mousePosition)) {
                if (!obj.isSelected()) {
                    // Unselect all other objects and reset the selection
                    selectable.forEach(el => {
                        el.unSelect();
                    });

                    // Select the only clicked obj
                    obj.select();

                    break;
                }
            } else {
                if (obj.isSelected()) {
                    obj.unSelect();
                }
            }
        }
    }

    private rightClick(args: MouseEvent): void {
        args.preventDefault();

        // Move selected objects
        let mousePosition = new Point2d(args.clientX, args.clientY).add(this.camera);
        this.objects.getUnits().forEach(u => {
            if (u.isSelected()) {
                let path = this.getPath(u.position, mousePosition);
                u.loadMovements(path);
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
        this.stageMax = canvasSize;
        this.gameLayer.width = canvasSize.width;
        this.gameLayer.height = canvasSize.height;
        this.bgLayer.width = canvasSize.width;
        this.bgLayer.height = canvasSize.height;
    }
}

interface IGameObject {
    position: Point2d;
    draw(camera: Point2d): void;
    isPointInside(point: Point2d): boolean;
}

interface IMovable extends IGameObject {
    move(): void;
    loadMovements(path: Array<Point2d>): void;
    stop(): void;
}

interface ISelectable extends IGameObject {
    isSelected(): boolean;
    select(): void;
    unSelect(): void;
    getRect(): SelectRect;
}

class Objects {
    private ctx: CanvasRenderingContext2D;
    // Type separated objects for optimization
    private objects: { [type: string]: Array<IGameObject>; };

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
        this.objects = {};
    }

    add(obj: IGameObject) {
        // Insert the object in Array from its type or create one if missing
        let type = (<any>obj).constructor.name;
        if (!this.objects[type]) {
            this.objects[type] = new Array<IGameObject>();
        }

        this.objects[type].push(obj);
    }

    getAll(): Array<IGameObject> {
        let all = new Array<IGameObject>();
        for (const key in this.objects) {
            if (this.objects.hasOwnProperty(key))
                all = all.concat(this.objects[key]);
        }

        return all;
    }

    getSelectable(): Array<ISelectable> {
        return this.getUnits();
    }

    getUnits(): Array<Unit> {
        return <Array<Unit>>this.objects[(<any>Unit).name];
    }

    update() {
        this.getUnits()
            .filter(u => u.isSelected())
            .forEach(u => {
                u.move();
            });
    }

    // Draw all static and movable objects
    draw(camera: Point2d) {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.getAll().forEach(el => {
            el.draw(camera);
        });

        // TODO: Optimize: Draw only objects in the visible area
    }
}

class ObjectFactory {
    private ctx: CanvasRenderingContext2D;

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
    }

    baseUnit(position: Point2d): Unit {
        let u = new Unit(this.ctx, position, new Size(20, 20), 3);
        return u;
    }
}

abstract class Rect implements IGameObject {
    public position: Point2d;
    protected ctx: CanvasRenderingContext2D;
    protected width: number;
    protected height: number;
    protected fill: string;
    protected stroke: string;
    protected strokewidth: number;

    constructor(ctx: CanvasRenderingContext2D, topLeft: Point2d, width: number, height: number, fill: string, stroke: string, strokewidth: number) {
        this.ctx = ctx;
        this.position = topLeft;
        this.width = width;
        this.height = height;
        this.fill = fill;
        this.stroke = stroke;
        this.strokewidth = strokewidth;
    }

    abstract draw(camera: Point2d): void;

    isPointInside(point: Point2d): boolean {
        return (
            point.x >= this.position.x &&
            point.x <= this.position.x + this.width &&
            point.y >= this.position.y &&
            point.y <= this.position.y + this.height);
    }
}

class Raster extends Rect {
    draw(camera: Point2d): void {
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
}

class SelectRect extends Rect implements ISelectable {
    private _isSelected: boolean
    private originalStroke: string;

    isSelected(): boolean {
        return this._isSelected;
    }

    select(): void {
        this.originalStroke = this.stroke;
        this.stroke = 'orange';
        this._isSelected = true;
    }

    unSelect(): void {
        this.stroke = this.originalStroke;
        this._isSelected = false;
    }

    getRect(): SelectRect {
        return this;
    }

    draw(camera: Point2d): void {
        // TODO: Draw isometric rect or circle
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.fillStyle = this.fill;
        this.ctx.strokeStyle = this.stroke;
        this.ctx.lineWidth = this.strokewidth;
        this.ctx.rect(this.position.x - camera.x, this.position.y - camera.y, this.width, this.height);
        this.ctx.stroke();
        this.ctx.fill();
        this.ctx.restore();
    }
}

class Unit implements ISelectable, IMovable {
    private ctx: CanvasRenderingContext2D;
    private size: Size;
    private movementsQueue: Array<Point2d>;
    private nextStep: Point2d;
    private velocity: Point2d;
    private speed: number;
    // Centered position of the unit
    public position: Point2d;
    // The unit's base rect
    private rect: SelectRect;

    constructor(ctx: CanvasRenderingContext2D, position: Point2d, size: Size, speed: number) {
        this.ctx = ctx;
        this.size = size;
        this.position = position;
        this.speed = speed;
        this.movementsQueue = new Array<Point2d>();
        this.rect = new SelectRect(ctx, new Point2d(0, 0), size.width, size.height, 'green', 'black', 2);
        this.positionRect();
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

        // Step is over
        if (this.isPointInside(this.nextStep))
            this.nextStep = null;
    }

    isPointInside(other: Point2d) {
        return this.position.x === other.x && this.position.y === other.y;
    }

    stop() {
        // Implement
    }

    isSelected(): boolean {
        return this.rect.isSelected();
    }

    draw(camera: Point2d): void {
        this.rect.draw(camera);

        this.ctx.beginPath();
        this.ctx.arc(this.position.x - camera.x, this.position.y - camera.y, this.size.height / 2, 0, 2 * Math.PI);
        this.ctx.lineWidth = 1;
        this.ctx.fillStyle = 'red';
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
}

class Size {
    public width: number;
    public height: number;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
    }
}