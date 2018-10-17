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
var GameEngine = /** @class */ (function () {
    function GameEngine() {
        this.selectableObjects = new Array();
        this.selection = null;
    }
    GameEngine.prototype.init = function (canvasId) {
        var canvas = document.getElementById(canvasId);
        // Style the canvas
        canvas.width = 900; // TODO: Take the window width - offset
        canvas.height = 500; // TODO: Take the window height - offset
        var ctx = canvas.getContext("2d");
        var shapes = new ShapeFactory(ctx, this.selectableObjects);
        var r = shapes.getRect(20, 20, 25, 25, "blue", "red", 2);
        r.draw();
        // Attach click event
        var that = this;
        canvas.onclick = function (args) {
            var p = new Point2d(args.clientX, args.clientY);
            that.selectableObjects.forEach(function (obj) {
                if (obj.isPointInside(p)) {
                    if (!obj.selected) {
                        obj.select();
                    }
                }
                else {
                    if (obj.selected) {
                        obj.unSelect();
                    }
                }
            });
        };
    };
    ;
    return GameEngine;
}());
var ShapeFactory = /** @class */ (function () {
    function ShapeFactory(ctx, selectableObjects) {
        this.ctx = ctx;
        this.selectableObjects = selectableObjects;
    }
    ShapeFactory.prototype.getRect = function (x, y, width, height, fill, stroke, strokewidth) {
        var r = new Rect(this.ctx, x, y, width, height, fill, stroke, strokewidth);
        this.selectableObjects.push(r);
        return r;
    };
    return ShapeFactory;
}());
var Shape = /** @class */ (function () {
    function Shape(ctx, x, y) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
    }
    return Shape;
}());
var Rect = /** @class */ (function (_super) {
    __extends(Rect, _super);
    function Rect(ctx, x, y, width, height, fill, stroke, strokewidth) {
        var _this = _super.call(this, ctx, x, y) || this;
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
        this.ctx.rect(this.x, this.y, this.width, this.height);
        this.ctx.stroke();
        this.ctx.fill();
        this.ctx.restore();
    };
    Rect.prototype.isPointInside = function (point) {
        return (point.x >= this.x &&
            point.x <= this.x + this.width &&
            point.y >= this.y &&
            point.y <= this.y + this.height);
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
var Point2d = /** @class */ (function () {
    function Point2d(x, y) {
        this.x = x;
        this.y = y;
    }
    return Point2d;
}());
//# sourceMappingURL=poc.js.map