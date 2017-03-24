import React from 'react'
import MaskDefs from './MaskDefs'
import MaskRect from './MaskRect'
import GridRect from './GridRect'
import generateDungeon from './helpers/DungeonMaker'

export default class Dungeon extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      grid: Array.from({length: 42}, () => Array.from({length: 84}, () => 'rock')),
      hero: {'visible': false},
      items: [],
      bossHealth: 0,
      candle: 'candledark'
    }
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.handleItemContact = this.handleItemContact.bind(this)
    this.handleCombat = this.handleCombat.bind(this)
    this.makeNewDungeon = this.makeNewDungeon.bind(this)
    this.fadeInCandle = this.fadeInCandle.bind(this)
    this.fadeOutCandle = this.fadeOutCandle.bind(this)
    this.displayGrid = this.displayGrid.bind(this)
  }

  componentDidMount () {
    this.makeNewDungeon()
    window.addEventListener('keydown', this.handleKeyDown)
  }

  componentWillUnmount () {
    window.removeEventListener('keydown', this.handleKeyDown)
  }

  makeNewDungeon () {
    let newDun = generateDungeon(this.props.dungeonLevel)
    this.setState({
      hero: newDun.hero,
      grid: newDun.grid,
      items: newDun.items,
      bossHealth: newDun.bossHealth,
      candle: 'candledark'
    })
    setTimeout(this.fadeInCandle, 100)
  }

  fadeInCandle () {
    this.setState({
      candle: 'candlelight'
    })
  }

  fadeOutCandle () {
    this.setState({
      candle: 'candledark'
    })
  }

  handleCombat (monster, hero) {
    let newMonsterHealth = monster.health - this.props.weaponCurrent.power - (5 * this.props.heroProwess)
    let newHeroHealth = this.props.health - monster.damage + (5 * this.props.heroProwess)
    if (newHeroHealth < 1) {
      this.fadeOutCandle()
      this.props.openModal(0)
      this.props.resetValuesForNewGame()
      setTimeout(this.makeNewDungeon, 2200)
      return
    } else if (newMonsterHealth < 1) {
      let itemsRevised = this.state.items.filter(i => i !== monster)
      this.setState({items: itemsRevised})
      this.props.logMonsterKill()
      this.props.addHealth(Math.floor(monster.damage / 3))
    } else {
      let itemsRevised = this.state.items.filter(i => i !== monster)
      this.props.addHealth(-monster.damage)
      monster.health = newMonsterHealth
      this.setState({items: itemsRevised.concat(monster)})
    }
  }

  handleBoss (hero) {
    let newBossHealth = this.state.bossHealth - this.props.weaponCurrent.power
    let newHeroHealth = this.props.health - 50
    if (newHeroHealth < 1) {
      this.fadeOutCandle()
      this.props.openModal(0)
      this.props.resetValuesForNewGame()
      setTimeout(this.makeNewDungeon, 2200)
      return
    } else if (newBossHealth < 1) {
      this.props.openModal(1)
      this.fadeOutCandle()
      this.props.resetValuesForNewGame()
      setTimeout(this.makeNewDungeon, 2200)
      return
    } else {
      this.props.addHealth(-50)
      this.setState({bossHealth: newBossHealth})
    }
  }

  handleItemContact (item, hero) {
    if (item.type === 'weapon') {
      this.props.upgradeWeapon(this.props.dungeonLevel)
      let itemsRevised = this.state.items.filter(i => i !== item)
      this.setState({
        hero: {x: item.x, y: item.y, visible: true},
        items: itemsRevised
      })
      return
    } else if (item.type === 'healthpack') {
      this.props.addHealth(20)
      let itemsRevised = this.state.items.filter(i => i !== item)
      this.setState({
        hero: {x: item.x, y: item.y, visible: true},
        items: itemsRevised
      })
      return
    } else if (item.type === 'monster') {
      this.handleCombat(item, hero)
      return
    } else if (item.type === 'bossEdge') {
      this.handleBoss(hero)
      return
    } else if (item.type === 'exit') {
      let itemsRevised = this.state.items.filter(i => i !== item)
      this.setState({
        hero: {x: item.x, y: item.y, visible: true},
        items: itemsRevised
      })
      this.fadeOutCandle()
      this.props.moveToNextDungeon()
      setTimeout(this.makeNewDungeon, 2500)
    }
  }

  handleKeyDown (e) {
    if (e.keyCode > 36 && e.keyCode < 41) {
      e.preventDefault()
    }
    let h = this.state.hero
    if (e.keyCode === 37 && this.state.grid[h.y][h.x - 1] === 'open') {
      let ranIntoItem = this.state.items.find(item => item.y === h.y && item.x === h.x - 1)
      if (ranIntoItem) {
        this.handleItemContact(ranIntoItem, h)
      } else {
        this.setState({hero: {x: h.x - 1, y: h.y, visible: true}})
      }
    }
    if (e.keyCode === 38 && this.state.grid[h.y - 1][h.x] === 'open') {
      let ranIntoItem = this.state.items.find(item => item.y === h.y - 1 && item.x === h.x)
      if (ranIntoItem) {
        this.handleItemContact(ranIntoItem, h)
      } else {
        this.setState({hero: {x: h.x, y: h.y - 1, visible: true}})
      }
    }
    if (e.keyCode === 39 && this.state.grid[h.y][h.x + 1] === 'open') {
      let ranIntoItem = this.state.items.find(item => item.y === h.y && item.x === h.x + 1)
      if (ranIntoItem) {
        this.handleItemContact(ranIntoItem, h)
      } else {
        this.setState({hero: {x: h.x + 1, y: h.y, visible: true}})
      }
    }
    if (e.keyCode === 40 && this.state.grid[h.y + 1][h.x] === 'open') {
      let ranIntoItem = this.state.items.find(item => item.y === h.y + 1 && item.x === h.x)
      if (ranIntoItem) {
        this.handleItemContact(ranIntoItem, h)
      } else {
        this.setState({hero: {x: h.x, y: h.y + 1, visible: true}})
      }
    }
  }

  displayGrid () {
    return this.state.grid.map((row, gy) => {
      return row.map((dot, gx) => {
        let oxo = 'on' + String(dot)
        let keyrect = 'x' + gx + 'y' + gy
        return (
          <GridRect
            oxo={oxo}
            keyrect={keyrect}
            gx={gx}
            gy={gy}
          />
        )
      })
    })
  }

  render () {
    return (
      <div>
        <svg>
          { this.displayGrid() }
          {
            this.state.items.map((spot) => {
              let keyitem = spot.type + '_x' + spot.x + 'y' + spot.y
              let itemRadius = spot.type === 'boss' ? 18 : 6
              return (
                <circle
                  className={spot.type}
                  key={keyitem}
                  cx={spot.x * 14 + 7}
                  cy={spot.y * 14 + 7}
                  r={itemRadius}
                />
              )
            })
          }
          {this.state.hero.visible &&
            <circle
              className='hero'
              cx={this.state.hero.x * 14 + 7}
              cy={this.state.hero.y * 14 + 7}
              r='6'
            />
          }
          {this.state.hero.visible && this.props.maskOn &&
            <MaskDefs
              hero={this.state.hero}
              candle={this.state.candle}
            />
          }
          {this.state.hero.visible && this.props.maskOn &&
            <MaskRect />
          }
        </svg>
      </div>
    )
  }

}
