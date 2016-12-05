import React from 'react'

export default class Dungeon extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      grid: Array.from({length: 60}, () => Array.from({length: 120}, () => 'rock'))
    }
    this.newDun = Array.from({length: 60}, () => Array.from({length: 120}, () => 'rock'))
    this.rooms = []
    this.generateDungeon = this.generateDungeon.bind(this)
    this.generateTunnel = this.generateTunnel.bind(this)
    this.generateRoom = this.generateRoom.bind(this)
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
        'yh': rh - 1,
        'xc': rx + 1,
        'xw': rw - 1
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
    // draw the tunnel
    console.log("to/from: ", slotNum, nearest.prev)
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

  componentDidMount () {
    this.generateDungeon()
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
        </svg>
      </div>
    )
  }

}
