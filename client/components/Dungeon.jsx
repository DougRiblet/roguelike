import React from 'react'

export default class Dungeon extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      grid: Array.from({length: 60}, () => Array.from({length: 120}, () => 'rock')),
      hero: {'visible': false},
      exit: {'visible': false}
    }
    this.newDun = Array.from({length: 60}, () => Array.from({length: 120}, () => 'rock'))
    this.rooms = []
    this.generateDungeon = this.generateDungeon.bind(this)
    this.generateTunnel = this.generateTunnel.bind(this)
    this.generateRoom = this.generateRoom.bind(this)
    this.placeHeroStart = this.placeHeroStart.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)
  }

  generateDungeon () {
    // reset newDun to solid rock
    this.newDun = Array.from({length: 60}, () => Array.from({length: 120}, () => 'rock'))
    this.rooms = []
    let count = 0
    // fill up blank dungeon with rooms
    while (count < 200) {
      this.generateRoom(count)
      count++
    }
    // dig tunnels between rooms
    let roomsSorted = this.rooms.sort(function (a, b) {
      return (a.xc + a.yc * 1.33) - (b.xc + b.yc * 1.33)
    })
    let tunnelPass = 1
    while (tunnelPass < roomsSorted.length) {
      this.generateTunnel(roomsSorted, tunnelPass)
      tunnelPass++
    }
    // change state to show new dungeon
    this.setState({grid: this.newDun})
    // place hero in upper left room to start
    this.placeHeroStart(roomsSorted[0])
    this.placeExit(roomsSorted[roomsSorted.length - 1])
  }

  generateRoom (count) {
    let sizemin = Math.floor(6 + ((200 - count) / 70))
    // make Room dimensions
    let rw = sizemin + Math.floor(Math.random() * sizemin * 2)
    let rh = sizemin + Math.floor(Math.random() * sizemin * 1.5)
    // make Room position
    let rx = Math.floor(Math.random() * (119 - rw))
    let ry = Math.floor(Math.random() * (59 - rh))
    // check if position empty
    let empty = true
    for (let row = ry; row <= ry + rh; row++) {
      for (let col = rx; col <= rx + rw; col++) {
        if (this.newDun[row][col] !== 'rock') {
          empty = false
          break
        }
      }
    }
    if (empty) {
      this.rooms.push({
        'yc': ry + 1,
        'yh': rh - 2,
        'xc': rx + 1,
        'xw': rw - 2
      })
      for (let row = ry + 1; row < ry + rh; row++) {
        for (let col = rx + 1; col < rx + rw; col++) {
          this.newDun[row][col] = 'open'
        }
      }
    }
  }

  generateTunnel (roomArr, slotNum) {
    // set current room
    let curr = roomArr[slotNum]
    // pick random spot inside current room
    let cury = curr.yc + Math.floor(Math.random() * curr.yh)
    let curx = curr.xc + Math.floor(Math.random() * curr.xw)
    // find nearest connection to previous room
    let nearest = {'len': 200, 'prev': null, 'dir': null}
    for (let i = 0; i < slotNum; i++) {
      let prev = roomArr[i]
      if (cury >= prev.yc && cury <= prev.yc + prev.yh) {
        if (curx > prev.xc && curr.xc - (prev.xc + prev.xw) < nearest.len) {
          nearest = {'len': curr.xc - (prev.xc + prev.xw), 'prev': i, 'dir': 'LR'}
        }
        if (curx < prev.xc && prev.xc - (curr.xc + curr.xw) < nearest.len) {
          nearest = {'len': prev.xc - (curr.xc + curr.xw), 'prev': i, 'dir': 'LR'}
        }
      }
      if (curx >= prev.xc && curx <= prev.xc + prev.xw) {
        if (cury > prev.yc && curr.yc - (prev.yc + prev.yh) < nearest.len) {
          nearest = {'len': curr.yc - (prev.yc + prev.yh), 'prev': i, 'dir': 'UD'}
        }
        if (cury < prev.yc && prev.yc - (curr.yc + curr.yh) < nearest.len) {
          nearest = {'len': prev.yc - (curr.yc + curr.yh), 'prev': i, 'dir': 'UD'}
        }
      }
    }
    // if random spot doesn't make a connection, try again from upper left corner
    if (nearest.dir === null) {
      cury = curr.yc + 1
      curx = curr.xc + 1
      for (let i = 0; i < slotNum; i++) {
        let prev = roomArr[i]
        if (cury >= prev.yc && cury <= prev.yc + prev.yh) {
          if (curx > prev.xc && curr.xc - (prev.xc + prev.xw) < nearest.len) {
            nearest = {'len': curr.xc - (prev.xc + prev.xw), 'prev': i, 'dir': 'LR'}
          }
          if (curx < prev.xc && prev.xc - (curr.xc + curr.xw) < nearest.len) {
            nearest = {'len': prev.xc - (curr.xc + curr.xw), 'prev': i, 'dir': 'LR'}
          }
        }
        if (curx >= prev.xc && curx <= prev.xc + prev.xw) {
          if (cury > prev.yc && curr.yc - (prev.yc + prev.yh) < nearest.len) {
            nearest = {'len': curr.yc - (prev.yc + prev.yh), 'prev': i, 'dir': 'UD'}
          }
          if (cury < prev.yc && prev.yc - (curr.yc + curr.yh) < nearest.len) {
            nearest = {'len': prev.yc - (curr.yc + curr.yh), 'prev': i, 'dir': 'UD'}
          }
        }
      }
    }
    // if still no connection, draw crooked tunnel
    if (nearest.dir === null) {
      let zigy = curr.yc + Math.ceil(curr.yh / 2)
      let zigx = curr.xc + Math.ceil(curr.xw / 2)
      let zagy = roomArr[slotNum - 1].yc + Math.ceil(roomArr[slotNum - 1].yh / 2)
      let zagx = roomArr[slotNum - 1].xc + Math.ceil(roomArr[slotNum - 1].xw / 2)
      let rowAcross = Math.min(zagy, zigy)
      let lowcolAcross = Math.min(zagx, zigx)
      let highcolAcross = Math.max(zagx, zigx)
      let colDown = (zigy > zagy && zigx > zagx) ? Math.max(zagx, zigx) : Math.min(zagx, zigx)
      let lowrowDown = Math.min(zagy, zigy)
      let highrowDown = Math.max(zagy, zigy)
      for (let colAcross = lowcolAcross; colAcross <= highcolAcross; colAcross++) {
        this.newDun[rowAcross][colAcross] = 'open'
      }
      for (let rowDown = lowrowDown; rowDown <= highrowDown; rowDown++) {
        this.newDun[rowDown][colDown] = 'open'
      }
    }
    // if connection found, draw the tunnel
    if (nearest.dir === 'LR') {
      let row = cury
      let lowcol = Math.min(curx, roomArr[nearest.prev].xc)
      let highcol = Math.max(curx, roomArr[nearest.prev].xc)
      for (let col = lowcol; col <= highcol; col++) {
        this.newDun[row][col] = 'open'
      }
    }
    if (nearest.dir === 'UD') {
      let col = curx
      let lowrow = Math.min(cury, roomArr[nearest.prev].yc)
      let highrow = Math.max(cury, roomArr[nearest.prev].yc)
      for (let row = lowrow; row <= highrow; row++) {
        this.newDun[row][col] = 'open'
      }
    }
  }

  placeHeroStart (room) {
    let startx = room.xc + Math.floor(Math.random() * room.xw)
    let starty = room.yc + Math.floor(Math.random() * room.yh)
    this.setState({'hero': {'x': startx, 'y': starty, 'visible': true}})
  }

  placeExit (room) {
    let startx = room.xc + Math.floor(Math.random() * room.xw)
    let starty = room.yc + Math.floor(Math.random() * room.yh)
    this.setState({'exit': {'x': startx, 'y': starty, 'visible': true}})
  }

  // distributeItems () {

  // }

  handleKeyDown (e) {
    if (e.keyCode > 36 && e.keyCode < 41) {
      e.preventDefault()
    }
    let h = this.state.hero
    if (e.keyCode === 37 && this.state.grid[h.y][h.x - 1] === 'open') {
      this.setState({hero: {x: h.x - 1, y: h.y, visible: true}})
    }
    if (e.keyCode === 38 && this.state.grid[h.y - 1][h.x] === 'open') {
      this.setState({hero: {x: h.x, y: h.y - 1, visible: true}})
    }
    if (e.keyCode === 39 && this.state.grid[h.y][h.x + 1] === 'open') {
      this.setState({hero: {x: h.x + 1, y: h.y, visible: true}})
    }
    if (e.keyCode === 40 && this.state.grid[h.y + 1][h.x] === 'open') {
      this.setState({hero: {x: h.x, y: h.y + 1, visible: true}})
    }
  }

  componentDidMount () {
    this.generateDungeon()
    window.addEventListener('keydown', this.handleKeyDown)
  }

  componentWillUnmount () {
    window.removeEventListener('keydown', this.handleKeyDown)
  }

  render () {
    return (
      <div>
        <svg>
          {
            this.state.grid.map((row, gy) => {
              return row.map((dot, gx) => {
                let oxo = 'on' + String(dot)
                return (
                  <rect
                    className={oxo}
                    x={gx * 10} y={gy * 10}
                  />
                )
              })
            })
          }
          {this.state.hero.visible &&
            <circle
              className='hero'
              cx={this.state.hero.x * 10 + 5}
              cy={this.state.hero.y * 10 + 5}
              r='4'
            />
          }
          {this.state.exit.visible &&
            <circle
              className='exit'
              cx={this.state.exit.x * 10 + 5}
              cy={this.state.exit.y * 10 + 5}
              r='4'
            />
          }
        </svg>
      </div>
    )
  }

}
