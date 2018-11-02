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
    // In pixels
    public rasterSize: number;

    constructor() {
        this.rasterSize = 50;
        this.objects = [
            [0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 2, 0, 0, 0, 1, 0, 0, 0, 0, 2, 1, 2, 0, 0, 0, 1, 0, 1, 0, 2],
            [0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 2, 0, 0, 0, 1, 0, 0, 0, 0, 2, 1, 0, 0, 0, 0, 0, 0, 1, 0, 2],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 1, 0, 0, 1, 0, 2],
            [0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 2, 0, 2, 0, 0, 0, 0, 0, 1, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 2],
            [0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 2, 1, 0, 0, 0, 0, 1, 0, 2],
            [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 2, 1, 2, 0, 0, 1, 0, 0, 1, 0, 2],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0],
            [0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2, 0, 0, 0, 1, 0, 2],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0, 1, 0, 0],
            [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 2, 1, 0, 0, 0, 0, 0, 0, 2],
            [0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 2, 0, 1, 0, 2],
            [0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0, 0, 0, 1, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 2, 1, 1, 0, 0, 0, 0, 0, 1, 0, 2],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 1, 0, 0, 1, 0, 2],
            [0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0, 1, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 2, 0, 0, 0, 0, 0, 0, 0, 2],
            [0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0, 0, 0, 1, 0, 2],
            [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 2, 0, 1, 0, 0, 0, 1, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 2],
            [0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0, 1, 0, 2],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 1, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 1, 0, 2, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 2],
        ];
    }

    size(): Size {
        // Size of the map in objects (not in pixels)
        return new Size(this.objects[0].length, this.objects.length);
    }
}

class Terrain {
    private ctx: CanvasRenderingContext2D;
    private map: Map;
    // Used to remember the last camera position
    private lastCamera: Point2d;
    private objectsFactory: TerrainObjectsFactory;

    constructor(ctx: CanvasRenderingContext2D, map: Map, objectsFactory: TerrainObjectsFactory) {
        this.ctx = ctx;
        this.map = map;
        this.objectsFactory = objectsFactory;
    }

    public size(): Size {
        // Size of the terrain in pixels
        return new Size(this.map.size().width * this.map.rasterSize, this.map.size().height * this.map.rasterSize);
    }

    public draw(camera: Point2d) {
        // Optimizing the draw() and render only if the camera changes its position
        if (this.lastCamera && camera.equals(this.lastCamera)) {
            return;
        }

        let maxRight = this.ctx.canvas.height;
        let maxTop = this.ctx.canvas.width;
        let rasterSize = this.map.rasterSize;

        this.ctx.clearRect(0, 0, maxRight, maxTop);

        let startPos = new Point2d((camera.x % rasterSize) * - 1, (camera.y % rasterSize) * -1);
        let pos = startPos.clone();

        let row = Math.floor(camera.y / rasterSize);
        let col = Math.floor(camera.x / rasterSize);
        let startCol = col;

        // Go to the end of the screen Y
        for (let i = 1; i <= Math.ceil(maxTop / rasterSize) + 1; i++) {
            // No more map rows
            if (!this.map.objects[row]) break;

            // Go to the end of the screen X
            for (let j = 1; j <= Math.ceil(maxRight / rasterSize); j++) {
                // No more map columns
                if (!(this.map.objects[row][col] >= 0)) break;

                let rasterCode = this.map.objects[row][col];
                let terrainObject = this.objectsFactory.create(rasterCode, pos, rasterSize);

                terrainObject.draw(camera);

                col++;
                pos.x = startPos.x + (j * rasterSize);
            }

            col = startCol;
            row++;
            pos.x = startPos.x;
            pos.y = startPos.y + (i * rasterSize);
        }

        this.lastCamera = camera.clone();
    }
}

class Game {
    private objects: Objects;
    private gameLayer: HTMLCanvasElement;
    private gameCtx: CanvasRenderingContext2D;
    private bgLayer: HTMLCanvasElement;
    private toolsLayer: HTMLCanvasElement;
    private rightPanel: HTMLElement;
    private bottomPanel: HTMLElement;
    private camera: Point2d;
    private terrain: Terrain;
    private stageMax: Size;
    private mapProjection: MapProjection;

    constructor(gameLayer: HTMLCanvasElement, bgLayer: HTMLCanvasElement, toolsLayer: HTMLCanvasElement, rightPanel: HTMLElement, bottomPanel: HTMLElement) {
        if (!gameLayer) throw new Error('Missing argument: gameLayer');
        if (!rightPanel) throw new Error('Missing argument: rightPanel');
        if (!rightPanel) throw new Error('Missing argument: rightPanel');
        if (!bottomPanel) throw new Error('Missing argument: bottomPanel');
        if (!toolsLayer) throw new Error('Missing argument: toolsLayer');

        this.gameLayer = gameLayer;
        this.bgLayer = bgLayer;
        this.toolsLayer = toolsLayer;
        this.rightPanel = rightPanel;
        this.bottomPanel = bottomPanel;

        this.gameCtx = this.gameLayer.getContext("2d");
        this.objects = new Objects(this.gameCtx);
        this.camera = Point2d.zero();

        this.setStageSize();

        document.onkeypress = (ev) => this.keyPress(ev);
        this.gameLayer.onclick = (args) => this.leftClick(args);
        this.gameLayer.oncontextmenu = (args) => this.rightClick(args);
    }

    public start(): void {
        let bgCtx = this.bgLayer.getContext('2d');
        let terrainObjectsFactory = new TerrainObjectsFactory(bgCtx);
        let map = new Map();
        this.terrain = new Terrain(bgCtx, map, terrainObjectsFactory);

        let toolsCtx = this.toolsLayer.getContext('2d');
        this.mapProjection = new MapProjection(this.objects, map, toolsCtx, Point2d.zero(), new Size(this.rightPanel.clientWidth, this.rightPanel.clientWidth));

        let player = new Player('red');
        let unitFactory = new UnitFactory(this.gameCtx, player);

        this.objects.add(unitFactory.baseUnit(new Point2d(50, 50)));
        this.objects.add(unitFactory.baseUnit(new Point2d(100, 100)));

        // Start the game loop
        this.update();
    };

    private update = () => {
        this.terrain.draw(this.camera);
        this.objects.update();
        this.objects.draw(this.camera);
        this.mapProjection.draw(this.camera);

        requestAnimationFrame(this.update);
    }

    private keyPress(ev: KeyboardEvent): void {
        // TODO: Replace the key with some other

        let cameraSpeed = 15;

        switch (ev.key) {
            case 'd':
                if (this.camera.x + this.stageMax.width < this.terrain.size().width)
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
                if (this.camera.y + this.stageMax.height < this.terrain.size().height)
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
        //this.toolsLayer
        this.toolsLayer.width = this.rightPanel.clientWidth;
        this.toolsLayer.height = this.rightPanel.clientHeight;
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

    draw(camera: Point2d) {
        // Draw all static and movable objects
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.getAll().forEach(el => {
            el.draw(camera);
        });

        // TODO: Optimize: Draw only objects in the visible area
    }
}

class TerrainObjectsFactory {
    private ctx: CanvasRenderingContext2D;

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
    }

    create(rasterCode: number, position: Point2d, size: number): Raster {
        switch (rasterCode) {
            case 0:
                return new Raster(this.ctx, position, new Size(size, size), '#66440b');
            case 1:
                return new Raster(this.ctx, position, new Size(size, size), '#3d3321');
            default:
                return new Raster(this.ctx, position, new Size(size, size), '#0f0b04');
        }
    }
}

class UnitFactory {
    private ctx: CanvasRenderingContext2D;
    private player: Player;

    constructor(ctx: CanvasRenderingContext2D, player: Player) {
        this.ctx = ctx;
        this.player = player;
    }

    baseUnit(position: Point2d): Unit {
        return new Unit(this.ctx, position, new Size(20, 20), 3, this.player);
    }
}

abstract class Rect implements IGameObject {
    public position: Point2d;
    public size: Size;
    protected ctx: CanvasRenderingContext2D;
    protected fill: string;
    protected stroke: string;
    protected strokewidth: number;

    constructor(ctx: CanvasRenderingContext2D, topLeft: Point2d, size: Size, fill: string, stroke?: string, strokewidth?: number) {
        this.ctx = ctx;
        this.position = topLeft;
        this.size = size;
        this.fill = fill;
        this.stroke = stroke || fill;
        this.strokewidth = strokewidth || 1;
    }

    abstract draw(camera: Point2d): void;

    isPointInside(point: Point2d): boolean {
        return (
            point.x >= this.position.x &&
            point.x <= this.position.x + this.size.width &&
            point.y >= this.position.y &&
            point.y <= this.position.y + this.size.height);
    }
}

class Circle implements IGameObject {
    public position: Point2d;
    protected ctx: CanvasRenderingContext2D;
    protected fill: string;
    protected stroke: string;
    protected strokewidth: number;
    protected radius: number;

    constructor(ctx: CanvasRenderingContext2D, center: Point2d, radius: number, fill: string, stroke?: string, strokewidth?: number) {
        this.ctx = ctx;
        this.position = center;
        this.radius = radius;
        this.fill = fill;
        this.stroke = stroke || fill;
        this.strokewidth = strokewidth || 1;
    }

    draw(camera: Point2d): void {
        this.ctx.beginPath();
        this.ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
        this.ctx.lineWidth = this.strokewidth;
        this.ctx.fillStyle = this.fill;
        this.ctx.fill();
        this.ctx.stroke();
    }

    isPointInside(point: Point2d): boolean {
        throw new Error("Method not implemented.");
    }
}

class Raster extends Rect {
    draw(camera: Point2d): void {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.fillStyle = this.fill;
        this.ctx.strokeStyle = this.stroke;
        this.ctx.lineWidth = this.strokewidth;
        this.ctx.rect(this.position.x, this.position.y, this.size.width, this.size.height);
        this.ctx.stroke();
        this.ctx.fill();
        this.ctx.restore();
    }
}

class MapProjection extends Raster {
    /// Projected map as an interactive component
    /// Shows the active objects, current camera position
    /// Player can click and move the camera fast

    private static bgColor: string = '#20262e';
    private static borderColor: string = '#2d333b';
    private map: Map;
    private objects: Objects;
    private border: Raster;

    constructor(objects: Objects, map: Map, ctx: CanvasRenderingContext2D, topLeft: Point2d, size: Size) {
        super(ctx, topLeft, size, MapProjection.bgColor, MapProjection.borderColor, 1);
        this.map = map;
        this.objects = objects;
        this.border = this.createBorder();
    }

    draw(camera: Point2d): void {
        super.draw(camera);
        this.border.draw(camera);

         // Unit's projection on the map
        this.objects.getUnits().forEach(u => {
            // TODO: Optimize - Mandatory!
            // 1. Create objects in every frame may be too expensive. Must remake it!
            let ratioX = u.position.x / (this.map.size().width * this.map.rasterSize);
            let ratioY = u.position.y / (this.map.size().height * this.map.rasterSize);

            let x = this.border.position.x + (ratioX * this.border.size.width);
            let y = this.border.position.y + (ratioY * this.border.size.height);

            let unitProjection = new Circle(this.ctx, new Point2d(x, y), 3, u.player.color);

            unitProjection.draw(camera);
        });
    }

    private createBorder(): Raster {
        // Get scaled size based on the map ratio
        let w = this.map.size().width,
            h = this.map.size().height,
            scaledW: number,
            scaledH: number;

        if (w >= h) {
            scaledW = 1;
            scaledH = h / w;
        } else {
            scaledW = w / h;
            scaledH = 1;
        }

        let size = new Size(this.size.width * scaledW, this.size.height * scaledH);

        // Get centered position
        let x = (this.size.width - size.width) / 2;
        let y = (this.size.height - size.height) / 2;

        return new Raster(this.ctx, new Point2d(x, y), size, 'black', MapProjection.borderColor, 1);
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
        this.ctx.rect(this.position.x - camera.x, this.position.y - camera.y, this.size.width, this.size.height);
        this.ctx.stroke();
        this.ctx.fill();
        this.ctx.restore();
    }
}

class Unit implements ISelectable, IMovable {
    public player: Player;
    // Centered position of the unit
    public position: Point2d;
    // The unit's base rect
    private rect: SelectRect;
    private ctx: CanvasRenderingContext2D;
    private size: Size;
    private movementsQueue: Array<Point2d>;
    private nextStep: Point2d;
    private velocity: Point2d;
    private speed: number;

    constructor(ctx: CanvasRenderingContext2D, center: Point2d, size: Size, speed: number, player: Player) {
        this.player = player;
        this.ctx = ctx;
        this.size = size;
        this.position = center;
        this.speed = speed;
        this.movementsQueue = new Array<Point2d>();
        this.rect = new SelectRect(ctx, Point2d.zero(), size, 'green', 'black', 2);
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
        // TODO: Implement
    }

    isSelected(): boolean {
        return this.rect.isSelected();
    }

    draw(camera: Point2d): void {
        this.rect.draw(camera);

        this.ctx.beginPath();
        this.ctx.arc(this.position.x - camera.x, this.position.y - camera.y, this.size.height / 2, 0, 2 * Math.PI);
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
}

class Player {
    public color: string;

    constructor(color: string) {
        this.color = color;
    }
}

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

    equals(other: Point2d): boolean {
        return this.x === other.x && this.y === other.y;
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