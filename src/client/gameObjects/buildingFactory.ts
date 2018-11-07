import Player = require('common/player');
import Point2d = require('common/point2d');
import Size = require('common/size');
import Building = require('building');

class BuildingFactory {
    private ctx: CanvasRenderingContext2D;
    private player: Player;

    constructor(ctx: CanvasRenderingContext2D, player: Player) {
        this.ctx = ctx;
        this.player = player;
    }

    baseBuilding(position: Point2d): Building {
        return new Building(this.ctx, position, new Size(120, 60), this.player);
    }
}

export = BuildingFactory;