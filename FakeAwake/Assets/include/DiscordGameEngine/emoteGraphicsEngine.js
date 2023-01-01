const THREE = require("three");

class Viewport {
    client;
    width = 6;
    height = 4;
    background = ':black_large_square:';
    pixels = [];
    gameObjects = [];

    constructor(Client, W, H, DefaultBG = ':black_large_square:') {
        this.client = Client;
        this.width = W;
        this.height = H;
        this.background = DefaultBG;
    }

    Render(message, _return = false) {
        this.pixels = new Array(this.height).fill(this.background).map(() => new Array(this.width).fill(this.background));

        // Create Background
        for (var i = 0; i < this.height; i++) { // For each row
            for (var j = 0; j < this.width; j++) { // For each column
                this.pixels[i][j] = this.background;
            }
        }

        //Add Layers
        for (var gameObjectIdx = 0; gameObjectIdx < this.gameObjects.length; gameObjectIdx++) { // For each Game Object
            for (var i = 0; i < this.height; i++) { // For each row of pixels
                for (var j = 0; j < this.width; j++) { // For each column of pixels
                    if (this.gameObjects[gameObjectIdx].pixelData[i][j] !== null) {
                        this.pixels[i][j] = this.gameObjects[gameObjectIdx].pixelData[i][j];
                    }
                }
            }
        }

        // Comma Remover
        for (var i = 0; i < this.height; i++) {
            this.pixels[i] = this.pixels[i].join('');
        }

        if (_return) {
            return this.pixels;
        } else {
            message.edit({ embed: [this.pixels] });
        }
    }
}

class Rectangle {
    name = '';
    position = new THREE.Vector2(0, 0);
    size = new THREE.Vector2(1, 1);
    Viewport = null;
    pixelData = [];

    constructor(x, y, w, h, vp, name = '') {
        this.position.x = x;
        this.position.y = y;
        this.size.x = w;
        this.size.y = h;
        this.Viewport = vp;
        this.name = name;
    }

    Render(brush = ':white_large_square:', fill = true) {
        this.pixelData = new Array(this.Viewport.height).fill(null).map(() => new Array(this.Viewport.width).fill(null));

        for (var i = 0; i < this.size.y; i++) {
            for (var j = 0; j < this.size.x; j++) {
                this.pixelData[this.position.y + i][this.position.x + j] = brush;
            }
        }

        if (!fill) {
            for (var i = 1; i < this.size.y - 1; i++) {
                for (var j = 1; j < this.size.x - 1; j++) {
                    this.pixelData[this.position.y + i][this.position.x + j] = null;
                }
            }
        }
    }
}

class Circle {
    position = new THREE.Vector2(0, 0);
    radius = 1;
    pixel = new THREE.Vector2(1, Math.round(Math.sqrt((this.radius * this.radius) - 1) + 0.5));
    Viewport = null;
    pixelData = [];
    funni = 0;

    constructor(x, y, r, vp, name = '') {
        this.position = new THREE.Vector2(x, y);
        this.radius = r;
        this.pixel = new THREE.Vector2(1, Math.round(Math.sqrt((this.radius * this.radius) - 1) + 0.5) - this.funni);
        this.Viewport = vp;
        this.name = name;
    }

    Render(brush = ':white_large_square:', fill = false) {
        this.pixelData = new Array(this.Viewport.height).fill(null).map(() => new Array(this.Viewport.width).fill(null));
        this.pixel = new THREE.Vector2(1, Math.round(Math.sqrt((this.radius * this.radius) - 1) + 0.5) - this.funni);

        this.pixelData[this.position.x][this.position.y + this.radius] = brush;
        this.pixelData[this.position.x][this.position.y - this.radius] = brush;
        this.pixelData[this.position.x + this.radius][this.position.y] = brush;
        this.pixelData[this.position.x - this.radius][this.position.y] = brush;

        while (this.pixel.x < this.pixel.y) {
            this.pixelData[this.position.x + this.pixel.x][this.position.y + this.pixel.y] = brush;
            this.pixelData[this.position.x + this.pixel.x][this.position.y - this.pixel.y] = brush;
            this.pixelData[this.position.x - this.pixel.x][this.position.y + this.pixel.y] = brush;
            this.pixelData[this.position.x - this.pixel.x][this.position.y - this.pixel.y] = brush;
            this.pixelData[this.position.x + this.pixel.y][this.position.y + this.pixel.x] = brush;
            this.pixelData[this.position.x + this.pixel.y][this.position.y - this.pixel.x] = brush;
            this.pixelData[this.position.x - this.pixel.y][this.position.y + this.pixel.x] = brush;
            this.pixelData[this.position.x - this.pixel.y][this.position.y - this.pixel.x] = brush;
            this.pixel.x++;
            this.pixel.y = Math.round(Math.sqrt((this.radius * this.radius) - (this.pixel.x * this.pixel.x)) + 0.5);
        }

        if (this.pixel.x === this.pixel.y) {
            this.pixelData[this.position.x + this.pixel.x][this.position.y + this.pixel.y] = brush;
            this.pixelData[this.position.x + this.pixel.x][this.position.y - this.pixel.y] = brush;
            this.pixelData[this.position.x - this.pixel.x][this.position.y + this.pixel.y] = brush;
            this.pixelData[this.position.x - this.pixel.x][this.position.y - this.pixel.y] = brush;
        }
    }
}

module.exports = {
    Viewport,
    Rectangle,
    Circle
};