class GameEngine {
    private selectableObjects: Array<ISelectable>;

    constructor() {
        this.selectableObjects = new Array<ISelectable>();
    }

    init(canvasId: string) {
        let canvas = <HTMLCanvasElement>document.getElementById(canvasId);

        // Style the canvas
        canvas.width = 900;    // TODO: Take the window width - offset
        canvas.height = 500;    // TODO: Take the window height - offset

        let ctx = canvas.getContext("2d");
        let shapes = new ShapeFactory(ctx, this.selectableObjects);

        let r = shapes.getRect(20, 20, 25, 25, "blue", "red", 2);
        r.draw();

        // Attach click event
        let that = this;
        canvas.onclick = function (args) {
            let p = new Point2d(args.clientX, args.clientY);

            that.selectableObjects.forEach(obj => {
                if (obj.isPointInside(p)) {
                    obj.select();
                }
            });
        };
    };
}

interface ISelectable extends IShape {
    select(): void;
    unSelect(): void;
}

interface IShape{
    draw(): void;
    isPointInside(point: Point2d): boolean;
}

class ShapeFactory {
    private ctx: CanvasRenderingContext2D;
    private selectableObjects: Array<ISelectable>;

    constructor(ctx: CanvasRenderingContext2D, selectableObjects: Array<ISelectable>) {
        this.ctx = ctx;
        this.selectableObjects = selectableObjects;
    }

    getRect(x: number, y: number, width: number, height: number, fill: string, stroke: string, strokewidth: number): Shape {
        let r = new Rect(this.ctx, x, y, width, height, fill, stroke, strokewidth);
        this.selectableObjects.push(r);
        return r;
    }
}

abstract class Shape {
    protected ctx: CanvasRenderingContext2D;
    public x: number;
    public y: number;

    constructor(ctx: CanvasRenderingContext2D, x: number, y: number) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
    }

    abstract draw(): void;
    abstract isPointInside(point: Point2d): boolean;
}

class Rect extends Shape implements ISelectable {
    width: number;
    height: number;
    fill: string;
    stroke: string;
    strokewidth: number;

    constructor(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, fill: string, stroke: string, strokewidth: number) {
        super(ctx, x, y);
        this.width = width;
        this.height = height;
        this.fill = fill;
        this.stroke = stroke;
        this.strokewidth = strokewidth;
    }

    draw(): void {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.fillStyle = this.fill;
        this.ctx.strokeStyle = this.stroke;
        this.ctx.lineWidth = this.strokewidth;
        this.ctx.rect(this.x, this.y, this.width, this.height);
        this.ctx.stroke();
        this.ctx.fill();
        this.ctx.restore();
    }

    isPointInside(point: Point2d): boolean {
        return (
            point.x >= this.x &&
            point.x <= this.x + this.width &&
            point.y >= this.y &&
            point.y <= this.y + this.height);
    }

    select(): void {
        this.stroke = 'orange';
        this.draw();
    }

    unSelect(): void {
        throw new Error("Method not implemented.");
    }
}

class Point2d {
    public x: number;
    public y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}