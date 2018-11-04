import Point2d = require('common/point2d');
import Camera = require('common/camera');

interface IGameObject {
    position: Point2d;
    draw(camera: Camera): void;
    isPointInside(point: Point2d): boolean;
}

export = IGameObject;