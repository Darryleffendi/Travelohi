import Sprite from './sprite'

export default class Fighter extends Sprite {
    constructor({
        position, // {x : _, y : _}
        imageSrc, // Source gambar
        frameCount, // Jumlah frame dalam animasi sprite
        scale, // Pembesaran size image
        sprites,
        ctx,
        canvas,
        attackMaxIndex,
    }) {
        super({position: position, imageSrc: imageSrc, frameCount: frameCount, scale: scale, ctx: ctx, canvas: canvas});
        this.velocity = {
            x: 0, 
            y: 0 // Velocity ke bawah (pengaruh gravitasi)
        }
        this.sprites = sprites;
        this.attackFrame = 0;
        this.attackIndex = 1;
        this.isAttacking = false;
        this.attackMaxIndex = attackMaxIndex;
        this.flipped = false;

        for(let sprite in this.sprites) {
            sprites[sprite].image = new Image();
            sprites[sprite].image.src = sprites[sprite].imageSrc
        }
    }

    update(keys) {
        if(this.canvas === undefined || this.canvas === null) return;

        if(!this.isGrounded()) {
            if(keys.attack) this.airAttack();
        }
        else {
            if(keys.attack && keys.down) {
                this.specialAttack();
            }
            if(this.flipped) {
                if(keys.attack && keys.left) {
                    this.attack();
                    this.velocity.x = -20
                }
            }
            else if(keys.attack && keys.right) {
                this.attack();
                this.velocity.x = 20
            }
        }
        if(!this.isAttacking) {
            if(keys.up == true) {
                this.jump()
            }
            if(keys.left == true) {
                this.velocity.x = -3;
            }
            else if(keys.right == true) {
                this.velocity.x = 3;
            }
            else {
                this.velocity.x = 0;
            }
        }
        

        super.update();
        
        //  Gravity
        if(this.isGrounded(keys)) {
            this.velocity.y = 0;
        } 
        // else if(this.position.y + this.image.height + this.velocity.y >= this.canvas.height - 315
        //     && this.position.y + this.image.height + this.velocity.y <= this.canvas.height - 300
        //     && this.position.x >= 500 && this.position.x <= 700) {
        //     this.velocity.y = 0;
        // }
        else if(!this.isAttacking) {
            this.velocity.y += 0.2 // 0.7 -> Percepatan Gravitasi
        }

        if(!this.isAttacking) {
            this.position.y += this.velocity.y
            this.position.x += this.velocity.x
        }
    }

    jump() {
        if(this.isGrounded()) {
            this.velocity.y = -11;
        }
    }

    attack() {
        if(this.isAttacking) return;

        this.switchSprite('attack' + this.attackIndex);
        this.attackFrame = this.sprites['attack' + this.attackIndex].frameCount;
        this.isAttacking = true;
    }

    specialAttack() {
        if(this.isAttacking) return;

        this.switchSprite('specialAttack');
        this.attackFrame = this.sprites['specialAttack'].frameCount;
        this.isAttacking = true;
    }
    
    airAttack() {
        if(this.isAttacking) return;

        this.switchSprite('airAttack');
        this.attackFrame = this.sprites['airAttack'].frameCount;
        this.isAttacking = true;
    }

    isGrounded(keys) {
        if(this.velocity.y < -1) {
            return false
        }
        else if(this.position.y + (this.image.height * this.scale) + this.velocity.y >= this.canvas.height -100) {
            return true
        }
        if(this.position.x > 325 && this.position.y < -120 && this.position.y > -130) {
            if(keys != null) {
                if(keys.down) return false;
            }
            return true
        }
        return false
    }
    
    switchSprite(sprite) {

        if(this.flipped) sprite += "_flipped"

        if(this.image == this.sprites[sprite].image) return;

        this.image = this.sprites[sprite].image
        this.frameCount = this.sprites[sprite].frameCount
        this.frameIndex = 0;
    }

    draw() {

        const shadowScale =  (this.position.y  + this.image.height * this.scale) / 600
        
        // Calculate shadow dimensions
        const shadowWidth = this.image.width / this.frameCount / 4 * shadowScale; 
        const shadowHeight = 10;
        const shadowX = this.position.x + (this.image.width / this.frameCount * 1.5) - shadowWidth / 2;
        const shadowY = this.canvas.height -105;

        // Set shadow style
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';

        // Begin path for shadow
        if(shadowWidth >= 0) {
            this.ctx.beginPath();
            this.ctx.ellipse(shadowX, shadowY, shadowWidth, shadowHeight, 0, 0, 2 * Math.PI);
            this.ctx.fill();
        }

        super.draw();

    }

    animate() {
        super.animate();


        
        if(this.isAttacking) {
            this.attackFrame --;

            if(this.attackFrame <= 0) {
                this.switchSprite('idle');
                this.isAttacking = false;
                this.attackFrame = 0;
                this.attackIndex++;
                if(this.attackIndex > this.attackMaxIndex) this.attackIndex = 1;
            }
        }
        else {

            if(this.velocity.y < 0) {
                this.switchSprite('jump')
            }
            else if(this.velocity.y > 0) {
                this.switchSprite('fall')
            }
            else if(this.velocity.x != 0) {
                this.switchSprite('run')
            }
            else {
                this.switchSprite('idle')
            }
        }
    }
}