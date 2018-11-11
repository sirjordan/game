import Player = require('common/player');
import Point2d = require('common/point2d');
import Size = require('common/size');
import Sequence = require('common/sequence');
import Building = require('building');

class BuildingFactory {
    private ctx: CanvasRenderingContext2D;
    private player: Player;
    private sequence: Sequence;
    constructor(ctx: CanvasRenderingContext2D, player: Player, sequence: Sequence) {
        this.ctx = ctx;
        this.player = player;
        this.sequence = sequence;
    }

    baseBuilding(position: Point2d): Building {
        return new Building(this.sequence.getNext(), this.ctx, position, new Size(120, 60), this.player);
    }
}

export = BuildingFactory;