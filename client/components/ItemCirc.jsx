import React from 'react'

export default class ItemCirc extends React.Component {

  render () {
    let spot = this.props.spot
    return (
      <circle
        className={spot.type}
        key={spot.type + '_x' + spot.x + 'y' + spot.y}
        cx={spot.x * 14 + 7}
        cy={spot.y * 14 + 7}
        r={spot.type === 'boss' ? 18 : 6}
      />
    )
  }

}
