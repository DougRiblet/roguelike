import React from 'react'

export default class GridRect extends React.Component {

  render () {
    return (
      <rect
        className={'on' + String(this.props.dot)}
        key={'x' + this.props.gx + 'y' + this.props.gy}
        x={this.props.gx * 14}
        y={this.props.gy * 14}
      />
    )
  }

}
