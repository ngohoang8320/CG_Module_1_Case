class Pacman {
    constructor(x, y, width, height, speed) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.speed = speed
        this.direction = DIRECTION_RIGHT
        this.nextDirection = this.direction
        this.currentFrame = 1
        this.frameCount = 7

        /* setInterval(() => {
            this.changeAnimation()
        }, 100) */

        /* setInterval(function () {
            this.currentFrame = 1
            this.frameCount = 7;
            this.changeAnimation;
        }, 100) */
        // I've set these two outside

    }

    moveProcess() {
        //Set the Tele Tunnel in the middle
        if (this.getMapX() > map[0].length - 1) {
            this.x = 0
            this.y = ((map.length - 3) / 2) * oneBlockSize
        }
        else if (this.getMapX() < 0) {
            this.x = (map[0].length) * oneBlockSize
            this.y = ((map.length - 3) / 2) * oneBlockSize
        }
        //

        this.changeDirectionPossible()
        this.moveForwards()

        if (this.checkCollision()) {
            this.moveBackwards()
        }
    }

    eat(plus) {
        for (let i = 0; i < map.length; i++) {
            for (let j = 0; j < map[0].length; j++) {
                if (
                    map[i][j] == 2 &&
                    this.getMapX() == j &&
                    this.getMapY() == i
                ) {
                    map[i][j] = 3
                    //New feat: If you eat frequency in 2 second, you get more point
                    score += plus
                    scoreCount++
                }
            }
        }
    }

    moveBackwards() {
        switch (this.direction) {
            case DIRECTION_RIGHT:
                this.x -= this.speed
                break
            case DIRECTION_LEFT:
                this.x += this.speed
                break
            case DIRECTION_UP:
                this.y += this.speed
                break
            case DIRECTION_DOWN:
                this.y -= this.speed
                break
        }
    }

    moveForwards() {
        switch (this.direction) {
            case DIRECTION_RIGHT:
                this.x += this.speed
                break
            case DIRECTION_LEFT:
                this.x -= this.speed
                break
            case DIRECTION_UP:
                this.y -= this.speed
                break
            case DIRECTION_DOWN:
                this.y += this.speed
                break
        }
    }

    checkCollision() {
        if (
            map[this.getMapY()][this.getMapX()] == 1
            || map[this.getMapYRightSide()][this.getMapX()] == 1
            || map[this.getMapY()][this.getMapXRightSide()] == 1
            || map[this.getMapYRightSide()][this.getMapXRightSide()] == 1
        ) {
            return true

        }
        return false
    }

    checkGhostCollision() {
        for (let i = 0; i < ghosts.length; i++) {
            let ghost = ghosts[i]
            if (ghost.getMapX() == this.getMapX() && ghost.getMapY() == this.getMapY()) {
                return true
            }
        }
        return false
    }

    changeDirectionPossible() {
        if (this.direction == this.nextDirection)
            return

        let tempDirection = this.direction
        this.direction = this.nextDirection

        this.moveForwards()

        if (this.checkCollision()) {
            this.moveBackwards()
            this.direction = tempDirection
        }
        else {
            this.moveBackwards()
        }
    }

    changeAnimation() {
        this.currentFrame = this.currentFrame == this.frameCount ? 1 : this.currentFrame + 1
    }

    draw() {
        canvasContext.save()
        canvasContext.translate(
            this.x + oneBlockSize / 2,
            this.y + oneBlockSize / 2
        )

        canvasContext.rotate((this.direction * 90 * Math.PI) / 180)

        canvasContext.translate(
            -this.x - oneBlockSize / 2,
            -this.y - oneBlockSize / 2
        )

        canvasContext.drawImage(
            pacmanFrames,
            (this.currentFrame - 1) * oneBlockSize,
            0,
            oneBlockSize,
            oneBlockSize,
            this.x,
            this.y,
            this.width,
            this.height,
        )

        canvasContext.restore()
    }

    getMapX() {
        return parseInt(this.x / oneBlockSize)      //
    }

    getMapY() {
        return parseInt(this.y / oneBlockSize)      //
    }

    getMapXRightSide() {
        return parseInt((this.x + 0.9999 * oneBlockSize) / oneBlockSize)    //
    }

    getMapYRightSide() {
        return parseInt((this.y + 0.9999 * oneBlockSize) / oneBlockSize)    //
    }
}