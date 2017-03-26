import React from 'react'

export default class OurHero extends React.Component {
  render () {
    return (
      <circle
        className='hero'
        cx={this.props.hero.x * 14 + 7}
        cy={this.props.hero.y * 14 + 7}
        r='6'
      />
    )
  }
}

OurHero.propTypes = {
  hero: React.PropTypes.shape({
    x: React.PropTypes.number,
    y: React.PropTypes.number,
    visible: React.PropTypes.bool
  }).isRequired
}
