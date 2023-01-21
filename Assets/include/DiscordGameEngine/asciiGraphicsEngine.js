class Viewport {
    width = 6;
    height = 4;
    background = '#';
    pixels = [];
    layers = [];

    constructor(W, H, DefaultBG = '#') {
        this.width = W;
        this.height = H;
        this.background = DefaultBG;
    }

    DrawRectangle(x = 0, y = 0, w = 1, h = 1, brush = '@', fill = true) {
        var pixelData = new Array(this.height).fill(null).map(() => new Array(this.width).fill(null));

        for (var i = 0; i < h; i++) {
            for (var j = 0; j < w; j++) {
                pixelData[y + i][x + j] = brush;
            }
        }

        if (!fill) {
            for (var i = 1; i < h - 1; i++) {
                for (var j = 1; j < w - 1; j++) {
                    pixelData[y + i][x + j] = null;
                }
            }
        }

        this.layers.push(pixelData);
    }

    DrawCircle(x = 0, y = 0, r = 1, brush = '@', fill = true) {
        var pixelData = new Array(this.height).fill(null).map(() => new Array(this.width).fill(null));

        pixelData[x][y + r] = brush;
        pixelData[x][y - r] = brush;
        pixelData[x + r][y] = brush;
        pixelData[x - r][y] = brush;

        var pixY = Math.round(Math.sqrt((r * r) - 1) + 0.5),
            pixX = 1;

        while (pixX < pixY) {
            pixelData[x + pixX][y + pixY] = brush;
            pixelData[x + pixX][y - pixY] = brush;
            pixelData[x - pixX][y + pixY] = brush;
            pixelData[x - pixX][y - pixY] = brush;
            pixelData[x + pixY][y + pixX] = brush;
            pixelData[x + pixY][y - pixX] = brush;
            pixelData[x - pixY][y + pixX] = brush;
            pixelData[x - pixY][y - pixX] = brush;
            pixX++;
            pixY = Math.round(Math.sqrt((r * r) - (pixX * pixX)) + 0.5);
        }

        if (pixX === pixY) {
            pixelData[x + pixX][y + pixY] = brush;
            pixelData[x + pixX][y - pixY] = brush;
            pixelData[x - pixX][y + pixY] = brush;
            pixelData[x - pixX][y - pixY] = brush;
        }

        /*
        for (var pixX = -r; pixX < r; pixX++) {
            var pixY = Math.round(Math.sqrt((r * r) - (pixX * pixX)) + 0.5);
            pixelData[x + pixX][y + pixY] = brush;
            pixelData[x + pixX][y - pixY] = brush;
            pixelData[x - pixX][y + pixY] = brush;
            pixelData[x - pixX][y - pixY] = brush;
        }
        */
        this.layers.push(pixelData);
    }

    Render() {
        this.pixels = new Array(this.height).fill(0).map(() => new Array(this.width).fill(0));

        // Create Background
        for (var i = 0; i < this.height; i++) { // For each row
            for (var j = 0; j < this.width; j++) { // For each column
                this.pixels[i][j] = this.background;
            }
        }

        //Add Layers
        for (var layerIdx = 0; layerIdx < this.layers.length; layerIdx++) { // For each layer
            for (var i = 0; i < this.height; i++) { // For each row of pixels
                for (var j = 0; j < this.width; j++) { // For each column of pixels
                    if (this.layers[layerIdx][i][j] !== null) {
                        this.pixels[i][j] = this.layers[layerIdx][i][j];
                    }
                }
            }
        }

        // Comma Remover
        for (var i = 0; i < this.height; i++) {
            this.pixels[i] = this.pixels[i].join('');
        }

        return this.pixels;
    }
}

module.exports = Viewport;