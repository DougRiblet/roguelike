import React from 'react'

export default class Dungeon extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      grid: Array.from({length: 80}, () => Array.from({length: 120}, () => 'rock')
    }
  }

  generateDungeon () {
    let newDun = Array.from({length: 80}, () => Array.from({length: 120}, () => 'rock')
    let count = 0

    while (count < 100) {
      generateRoom()
      count++
    }

    this.setState({grid: newDun})

    generateRoom () {
      // make Room dimensions
      let rw = 6 + Math.floor(Math.random() * 6)
      let rh = 6 + Math.floor(Math.random() * 6)
      // make Room position
      let rx = Math.random() * (120 - rw)
      let ry = Math.random() * (80 - rh)
      // check if position empty
      let empty = true
      for (let row = ry; row <= ry + rw; row++) {
        for (let col = rx; col <= rx + rh; col++) {
          if (newDun[row][col] !== 'rock') {
            empty = false
            break
          }
        }
      }
      if (empty) {
        for (let row = ry + 1; row < ry + rw; row++) {
          for (let col = rx + 1; col < rx + rh; col++) {
            newDun[row][col] = 'open'
          }
        }
      }
    }
    // end generateRoom
  }

  componentDidMount () {
    this.generateDungeon()
  }

  render () {
    return (
      <div>

      </div>
    )
  }

}
