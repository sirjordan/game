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
    Utils.calcCanvasSize = function (rightPanel, bottomPanel) {
        var rightPanelOffset = this.calcOffset(rightPanel);
        var bottomPanelOffset = this.calcOffset(bottomPanel);
        return new Size(rightPanelOffset.left, bottomPanelOffset.top);
    };
    Utils.calcOffset = function (el) {
        // Calculates the TopLeft of Html element
        var _x = 0;
        var _y = 0;
        while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
            _x += el.offsetLeft - el.scrollLeft;
            _y += el.offsetTop - el.scrollTop;
            el = el.offsetParent;
        }
        return { top: _y, left: _x };
    };
    return Utils;
}());
var State = /** @class */ (function () {
    function State() {
    }
    return State;
}());
var GameEngine = /** @class */ (function () {
    function GameEngine(gameLayerId, bgLayerId, rightPanelId, bottomPanelId) {
        var _this = this;
        if (!gameLayerId)
            throw new Error('Missing argument: gameLayerId');
        if (!rightPanelId)
            throw new Error('Missing argument: rightPanelId');
        if (!rightPanelId)
            throw new Error('Missing argument: rightPanelId');
        if (!bottomPanelId)
            throw new Error('Missing argument: bottomPanelId');
        this.objects = new ObjectPool();
        this.gameLayer = document.getElementById(gameLayerId);
        this.bgLayer = document.getElementById(bgLayerId);
        this.rightPanel = document.getElementById(rightPanelId);
        this.bottomPanel = document.getElementById(bottomPanelId);
        this.setStageSize();
        document.onkeypress = function (ev) { return _this.keyPress(ev); };
        this.gameLayer.onclick = function (args) { return _this.leftClick(args); };
        this.gameLayer.oncontextmenu = function (args) { return _this.rightClick(args); };
    }
    GameEngine.prototype.init = function () {
        var bgCtx = this.bgLayer.getContext('2d');
        this.drawTerrain(bgCtx);
        var gameCtx = this.gameLayer.getContext("2d");
        var factory = new ObjectFactory(gameCtx, this.objects);
        var u_1 = factory.createUnit(new Point2d(20, 20), 25, 25, "blue", "red", 2);
        u_1.draw();
        var u_2 = factory.createUnit(new Point2d(20, 80), 25, 25, "green", "yellow", 2);
        u_2.draw();
    };
    ;
    GameEngine.prototype.keyPress = function (ev) {
        console.log(ev);
    };
    GameEngine.prototype.leftClick = function (args) {
        var mousePosition = new Point2d(args.clientX, args.clientY);
        // Check if any selectable object is at the mouse click position
        for (var _i = 0, _a = this.objects.selectable; _i < _a.length; _i++) {
            var obj = _a[_i];
            if (obj.isPointInside(mousePosition)) {
                if (!obj.selected) {
                    // Unselect all other objects and reset the selection
                    this.objects.selectable.forEach(function (el) {
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
    GameEngine.prototype.rightClick = function (args) {
        var _this = this;
        args.preventDefault();
        // Move selected objects
        var mousePosition = new Point2d(args.clientX, args.clientY);
        this.objects.units.forEach(function (u) {
            if (u.selected) {
                var path = _this.getPath(u.position, mousePosition);
                u.move(path);
            }
        });
    };
    GameEngine.prototype.getPath = function (from, to) {
        var path = new Array();
        // TODO: Make req to the server and get the path
        path.push(from);
        path.push(new Point2d(to.x, from.y));
        path.push(to);
        return path;
    };
    GameEngine.prototype.setStageSize = function () {
        var canvasSize = Utils.calcCanvasSize(this.rightPanel, this.bottomPanel);
        State.canvasSize = canvasSize;
        this.gameLayer.width = canvasSize.width;
        this.gameLayer.height = canvasSize.height;
        this.bgLayer.width = canvasSize.width;
        this.bgLayer.height = canvasSize.height;
    };
    GameEngine.prototype.drawTerrain = function (bgCtx) {
        var offset = 50;
        var pos = new Point2d(0, 0);
        while (pos.y < bgCtx.canvas.height) {
            while (pos.x < bgCtx.canvas.width) {
                var r = new Rect(bgCtx, pos, offset, offset, 'green', 'black', 1);
                r.draw();
                pos.x += offset;
            }
            pos.x = 0;
            pos.y += offset;
        }
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
        _this.speed = 3;
        return _this;
    }
    Unit.prototype.move = function (path) {
        var that = this;
        // The first path step must be the current
        var startPoint = path.shift().clone();
        var endPoint = path.shift().clone();
        var velocity = startPoint.calcVelocity(endPoint, that.speed);
        function update() {
            // Step over
            if (that.isPointInside(endPoint)) {
                // Path over
                if (path.length === 0) {
                    return;
                }
                startPoint = endPoint;
                endPoint = path.shift().clone();
                velocity = startPoint.calcVelocity(endPoint, that.speed);
            }
            that.clear();
            that.position.x += velocity.x;
            that.position.y += velocity.y;
            that.draw();
            requestAnimationFrame(update);
        }
        update();
    };
    Unit.prototype.stop = function () {
        // Implement
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
    Point2d.prototype.distanceTo = function (other) {
        return Math.sqrt(Math.pow(this.x - other.x, 2) + Math.pow(this.y - other.y, 2));
    };
    Point2d.prototype.calcVelocity = function (other, magnitude) {
        var delta = magnitude / this.distanceTo(other);
        var offsetX = Utils.lerp(this.x, other.x, delta) - this.x;
        var offsetY = Utils.lerp(this.y, other.y, delta) - this.y;
        return new Point2d(offsetX, offsetY);
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