var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Settings = /** @class */ (function () {
    function Settings() {
    }
    Settings.animationSpeed = 0.01;
    return Settings;
}());
var Utils = /** @class */ (function () {
    function Utils() {
    }
    Utils.lerp = function (v0, v1, t) {
        return v0 + t * (v1 - v0);
    };
    Utils.calcCanvasSize = function () {
        // TODO: Take the window width/height of the window
        return new Size(900, 500);
    };
    return Utils;
}());
var State = /** @class */ (function () {
    function State() {
    }
    return State;
}());
var GameEngine = /** @class */ (function () {
    function GameEngine() {
        this.objectPool = new ObjectPool();
    }
    GameEngine.prototype.init = function (canvasId) {
        var canvasSize = Utils.calcCanvasSize();
        State.canvasSize = canvasSize;
        var canvas = document.getElementById(canvasId);
        // Style the canvas
        canvas.width = canvasSize.width;
        canvas.height = canvasSize.height;
        var ctx = canvas.getContext("2d");
        var factory = new ObjectFactory(ctx, this.objectPool);
        var u_1 = factory.createUnit(new Point2d(20, 20), 25, 25, "blue", "red", 2);
        u_1.draw();
        var u_2 = factory.createUnit(new Point2d(20, 80), 25, 25, "green", "yellow", 2);
        u_2.draw();
        // Attach click event
        var that = this;
        canvas.onclick = function (args) {
            var mousePosition = new Point2d(args.clientX, args.clientY);
            // Check if any selectable object is at the mouse click position
            for (var _i = 0, _a = that.objectPool.selectable; _i < _a.length; _i++) {
                var obj = _a[_i];
                if (obj.isPointInside(mousePosition)) {
                    if (!obj.selected) {
                        // Unselect all other objects and reset the selection
                        that.objectPool.selectable.forEach(function (el) {
                            el.unSelect();
                        });
                        // Select the only clicked obj
                        obj.select();
                        break;
                    }
                }
                else {
                    if (obj.selected) {
                        obj.unSelect();
                    }
                }
            }
        };
        canvas.oncontextmenu = function (args) {
            args.preventDefault();
            // Move selected objects
            var mousePosition = new Point2d(args.clientX, args.clientY);
            that.objectPool.units.forEach(function (u) {
                if (u.selected) {
                    var path = that.getPath(u.position, mousePosition);
                    u.move(path);
                }
            });
        };
    };
    ;
    GameEngine.prototype.getPath = function (from, to) {
        var path = new Array();
        // TODO: Make req to the server and get the path
        path.push(from);
        path.push(new Point2d(to.x, from.y));
        path.push(to);
        return path;
    };
    GameEngine.prototype.getMovable = function () {
    };
    return GameEngine;
}());
var ObjectPool = /** @class */ (function () {
    function ObjectPool() {
        this.selectable = new Array();
        this.units = new Array();
    }
    ObjectPool.prototype.addSelectable = function (obj) {
        this.selectable.push(obj);
    };
    ObjectPool.prototype.addUnit = function (obj) {
        this.units.push(obj);
        this.addSelectable(obj);
    };
    return ObjectPool;
}());
var ObjectFactory = /** @class */ (function () {
    function ObjectFactory(ctx, objectPool) {
        this.ctx = ctx;
        this.objectPool = objectPool;
    }
    ObjectFactory.prototype.createRect = function (position, width, height, fill, stroke, strokewidth) {
        var r = new Rect(this.ctx, position, width, height, fill, stroke, strokewidth);
        this.objectPool.addSelectable(r);
        return r;
    };
    ObjectFactory.prototype.createUnit = function (position, width, height, fill, stroke, strokewidth) {
        var u = new Unit(this.ctx, position, width, height, fill, stroke, strokewidth);
        this.objectPool.addUnit(u);
        return u;
    };
    return ObjectFactory;
}());
var Shape = /** @class */ (function () {
    function Shape(ctx, position) {
        this.ctx = ctx;
        this.position = position;
    }
    return Shape;
}());
var Rect = /** @class */ (function (_super) {
    __extends(Rect, _super);
    function Rect(ctx, topLeft, width, height, fill, stroke, strokewidth) {
        var _this = _super.call(this, ctx, topLeft) || this;
        _this.width = width;
        _this.height = height;
        _this.fill = fill;
        _this.stroke = stroke;
        _this.strokewidth = strokewidth;
        _this.selected = false;
        return _this;
    }
    Rect.prototype.draw = function () {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.fillStyle = this.fill;
        this.ctx.strokeStyle = this.stroke;
        this.ctx.lineWidth = this.strokewidth;
        this.ctx.rect(this.position.x, this.position.y, this.width, this.height);
        this.ctx.stroke();
        this.ctx.fill();
        this.ctx.restore();
    };
    Rect.prototype.clear = function () {
        this.ctx.clearRect(this.position.x - this.strokewidth, this.position.y - this.strokewidth, this.position.x + this.width + this.strokewidth, this.position.y + this.height + this.strokewidth);
    };
    Rect.prototype.isPointInside = function (point) {
        return (point.x >= this.position.x &&
            point.x <= this.position.x + this.width &&
            point.y >= this.position.y &&
            point.y <= this.position.y + this.height);
    };
    Rect.prototype.select = function () {
        this.originalStroke = this.stroke;
        this.stroke = 'orange';
        this.draw();
        this.selected = true;
    };
    Rect.prototype.unSelect = function () {
        this.stroke = this.originalStroke;
        this.draw();
        this.selected = false;
    };
    return Rect;
}(Shape));
var Unit = /** @class */ (function (_super) {
    __extends(Unit, _super);
    function Unit(ctx, position, width, height, fill, stroke, strokewidth) {
        var _this = _super.call(this, ctx, position, width, height, fill, stroke, strokewidth) || this;
        _this.speed = 1;
        return _this;
    }
    Unit.prototype.move = function (path) {
        var that = this;
        // The first path step must be the current
        var startPoint = path.shift().clone();
        var endPoint = path.shift().clone();
        var delta = that.speed * Settings.animationSpeed;
        var dX = Utils.lerp(startPoint.x, endPoint.x, delta) - startPoint.x;
        var dY = Utils.lerp(startPoint.y, endPoint.y, delta) - startPoint.y;
        function update() {
            // Step over
            if (that.isPointInside(endPoint)) {
                // Path over
                if (path.length === 0) {
                    return;
                }
                startPoint = endPoint;
                endPoint = path.shift().clone();
                dX = Utils.lerp(startPoint.x, endPoint.x, delta) - startPoint.x;
                dY = Utils.lerp(startPoint.y, endPoint.y, delta) - startPoint.y;
            }
            that.clear();
            that.position.x += dX;
            that.position.y += dY;
            that.draw();
            requestAnimationFrame(update);
        }
        update();
    };
    return Unit;
}(Rect));
var Point2d = /** @class */ (function () {
    function Point2d(x, y) {
        this.x = x;
        this.y = y;
    }
    Point2d.prototype.clone = function () {
        return new Point2d(this.x, this.y);
    };
    return Point2d;
}());
var Size = /** @class */ (function () {
    function Size(width, height) {
        this.width = width;
        this.height = height;
    }
    return Size;
}());
//# sourceMappingURL=poc.js.map