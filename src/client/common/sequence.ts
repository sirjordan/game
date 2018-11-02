class Sequence {
    private last: number;

    constructor() {
        this.last = 0;
    }

    getNext = (): number => {
        this.last++;
        return this.last;
    }
}

export = Sequence;