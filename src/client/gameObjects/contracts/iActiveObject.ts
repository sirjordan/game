import Player = require('common/player');

interface IActiveObject {
    getPlayer(): Player;
    getId(): number;
}

export = IActiveObject;

