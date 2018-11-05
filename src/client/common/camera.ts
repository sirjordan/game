import Size = require('common/size');
import Point2d = require('common/point2d');

class Camera {
    // Topleft of the camera
    public position: Point2d;
    public size: Size;

    constructor( size: Size, position?: Point2d) {
        this.position = position || Point2d.zero();
        this.size = size;
    }
}

export = Camera;