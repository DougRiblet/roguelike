import React from 'react'
import Status from './Status'
import Dungeon from './Dungeon'

export default class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      health: 100,
      weaponCurrent: 'stick',
      heroProwess: 1,
      dungeonLevel: 1
    }
  }

  render () {
    return (
      <div className='app'>
        <div id='statusBar'>
          <Status
            health={this.state.health}
            weaponCurrent={this.state.weaponCurrent}
            heroProwess={this.state.heroProwess}
            dungeonLevel={this.state.dungeonLevel}
          />
        </div>
        <div id='dungeon'>
          <Dungeon
            health={this.state.health}
            weaponCurrent={this.state.weaponCurrent}
            heroProwess={this.state.heroProwess}
            dungeonLevel={this.state.dungeonLevel}
          />
        </div>
      </div>
    )
  }

}
