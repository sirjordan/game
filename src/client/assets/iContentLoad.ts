interface IContentLoad {
    load(loadComplete: () => void): void;
}

export = IContentLoad;