import Point2d = require('common/point2d');

interface IGameObject {
    position: Point2d;
    draw(camera: Point2d): void;
    isPointInside(point: Point2d): boolean;
}

export = IGameObject;