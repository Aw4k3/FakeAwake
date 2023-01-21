class animation2D {
    keyframes = [];
    framerate = 3;

    CreateKeyframe(frame, x, y) {
        this.keyframes.push(new keyFrame(frame, x, y));
    }
}

class keyFrame {
    frame = 0;
    x = 0;
    y = 0;

    constructor(frame, x, y) {
        this.frame = frame;
        this.x = x;
        this.y = y;
    }
}