const canvas = document.getElementById('canvas')
const canvasContext = canvas.getContext('2d')
const pacmanFrames = document.getElementById('animation')
const ghostFrames = document.getElementById('ghost')

let createRect = function (x, y, width, height, color) {
    canvasContext.fillStyle = color;
    canvasContext.fillRect(x, y, width, height);
}

//Varaiable to draw
let fps = 30;
let oneBlockSize = 20
let wallColor_range = ['#359c9c', '#c2b853', '#86669c', '#ed0a04', '#5036d9', '#12bc76', '#c55994', '#2067c1']
let wallColor = wallColor_range[0]
let wallSpaceWidth = oneBlockSize / 1.5
let wallOffset = (oneBlockSize - wallSpaceWidth) / 2
let wallInnerColor = 'black'
let foodColor = 'yellow'

//Score (Score) and check score to win (scoreCount)
let score = 0
let scoreCount = 0

//Create array to push ghost from the image to game
let ghosts = []
let ghostCount = 4

let lives = 3
let foodCount = 0

let ghostSpeed = oneBlockSize / 10

const DIRECTION_RIGHT = 4
const DIRECTION_UP = 3
const DIRECTION_LEFT = 2
const DIRECTION_DOWN = 1

//Set default ghosts's location
let ghostLocations = [
    { x: 0, y: 0 },
    { x: 176, y: 0 },
    { x: 0, y: 121 },
    { x: 176, y: 121 },
]

//Create a map
let map_origin = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1],
    [2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2],
    [1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1, 1],
    [1, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 1],
    [1, 1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1, 1],
    [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
]

/* let map_origin = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1],
    [2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2],
    [1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1],
    [1, 2, 1, 2, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 2, 1, 2, 1],
    [1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
] */

let map = []
for (let i = 0; i < map_origin.length; i++) {
    map[i] = map_origin[i].slice()
}

//Count origin number of food to check if eat all the food to set you win
for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[0].length; j++) {
        if (map[i][j] == 2) {
            foodCount++
        }
    }
}

//Set some location for ghosts to focus when they don't aware pacman
let randomTargetsForGhost = [
    { x: oneBlockSize, y: oneBlockSize },
    { x: oneBlockSize, y: (map.length - 3) * oneBlockSize },
    { x: (map[0].length - 2) * oneBlockSize, y: oneBlockSize },
    { x: (map[0].length - 2) * oneBlockSize, y: (map.length - 3) * oneBlockSize },
    { x: 5 * oneBlockSize, y: ((map.length - 3) / 2) * oneBlockSize },
    { x: (map[0].length - 5) * oneBlockSize, y: ((map.length - 3) / 2) * oneBlockSize },
    { x: 5 * oneBlockSize, y: ((map.length - 3) / 2 + 5) * oneBlockSize },
    { x: (map[0].length - 5) * oneBlockSize, y: ((map.length - 3) / 2 + 5) * oneBlockSize },
    // Added more random target position
]

//Called every 1/fps(s) by gameInterval
let gameLoop = function () {
    draw()
    update()
    drawlives()
}

//NEW FEAT: IF YOU EAT FREQUENCY IN 2 SECOND, YOU GET MORE POINT
let plusScore = 10
let tempScore
setInterval(() => {
    if (tempScore != score) {
        plusScore = 10
    }
    else {
        plusScore = 1
    }
    tempScore = score
}, 2000)


let update = function () {
    pacman.moveProcess()

    pacman.eat(plusScore)

    for (let i = 0; i < ghosts.length; i++) {
        ghosts[i].moveProcess()
    }

    if (pacman.checkGhostCollision()) {
        restartGame()
    }

    if (scoreCount >= foodCount) {
        drawWin()
        clearInterval(gameInterval)
    }
}

//Update rank
let names = JSON.parse(localStorage.getItem('Names'))
if (names === null) {
    names = []
}

let restartGame = () => {
    // wallColor = wallColor_range[Math.floor(Math.random() * wallColor_range.length)]
    createNewPacman()
    check_hard()
    lives--
    if (lives == 0) {
        gameOver()
    }
}

let drawRank = () => {
    canvasContext.font = '20px Emulogic'
    canvasContext.fillStyle = 'white'
    canvasContext.save()
    canvasContext.font = '30px Emulogic'
    let colorText = wallColor
    canvasContext.fillStyle = colorText
    canvasContext.fillText('Rank:', 520, 40)
    canvasContext.restore()
    let rowSpace = 50

    let rankCount = 1
    for (printName of names) {
        canvasContext.fillText(rankCount + '. ' + printName.name + ': ' + printName.score, 480, 35 + rowSpace)
        rankCount++
        rowSpace += 40

        if (rankCount == 6) return
    }
}

let gameOver = () => {
    drawGameOver()
    let name = prompt('Enter your name:')
    names.push({ 'name': name, 'score': score * 10 })
    names.sort((a, b) => b.score - a.score)
    localStorage.setItem("Names", JSON.stringify(names))
    createRect(500, 0, canvas.width, canvas.height, 'black')
    drawRank()
    clearInterval(gameInterval)
}

let drawGameOver = () => {
    canvasContext.font = '20px Emulogic'
    canvasContext.fillStyle = 'white'
    canvasContext.fillText('Game Over!', 110, 200)
}

let drawWin = () => {
    canvasContext.font = '20px Emulogic'
    canvasContext.fillStyle = 'white'
    canvasContext.fillText('You Win!', 140, 200)
}

let drawGhosts = () => {
    for (let i = 0; i < ghosts.length; i++) {
        ghosts[i].draw()
    }
}

let drawlives = () => {
    canvasContext.font = '20px Emulogic'
    canvasContext.fillStyle = 'white'
    canvasContext.fillText('Lives: ', 260, oneBlockSize * (map.length + 1) + 10)

    for (let i = 0; i < lives; i++) {
        canvasContext.drawImage(
            pacmanFrames,
            2 * oneBlockSize,
            0,
            oneBlockSize,
            oneBlockSize,
            380 + i * oneBlockSize,
            oneBlockSize * map.length + 10,
            oneBlockSize,
            oneBlockSize
        )
    }
}

let draw = () => {
    createRect(0, 0, canvas.width, canvas.height, 'black')

    drawWalls()

    drawFoods()

    pacman.draw()

    drawscore()

    drawGhosts()

    drawRank()
}

let drawFoods = () => { //Use arrow function - just practice
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[0].length; j++) {
            if (map[i][j] == 2) {
                createRect(j * oneBlockSize + oneBlockSize / 2.2,
                    i * oneBlockSize + oneBlockSize / 2.2,
                    oneBlockSize / 5,
                    oneBlockSize / 5,
                    foodColor)
            }
        }
    }
}

let drawscore = () => {
    canvasContext.font = '20px Emulogic'
    canvasContext.fillStyle = 'white'
    canvasContext.fillText(
        'Score: ' + score * 10,
        0,
        oneBlockSize * [map.length + 1] + 10
    )
}

let gameInterval = setInterval(gameLoop, 1000 / fps)

//MORE FEATURE: RESTART
let reset = function () {
    clearInterval(gameInterval)
    createNewPacman()
    check_hard()
    wallColor = wallColor_range[Math.floor(Math.random() * wallColor_range.length)]
    score = 0
    scoreCount = 0
    lives = 3
    for (let i = 0; i < map_origin.length; i++) {
        map[i] = map_origin[i].slice()
    }
    gameInterval = setInterval(gameLoop, 1000 / fps)
}

let drawWalls = function () {
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[0].length; j++) {
            if (map[i][j] == 1) {
                createRect(
                    j * oneBlockSize,
                    i * oneBlockSize,
                    oneBlockSize,
                    oneBlockSize,
                    wallColor
                );

                //draw black rectangle inside
                if (j > 0 && map[i][j - 1] == 1) {
                    createRect(
                        j * oneBlockSize,
                        i * oneBlockSize + wallOffset,
                        wallSpaceWidth + wallOffset,
                        wallSpaceWidth,
                        wallInnerColor
                    );
                }

                if (j < map[0].length - 1 && map[i][j + 1] == 1) {
                    createRect(
                        j * oneBlockSize + wallOffset,
                        i * oneBlockSize + wallOffset,
                        wallSpaceWidth + wallOffset,
                        wallSpaceWidth,
                        wallInnerColor
                    );
                }

                if (i > 0 && map[i - 1][j] == 1) {
                    createRect(
                        j * oneBlockSize + wallOffset,
                        i * oneBlockSize,
                        wallSpaceWidth,
                        wallSpaceWidth + wallOffset,
                        wallInnerColor
                    );
                }

                if (i < map.length - 1 && map[i + 1][j] == 1) {
                    createRect(
                        j * oneBlockSize + wallOffset,
                        i * oneBlockSize + wallOffset,
                        wallSpaceWidth,
                        wallSpaceWidth + wallOffset,
                        wallInnerColor
                    );
                }

            }

        }
    }
}

let createNewPacman = () => {
    pacman = new Pacman(
        oneBlockSize,
        oneBlockSize,
        oneBlockSize,
        oneBlockSize,
        oneBlockSize / 5
    )
}

let createNewGhosts = function (gSpeed) {
    ghosts = []
    for (let i = 0; i < ghostCount * 3; i++) {
        let newGhost = new Ghosts(
            9 * oneBlockSize + (i % 2 == 0 ? 0 : 1) * oneBlockSize,
            10 * oneBlockSize + (i % 2 == 0 ? 0 : 1) * oneBlockSize,
            oneBlockSize,
            oneBlockSize,
            gSpeed,
            ghostLocations[i % 4].x,
            ghostLocations[i % 4].y,
            124,
            116,
            6 + i
        )
        ghosts.push(newGhost)
    }
}

//NEW FEATURE: HARDMODE
let checkb = document.getElementById('ckb')
let check_hard = function () {
    if (checkb.checked) {
        ghostSpeed = oneBlockSize / 5
        createNewGhosts(ghostSpeed)
    }
    else {
        ghostSpeed = oneBlockSize / 10
        createNewGhosts(ghostSpeed)
    }
}

//Create Pacman
createNewPacman()
//Check hard mode, create ghosts and set speed to ghosts 
check_hard()

//Set animation for Pacman
setInterval(function () {
    pacman.changeAnimation()
}, 100)

gameLoop()

window.addEventListener('keydown', (event) => {
    let k = event.key

    setTimeout(() => {  //another way to call a function like above
        switch (k) {
            case 'ArrowUp':
                pacman.nextDirection = DIRECTION_UP
                break
            case 'ArrowDown':
                pacman.nextDirection = DIRECTION_DOWN
                break
            case 'ArrowLeft':
                pacman.nextDirection = DIRECTION_LEFT
                break
            case 'ArrowRight':
                pacman.nextDirection = DIRECTION_RIGHT
                break
        }
    }, 1)
})