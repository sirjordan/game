import Point2d = require('common/point2d');
import Camera = require('common/camera');
import Size = require('common/size');

interface IGameObject {
    setPosition(point: Point2d): void;
    getPosition(): Point2d;
    getSize(): Size;
    draw(camera: Camera): void;
    isPointInside(point: Point2d): boolean;
}

export = IGameObject;