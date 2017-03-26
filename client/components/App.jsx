import React from 'react'
import Modal from 'react-modal'
import Status from './Status'
import Dungeon from './Dungeon'
import customModalStyle from './helpers/CustomModalStyle'

export default class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      health: 100,
      weaponCurrent: {name: 'stick', power: 10},
      heroProwess: 1,
      monstersKilled: 0,
      dungeonLevel: 1,
      maskOn: true,
      modalIsOpen: true,
      modalMessage: 'SUZU: A ROGUELIKE',
      modalPara: 'Guide your hero (red) through the dungeon. Boost your hero by upgrading your weapon (turquoise), finding healthpacks (green) and vanquishing monsters (purple). Locate the exit (gold) to advance to the next dungeon. Defeat the giant monster in dungeon 4 to win the game.',
      modalButtonText: 'Enter the Dungeon'
    }
    this.upgradeWeapon = this.upgradeWeapon.bind(this)
    this.addHealth = this.addHealth.bind(this)
    this.moveToNextDungeon = this.moveToNextDungeon.bind(this)
    this.resetValuesForNewGame = this.resetValuesForNewGame.bind(this)
    this.logMonsterKill = this.logMonsterKill.bind(this)
    this.openModal = this.openModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.toggleMask = this.toggleMask.bind(this)
  }

  upgradeWeapon (dLevel) {
    let weaponCache = [
      {name: 'stick', power: 10},
      {name: 'knife', power: 20},
      {name: 'mace', power: 30},
      {name: 'sword', power: 40},
      {name: 'shotgun', power: 50}
    ]
    this.setState({weaponCurrent: weaponCache[dLevel]})
  }

  addHealth (num) {
    let newHealth = this.state.health + num
    this.setState({health: newHealth})
  }

  logMonsterKill () {
    let newMK = this.state.monstersKilled + 1
    let newHP = 1 + Math.floor(newMK / 6)
    this.setState({monstersKilled: newMK, heroProwess: newHP})
  }

  moveToNextDungeon () {
    let dunPlusOne = this.state.dungeonLevel + 1
    this.setState({dungeonLevel: dunPlusOne})
  }

  resetValuesForNewGame () {
    this.setState({
      health: 100,
      weaponCurrent: {name: 'stick', power: 10},
      heroProwess: 1,
      monstersKilled: 0,
      dungeonLevel: 1
    })
  }

  toggleMask () {
    this.setState({maskOn: !this.state.maskOn})
  }

  openModal (num) {
    let mHead = ['Game Over, You Lose', 'Game Over, You Win']
    let mPara = ['Try again?', 'Congratulations!']
    this.setState({
      modalIsOpen: true,
      modalMessage: mHead[num],
      modalPara: mPara[num],
      modalButtonText: 'Start New Game'
    })
  }

  closeModal () {
    this.setState({modalIsOpen: false})
  }

  render () {
    return (
      <div className='app'>
        <div id='statusBar'>
          <Status
            health={this.state.health}
            weaponCurrent={this.state.weaponCurrent}
            heroProwess={this.state.heroProwess}
            dungeonLevel={this.state.dungeonLevel}
            toggleMask={() => this.toggleMask()}
          />
        </div>
        <div id='modalDiv'>
          <Modal
            isOpen={this.state.modalIsOpen}
            style={customModalStyle}
            contentLabel='Modal'
          >
            <h2 className='modalH2'>{this.state.modalMessage}</h2>
            <p className='modalP'>{this.state.modalPara}</p>
            <button onClick={this.closeModal} className='modalButton'>
              {this.state.modalButtonText}
            </button>
          </Modal>
        </div>
        <div id='dungeon'>
          <Dungeon
            health={this.state.health}
            weaponCurrent={this.state.weaponCurrent}
            heroProwess={this.state.heroProwess}
            dungeonLevel={this.state.dungeonLevel}
            maskOn={this.state.maskOn}
            upgradeWeapon={(dLevel) => this.upgradeWeapon(dLevel)}
            addHealth={(num) => this.addHealth(num)}
            moveToNextDungeon={() => this.moveToNextDungeon()}
            logMonsterKill={() => this.logMonsterKill()}
            openModal={(num) => this.openModal(num)}
            closeModal={() => this.closeModal()}
            resetValuesForNewGame={() => this.resetValuesForNewGame()}
          />
        </div>
      </div>
    )
  }
}
