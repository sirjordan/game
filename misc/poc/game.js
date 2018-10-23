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
        var gameCtx = this.gameLayer.getContext("2d");
        var factory = new ObjectFactory(gameCtx);
        this.objects.add(factory.baseUnit(new Point2d(50, 50)));
        this.objects.add(factory.baseUnit(new Point2d(100, 100)));
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
        for (var _i = 0, _a = this.objects.getSelectable(); _i < _a.length; _i++) {
            var obj = _a[_i];
            if (obj.getRect().isPointInside(mousePosition)) {
                if (!obj.selected) {
                    // Unselect all other objects and reset the selection
                    this.objects.getSelectable().forEach(function (el) {
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
        this.objects.getUnits().forEach(function (u) {
            if (u.selected) {
                var path = _this.getPath(u.position, mousePosition);
                u.loadMovements(path);
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
        this.objects = {};
    }
    Objects.prototype.add = function (obj) {
        // Insert the object in Array from its type or create one if missing
        var type = obj.constructor.name;
        if (!this.objects[type]) {
            this.objects[type] = new Array();
        }
        this.objects[type].push(obj);
    };
    Objects.prototype.getAll = function () {
        var all = new Array();
        for (var key in this.objects) {
            if (this.objects.hasOwnProperty(key))
                all = all.concat(this.objects[key]);
        }
        return all;
    };
    Objects.prototype.getSelectable = function () {
        return this.getUnits();
    };
    Objects.prototype.getUnits = function () {
        return this.objects[Unit.name];
    };
    Objects.prototype.update = function () {
        this.getUnits()
            .filter(function (u) { return u.selected(); })
            .forEach(function (u) {
            u.move();
        });
    };
    // Draw all static and movable objects
    Objects.prototype.draw = function (camera) {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.getAll().forEach(function (el) {
            el.draw();
        });
        // TODO: Optimize: Draw only objects in the visible area
    };
    return Objects;
}());
var ObjectFactory = /** @class */ (function () {
    function ObjectFactory(ctx) {
        this.ctx = ctx;
    }
    ObjectFactory.prototype.baseUnit = function (position) {
        var u = new Unit(this.ctx, position, new Size(20, 20), 3);
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
        _this.isSelected = false;
        return _this;
    }
    Rect.prototype.draw = function () {
        this.ctx.beginPath();
        this.ctx.fillStyle = this.fill;
        this.ctx.strokeStyle = this.stroke;
        this.ctx.lineWidth = this.strokewidth;
        this.ctx.rect(this.position.x, this.position.y, this.width, this.height);
        this.ctx.stroke();
        this.ctx.fill();
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
        this.isSelected = true;
    };
    Rect.prototype.unSelect = function () {
        this.stroke = this.originalStroke;
        this.draw();
        this.isSelected = false;
    };
    Rect.prototype.selected = function () {
        return this.isSelected;
    };
    return Rect;
}(Shape));
var Unit = /** @class */ (function () {
    function Unit(ctx, position, size, speed) {
        this.ctx = ctx;
        this.size = size;
        this.position = position;
        this.speed = speed;
        this.movementsQueue = new Array();
        this.rect = new Rect(ctx, new Point2d((position.x - size.width / 2), (position.y - size.height / 2)), size.width, size.height, 'green', 'black', 2);
    }
    Unit.prototype.getRect = function () {
        return this.rect;
    };
    Unit.prototype.loadMovements = function (path) {
        this.movementsQueue = path;
    };
    Unit.prototype.move = function () {
        if (!this.nextStep) {
            // Path is over
            if (this.movementsQueue.length == 0)
                return;
            this.nextStep = this.movementsQueue.shift().clone();
            // First step in the movement queue is the current - skip it
            if (this.position.x === this.nextStep.x && this.position.y === this.nextStep.y) {
                this.nextStep = this.movementsQueue.shift().clone();
            }
            this.velocity = this.position.calcVelocity(this.nextStep, this.speed);
        }
        // Step is over
        if (this.isPointInside(this.nextStep)) {
            this.nextStep = null;
        }
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    };
    Unit.prototype.isPointInside = function (other) {
        // TODO: Make it in the circle/rect with allowable limits
        return this.position.x == other.x && this.position.y == other.y;
    };
    Unit.prototype.stop = function () {
        // Implement
    };
    Unit.prototype.selected = function () {
        return this.rect.selected();
    };
    Unit.prototype.draw = function () {
        this.rect.draw();
        this.ctx.beginPath();
        this.ctx.arc(this.position.x, this.position.y, this.size.height / 2, 0, 2 * Math.PI);
        this.ctx.lineWidth = 1;
        this.ctx.fillStyle = 'red';
        this.ctx.fill();
        this.ctx.stroke();
    };
    Unit.prototype.select = function () {
        this.rect.select();
    };
    Unit.prototype.unSelect = function () {
        this.rect.unSelect();
    };
    return Unit;
}());
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