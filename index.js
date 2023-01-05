const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
console.log(battleZonesData)

canvas.height = 576
canvas.width = 1024

const collisionsMap = []
for (let i = 0; i < collisions.length; i += 70) {
    collisionsMap.push(collisions.slice(i, i + 70))
}

const battleZonesMap = []
for (let i = 0; i < battleZonesData.length; i += 70) {
    battleZonesMap.push(battleZonesData.slice(i, i + 70))
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
        c.fillStyle = 'rgba(255,0,0,0.5)'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}

const offset = {
    x: -388,
    y: -130
}

const boundaries = []

collisionsMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 1025)
            boundaries.push(new Boundary({
                position: {
                    x: j * Boundary.width + offset.x,
                    y: i * Boundary.height + offset.y
                }
            }
            ))
    })
})

const battleZones = []

battleZonesMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 1025)
            battleZones.push(new Boundary({
                position: {
                    x: j * Boundary.width + offset.x,
                    y: i * Boundary.height + offset.y
                }
            }
            ))
    })
})

c.scale(4, 4)
c.imageSmoothingEnabled = false;

const image = new Image()
image.src = './img/FirstMap.png'

const playerDownImage = new Image()
playerDownImage.src = './img/playerDown.png'

const playerUpImage = new Image()
playerUpImage.src = './img/playerUp.png'

const playerLeftImage = new Image()
playerLeftImage.src = './img/playerLeft.png'

const playerImageRight = new Image()
playerImageRight.src = './img/playerRight.png'

const foregroundImage = new Image()
foregroundImage.src = './img/Foreground.png'

class Sprite {
    constructor({ position, image, velocity, frames = { min: 1, max: 1 }, moving = false, sprites = [] }) {
        this.position = position
        this.image = image
        this.frames = { ...frames, val: 0, elapsed: 0 }
        this.image.onload = () => {
            this.width = this.image.width / this.frames.max
            this.height = this.image.height
        }
        this.moving = moving
        this.sprites = sprites
    }
    draw() {
        c.drawImage(
            this.image,
            //crop width start
            this.frames.val * this.width,
            //crop height start
            0,
            //crop width end
            this.width,
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
            this.frames.elapsed++
        }
        if (this.frames.elapsed % 20 === 0) {
            if (this.frames.val < this.frames.max - 1) this.frames.val++
            else this.frames.val = 0
        }

        // c.drawImage(this.image, this.position.x, this.position.y)
    }
}

const background = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: image
})

const player = new Sprite({
    position: {
        x: canvas.width / 8 - 192 / 32,
        y: canvas.height / 8 - 68 / 8,
    },
    frames: {
        min: 16,
        max: 4
    },
    image: playerDownImage,
    sprites: {
        down: playerDownImage, 
        up: playerUpImage, 
        left: playerLeftImage, 
        right: playerImageRight
    }
})

const foreground = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: foregroundImage
})

const keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    }
}
// const testBoundary = new Boundary({
//     position: {
//         x: 200,
//         y: 100
//     }
// })
const movables = [background, foreground, ...boundaries, ...battleZones]

function rectangularCollision({ rectangle1, rectangle2 }) {
    return (
        rectangle1.position.x + rectangle1.width / 4 >= rectangle2.position.x &&
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.position.y <= rectangle2.position.y + 6 &&
        rectangle1.position.y + rectangle1.height / 4 >= rectangle2.position.y
    )
}

function animate() {
    window.requestAnimationFrame(animate)
    background.draw()
    boundaries.forEach(boundary => {
        boundary.draw()
        if (
            rectangularCollision({
                rectangle1: player,
                rectangle2: boundary
            })
        ) {
            console.log('collision!!!')
        }
    })

    // testBoundary.draw()
    player.draw()
    foreground.draw()

    if (keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed) {
        for (let i = 0; i < battleZones.length; i++) {
            const battleZone = battleZones[i]
            const overlappingArea = 
            (Math.min(player.position.x + player.width / 4, battleZone.position.x + battleZone.width) - 
            Math.max(player.position.x, battleZone.position.x)) * 
            (Math.min(player.position.y + player.height / 4, battleZone.position.y + battleZone.height) - 
            Math.max(player.position.y, battleZone.position.y))
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: battleZone
                }) &&
                overlappingArea + 30 > (player.width / 4 * player.height / 4) / 2
            ) {
                console.log('battleZONNNEEE!')
            }
        }
    }

    let moving = true
    player.moving = false
    if (keys.w.pressed && lastKey === 'w') {
        player.moving = true
        player.image = player.sprites.up
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (rectangularCollision({
                rectangle1: player,
                rectangle2: {
                    ...boundary, position: { x: boundary.position.x, y: boundary.position.y + 3 / 4 }
                }
            })) {
                moving = false
                break
            }
        }
        if (moving) {
            movables.forEach((movable) => {
                movable.position.y += 3 / 4
            })
        }
    }
    else if (keys.a.pressed && lastKey === 'a') {
        player.moving = true
        player.image = player.sprites.left
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (rectangularCollision({
                rectangle1: player,
                rectangle2: {
                    ...boundary, position: { x: boundary.position.x + 3 / 4, y: boundary.position.y }
                }
            })) {
                moving = false
                break
            }
        }
        if (moving) {
            movables.forEach((movable) => {
                movable.position.x += 3 / 4
            })
        }
    }
    else if (keys.s.pressed && lastKey === 's') {
        player.moving = true
        player.image = player.sprites.down
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (rectangularCollision({
                rectangle1: player,
                rectangle2: {
                    ...boundary, position: { x: boundary.position.x, y: boundary.position.y - 3 / 4 }
                }
            })) {
                moving = false
                break
            }
        }
        if (moving) {
            movables.forEach((movable) => {
                movable.position.y -= 3 / 4
            })
        }
    }
    else if (keys.d.pressed && lastKey === 'd') {
        player.moving = true
        player.image = player.sprites.right
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (rectangularCollision({
                rectangle1: player,
                rectangle2: {
                    ...boundary, position: { x: boundary.position.x - 3 / 4, y: boundary.position.y }
                }
            })) {
                moving = false
                break
            }
        }
        if (moving) {
            movables.forEach((movable) => {
                movable.position.x -= 3 / 4
            })
        }
    }
}


animate()

let lastKey = ''

window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'w':
            keys.w.pressed = true
            lastKey = 'w'
            break
        case 'a':
            keys.a.pressed = true
            lastKey = 'a'
            break
        case 's':
            keys.s.pressed = true
            lastKey = 's'
            break
        case 'd':
            keys.d.pressed = true
            lastKey = 'd'
            break
    }
})

window.addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'w':
            keys.w.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
        case 's':
            keys.s.pressed = false
            break
        case 'd':
            keys.d.pressed = false
            break
    }
})