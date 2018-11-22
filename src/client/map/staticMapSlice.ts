import Rect = require('gameObjects/rect');
import Point2d = require('common/point2d');
import Camera = require('common/camera');
import Settings = require('settings');
import Sprite = require('assets/sprite');

class StaticMapSlice extends Rect {
    // Defines how is the slice of the sprite designed 
    private spritePosition: Point2d;
    private sprite: Sprite;

    constructor(id: number, sprite: Sprite, ctx: CanvasRenderingContext2D, drawAtPosition: Point2d) {
        // Using the RASTER_SIZE of the settings as Output size. 
        super(ctx, drawAtPosition, Settings.RASTER_SIZE);
        this.sprite = sprite;
        this.spritePosition = this.calcSpritePosition(id, sprite);
    }

    draw(camera: Camera): void {
        this.ctx.drawImage(
            this.sprite.content(),
            this.spritePosition.x,
            this.spritePosition.y,
            this.sprite.sliceSize().width,
            this.sprite.sliceSize().height,
            this.topLeft.x,
            this.topLeft.y,
            this.size.width,
            this.size.height);
    }

    private calcSpritePosition(id: number, sprite: Sprite): Point2d {
        let spriteCols = sprite.size().width / sprite.sliceSize().width;
        let spriteRows = sprite.size().height / sprite.sliceSize().height;

        let textureRow = Math.ceil(id / spriteCols) - 1;
        let textureCol = id % spriteCols;

        if (textureRow > spriteRows - 1 || textureCol > spriteCols - 1)
            throw new Error('Requested slice number [' + id + '] on [' + textureRow + ', ' + textureCol + '] does not exists.');

        return new Point2d(textureCol * sprite.sliceSize().width, textureRow * sprite.sliceSize().height);
    }
}

export = StaticMapSlice;