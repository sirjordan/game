import ISelectable = require('contracts/iSelectable');
import Rect = require('rect');
import Circle = require('circle');
import Camera = require('common/camera');
import Settings = require('settings');
import Size = require('common/size');
import Point2d = require('common/point2d');

class SelectRect extends Rect implements ISelectable {
    private _isSelected: boolean
    private selectionDrawingObject: Circle;

    constructor(ctx: CanvasRenderingContext2D, topLeft: Point2d, size: Size) {
        super(ctx, topLeft, size);

        let radius = Math.sqrt(Math.pow(size.width, 2) + Math.pow(size.height, 2)) / 2;
        this.selectionDrawingObject = new Circle(ctx, topLeft.toCenter(size), radius, Settings.MAIN_COLOR);
    }

    setPosition(point: Point2d){
        super.setPosition(point);
        this.selectionDrawingObject.setPosition(this.topLeft.toCenter(this.size));
    }

    isSelected(): boolean {
        return this._isSelected;
    }

    select(): void {
        this.stroke = Settings.MAIN_COLOR;
        this._isSelected = true;
    }

    unSelect(): void {
        this._isSelected = false;
    }

    getRect(): SelectRect {
        return this;
    }

    draw(camera: Camera): void {
        if (this._isSelected) {
            this.selectionDrawingObject.draw(camera);
        }
    }
}

export = SelectRect;