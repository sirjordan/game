import Player = require('common/player');
import IGameObject = require('contracts/iGameObject');

interface IOwnedObject extends IGameObject{
    player: Player;
}

export = IOwnedObject;

