import React from 'react'
import Status from './Status'
import Dungeon from './Dungeon'

export default class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      health: 100,
      weaponCurrent: {name: 'stick', power: 10},
      heroProwess: 1,
      dungeonLevel: 1
    }
    this.upgradeWeapon = this.upgradeWeapon.bind(this)
    this.addHealth = this.addHealth.bind(this)
  }

  upgradeWeapon (dLevel) {
    let weaponCache = [
      {name: 'stick', power: 10},
      {name: 'knife', power: 20},
      {name: 'mace', power: 30},
      {name: 'sword', power: 40},
      {name: 'shotgun', power: 50}
    ]
    this.setState({weaponCurrent: weaponCache[dLevel]})
  }

  addHealth () {
    let newHealth = this.state.health + 20
    this.setState({health: newHealth})
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
            upgradeWeapon={(dLevel) => this.upgradeWeapon(dLevel)}
            addHealth={() => this.addHealth()}
          />
        </div>
      </div>
    )
  }

}
