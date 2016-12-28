import React from 'react'

export default class Status extends React.Component {
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
      <div>
        Status Bar
      </div>
    )
  }

}
