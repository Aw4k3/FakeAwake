class navArea {
    Left = 0;
    Top = 0;
    Right = 1;
    Bottom = 1;
    
    constructor(x, y, w, h) {
        this.Left = x;
        this.Top = y;
        this.Right = w;
        this.Bottom = h;
    }

    showNavArea(Viewport) {
        var pixelData = new Array(this.Viewport.height).fill(null).map(() => new Array(this.Viewport.width).fill(null));

        for (var i = 0; i < this.Bottom; i++) {
            for (var j = 0; j < this.Right; j++) {
                pixelData[this.Top + i][this.Left + j] = ':white_square_button:';
            }
        }

        this.Viewport.layers.push(pixelData);
    }
}

module.exports = navArea;