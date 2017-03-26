import React from 'react'

export default class GridRect extends React.Component {
  render () {
    return (
      <rect
        className={'on' + String(this.props.dot)}
        x={this.props.gx * 14}
        y={this.props.gy * 14}
      />
    )
  }
}

GridRect.propTypes = {
  gx: React.PropTypes.number.isRequired,
  gy: React.PropTypes.number.isRequired,
  dot: React.PropTypes.string.isRequired
}
