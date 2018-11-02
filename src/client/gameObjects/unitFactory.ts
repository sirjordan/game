import Unit = require('unit');
import Player = require('common/player');
import Sequence = require('common/sequence');
import Point2d = require('common/point2d');
import Size = require('common/size');

class UnitFactory {
    private ctx: CanvasRenderingContext2D;
    private player: Player;
    private sequence: Sequence;

    constructor(ctx: CanvasRenderingContext2D, player: Player, sequence: Sequence) {
        this.ctx = ctx;
        this.player = player;
        this.sequence = sequence;
    }

    baseUnit(position: Point2d): Unit {
        return new Unit(this.sequence.getNext(), this.ctx, position, new Size(20, 20), 3, this.player);
    }
}

export = UnitFactory;