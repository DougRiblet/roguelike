import React from 'react'

export default class Status extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    return (
      <div>
        <ul id='statusList'>
          <li>Health: {this.props.health}</li>
          <li>Weapon: {this.props.weaponCurrent.name}</li>
          <li>Prowess: {this.props.heroProwess}</li>
          <li>Dungeon: {this.props.dungeonLevel}</li>
        </ul>
      </div>
    )
  }

}
