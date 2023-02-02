const squirrelSprite = new Image()
squirrelSprite.src = './img/SquirrelSprite4.png'

const ghostSprite = new Image()
ghostSprite.src = './img/SpiritSprite4.png'

const monsters = {
    Ghost: {
        name: 'Ghost',
        position: {
            x: 300 / 4,
            y: 350 / 4,
        },
        frames: {
            min: 1,
            hold: 23,
            max: 4
        },
        image: {
            src: ghostSprite.src
        },
        animate: true,
        sprites: {
            enemy: ghostSprite,
            character: ghostSprite
                },
        attacks: [attacks.Tackle,attacks.Haunt]
    },
    Squirrel: {
        name: 'Rabid Squirrel',
        position: {
            x: 800 / 4,
            y: 125 / 4,
        },
        frames: {
            min: 1,
            hold: 23,
            max: 4
        },
        animate: true,
        image: {
            src: squirrelSprite.src
        },
        sprites: {
            enemy: squirrelSprite,
            character: squirrelSprite
        },
        attacks: [attacks.Bite, attacks.Rock],
        isEnemy: true
    }
}