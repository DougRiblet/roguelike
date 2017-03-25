import React from 'react'

export default class Status extends React.Component {
  render () {
    return (
      <div>
        <ul id='statusList'>
          <li>Health: {this.props.health}</li>
          <li>Weapon: {this.props.weaponCurrent.name}</li>
          <li>Prowess: {this.props.heroProwess}</li>
          <li>Dungeon: {this.props.dungeonLevel}</li>
          <li>
            <span
              onClick={this.props.toggleMask}
              className='fa fa-lightbulb-o'
              id='toggle-mask'
            />
          </li>
        </ul>
      </div>
    )
  }
}

Status.propTypes = {
  health: React.PropTypes.number.isRequired,
  heroProwess: React.PropTypes.number.isRequired,
  dungeonLevel: React.PropTypes.number.isRequired,
  toggleMask: React.PropTypes.func.isRequired,
  weaponCurrent: React.PropTypes.shape({
    name: React.PropTypes.string,
    power: React.PropTypes.number
  }).isRequired
}
