class Sprite {
    constructor({ position, velocity, image, frames = { min: 1, hold: 10, max: 1 }, animate = false, sprites = [], rotation = 0,}) {
        this.position = position
        this.velocity = velocity
        this.image = new Image()
        this.frames = { ...frames, val: 0, elapsed: 0 }
        this.image.onload = () => {
            this.width = this.image.width / this.frames.max
            this.height = this.image.height
        }
        this.image.src = image.src
        this.animate = animate
        this.sprites = sprites
        this.opacity = 1
        this.rotation = rotation
    }
    draw() {
        c.save()
        c.translate(
            this.position.x + this.width / 2, 
            this.position.y + this.height / 2
            )
        c.rotate(this.rotation)
        c.translate(
            -this.position.x - this.width / 2, 
            -this.position.y - this.height / 2
            )
        c.globalAlpha = this.opacity
        c.drawImage(
            //image to draw
            this.image,
            //crop width start
            this.frames.val * this.width,
            //crop height start
            0,
            //crop width end
            this.width,
            //crop height end
            this.height,
            //x-location
            this.position.x,
            //y-location
            this.position.y,
            //image width
            this.width / (this.frames.min),
            //image height
            this.height / (this.frames.min)
        )
        c.restore()

        if (!this.animate) return
        if (this.frames.max > 1) {
            this.frames.elapsed++
        }
        if (this.frames.elapsed % this.frames.hold === 0) {
            if (this.frames.val < this.frames.max - 1) this.frames.val++
            else this.frames.val = 0
        }
    }
}

class Monster extends Sprite {
    constructor({
        position, 
        image, 
        frames = { min: 1, hold: 10, max: 1 }, 
        animate = false, 
        sprites = [],
        name,
        rotation = 0,
        isEnemy = false, 
        health = 100, 
        attacks = [],
    }) {
        super ({
            position, 
            image, 
            frames, 
            animate, 
            sprites,
            rotation,
        })
        this.name = name,
        this.health = health
        this.isEnemy = isEnemy
        this.rotation = rotation
        this.attacks = attacks
    }

    faint() {
        const dialogBox = document.querySelector('#dialogBox')
        dialogBox.style.display = 'block'
        dialogBox.innerHTML = this.name + ' fainted!'
        gsap.to(this.position, {
            y: this.position.y + 10
        })
        gsap.to(this, {
            opacity: 0
        })
        battle.initiated = false
    }

    attack({ attack, recipient, renderedSprites }) {
        const dialogBox = document.querySelector('#dialogBox')
        dialogBox.style.display = 'block'
        dialogBox.innerHTML = this.name + ' used ' + attack.name

        let healthBar = '#enemyHealthBar'
        if (this.isEnemy) healthBar = '#playerHealthBar'

        let rotation = 1
        if (this.isEnemy) rotation = -2.2

        recipient.health -= attack.damage

        switch (attack.name) {
            case 'Haunt': {
                const energyBallImage = new Image()
                energyBallImage.src = './img/EnergyBall.png'
                const energyBall = new Sprite({
                    position: {
                        x: this.position.x,
                        y: this.position.y
                    },
                    frames: {
                        min: 1,
                        hold: 23,
                        max: 4
                    },
                    rotation,
                    animate: true,
                    image: energyBallImage
                })

                renderedSprites.splice(1, 0, energyBall)

                gsap.to(energyBall.position, {
                    x: recipient.position.x,
                    y: recipient.position.y,
                    onComplete: () => {
                            gsap.to(healthBar, {
                                width: recipient.health + '%'
                            })
    
                            gsap.to(recipient.position, {
                                x: recipient.position.x + 10,
                                yoyo: true,
                                repeat: 5,
                                duration: 0.08
                            })
    
                            gsap.to(recipient, {
                                opacity: 0,
                                yoyo: true,
                                repeat: 5,
                                duration: 0.08
                            })
                        renderedSprites.splice(1,1)
                    },
                    
                })

                

                break
            }

            case 'Rock Throw': {
                const rockImage = new Image()
                rockImage.src = './img/SpriteSheetRock.png'
                const rock = new Sprite({
                    position: {
                        x: this.position.x,
                        y: this.position.y
                    },
                    frames: {
                        min: 1,
                        hold: 23,
                        max: 4
                    },
                    rotation,
                    animate: true,
                    image: rockImage
                })

                renderedSprites.splice(1, 0, rock)

                gsap.to(rock.position, {
                    x: recipient.position.x,
                    y: recipient.position.y,
                    onComplete: () => {
                            gsap.to(healthBar, {
                                width: recipient.health + '%'
                            })
    
                            gsap.to(recipient.position, {
                                x: recipient.position.x + 10,
                                yoyo: true,
                                repeat: 5,
                                duration: 0.08
                            })
    
                            gsap.to(recipient, {
                                opacity: 0,
                                yoyo: true,
                                repeat: 5,
                                duration: 0.08
                            })
                        renderedSprites.splice(1,1)
                    },
                    
                })

                break
            }

            case 'Tackle': {

                const tl = gsap.timeline()

                let movementDistance = 5
                if (this.isEnemy) movementDistance = -5

                tl.to(this.position, {
                    x: this.position.x - movementDistance
                }).to(this.position, {
                    x: this.position.x + movementDistance * 2,
                    duration: .1,
                    onComplete: () => {

                        gsap.to(healthBar, {
                            width: recipient.health + '%'
                        })

                        gsap.to(recipient.position, {
                            x: recipient.position.x + 10,
                            yoyo: true,
                            repeat: 5,
                            duration: 0.08
                        })

                        gsap.to(recipient, {
                            opacity: 0,
                            yoyo: true,
                            repeat: 5,
                            duration: 0.08
                        })
                    }
                }).to(this.position, {
                    x: this.position.x
                })
                break
            }
            case 'Bite': {

                const tl = gsap.timeline()

                let movementDistance = 5
                if (this.isEnemy) movementDistance = -5

                tl.to(this.position, {
                    x: this.position.x - movementDistance
                }).to(this.position, {
                    x: this.position.x + movementDistance * 2,
                    duration: .1,
                    onComplete: () => {

                        gsap.to(healthBar, {
                            width: recipient.health + '%'
                        })

                        gsap.to(recipient.position, {
                            x: recipient.position.x + 10,
                            yoyo: true,
                            repeat: 5,
                            duration: 0.08
                        })

                        gsap.to(recipient, {
                            opacity: 0,
                            yoyo: true,
                            repeat: 5,
                            duration: 0.08
                        })
                    }
                }).to(this.position, {
                    x: this.position.x
                })
                break
            }
        }
    }

}