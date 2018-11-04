import ISelectable = require('contracts/iSelectable');
import Rect = require('rect');
import Camera = require('common/camera');

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

    draw(camera: Camera): void {
        // TODO: Draw isometric rect or circle
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.fillStyle = this.fill;
        this.ctx.strokeStyle = this.stroke;
        this.ctx.lineWidth = this.strokewidth;
        this.ctx.rect(this.position.x - camera.position.x, this.position.y - camera.position.y, this.size.width, this.size.height);
        this.ctx.stroke();
        this.ctx.fill();
        this.ctx.restore();
    }
}

export = SelectRect;