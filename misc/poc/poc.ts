class Utils {
    static lerp(v0: number, v1: number, t: number): number {
        return v0 + t * (v1 - v0);
    }
}

class GameEngine {
    private selectableObjects: Array<ISelectable>;
    private movableObjects: Array<IMovable>;
    private selection: ISelectable;

    constructor() {
        this.selectableObjects = new Array<ISelectable>();
        this.movableObjects = new Array<IMovable>();
        this.selection = null;
    }

    init(canvasId: string) {
        let canvas = <HTMLCanvasElement>document.getElementById(canvasId);

        // Style the canvas
        canvas.width = 900;    // TODO: Take the window width - offset
        canvas.height = 500;    // TODO: Take the window height - offset

        let ctx = canvas.getContext("2d");
        let shapes = new ObjectFactory(ctx, this.selectableObjects, this.movableObjects);

        let r = shapes.getUnit(new Point2d(20, 20), 25, 25, "blue", "red", 2);
        r.draw();

        // Attach click event
        let that = this;
        canvas.onclick = function (args) {
            let mousePosition = new Point2d(args.clientX, args.clientY);

            that.selectableObjects.forEach(obj => {
                if (obj.isPointInside(mousePosition)) {
                    if (!obj.selected) {
                        obj.select();
                    }
                } else {
                    if (obj.selected) {
                        // TODO: Move if selected or leave if not movable
                        obj.unSelect();

                        // TODO: Remove this
                        let path = that.getPath(that.movableObjects[0].position, mousePosition);
                        that.movableObjects[0].move(path);
                    }
                }
            });
        };
    };

    getPath(from: Point2d, to: Point2d): Array<Point2d> {
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

    getRect(position: Point2d, width: number, height: number, fill: string, stroke: string, strokewidth: number): Shape {
        let r = new Rect(this.ctx, position, width, height, fill, stroke, strokewidth);
        this.selectableObjects.push(r);
        return r;
    }

    getUnit(position: Point2d, width: number, height: number, fill: string, stroke: string, strokewidth: number) {
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

        function update() {
            // Step over
            if (that.isPointInside(endPoint)) {
                // Path over
                if (path.length === 0) {
                    return;
                }

                startPoint = endPoint;
                endPoint = path.shift().clone();
            }

            let dX = startPoint.x !== endPoint.x ? Utils.lerp(startPoint.x, endPoint.x, that.speed * 0.01) : 0;
            let dY = startPoint.y !== endPoint.y ? Utils.lerp(startPoint.y, endPoint.y, that.speed * 0.01) : 0;

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