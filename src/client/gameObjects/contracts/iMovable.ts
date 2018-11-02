import Point2d = require('common/point2d');

interface IMovable {
    move(): void;
    loadMovements(path: Array<Point2d>): void;
    stop(): void;
}

export = IMovable;