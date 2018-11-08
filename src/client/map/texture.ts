import Rect = require('gameObjects/rect');
import Size = require('common/size');
import Point2d = require('common/point2d');
import Camera = require('common/camera');
import Settings = require('settings');

class Texture extends Rect {
    private spritePosition: Point2d;
    private textureSprite: HTMLImageElement;

    constructor(id: number, textureSprite: HTMLImageElement, ctx: CanvasRenderingContext2D, drawAtPosition: Point2d, outputSize: Size) {
        super(ctx, drawAtPosition, outputSize);
        this.textureSprite = textureSprite;
        this.spritePosition = this.calcSpritePosition(id, textureSprite);
    }

    draw(camera: Camera): void {
        this.ctx.drawImage(
            this.textureSprite, 
            this.spritePosition.x, 
            this.spritePosition.y, 
            Settings.TERRAIN_TEXTURE_SIZE.width, 
            Settings.TERRAIN_TEXTURE_SIZE.height, 
            this.position.x, 
            this.position.y, 
            this.size.width, 
            this.size.height);
    }

    private calcSpritePosition(id: number, textureSprite: HTMLImageElement): Point2d {
        let spriteCols = textureSprite.width / Settings.TERRAIN_TEXTURE_SIZE.width;
        let spriteRows = textureSprite.height / Settings.TERRAIN_TEXTURE_SIZE.height;

        let textureRow = Math.ceil(id / spriteCols);
        let textureCol = id % spriteCols;

        if (textureRow > spriteRows - 1 || textureCol > spriteCols - 1)
            throw new Error('Requested texture number [' + id + '] on [' + textureRow + ', ' + textureCol + '] does not exists.');

        return new Point2d(textureCol * Settings.TERRAIN_TEXTURE_SIZE.width, textureRow * Settings.TERRAIN_TEXTURE_SIZE.height);
    }
}

export = Texture;