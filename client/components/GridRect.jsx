import React from 'react'

export default class GridRect extends React.Component {

  render () {
    return (
      <rect
        className={this.props.oxo}
        key={this.props.keyrect}
        x={this.props.gx * 14}
        y={this.props.gy * 14}
      />
    )
  }

}
