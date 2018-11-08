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
define("common/functions", ["require", "exports", "common/size"], function (require, exports, Size) {
    "use strict";
    var Functions = /** @class */ (function () {
        function Functions() {
        }
        Functions.lerp = function (v0, v1, t) {
            return v0 + t * (v1 - v0);
        };
        Functions.calcCanvasSize = function (rightPanel, bottomPanel) {
            var rightPanelOffset = this.calcOffset(rightPanel);
            var bottomPanelOffset = this.calcOffset(bottomPanel);
            return new Size(rightPanelOffset.left, bottomPanelOffset.top);
        };
        Functions.calcOffset = function (el) {
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
        return Functions;
    }());
    return Functions;
});
define("common/point2d", ["require", "exports", "common/functions"], function (require, exports, Functions) {
    "use strict";
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
            var offsetX = Functions.lerp(this.x, other.x, delta) - this.x;
            var offsetY = Functions.lerp(this.y, other.y, delta) - this.y;
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
        Point2d.prototype.toCenter = function (size) {
            return new Point2d(this.x + size.width / 2, this.y + size.height / 2);
        };
        Point2d.prototype.toTopLeft = function (size) {
            return new Point2d(this.x - size.width / 2, this.y - size.height / 2);
        };
        return Point2d;
    }());
    return Point2d;
});
define("common/camera", ["require", "exports", "common/point2d"], function (require, exports, Point2d) {
    "use strict";
    var Camera = /** @class */ (function () {
        function Camera(size, position) {
            this.position = position || Point2d.zero();
            this.size = size;
        }
        return Camera;
    }());
    return Camera;
});
define("gameObjects/contracts/iGameObject", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("gameObjects/rect", ["require", "exports"], function (require, exports) {
    "use strict";
    var Rect = /** @class */ (function () {
        function Rect(ctx, topLeft, size, fill, stroke, strokewidth) {
            this.position = topLeft;
            this.ctx = ctx;
            this.size = size;
            this.fill = fill;
            this.stroke = stroke || fill;
            this.strokewidth = strokewidth || 1;
        }
        Rect.prototype.draw = function (camera) {
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.fillStyle = this.fill;
            this.ctx.strokeStyle = this.stroke;
            this.ctx.lineWidth = this.strokewidth;
            this.ctx.rect(this.position.x - camera.position.x, this.position.y - camera.position.y, this.size.width, this.size.height);
            this.ctx.stroke();
            if (this.fill)
                this.ctx.fill();
            this.ctx.restore();
        };
        Rect.prototype.isPointInside = function (point) {
            return (point.x >= this.position.x &&
                point.x <= this.position.x + this.size.width &&
                point.y >= this.position.y &&
                point.y <= this.position.y + this.size.height);
        };
        return Rect;
    }());
    return Rect;
});
define("gameObjects/circle", ["require", "exports"], function (require, exports) {
    "use strict";
    var Circle = /** @class */ (function () {
        function Circle(ctx, center, radius, stroke, fill, strokewidth) {
            this.ctx = ctx;
            this.position = center;
            this.radius = radius;
            this.fill = fill;
            this.stroke = stroke;
            this.strokewidth = strokewidth || 1;
        }
        Circle.prototype.draw = function (camera) {
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.arc(this.position.x - camera.position.x, this.position.y - camera.position.y, this.radius, 0, 2 * Math.PI);
            this.ctx.lineWidth = this.strokewidth;
            this.ctx.fillStyle = this.fill;
            this.ctx.strokeStyle = this.stroke;
            if (this.fill)
                this.ctx.fill();
            this.ctx.stroke();
            this.ctx.restore();
        };
        Circle.prototype.isPointInside = function (point) {
            throw new Error("Method not implemented.");
        };
        return Circle;
    }());
    return Circle;
});
define("settings", ["require", "exports", "common/size"], function (require, exports, Size) {
    "use strict";
    var Settings = /** @class */ (function () {
        function Settings() {
        }
        Settings.MAIN_COLOR = '#f9c731';
        Settings.TERRAIN_TEXTURE_SIZE = new Size(100, 100);
        return Settings;
    }());
    return Settings;
});
define("gameObjects/selectRect", ["require", "exports", "gameObjects/rect", "gameObjects/circle", "settings"], function (require, exports, Rect, Circle, Settings) {
    "use strict";
    var SelectRect = /** @class */ (function (_super) {
        __extends(SelectRect, _super);
        function SelectRect(ctx, topLeft, size) {
            var _this = _super.call(this, ctx, topLeft, size) || this;
            var radius = Math.sqrt(Math.pow(size.width, 2) + Math.pow(size.height, 2)) / 2;
            _this.selectionDrawingObject = new Circle(ctx, topLeft.toCenter(size), radius, Settings.MAIN_COLOR);
            return _this;
        }
        SelectRect.prototype.isSelected = function () {
            return this._isSelected;
        };
        SelectRect.prototype.select = function () {
            this.stroke = Settings.MAIN_COLOR;
            this._isSelected = true;
        };
        SelectRect.prototype.unSelect = function () {
            this._isSelected = false;
        };
        SelectRect.prototype.getRect = function () {
            return this;
        };
        SelectRect.prototype.draw = function (camera) {
            if (this._isSelected) {
                this.selectionDrawingObject.draw(camera);
            }
        };
        return SelectRect;
    }(Rect));
    return SelectRect;
});
define("gameObjects/contracts/iSelectable", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("common/contracts/iSubscriber", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("common/contracts/iNotifier", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("common/player", ["require", "exports"], function (require, exports) {
    "use strict";
    var Player = /** @class */ (function () {
        function Player(color) {
            this.color = color;
        }
        return Player;
    }());
    return Player;
});
define("gameObjects/contracts/IMovable", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("gameObjects/contracts/iOwnedObject", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("gameObjects/unit", ["require", "exports", "gameObjects/selectRect"], function (require, exports, SelectRect) {
    "use strict";
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
            this.rect = new SelectRect(ctx, center.toTopLeft(size), size);
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
            this.ctx.arc(this.position.x - camera.position.x, this.position.y - camera.position.y, this.size.height / 2, 0, 2 * Math.PI);
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
        Unit.prototype.notifyStateUpdate = function () {
            var _this = this;
            // Notify the subscribers, that the state has been updated
            this.stateUpdateSubscribers.forEach(function (sc) {
                sc.notify(_this);
            });
        };
        return Unit;
    }());
    return Unit;
});
define("gameObjects/building", ["require", "exports", "gameObjects/selectRect"], function (require, exports, SelectRect) {
    "use strict";
    var Building = /** @class */ (function () {
        function Building(ctx, center, size, player) {
            this.ctx = ctx;
            this.position = center;
            this.size = size;
            this.player = player;
            this.rect = new SelectRect(ctx, center.toTopLeft(size), size);
        }
        Building.prototype.draw = function (camera) {
            this.rect.draw(camera);
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.fillStyle = this.player.color;
            this.ctx.strokeStyle = this.player.color;
            this.ctx.lineWidth = 1;
            this.ctx.rect(this.position.x - camera.position.x - this.size.width / 2, this.position.y - camera.position.y - this.size.height / 2, this.size.width, this.size.height);
            this.ctx.stroke();
            this.ctx.fill();
            this.ctx.restore();
        };
        Building.prototype.isPointInside = function (point) {
            return this.rect.isPointInside(point);
        };
        Building.prototype.isSelected = function () {
            return this.rect.isSelected();
        };
        Building.prototype.select = function () {
            this.rect.select();
        };
        Building.prototype.unSelect = function () {
            this.rect.unSelect();
        };
        Building.prototype.getRect = function () {
            return this.rect;
        };
        return Building;
    }());
    return Building;
});
define("gameObjects/objects", ["require", "exports", "gameObjects/unit", "gameObjects/building"], function (require, exports, Unit, Building) {
    "use strict";
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
            return new (Array.bind.apply(Array, [void 0].concat(this.getUnits(), this.getBuildings())))();
        };
        Objects.prototype.getBuildings = function () {
            return this.objects[Building.name] || [];
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
    return Objects;
});
define("common/sequence", ["require", "exports"], function (require, exports) {
    "use strict";
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
    return Sequence;
});
define("gameObjects/unitFactory", ["require", "exports", "gameObjects/unit", "common/size"], function (require, exports, Unit, Size) {
    "use strict";
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
    return UnitFactory;
});
define("gameObjects/buildingFactory", ["require", "exports", "common/size", "gameObjects/building"], function (require, exports, Size, Building) {
    "use strict";
    var BuildingFactory = /** @class */ (function () {
        function BuildingFactory(ctx, player) {
            this.ctx = ctx;
            this.player = player;
        }
        BuildingFactory.prototype.baseBuilding = function (position) {
            return new Building(this.ctx, position, new Size(120, 60), this.player);
        };
        return BuildingFactory;
    }());
    return BuildingFactory;
});
define("map/map", ["require", "exports", "common/size"], function (require, exports, Size) {
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
        Map.prototype.sizeInPixels = function () {
            return new Size(this.size().width * this.rasterSize, this.size().height * this.rasterSize);
        };
        return Map;
    }());
    return Map;
});
define("gameObjects/raster", ["require", "exports", "gameObjects/rect"], function (require, exports, Rect) {
    "use strict";
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
            if (this.fill)
                this.ctx.fill();
            this.ctx.restore();
        };
        return Raster;
    }(Rect));
    return Raster;
});
define("map/texture", ["require", "exports", "gameObjects/rect", "common/point2d", "settings"], function (require, exports, Rect, Point2d, Settings) {
    "use strict";
    var Texture = /** @class */ (function (_super) {
        __extends(Texture, _super);
        function Texture(id, textureSprite, ctx, drawAtPosition, outputSize) {
            var _this = _super.call(this, ctx, drawAtPosition, outputSize) || this;
            _this.textureSprite = textureSprite;
            _this.spritePosition = _this.calcSpritePosition(id, textureSprite);
            return _this;
        }
        Texture.prototype.draw = function (camera) {
            this.ctx.drawImage(this.textureSprite, this.spritePosition.x, this.spritePosition.y, Settings.TERRAIN_TEXTURE_SIZE.width, Settings.TERRAIN_TEXTURE_SIZE.height, this.position.x, this.position.y, this.size.width, this.size.height);
        };
        Texture.prototype.calcSpritePosition = function (id, textureSprite) {
            var spriteCols = textureSprite.width / Settings.TERRAIN_TEXTURE_SIZE.width;
            var spriteRows = textureSprite.height / Settings.TERRAIN_TEXTURE_SIZE.height;
            var textureRow = Math.ceil(id / spriteCols) - 1;
            var textureCol = id % spriteCols;
            if (textureRow > spriteRows - 1 || textureCol > spriteCols - 1)
                throw new Error('Requested texture number [' + id + '] on [' + textureRow + ', ' + textureCol + '] does not exists.');
            return new Point2d(textureCol * Settings.TERRAIN_TEXTURE_SIZE.width, textureRow * Settings.TERRAIN_TEXTURE_SIZE.height);
        };
        return Texture;
    }(Rect));
    return Texture;
});
define("map/terrainObjectsFactory", ["require", "exports", "common/size", "gameObjects/raster", "map/texture"], function (require, exports, Size, Raster, Texture) {
    "use strict";
    var TerrainObjectsFactory = /** @class */ (function () {
        function TerrainObjectsFactory(ctx, textureSprite) {
            this.ctx = ctx;
            this.textureSprite = textureSprite;
        }
        TerrainObjectsFactory.prototype.texture = function (textureNumber, position, size) {
            try {
                return new Texture(textureNumber, this.textureSprite, this.ctx, position, new Size(size, size));
            }
            catch (error) {
                console.error(error);
                return new Raster(this.ctx, position, new Size(size, size), '#0f0b04');
            }
            switch (textureNumber) {
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
    return TerrainObjectsFactory;
});
define("map/terrain", ["require", "exports", "common/point2d"], function (require, exports, Point2d) {
    "use strict";
    var Terrain = /** @class */ (function () {
        function Terrain(ctx, map, terrainObjects) {
            this.ctx = ctx;
            this.map = map;
            this.terrainObjects = terrainObjects;
        }
        Terrain.prototype.draw = function (camera) {
            // Optimizing the draw() and render only if the camera changes its position
            if (this.lastCameraPosition && camera.position.equals(this.lastCameraPosition)) {
                return;
            }
            var maxRight = this.ctx.canvas.width;
            var maxTop = this.ctx.canvas.height;
            var rasterSize = this.map.rasterSize;
            this.ctx.clearRect(0, 0, maxRight, maxTop);
            var startPos = new Point2d((camera.position.x % rasterSize) * -1, (camera.position.y % rasterSize) * -1);
            var pos = startPos.clone();
            var row = Math.floor(camera.position.y / rasterSize);
            var col = Math.floor(camera.position.x / rasterSize);
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
                    var terrainObject = this.terrainObjects.texture(rasterCode, pos, rasterSize);
                    terrainObject.draw(camera);
                    col++;
                    pos.x = startPos.x + (j * rasterSize);
                }
                col = startCol;
                row++;
                pos.x = startPos.x;
                pos.y = startPos.y + (i * rasterSize);
            }
            this.lastCameraPosition = camera.position.clone();
        };
        Terrain.prototype.reDraw = function (camera) {
            // Force the terrain to redraw
            this.lastCameraPosition = null;
            this.draw(camera);
        };
        return Terrain;
    }());
    return Terrain;
});
define("map/mapProjection", ["require", "exports", "gameObjects/raster", "common/point2d", "common/size", "settings"], function (require, exports, Raster, Point2d, Size, Settings) {
    "use strict";
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
            for (var key in this.objectProjections)
                if (this.objectProjections.hasOwnProperty(key))
                    this.objectProjections[key].draw(camera);
            // Draw the camera and update only if camera change its position
            if (this.lastCameraPosition && !this.lastCameraPosition.equals(camera.position))
                this.cameraProjection.draw(camera);
            else
                this.cameraProjection = this.projectCamera(camera);
            this.lastCameraPosition = camera.position.clone();
            this.cameraProjection.draw(camera);
        };
        MapProjection.prototype.notify = function (context) {
            // Update the projection when the context object canges its state
            // TODO: Use notify for this.objects, when the objects uncrease or decrease
            var updatedUnit = context;
            this.objectProjections[updatedUnit.id] = this.project(updatedUnit);
        };
        MapProjection.prototype.calcAbsolutePosition = function (relativePosition) {
            var ratioX = (relativePosition.x - this.border.position.x) / this.background.size.width;
            var ratioY = (relativePosition.y - this.border.position.y) / this.background.size.height;
            var x = ratioX * this.map.sizeInPixels().width;
            var y = ratioY * this.map.sizeInPixels().height;
            var absolute = new Point2d(x, y);
            return absolute;
        };
        MapProjection.prototype.createUnitsProjections = function (units) {
            var _this = this;
            // Create initial units projections
            units.forEach(function (u) {
                _this.objectProjections[u.id] = _this.project(u);
                u.subscribe(_this);
            });
        };
        MapProjection.prototype.project = function (obj) {
            return new Raster(this.ctx, this.calcRelativePosition(obj.position), this.scaleSize(obj.size), obj.player.color);
        };
        MapProjection.prototype.projectCamera = function (camera) {
            return new Raster(this.ctx, this.calcRelativePosition(camera.position), this.scaleSize(camera.size), '', Settings.MAIN_COLOR);
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
        MapProjection.prototype.scaleSize = function (size) {
            var ratioX = size.width / this.map.sizeInPixels().width;
            var ratioY = size.height / this.map.sizeInPixels().height;
            return new Size(this.border.size.width * ratioX, this.border.size.height * ratioY);
        };
        MapProjection.prototype.calcRelativePosition = function (absolutePosition) {
            var ratioX = absolutePosition.x / this.map.sizeInPixels().width;
            var ratioY = absolutePosition.y / this.map.sizeInPixels().height;
            var x = ratioX * this.border.size.width;
            var y = ratioY * this.border.size.height;
            return new Point2d(x, y).add(this.border.position);
        };
        MapProjection.bgColor = '#20262e';
        MapProjection.borderColor = '#2d333b';
        return MapProjection;
    }());
    return MapProjection;
});
define("game", ["require", "exports", "gameObjects/objects", "gameObjects/unitFactory", "gameObjects/buildingFactory", "common/functions", "common/size", "common/point2d", "common/player", "common/sequence", "common/camera", "map/map", "map/terrain", "map/mapProjection", "map/terrainObjectsFactory"], function (require, exports, Objects, UnitFactory, BuildingFactory, Functions, Size, Point2d, Player, Sequence, Camera, Map, Terrain, MapProjection, TerrainObjectsFactory) {
    "use strict";
    var Game = /** @class */ (function () {
        function Game(gameLayer, bgLayer, mapProjectionLayer, rightPanel, bottomPanel) {
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
            if (!mapProjectionLayer)
                throw new Error('Missing argument: toolsLayer');
            this.gameLayer = gameLayer;
            this.bgLayer = bgLayer;
            this.mapProjectionLayer = mapProjectionLayer;
            this.rightPanel = rightPanel;
            this.bottomPanel = bottomPanel;
            this.gameCtx = this.gameLayer.getContext("2d");
            this.objects = new Objects(this.gameCtx);
            this.camera = new Camera(Functions.calcCanvasSize(this.rightPanel, this.bottomPanel));
            this.setStageSize();
            document.onkeypress = function (ev) { return _this.keyPress(ev); };
            window.onresize = function (ev) { return _this.resizeWindow(ev); };
            this.gameLayer.onclick = function (args) { return _this.leftClick(args); };
            this.gameLayer.oncontextmenu = function (args) { return _this.rightClick(args); };
            this.mapProjectionLayer.onclick = function (args) { return _this.mapClick(args); };
        }
        Game.prototype.start = function () {
            var _this = this;
            var terrainTextures = new Image();
            terrainTextures.src = 'imgs/textures.jpg';
            terrainTextures.onload = function () {
                var bgCtx = _this.bgLayer.getContext('2d');
                var terrainObjectsFactory = new TerrainObjectsFactory(bgCtx, terrainTextures);
                var map = new Map();
                _this.terrain = new Terrain(bgCtx, map, terrainObjectsFactory);
                var player = new Player('red');
                var unitFactory = new UnitFactory(_this.gameCtx, player, new Sequence());
                var buildings = new BuildingFactory(_this.gameCtx, player);
                _this.objects.add(unitFactory.baseUnit(new Point2d(50, 50)));
                _this.objects.add(unitFactory.baseUnit(new Point2d(100, 100)));
                _this.objects.add(buildings.baseBuilding(new Point2d(216, 217)));
                var toolsCtx = _this.mapProjectionLayer.getContext('2d');
                _this.mapProjection = new MapProjection(_this.objects, map, toolsCtx, Point2d.zero(), new Size(_this.rightPanel.clientWidth, _this.rightPanel.clientWidth));
                // Start the game loop
                _this.update();
            };
        };
        ;
        Game.prototype.keyPress = function (ev) {
            // TODO: Replace the key with some other
            var cameraSpeed = 15;
            var newPos = this.camera.position.clone();
            switch (ev.key) {
                case 'd':
                    newPos.x += cameraSpeed;
                    break;
                case 'a':
                    newPos.x -= cameraSpeed;
                    break;
                case 'w':
                    newPos.y -= cameraSpeed;
                    break;
                case 's':
                    newPos.y += cameraSpeed;
                    break;
            }
            this.setCameraAtPosition(newPos);
        };
        Game.prototype.resizeWindow = function (ev) {
            this.setStageSize();
            this.terrain.reDraw(this.camera);
        };
        Game.prototype.leftClick = function (args) {
            var mousePosition = new Point2d(args.clientX, args.clientY).add(this.camera.position);
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
            var mousePosition = new Point2d(args.clientX, args.clientY).add(this.camera.position);
            this.objects.getUnits().forEach(function (u) {
                if (u.isSelected()) {
                    var path = _this.getPath(u.position, mousePosition);
                    u.loadMovements(path);
                }
            });
        };
        Game.prototype.mapClick = function (args) {
            var mousePosition = new Point2d(args.clientX, args.clientY);
            var offset = Functions.calcOffset(this.mapProjectionLayer);
            var relative = mousePosition.substract(new Point2d(offset.left, offset.top));
            var moveTo = this.mapProjection.calcAbsolutePosition(relative);
            // Set the click to be the center of the camera
            moveTo.x -= this.camera.size.width / 2;
            moveTo.y -= this.camera.size.height / 2;
            this.setCameraAtPosition(moveTo);
        };
        Game.prototype.setCameraAtPosition = function (position) {
            if (position.x < 0)
                position.x = 0;
            if (position.y < 0)
                position.y = 0;
            if (position.x + this.camera.size.width > this.terrain.map.sizeInPixels().width)
                position.x = this.terrain.map.sizeInPixels().width - this.camera.size.width;
            if (position.y + this.camera.size.height > this.terrain.map.sizeInPixels().height)
                position.y = this.terrain.map.sizeInPixels().height - this.camera.size.height;
            this.camera.position = position;
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
            var canvasSize = Functions.calcCanvasSize(this.rightPanel, this.bottomPanel);
            this.gameLayer.width = canvasSize.width;
            this.gameLayer.height = canvasSize.height;
            this.bgLayer.width = canvasSize.width;
            this.bgLayer.height = canvasSize.height;
            this.camera.size = canvasSize;
        };
        return Game;
    }());
    return Game;
});
//# sourceMappingURL=game.js.map