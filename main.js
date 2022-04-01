// Code by Firmansyahken
// github: https://github.com/firmansyahken/covid-slayer
// instagram : https://instagram.com/firmansyahken

const gameOverBoard = document.querySelector('.gameover')
const countingBoard = document.querySelector('.counting')
const countText = document.getElementById('count')
const playBtn = document.getElementById('play')

var backgroundImage = new Image()
backgroundImage.src = 'asset/bg.svg'

var injectionImage = new Image()
injectionImage.src = 'asset/injection.svg'

var bulletImage = new Image()
bulletImage.src = 'asset/bullet.svg'

var deltaImage = new Image()
deltaImage.src = 'asset/delta.png'


playBtn.addEventListener('click', function() {
    document.querySelector('.preloader').style.display = 'none'
    const sfx = new Audio('asset/321.mp3')
    sfx.play()
    counting()
})

var count = 3

function counting() {
    setInterval(() => {
        count--
        if(count < 1) {
            return countText.innerText = 'GO!'
        }
        countText.innerText = count
    }, 1000)
    setTimeout(() => {
        countingBoard.style.display = 'none'
        gamePlay()
        const backsound = new Audio('asset/bs.mp3')
        backsound.loop = true
        backsound.play()
    }, 4000)
}

function gamePlay() {
    var score = 0
    var speed = 1
    var canvas = document.getElementById('game')
    var ctx = canvas.getContext('2d')
    
    canvas.width = canvas.scrollWidth
    canvas.height = canvas.scrollHeight
    
    var cW = canvas.width
    var cH = canvas.height

    function level() {
        if(score > 10) {
            speed = 2
        }

        if(score > 50) {
            speed = 3
        }
    }

    window.addEventListener('keydown', function(e) {
        if(e.keyCode == 65) {
            player.x -= 5 + speed
        }
    
        if(e.keyCode == 68) {
            player.x += 5 + speed
        }
    })
    
    var bullets = []
    
    var cooldown = 1
    setInterval(() => {
        cooldown -- 
    }, 10)
    
    canvas.addEventListener('click', function() {
        if(cooldown < 0) {
            cooldown = 10
            sfxCrot()
            bullets.push({'x': player.x + 20, 'y': player.y, 'w': 10, 'h': 20})
        }
    
    })
    
    function sfxCrot() {
        const sfx = new Audio()
        sfx.src = 'asset/crot.wav'
        sfx.currentTime = 0
        sfx.play()
    }
    
    function background() {
        this.x = 0, this.y = 0,
        
        this.render = () => {
            ctx.drawImage(backgroundImage, this.x, this.y--)
            
            if(this.y == -1200) {
                this.y = 0
            }
        }
    }
    
    var bg = new background()
    
    function playerObject() {
        this.x = 125, this.y = 450, this.w = 50, this.h = 120
    
        this.render = () => {
            ctx.drawImage(injectionImage, this.x, this.y, this.w, this.h)
            
            if(this.x < 5) {
                this.x = 5
            }
    
            if(this.x > 250) {
                this.x = 250
            }
        }
    }
    
    var player = new playerObject()
    
    var viruses = []
    
    function addVirus() {
        const pattern = [25, 125, 225]
        let r = Math.floor(Math.random() * 3)
        viruses.push({'x': pattern[r], 'y': 0, 'w': 50, 'h': 50})
    }
    
    var timing = 0
    
    function renderVirus() {
        for(let i = 0; i < viruses.length; i++) {
            let virus = viruses[i]
            ctx.drawImage(deltaImage, virus.x, virus.y+=speed, virus.w, virus.h)
            if(virus.y > cH) {
                gameOver()
            }
        }
    
        timing ++ 
    
        if(timing == 200) {
            addVirus()
            timing = 0
        }
    }
    
    function renderBullet() {
        for(let i = 0; i < bullets.length; i++) {
            let bullet = bullets[i]
            ctx.drawImage(bulletImage, bullet.x, bullet.y-= 5, bullet.w, bullet.h)
            if(bullet.y < 0) {
                bullets.splice(i, 1)
            }
        }
    }
    
    function destroy() {
        for(let v = 0; v < viruses.length; v++) {
            var virus = viruses[v]
            for(let b = 0; b < bullets.length; b++) {
                var bullet = bullets[b]
                if(virus.y > bullet.y && bullet.x+bullet.w > virus.x && bullet.x < virus.x+virus.w) {
                    sfxDhuar()
                    viruses[v].h = 15
                    setTimeout(() => {
                        viruses.splice(v, 1)
                    }, 100) 
                    score += 1
                    bullets.splice(b, 1)
                }
            }
        }   
    }
    
    function sfxDhuar() {
        const sfx = new Audio()
        sfx.src = 'asset/dhuar.wav'
        sfx.currentTime = 0
        sfx.play()
    }
    
    function gameOver() {
        const sfx = new Audio('asset/haha.mp3')
        sfx.play()
        gameOverBoard.style.display = 'flex'
        document.getElementById('score').innerText = score
        clearInterval(animationInterval)
    }
    
    function animation() {
        ctx.save()
        ctx.clearRect(0, 0, cW, cH)
        bg.render()
        player.render()
        renderBullet()
        renderVirus()
        destroy()
        level()
        ctx.restore()
    }
    
    var animationInterval = setInterval(animation, 5)
}