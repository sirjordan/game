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
define("common/size", ["require", "exports"], function (require, exports) {
    "use strict";
    var Size = /** @class */ (function () {
        function Size(width, height) {
            this.width = width;
            this.height = height;
        }
        return Size;
    }());
    return Size;
});
define("common/utils", ["require", "exports", "common/size"], function (require, exports, Size) {
    "use strict";
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
    return Utils;
});
define("game", ["require", "exports", "common/utils", "common/size"], function (require, exports, Utils, Size) {
    "use strict";
    var Map = /** @class */ (function () {
        function Map() {
            this.rasterSize = 50;
            this.objects = [
                [0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 2, 0, 0, 0, 1, 0, 0, 0, 0, 2, 1, 2, 0, 0, 0, 1, 0, 1, 0, 2],
                [0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 2, 0, 0, 0, 1, 0, 0, 0, 0, 2, 1, 0, 0, 0, 0, 0, 0, 1, 0, 2],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 1, 0, 0, 1, 0, 2],
                [0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 2, 0, 2, 0, 0, 0, 0, 0, 1, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 2],
                [0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 2, 1, 0, 0, 0, 0, 1, 0, 2],
                [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 2, 1, 2, 0, 0, 1, 0, 0, 1, 0, 2],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0],
                [0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2, 0, 0, 0, 1, 0, 2],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0, 1, 0, 0],
                [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 2, 1, 0, 0, 0, 0, 0, 0, 2],
                [0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 2, 0, 1, 0, 2],
                [0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0, 0, 0, 1, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 2, 1, 1, 0, 0, 0, 0, 0, 1, 0, 2],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 1, 0, 0, 1, 0, 2],
                [0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0, 1, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 2, 0, 0, 0, 0, 0, 0, 0, 2],
                [0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0, 0, 0, 1, 0, 2],
                [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 2, 0, 1, 0, 0, 0, 1, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 2],
                [0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0, 1, 0, 2],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 1, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 1, 0, 2, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 2],
            ];
        }
        Map.prototype.size = function () {
            // Size of the map in objects (not in pixels)
            return new Size(this.objects[0].length, this.objects.length);
        };
        return Map;
    }());
    var Terrain = /** @class */ (function () {
        function Terrain(ctx, map, objectsFactory) {
            this.ctx = ctx;
            this.map = map;
            this.objectsFactory = objectsFactory;
        }
        Terrain.prototype.size = function () {
            // Size of the terrain in pixels
            return new Size(this.map.size().width * this.map.rasterSize, this.map.size().height * this.map.rasterSize);
        };
        Terrain.prototype.draw = function (camera) {
            // Optimizing the draw() and render only if the camera changes its position
            if (this.lastCamera && camera.equals(this.lastCamera)) {
                return;
            }
            var maxRight = this.ctx.canvas.height;
            var maxTop = this.ctx.canvas.width;
            var rasterSize = this.map.rasterSize;
            this.ctx.clearRect(0, 0, maxRight, maxTop);
            var startPos = new Point2d((camera.x % rasterSize) * -1, (camera.y % rasterSize) * -1);
            var pos = startPos.clone();
            var row = Math.floor(camera.y / rasterSize);
            var col = Math.floor(camera.x / rasterSize);
            var startCol = col;
            // Go to the end of the screen Y
            for (var i = 1; i <= Math.ceil(maxTop / rasterSize) + 1; i++) {
                // No more map rows
                if (!this.map.objects[row])
                    break;
                // Go to the end of the screen X
                for (var j = 1; j <= Math.ceil(maxRight / rasterSize); j++) {
                    // No more map columns
                    if (!(this.map.objects[row][col] >= 0))
                        break;
                    var rasterCode = this.map.objects[row][col];
                    var terrainObject = this.objectsFactory.create(rasterCode, pos, rasterSize);
                    terrainObject.draw(camera);
                    col++;
                    pos.x = startPos.x + (j * rasterSize);
                }
                col = startCol;
                row++;
                pos.x = startPos.x;
                pos.y = startPos.y + (i * rasterSize);
            }
            this.lastCamera = camera.clone();
        };
        return Terrain;
    }());
    var Game = /** @class */ (function () {
        function Game(gameLayer, bgLayer, toolsLayer, rightPanel, bottomPanel) {
            var _this = this;
            this.update = function () {
                _this.terrain.draw(_this.camera);
                _this.objects.update();
                _this.objects.draw(_this.camera);
                _this.mapProjection.draw(_this.camera);
                requestAnimationFrame(_this.update);
            };
            if (!gameLayer)
                throw new Error('Missing argument: gameLayer');
            if (!rightPanel)
                throw new Error('Missing argument: rightPanel');
            if (!rightPanel)
                throw new Error('Missing argument: rightPanel');
            if (!bottomPanel)
                throw new Error('Missing argument: bottomPanel');
            if (!toolsLayer)
                throw new Error('Missing argument: toolsLayer');
            this.gameLayer = gameLayer;
            this.bgLayer = bgLayer;
            this.toolsLayer = toolsLayer;
            this.rightPanel = rightPanel;
            this.bottomPanel = bottomPanel;
            this.gameCtx = this.gameLayer.getContext("2d");
            this.objects = new Objects(this.gameCtx);
            this.camera = Point2d.zero();
            this.setStageSize();
            document.onkeypress = function (ev) { return _this.keyPress(ev); };
            this.gameLayer.onclick = function (args) { return _this.leftClick(args); };
            this.gameLayer.oncontextmenu = function (args) { return _this.rightClick(args); };
        }
        Game.prototype.start = function () {
            var bgCtx = this.bgLayer.getContext('2d');
            var terrainObjectsFactory = new TerrainObjectsFactory(bgCtx);
            var map = new Map();
            this.terrain = new Terrain(bgCtx, map, terrainObjectsFactory);
            var player = new Player('red');
            var unitFactory = new UnitFactory(this.gameCtx, player, new Sequence());
            this.objects.add(unitFactory.baseUnit(new Point2d(50, 50)));
            this.objects.add(unitFactory.baseUnit(new Point2d(100, 100)));
            var toolsCtx = this.toolsLayer.getContext('2d');
            this.mapProjection = new MapProjection(this.objects, map, toolsCtx, Point2d.zero(), new Size(this.rightPanel.clientWidth, this.rightPanel.clientWidth));
            // Start the game loop
            this.update();
        };
        ;
        Game.prototype.keyPress = function (ev) {
            // TODO: Replace the key with some other
            var cameraSpeed = 15;
            switch (ev.key) {
                case 'd':
                    if (this.camera.x + this.stageMax.width < this.terrain.size().width)
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
                    if (this.camera.y + this.stageMax.height < this.terrain.size().height)
                        this.camera.y += cameraSpeed;
                    break;
            }
        };
        Game.prototype.leftClick = function (args) {
            var mousePosition = new Point2d(args.clientX, args.clientY).add(this.camera);
            var selectable = this.objects.getSelectable();
            // Check if any selectable object is at the mouse click position
            for (var _i = 0, selectable_1 = selectable; _i < selectable_1.length; _i++) {
                var obj = selectable_1[_i];
                if (obj.getRect().isPointInside(mousePosition)) {
                    if (!obj.isSelected()) {
                        // Unselect all other objects and reset the selection
                        selectable.forEach(function (el) {
                            el.unSelect();
                        });
                        // Select the only clicked obj
                        obj.select();
                        break;
                    }
                }
                else {
                    if (obj.isSelected()) {
                        obj.unSelect();
                    }
                }
            }
        };
        Game.prototype.rightClick = function (args) {
            var _this = this;
            args.preventDefault();
            // Move selected objects
            var mousePosition = new Point2d(args.clientX, args.clientY).add(this.camera);
            this.objects.getUnits().forEach(function (u) {
                if (u.isSelected()) {
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
            this.toolsLayer.width = this.rightPanel.clientWidth;
            this.toolsLayer.height = this.rightPanel.clientHeight;
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
            return this.objects[Unit.name] || [];
        };
        Objects.prototype.update = function () {
            this.getUnits()
                .filter(function (u) { return u.isSelected(); })
                .forEach(function (u) {
                u.move();
            });
        };
        Objects.prototype.draw = function (camera) {
            // Draw all static and movable objects
            // TODO: Optimize: Draw only objects in the visible area
            this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
            this.getAll().forEach(function (el) {
                el.draw(camera);
            });
        };
        return Objects;
    }());
    var TerrainObjectsFactory = /** @class */ (function () {
        function TerrainObjectsFactory(ctx) {
            this.ctx = ctx;
        }
        TerrainObjectsFactory.prototype.create = function (rasterCode, position, size) {
            switch (rasterCode) {
                case 0:
                    return new Raster(this.ctx, position, new Size(size, size), '#66440b');
                case 1:
                    return new Raster(this.ctx, position, new Size(size, size), '#3d3321');
                default:
                    return new Raster(this.ctx, position, new Size(size, size), '#0f0b04');
            }
        };
        return TerrainObjectsFactory;
    }());
    var Sequence = /** @class */ (function () {
        function Sequence() {
            var _this = this;
            this.getNext = function () {
                _this.last++;
                return _this.last;
            };
            this.last = 0;
        }
        return Sequence;
    }());
    var UnitFactory = /** @class */ (function () {
        function UnitFactory(ctx, player, sequence) {
            this.ctx = ctx;
            this.player = player;
            this.sequence = sequence;
        }
        UnitFactory.prototype.baseUnit = function (position) {
            return new Unit(this.sequence.getNext(), this.ctx, position, new Size(20, 20), 3, this.player);
        };
        return UnitFactory;
    }());
    var Rect = /** @class */ (function () {
        function Rect(ctx, topLeft, size, fill, stroke, strokewidth) {
            this.position = topLeft;
            this.ctx = ctx;
            this.size = size;
            this.fill = fill;
            this.stroke = stroke || fill;
            this.strokewidth = strokewidth || 1;
        }
        Rect.prototype.isPointInside = function (point) {
            return (point.x >= this.position.x &&
                point.x <= this.position.x + this.size.width &&
                point.y >= this.position.y &&
                point.y <= this.position.y + this.size.height);
        };
        return Rect;
    }());
    var Circle = /** @class */ (function () {
        function Circle(ctx, center, radius, fill, stroke, strokewidth) {
            this.ctx = ctx;
            this.position = center;
            this.radius = radius;
            this.fill = fill;
            this.stroke = stroke || fill;
            this.strokewidth = strokewidth || 1;
        }
        Circle.prototype.draw = function (camera) {
            this.ctx.beginPath();
            this.ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
            this.ctx.lineWidth = this.strokewidth;
            this.ctx.fillStyle = this.fill;
            this.ctx.fill();
            this.ctx.stroke();
        };
        Circle.prototype.isPointInside = function (point) {
            throw new Error("Method not implemented.");
        };
        return Circle;
    }());
    var Raster = /** @class */ (function (_super) {
        __extends(Raster, _super);
        function Raster() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Raster.prototype.draw = function (camera) {
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.fillStyle = this.fill;
            this.ctx.strokeStyle = this.stroke;
            this.ctx.lineWidth = this.strokewidth;
            this.ctx.rect(this.position.x, this.position.y, this.size.width, this.size.height);
            this.ctx.stroke();
            this.ctx.fill();
            this.ctx.restore();
        };
        return Raster;
    }(Rect));
    var MapProjection = /** @class */ (function () {
        function MapProjection(objects, map, ctx, topLeft, size) {
            this.objectProjections = {};
            this.ctx = ctx;
            this.background = new Raster(ctx, topLeft, size, MapProjection.bgColor, MapProjection.borderColor, 1);
            this.map = map;
            this.objects = objects;
            this.border = this.createBorder();
            this.createUnitsProjections(objects.getUnits());
        }
        MapProjection.prototype.draw = function (camera) {
            this.background.draw(camera);
            this.border.draw(camera);
            // Draw unit's projection on the map
            for (var key in this.objectProjections) {
                if (this.objectProjections.hasOwnProperty(key)) {
                    this.objectProjections[key].draw(camera);
                }
            }
        };
        MapProjection.prototype.notify = function (context) {
            // Update the projection when the context object canges its state
            // TODO: Use notify for this.objects, when the objects uncrease or decrease
            var updatedUnit = context;
            this.objectProjections[updatedUnit.id] = this.createProjection(updatedUnit);
        };
        MapProjection.prototype.createUnitsProjections = function (units) {
            var _this = this;
            // Create initial units projections
            units.forEach(function (u) {
                _this.objectProjections[u.id] = _this.createProjection(u);
                u.subscribe(_this);
            });
        };
        MapProjection.prototype.createProjection = function (unit) {
            var ratioX = unit.position.x / (this.map.size().width * this.map.rasterSize);
            var ratioY = unit.position.y / (this.map.size().height * this.map.rasterSize);
            var x = this.border.position.x + (ratioX * this.border.size.width);
            var y = this.border.position.y + (ratioY * this.border.size.height);
            return new Circle(this.ctx, new Point2d(x, y), 3, unit.player.color);
        };
        MapProjection.prototype.createBorder = function () {
            // Get scaled size based on the map ratio
            var w = this.map.size().width, h = this.map.size().height, scaledW, scaledH;
            if (w >= h) {
                scaledW = 1;
                scaledH = h / w;
            }
            else {
                scaledW = w / h;
                scaledH = 1;
            }
            var size = new Size(this.background.size.width * scaledW, this.background.size.height * scaledH);
            // Get centered position
            var x = (this.background.size.width - size.width) / 2;
            var y = (this.background.size.height - size.height) / 2;
            return new Raster(this.ctx, new Point2d(x, y), size, 'black', MapProjection.borderColor, 1);
        };
        MapProjection.bgColor = '#20262e';
        MapProjection.borderColor = '#2d333b';
        return MapProjection;
    }());
    var SelectRect = /** @class */ (function (_super) {
        __extends(SelectRect, _super);
        function SelectRect() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        SelectRect.prototype.isSelected = function () {
            return this._isSelected;
        };
        SelectRect.prototype.select = function () {
            this.originalStroke = this.stroke;
            this.stroke = 'orange';
            this._isSelected = true;
        };
        SelectRect.prototype.unSelect = function () {
            this.stroke = this.originalStroke;
            this._isSelected = false;
        };
        SelectRect.prototype.getRect = function () {
            return this;
        };
        SelectRect.prototype.draw = function (camera) {
            // TODO: Draw isometric rect or circle
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.fillStyle = this.fill;
            this.ctx.strokeStyle = this.stroke;
            this.ctx.lineWidth = this.strokewidth;
            this.ctx.rect(this.position.x - camera.x, this.position.y - camera.y, this.size.width, this.size.height);
            this.ctx.stroke();
            this.ctx.fill();
            this.ctx.restore();
        };
        return SelectRect;
    }(Rect));
    var Unit = /** @class */ (function () {
        function Unit(id, ctx, center, size, speed, player) {
            // List of subscriber that are notified when the object state updates
            this.stateUpdateSubscribers = new Array();
            this.id = id;
            this.player = player;
            this.ctx = ctx;
            this.size = size;
            this.position = center;
            this.speed = speed;
            this.movementsQueue = new Array();
            this.rect = new SelectRect(ctx, Point2d.zero(), size, 'green', 'black', 2);
            this.positionRect();
        }
        Unit.prototype.subscribe = function (subscriber) {
            this.stateUpdateSubscribers.push(subscriber);
        };
        Unit.prototype.getRect = function () {
            return this.rect;
        };
        Unit.prototype.loadMovements = function (path) {
            this.movementsQueue = path;
        };
        Unit.prototype.move = function () {
            if (!this.nextStep) {
                // Path is over
                if (this.movementsQueue.length === 0)
                    return;
                this.nextStep = this.movementsQueue.shift().clone();
                // First step in the movement queue is the current - skip it
                if (this.position.x === this.nextStep.x && this.position.y === this.nextStep.y) {
                    this.nextStep = this.movementsQueue.shift().clone();
                }
                this.velocity = this.position.calcVelocity(this.nextStep, this.speed);
            }
            this.position.add(this.velocity);
            // If the position is closer than a velocity unit, the next step will jump over the position
            if (Math.abs(this.position.x - this.nextStep.x) < Math.abs(this.velocity.x))
                this.position.x = this.nextStep.x;
            if (Math.abs(this.position.y - this.nextStep.y) < Math.abs(this.velocity.y))
                this.position.y = this.nextStep.y;
            this.positionRect();
            this.notifyStateUpdate();
            // Step is over
            if (this.isPointInside(this.nextStep))
                this.nextStep = null;
        };
        Unit.prototype.isPointInside = function (other) {
            return this.position.x === other.x && this.position.y === other.y;
        };
        Unit.prototype.stop = function () {
            // TODO: Implement
        };
        Unit.prototype.isSelected = function () {
            return this.rect.isSelected();
        };
        Unit.prototype.draw = function (camera) {
            this.rect.draw(camera);
            this.ctx.beginPath();
            this.ctx.arc(this.position.x - camera.x, this.position.y - camera.y, this.size.height / 2, 0, 2 * Math.PI);
            this.ctx.lineWidth = 1;
            this.ctx.fillStyle = this.player.color;
            this.ctx.fill();
            this.ctx.stroke();
        };
        Unit.prototype.select = function () {
            this.rect.select();
        };
        Unit.prototype.unSelect = function () {
            this.rect.unSelect();
        };
        Unit.prototype.positionRect = function () {
            this.rect.position = new Point2d((this.position.x - this.size.width / 2), (this.position.y - this.size.height / 2));
        };
        Unit.prototype.notifyStateUpdate = function () {
            var _this = this;
            // Notify the subscribers, that the state has been updated
            this.stateUpdateSubscribers.forEach(function (sc) {
                sc.notify(_this);
            });
        };
        return Unit;
    }());
    var Player = /** @class */ (function () {
        function Player(color) {
            this.color = color;
        }
        return Player;
    }());
    var Point2d = /** @class */ (function () {
        function Point2d(x, y) {
            this.x = x;
            this.y = y;
        }
        Point2d.zero = function () {
            return new Point2d(0, 0);
        };
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
        Point2d.prototype.add = function (point) {
            this.x += point.x;
            this.y += point.y;
            return this;
        };
        Point2d.prototype.substract = function (point) {
            this.x -= point.x;
            this.y -= point.y;
            return this;
        };
        Point2d.prototype.equals = function (other) {
            return this.x === other.x && this.y === other.y;
        };
        return Point2d;
    }());
    return Game;
});
//# sourceMappingURL=game.js.map