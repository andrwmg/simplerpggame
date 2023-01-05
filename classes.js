class Sprite {
    constructor({ position, image, velocity, frames = { min: 1, max: 1 } }) {
        this.position = position
        this.image = image
        this.frames = {...frames, val: 0, elapsed: 0}
        this.image.onload = () => {
            this.width = this.image.width / this.frames.max
            this.height = this.image.height
        }
    }
    draw() {
        c.drawImage(
            this.image,
            //crop width start
            this.frames.val * this.width,
            //crop height start
            0,
            //crop width end
            this.image.width / this.frames.max,
            //crop height end
            this.image.height,
            //x-location
            this.position.x,
            //y-location
            this.position.y,
            //image width
            this.image.width / (this.frames.min),
            //image height
            this.image.height / (this.frames.max)
        )
        if (!this.moving) return
        if (this.frames.max > 1) {
            this.frames.elapsed ++
        }
        if (this.frames.elapsed % 20 === 0) {
        if (this.frames.val < this.frames.max - 1) this.frames.val++
        else this.frames.val=0
        }

        // c.drawImage(this.image, this.position.x, this.position.y)
    }
}

class Boundary {
    static width = 12
    static height = 12
    constructor({ position }) {
        this.position = position
        this.width = 12
        this.height = 12
    }
    draw() {
        c.fillStyle = 'rgba(255,0,0,0.0)'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}
