import SelectRect = require('selectRect');

interface ISelectable {
    isSelected(): boolean;
    select(): void;
    unSelect(): void;
    getRect(): SelectRect;
}

export = ISelectable;