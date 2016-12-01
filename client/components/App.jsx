import React from 'react'
import Status from './Status'
import Dungeon from './Dungeon'

export default class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    return (
      <div className='app'>
        <div id='statusBar'>
          <Status />
        </div>
        <div id='dungeon'>
          <Dungeon />
        </div>
      </div>
    )
  }

}
