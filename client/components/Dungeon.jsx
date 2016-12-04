import React from 'react'

export default class Dungeon extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      grid: Array.from({length: 60}, () => Array.from({length: 120}, () => 'rock'))
    }
    this.newDun = Array.from({length: 60}, () => Array.from({length: 120}, () => 'rock'))
    this.generateDungeon = this.generateDungeon.bind(this)
    this.generateRoom = this.generateRoom.bind(this)
  }

  generateDungeon () {
    // reset newDun to solid rock
    this.newDun = Array.from({length: 60}, () => Array.from({length: 120}, () => 'rock'))
    let count = 0
    // fill up blank dungeon with rooms
    while (count < 300) {
      this.generateRoom(count)
      count++
    }
    // change state to show new dungeon
    this.setState({grid: this.newDun})
  }

  generateRoom (count) {
    let sizemin = Math.floor(6 + ((300 - count) / 100))
    // make Room dimensions
    let rw = sizemin + Math.floor(Math.random() * sizemin * 2)
    let rh = sizemin + Math.floor(Math.random() * sizemin * 1.5)
    // make Room position
    let rx = Math.floor(Math.random() * (119 - rw))
    let ry = Math.floor(Math.random() * (59 - rh))

    console.log('w,h,x,y: ', rw, rh, rx, ry)
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
      for (let row = ry + 1; row < ry + rh; row++) {
        for (let col = rx + 1; col < rx + rw; col++) {
          this.newDun[row][col] = 'open'
        }
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
