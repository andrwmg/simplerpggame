const battleBackground = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    frames: { min: 1, max: 1 },
    image: battleBackgroundImage
})

let squirrel
let ghost
let renderedSprites
let queue

let battleAnimationId

function initBattle() {
    document.querySelector('#battleDisplay').style.display = 'block'
    document.querySelector('#onScreenButtons').style.display = 'none'
    document.querySelector('#dialogBox').style.display = 'none'
    document.querySelector('#enemyHealthBar').style.width = '100%'
    document.querySelector('#playerHealthBar').style.width = '100%'
    document.querySelector('#attacksBox').replaceChildren()

    squirrel = new Monster(monsters.Squirrel)
    ghost = new Monster(monsters.Ghost)
    renderedSprites = [squirrel, ghost]

    ghost.attacks.forEach(attack => {
        const button = document.createElement('button')
        button.innerHTML = attack.name
        document.querySelector('#attacksBox').append(button)
    })

    queue = []

    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', (e) => {
            const selectedAttack = attacks[e.currentTarget.innerHTML]
            ghost.attack({
                attack: selectedAttack,
                recipient: squirrel,
                renderedSprites
            })
    
            if (squirrel.health <= 0) {
                queue.push(()=> {
                    squirrel.faint()
                })
                queue.push(()=>{
                    gsap.to('#battleFlash', {
                        opacity: 1,
                        onComplete: ()=> {
                            cancelAnimationFrame(battleAnimationId)
                            animate()
                            document.querySelector('#battleDisplay').style.display = 'none'
                            document.querySelector('#onScreenButtons').style.display = 'block'
                            gsap.to('#battleFlash', {
                                opacity: 0
                            })
                        },
                    })
                })
                return
            }
    
            const randomAttack = squirrel.attacks[Math.floor(Math.random()*squirrel.attacks.length)]
    
            queue.push(()=> {
                squirrel.attack({
                    attack: randomAttack,
                    recipient: ghost,
                    renderedSprites
                })
                if (ghost.health <= 0) {
                    queue.push(()=> {
                        ghost.faint()
                    })
                    queue.push(()=>{
                        gsap.to('#battleFlash', {
                            opacity: 1,
                            onComplete: ()=> {
                                cancelAnimationFrame(battleAnimationId)
                                animate()
                                document.querySelector('#battleDisplay').style.display = 'none'
                                document.querySelector('#onScreenButtons').style.display = 'block'
                                gsap.to('#battleFlash', {
                                    opacity: 0
                                })
                            },
                        })
                    })
                    return
                }
            })
    
    
        })
        button.addEventListener('mouseenter', (e) => {
            const selectedAttack = attacks[e.currentTarget.innerHTML]
            document.querySelector('#attackType').innerHTML =  selectedAttack.type
            document.querySelector('#attackType').style.color =  selectedAttack.color
        })
        button.addEventListener('mouseleave', () => {
            document.querySelector('#attackType').innerHTML =  'Attack Type'
            document.querySelector('#attackType').style.color =  'black'
        })
    })
}

function animateBattle() {
    battleBackground.moving = false
    battleAnimationId = window.requestAnimationFrame(animateBattle)
    battleBackground.draw()
    renderedSprites.forEach((sprite) => {
        sprite.draw()
    })
}


document.querySelector('#dialogBox').addEventListener('click', (e) => {
    if (queue.length > 0) {
        queue[0]()
        queue.shift()
    } else e.currentTarget.style.display = 'none'

})