const THREE = require("three");

class Actor {
    Name = '';
    Sprite = '';
    Position = new THREE.Vector2(0, 0);
    IsPhysicsEnabled = true;
    Viewport = null;
    pixelData = [];

    constructor(emoteID, x, y, vp, name = '') {
        this.Sprite = emoteID;
        this.Position.x = x;
        this.Position.y = y;
        this.Viewport = vp;
        this.Name = name;
    }

    Render() {
        this.pixelData = new Array(this.Viewport.height).fill(null).map(() => new Array(this.Viewport.width).fill(null));
        this.pixelData[this.Position.y][this.Position.x] = this.Sprite;
    }
}

module.exports = { Actor };