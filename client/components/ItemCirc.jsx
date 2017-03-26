import React from 'react'

export default class ItemCirc extends React.Component {
  render () {
    let spot = this.props.spot
    return (
      <circle
        className={spot.type}
        cx={spot.x * 14 + 7}
        cy={spot.y * 14 + 7}
        r={spot.type === 'boss' ? 18 : 6}
      />
    )
  }
}

ItemCirc.propTypes = {
  spot: React.PropTypes.shape({
    x: React.PropTypes.number,
    y: React.PropTypes.number,
    type: React.PropTypes.string
  }).isRequired
}
