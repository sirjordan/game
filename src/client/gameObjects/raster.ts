import Rect = require('rect');
import Camera = require('common/camera');

class Raster extends Rect {
    draw(camera: Camera): void {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.fillStyle = this.fill;
        this.ctx.strokeStyle = this.stroke;
        this.ctx.lineWidth = this.strokewidth;
        this.ctx.rect(this.topLeft.x, this.topLeft.y, this.size.width, this.size.height);
        this.ctx.stroke();

        if (this.fill)
            this.ctx.fill();
            
        this.ctx.restore();
    }
}

export = Raster;