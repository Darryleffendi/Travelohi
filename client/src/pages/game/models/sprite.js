export default class Sprite {
    constructor({
        position, // {x : _, y : _}
        imageSrc, // Source gambar
        frameCount, // Jumlah frame dalam animasi sprite
        scale = 1, // Pembesaran size image
        ctx,
        canvas
    }) {
        this.position = position;
        this.imageSrc = imageSrc;
        this.scale = scale;
        this.frameCount = frameCount;
        this.frameIndex = 0; // frame animasi sekarang
        this.frameElapsed = 0; // Timer dari sprite dibuat
        this.frameHold = 10; // Jumlah frame changes untuk mengganti animasi sprite
        this.image = new Image();
        this.image.src = imageSrc;
        this.ctx = ctx;
        this.canvas = canvas;
    }

    draw() {
        if (this.image.complete) {
            this.ctx.drawImage(
                this.image, 
                this.frameIndex * (this.image.width / this.frameCount),
                0,
                this.image.width / this.frameCount,
                this.image.height,
                this.position.x, 
                this.position.y, 
                (this.image.width / this.frameCount) * this.scale, 
                (this.image.height) * this.scale
            )
        }
    }

    animate() {
        this.frameIndex = (this.frameIndex + 1) % this.frameCount;
    }

    update() {
        
        if(this.ctx === undefined || this.ctx === null) return;

        this.draw();

        this.frameElapsed ++;

        if(this.frameElapsed % this.frameHold == 0) {
            this.animate();
        }
    }
}