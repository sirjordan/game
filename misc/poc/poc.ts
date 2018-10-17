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

        let r = shapes.getUnit(20, 20, 25, 25, "blue", "red", 2);
        r.draw();

        // Attach click event
        let that = this;
        canvas.onclick = function (args) {
            let p = new Point2d(args.clientX, args.clientY);

            that.selectableObjects.forEach(obj => {
                if (obj.isPointInside(p)) {
                    if (!obj.selected) {
                        obj.select();
                    }
                } else {
                    if (obj.selected) {
                        // TODO: Move if selected or leave if not movable
                        obj.unSelect();

                        // TODO: Remove this
                        that.movableObjects[0].moveTo(new Point2d(1, 2));
                    }
                }
            });
        };
    };
}

interface IMovable {
    speed: number;
    moveTo(point: Point2d);
}

interface ISelectable extends IShape {
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

    getRect(x: number, y: number, width: number, height: number, fill: string, stroke: string, strokewidth: number): Shape {
        let r = new Rect(this.ctx, x, y, width, height, fill, stroke, strokewidth);
        this.selectableObjects.push(r);
        return r;
    }

    getUnit(x: number, y: number, width: number, height: number, fill: string, stroke: string, strokewidth: number){
        let u = new Unit(this.ctx, x, y, width, height, fill, stroke, strokewidth);
        this.selectableObjects.push(u);
        this.movableObjects.push(u);
        return u;
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
    private originalStroke: string;
    selected: boolean
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
        this.selected = false;
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

    constructor(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, fill: string, stroke: string, strokewidth: number) {
        super(ctx, x, y, width, height, fill, stroke, strokewidth);
        this.speed = 5;
    }

    moveTo(point: Point2d) {
        // TODO: Use linear interpolation
        this.updateMoving();
    }

    private updateMoving(){
        this.x += this.speed;
        this.y += this.speed;
        super.draw();
        requestAnimationFrame(this.updateMoving);
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