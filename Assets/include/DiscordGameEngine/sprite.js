class Sprite {
    texture2D = '773242571865587722';
    x = 0;
    y = 0;

    constructor(emoteID, x, y) {
        this.texture2D = emoteID;
        this.x = x;
        this.y = y;
    }
}

module.exports = Sprite;