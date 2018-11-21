import Objects = require('gameObjects/objects');
import UnitFactory = require('gameObjects/unitFactory');
import BuildingFactory = require('gameObjects/buildingFactory');
import Functions = require('common/functions');
import Size = require('common/size');
import Point2d = require('common/point2d');
import Player = require('common/player');
import Sequence = require('common/sequence');
import Camera = require('common/camera');
import Map = require('map/map');
import Terrain = require('map/terrain');
import MapProjection = require('map/mapProjection');
import TerrainFactory = require('./map/terrainFactory');

class Game {
    private objects: Objects;
    private gameLayer: HTMLCanvasElement;
    private gameCtx: CanvasRenderingContext2D;
    private bgLayer: HTMLCanvasElement;
    private mapProjectionLayer: HTMLCanvasElement;
    private rightPanel: HTMLElement;
    private bottomPanel: HTMLElement;
    private camera: Camera;
    private terrain: Terrain;
    private mapProjection: MapProjection;

    constructor(gameLayer: HTMLCanvasElement, bgLayer: HTMLCanvasElement, mapProjectionLayer: HTMLCanvasElement, rightPanel: HTMLElement, bottomPanel: HTMLElement) {
        if (!gameLayer) throw new Error('Missing argument: gameLayer');
        if (!rightPanel) throw new Error('Missing argument: rightPanel');
        if (!rightPanel) throw new Error('Missing argument: rightPanel');
        if (!bottomPanel) throw new Error('Missing argument: bottomPanel');
        if (!mapProjectionLayer) throw new Error('Missing argument: toolsLayer');

        this.gameLayer = gameLayer;
        this.bgLayer = bgLayer;
        this.mapProjectionLayer = mapProjectionLayer;
        this.rightPanel = rightPanel;
        this.bottomPanel = bottomPanel;

        this.gameCtx = this.gameLayer.getContext("2d");
        this.objects = new Objects(this.gameCtx);
        this.camera = new Camera(Functions.calcCanvasSize(this.rightPanel, this.bottomPanel));

        this.setStageSize();

        document.onkeypress = (ev) => this.keyPress(ev);
        window.onresize = (ev) => this.resizeWindow(ev);
        this.gameLayer.onclick = (args) => this.leftClick(args);
        this.gameLayer.oncontextmenu = (args) => this.rightClick(args);
        this.mapProjectionLayer.onclick = (args) => this.mapClick(args);
    }

    public start(): void {
        let terrainTextures = new Image();
        terrainTextures.src = 'imgs/textures.jpg';
        terrainTextures.onload = () => {
            let bgCtx = this.bgLayer.getContext('2d');
            let map = new Map();
            let terrainObjects = new TerrainFactory(bgCtx, terrainTextures);
            this.terrain = new Terrain(bgCtx, map, terrainObjects);

            let player = new Player('red');
            let sequence = new Sequence();

            let units = new UnitFactory(this.gameCtx, player, sequence);
            let buildings = new BuildingFactory(this.gameCtx, player, sequence);

            this.objects.add(units.baseUnit(new Point2d(50, 50)));
            this.objects.add(units.baseUnit(new Point2d(100, 100)));
            this.objects.add(buildings.baseBuilding(new Point2d(216, 217)));

            let toolsCtx = this.mapProjectionLayer.getContext('2d');
            this.mapProjection = new MapProjection(this.objects, map, toolsCtx, Point2d.zero(), new Size(this.rightPanel.clientWidth, this.rightPanel.clientWidth));

            // Start the game loop
            this.update();
        };
    };

    private update = () => {
        this.terrain.draw(this.camera);
        this.objects.update();
        this.objects.draw(this.camera);
        this.mapProjection.draw(this.camera);

        requestAnimationFrame(this.update);
    }

    private keyPress(ev: KeyboardEvent): void {
        // TODO: Replace the key with some other

        let cameraSpeed = 15;
        let newPos = this.camera.position.clone();

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
    }

    private resizeWindow(ev: UIEvent): void {
        this.setStageSize();
        this.terrain.reDraw(this.camera);
    }

    private leftClick(args: MouseEvent): void {
        let mousePosition = new Point2d(args.clientX, args.clientY).add(this.camera.position);
        let selectable = this.objects.getSelectable();

        // Check if any selectable object is at the mouse click position
        for (const obj of selectable) {
            if (obj.getRect().isPointInside(mousePosition)) {
                if (!obj.isSelected()) {
                    // Unselect all other objects and reset the selection
                    selectable.forEach(el => {
                        el.unSelect();
                    });

                    // Select the only clicked obj
                    obj.select();

                    break;
                }
            } else {
                if (obj.isSelected()) {
                    obj.unSelect();
                }
            }
        }
    }

    private rightClick(args: MouseEvent): void {
        args.preventDefault();

        // Move selected objects
        let mousePosition = new Point2d(args.clientX, args.clientY).add(this.camera.position);
        this.objects.getUnits().forEach(u => {
            if (u.isSelected()) {
                let path = this.getPath(u.getPosition(), mousePosition);
                u.loadMovements(path);
            }
        });
    }

    private mapClick(args: MouseEvent): void {
        let mousePosition = new Point2d(args.clientX, args.clientY);
        let offset = Functions.calcOffset(this.mapProjectionLayer);
        let relative = mousePosition.substract(new Point2d(offset.left, offset.top));
        let moveTo = this.mapProjection.calcAbsolutePosition(relative);
        // Set the click to be the center of the camera
        moveTo.x -= this.camera.size.width / 2;
        moveTo.y -= this.camera.size.height / 2
        this.setCameraAtPosition(moveTo);
    }

    private setCameraAtPosition(position: Point2d) {
        if (position.x < 0)
            position.x = 0;
        if (position.y < 0)
            position.y = 0;
        if (position.x + this.camera.size.width > this.terrain.map.sizeInPixels().width)
            position.x = this.terrain.map.sizeInPixels().width - this.camera.size.width;
        if (position.y + this.camera.size.height > this.terrain.map.sizeInPixels().height)
            position.y = this.terrain.map.sizeInPixels().height - this.camera.size.height;

        this.camera.position = position;
    }

    private getPath(from: Point2d, to: Point2d): Array<Point2d> {
        let path = new Array<Point2d>();

        // TODO: Make req to the server and get the path
        path.push(from);
        path.push(new Point2d(to.x, from.y));
        path.push(to);

        return path;
    }

    private setStageSize(): void {
        let canvasSize = Functions.calcCanvasSize(this.rightPanel, this.bottomPanel);
        this.gameLayer.width = canvasSize.width;
        this.gameLayer.height = canvasSize.height;
        this.bgLayer.width = canvasSize.width;
        this.bgLayer.height = canvasSize.height;
        this.camera.size = canvasSize;
    }
}

export = Game;














