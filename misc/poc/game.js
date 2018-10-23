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
var Map = /** @class */ (function () {
    function Map() {
        this.objects = [
            [0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 2, 0, 0, 0, 1, 0, 0, 0, 0, 2],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
            [0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 2],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0],
            [0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 2],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0],
            [0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0],
            [0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 2],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0],
            [0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 1, 0, 2, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0],
        ];
    }
    return Map;
}());
var Terrain = /** @class */ (function () {
    function Terrain(ctx, map) {
        this.ctx = ctx;
        this.rasterSize = 50; // TODO: Take it based on the client display resolution
        this.map = map;
    }
    Terrain.prototype.maxSize = function () {
        return new Size(this.map.objects[0].length * this.rasterSize, this.map.objects.length * this.rasterSize);
    };
    Terrain.prototype.draw = function (camera) {
        // Optimize the draw() and render only if the camera changes its position
        if (this.lastCamera && camera.x == this.lastCamera.x && camera.y == this.lastCamera.y) {
            return;
        }
        var maxRight = this.ctx.canvas.height;
        var maxTop = this.ctx.canvas.width;
        this.ctx.clearRect(0, 0, maxRight, maxTop);
        var startPos = new Point2d((camera.x % this.rasterSize) * -1, (camera.y % this.rasterSize) * -1);
        var pos = startPos.clone();
        var row = Math.floor(camera.y / this.rasterSize);
        var col = Math.floor(camera.x / this.rasterSize);
        var startCol = col;
        // Go to the end of the screen X
        for (var i = 1; i <= Math.ceil(maxTop / this.rasterSize) + 1; i++) {
            // No more map rows
            if (!this.map.objects[row])
                break;
            // Go to the end of the screen Y
            for (var j = 1; j <= Math.ceil(maxRight / this.rasterSize); j++) {
                // No more map columns
                if (!(this.map.objects[row][col] >= 0))
                    break;
                var el = this.map.objects[row][col];
                var terrainObject = this.createTerrainObject(el, pos);
                terrainObject.draw();
                col++;
                pos.x = startPos.x + (j * this.rasterSize);
            }
            col = startCol;
            row++;
            pos.x = startPos.x;
            pos.y = startPos.y + (i * this.rasterSize);
        }
        this.lastCamera = camera.clone();
    };
    Terrain.prototype.createTerrainObject = function (signature, position) {
        switch (signature) {
            case 0:
                return new Rect(this.ctx, position, this.rasterSize, this.rasterSize, 'green', 'black', 1);
            case 1:
                return new Rect(this.ctx, position, this.rasterSize, this.rasterSize, 'gray', 'black', 1);
            default:
                return new Rect(this.ctx, position, this.rasterSize, this.rasterSize, 'black', 'black', 1);
        }
    };
    return Terrain;
}());
var Game = /** @class */ (function () {
    function Game(gameLayerId, bgLayerId, rightPanelId, bottomPanelId) {
        var _this = this;
        this.update = function () {
            _this.terrain.draw(_this.camera);
            _this.objects.update();
            _this.objects.draw(_this.camera);
            requestAnimationFrame(_this.update);
        };
        if (!gameLayerId)
            throw new Error('Missing argument: gameLayerId');
        if (!rightPanelId)
            throw new Error('Missing argument: rightPanelId');
        if (!rightPanelId)
            throw new Error('Missing argument: rightPanelId');
        if (!bottomPanelId)
            throw new Error('Missing argument: bottomPanelId');
        this.gameLayer = document.getElementById(gameLayerId);
        this.objects = new Objects(this.gameLayer.getContext("2d"));
        this.bgLayer = document.getElementById(bgLayerId);
        this.rightPanel = document.getElementById(rightPanelId);
        this.bottomPanel = document.getElementById(bottomPanelId);
        this.camera = new Point2d(0, 0);
        this.setStageSize();
        document.onkeypress = function (ev) { return _this.keyPress(ev); };
        this.gameLayer.onclick = function (args) { return _this.leftClick(args); };
        this.gameLayer.oncontextmenu = function (args) { return _this.rightClick(args); };
    }
    Game.prototype.start = function () {
        var bgCtx = this.bgLayer.getContext('2d');
        var map = new Map();
        this.terrain = new Terrain(bgCtx, map);
        var gameCtx = this.gameLayer.getContext("2d"); // TODO: Remove this
        var factory = new ObjectFactory(gameCtx, this.objects);
        var u_1 = factory.createUnit(new Point2d(20, 20), 25, 25, "blue", "red", 2);
        u_1.draw();
        var u_2 = factory.createUnit(new Point2d(20, 80), 25, 25, "green", "yellow", 2);
        u_2.draw();
        this.update();
    };
    ;
    Game.prototype.keyPress = function (ev) {
        // TODO: Replace the key with some other
        var cameraSpeed = 5;
        switch (ev.key) {
            case 'd':
                if (this.camera.x + this.stageMax.width < this.terrain.maxSize().width)
                    this.camera.x += cameraSpeed;
                break;
            case 'a':
                if (this.camera.x > 0)
                    this.camera.x -= cameraSpeed;
                break;
            case 'w':
                if (this.camera.y > 0)
                    this.camera.y -= cameraSpeed;
                break;
            case 's':
                if (this.camera.y + this.stageMax.height < this.terrain.maxSize().height)
                    this.camera.y += cameraSpeed;
                break;
        }
    };
    Game.prototype.leftClick = function (args) {
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
    Game.prototype.rightClick = function (args) {
        var _this = this;
        args.preventDefault();
        // Move selected objects
        var mousePosition = new Point2d(args.clientX, args.clientY);
        this.objects.units.forEach(function (u) {
            if (u.selected) {
                var path = _this.getPath(u.position, mousePosition);
                u.loadMovements(path);
                //u.move(path);
            }
        });
    };
    Game.prototype.getPath = function (from, to) {
        var path = new Array();
        // TODO: Make req to the server and get the path
        path.push(from);
        path.push(new Point2d(to.x, from.y));
        path.push(to);
        return path;
    };
    Game.prototype.setStageSize = function () {
        var canvasSize = Utils.calcCanvasSize(this.rightPanel, this.bottomPanel);
        this.stageMax = canvasSize;
        this.gameLayer.width = canvasSize.width;
        this.gameLayer.height = canvasSize.height;
        this.bgLayer.width = canvasSize.width;
        this.bgLayer.height = canvasSize.height;
    };
    return Game;
}());
var Objects = /** @class */ (function () {
    function Objects(ctx) {
        this.ctx = ctx;
        this.selectable = new Array();
        this.units = new Array();
    }
    Objects.prototype.addSelectable = function (obj) {
        this.selectable.push(obj);
    };
    Objects.prototype.addUnit = function (obj) {
        this.units.push(obj);
        this.addSelectable(obj);
    };
    Objects.prototype.update = function () {
        this.units.forEach(function (u) {
            u.move();
        });
        // 0. Move objects that has steps in their movement queue
        // 1. Every movable object has a Queue with movement steps
        // 2. If empty -> continue
        // 3. If has movements -> Dequeue one
    };
    Objects.prototype.draw = function (camera) {
        // Draw all static and movable objects
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.selectable.forEach(function (el) {
            el.draw();
        });
        // TODO:
        // 3. Optimize: Draw only objects in the visible area
    };
    return Objects;
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
        _this.movementsQueue = new Array();
        return _this;
    }
    Unit.prototype.loadMovements = function (path) {
        this.movementsQueue = path;
    };
    Unit.prototype.move = function () {
        if (!this.nextStep) {
            // Path is over
            if (this.movementsQueue.length == 0) {
                return;
            }
            this.nextStep = this.movementsQueue.shift().clone();
            // First step in the movement queue is the current - skip it
            if (this.position.x === this.nextStep.x && this.position.y === this.nextStep.y) {
                this.nextStep = this.movementsQueue.shift().clone();
            }
            this.currStepVelocity = this.position.calcVelocity(this.nextStep, this.speed);
        }
        // Step is over
        if (this.isPointInside(this.nextStep)) {
            this.nextStep = null;
            return;
        }
        this.position.x += this.currStepVelocity.x;
        this.position.y += this.currStepVelocity.y;
    };
    Unit.prototype._move = function (path) {
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
//# sourceMappingURL=game.js.map