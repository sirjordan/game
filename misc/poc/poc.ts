class Settings {
    static animationSpeed = 0.01;
}

class Utils {
    static lerp(v0: number, v1: number, t: number): number {
        return v0 + t * (v1 - v0);
    }

    static calcCanvasSize(): Size {
        // TODO: Take the window width/height of the window
        return new Size(900, 500);
    }
}

class State {
    static canvasSize: Size;
}

class GameEngine {
    private selectable: Array<ISelectable>;
    private movable: Array<IMovable>;
    private selected: Array<ISelectable>;

    constructor() {
        this.selectable = new Array<ISelectable>();
        this.movable = new Array<IMovable>();
        this.selected = new Array<ISelectable>();
    }

    public init(canvasId: string) {
        let canvasSize = Utils.calcCanvasSize();
        State.canvasSize = canvasSize;

        let canvas = <HTMLCanvasElement>document.getElementById(canvasId);

        // Style the canvas
        canvas.width = canvasSize.width;
        canvas.height = canvasSize.height;

        let ctx = canvas.getContext("2d");
        let shapes = new ObjectFactory(ctx, this.selectable, this.movable);

        let u_1 = shapes.createUnit(new Point2d(20, 20), 25, 25, "blue", "red", 2);
        u_1.draw();

        let u_2 = shapes.createUnit(new Point2d(20, 80), 25, 25, "green", "yellow", 2);
        u_2.draw();

        // Attach click event
        let that = this;
        canvas.onclick = function (args) {
            let mousePosition = new Point2d(args.clientX, args.clientY)

            // Check if any selectable object is at the mouse click position
            for (const obj of that.selectable) {
                if (obj.isPointInside(mousePosition)) {
                    if (!obj.selected) {
                        // Unselect all other objects and reset the selection
                        that.selected.forEach(el => {
                            el.unSelect();
                        });
                        that.selected = [];

                        // Select the only clicked obj
                        that.selected.push(obj);
                        obj.select();

                        break;
                    }
                } else {
                    if (obj.selected) {
                        obj.unSelect();
                    }
                }
            }

            // Move selected
            if (that.selected.length > 0) {
                that.selected.forEach(el => {
                    let path = that.getPath(that.movable[0].position, mousePosition);
                    that.movable[0].move(path);
                });
            }
        };

        canvas.oncontextmenu = function(args){
            args.preventDefault();
        };
    };

    private getPath(from: Point2d, to: Point2d): Array<Point2d> {
        let path = new Array<Point2d>();

        // TODO: Make req to the server and get the path
        path.push(from);
        path.push(new Point2d(to.x, from.y));
        path.push(to);

        return path;
    }
}

interface IGameObject {
    position: Point2d;
}

interface IMovable extends IGameObject {
    speed: number;
    move(path: Array<Point2d>);
}

interface ISelectable extends IGameObject, IShape {
    selected: boolean;
    select(): void;
    unSelect(): void;
}

interface IShape {
    draw(): void;
    isPointInside(point: Point2d): boolean;
}

class ObjectFactory {
    private ctx: CanvasRenderingContext2D;
    private selectableObjects: Array<ISelectable>;
    private movableObjects: Array<IMovable>;

    constructor(ctx: CanvasRenderingContext2D, selectableObjects: Array<ISelectable>, movableObjects: Array<IMovable>) {
        this.ctx = ctx;
        this.selectableObjects = selectableObjects;
        this.movableObjects = movableObjects;
    }

    createRect(position: Point2d, width: number, height: number, fill: string, stroke: string, strokewidth: number): Shape {
        let r = new Rect(this.ctx, position, width, height, fill, stroke, strokewidth);
        this.selectableObjects.push(r);
        return r;
    }

    createUnit(position: Point2d, width: number, height: number, fill: string, stroke: string, strokewidth: number) {
        let u = new Unit(this.ctx, position, width, height, fill, stroke, strokewidth);
        this.selectableObjects.push(u);
        this.movableObjects.push(u);
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
        this.speed = 1;
    }

    move(path: Array<Point2d>) {
        let that = this;

        // The first path step must be the current
        let startPoint = path.shift().clone();
        let endPoint = path.shift().clone();

        let delta = that.speed * Settings.animationSpeed;
        let dX = Utils.lerp(startPoint.x, endPoint.x, delta) - startPoint.x;
        let dY = Utils.lerp(startPoint.y, endPoint.y, delta) - startPoint.y;

        function update() {
            // Step over
            if (that.isPointInside(endPoint)) {
                // Path over
                if (path.length === 0) {
                    return;
                }

                startPoint = endPoint;
                endPoint = path.shift().clone();

                dX = Utils.lerp(startPoint.x, endPoint.x, delta) - startPoint.x;
                dY = Utils.lerp(startPoint.y, endPoint.y, delta) - startPoint.y;
            }

            that.clear();

            that.position.x += dX;
            that.position.y += dY;

            that.draw();
            requestAnimationFrame(update);
        }

        update();
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
}

class Size {
    public width: number;
    public height: number;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
    }
}