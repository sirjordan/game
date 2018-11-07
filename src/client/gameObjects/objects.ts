import IGameObject = require('contracts/iGameObject');
import ISelectable = require('contracts/iSelectable');
import Unit = require('unit');
import Camera = require('common/camera');
import Building = require('building');

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
        return new Array<ISelectable>(this.getUnits(), this.getBuildings());
    }

    getBuildings(): Array<Building>{
        return <Array<Building>>this.objects[(<any>Building).name] || [];
    }

    getUnits(): Array<Unit> {
        return <Array<Unit>>this.objects[(<any>Unit).name] || [];
    }

    update() {
        this.getUnits()
            .filter(u => u.isSelected())
            .forEach(u => {
                u.move();
            });
    }

    draw(camera: Camera) {
        // Draw all static and movable objects
        // TODO: Optimize: Draw only objects in the visible area
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.getAll().forEach(el => {
            el.draw(camera);
        });
    }
}

export = Objects;