import Rect = require('gameObjects/rect');
import Size = require('common/size');
import Point2d = require('common/point2d');
import Camera = require('common/camera');
import Settings = require('settings');

class Texture extends Rect {
    // Defines how is the slice of the sprite designed 
    public static readonly SPRITE_SLICE = new Size(100, 100);
    private spritePosition: Point2d;
    private textureSprite: HTMLImageElement;

    constructor(id: number, textureSprite: HTMLImageElement, ctx: CanvasRenderingContext2D, drawAtPosition: Point2d) {
        // Using the RASTER_SIZE of the settings as Output size. 
        super(ctx, drawAtPosition, Settings.RASTER_SIZE);
        this.textureSprite = textureSprite;
        this.spritePosition = this.calcSpritePosition(id, textureSprite);
    }

    draw(camera: Camera): void {
        this.ctx.drawImage(
            this.textureSprite,
            this.spritePosition.x,
            this.spritePosition.y,
            Texture.SPRITE_SLICE.width,
            Texture.SPRITE_SLICE.height,
            this.topLeft.x,
            this.topLeft.y,
            this.size.width,
            this.size.height);
    }

    private calcSpritePosition(id: number, textureSprite: HTMLImageElement): Point2d {
        let spriteCols = textureSprite.width / Texture.SPRITE_SLICE.width;
        let spriteRows = textureSprite.height / Texture.SPRITE_SLICE.height;

        let textureRow = Math.ceil(id / spriteCols) - 1;
        let textureCol = id % spriteCols;

        if (textureRow > spriteRows - 1 || textureCol > spriteCols - 1)
            throw new Error('Requested texture number [' + id + '] on [' + textureRow + ', ' + textureCol + '] does not exists.');

        return new Point2d(textureCol * Texture.SPRITE_SLICE.width, textureRow * Texture.SPRITE_SLICE.height);
    }
}

export = Texture;