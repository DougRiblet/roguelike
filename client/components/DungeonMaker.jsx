
let newGrid, newRooms, newItems, newHero

const generateDungeon = () => {
  newGrid = Array.from({length: 42}, () => Array.from({length: 84}, () => 'rock'))
  newRooms = []
  newItems = []
  let count = 0
  // fill up blank dungeon with rooms
  while (count < 200) {
    generateRoom(count)
    count++
  }
  // dig tunnels between rooms
  let roomsSorted = newRooms.sort(function (a, b) {
    return (a.xc + a.yc * 1.33) - (b.xc + b.yc * 1.33)
  })
  let tunnelPass = 1
  while (tunnelPass < roomsSorted.length) {
    generateTunnel(roomsSorted, tunnelPass)
    tunnelPass++
  }
  // // change state to show new dungeon
  // this.setState({grid: this.newDun})
  // scatter items and foes around the dungeon
  let openSpots = []
  for (let f = 1; f < roomsSorted.length - 1; f++) {
    let r = roomsSorted[f]
    for (let ry = r.yc + 1; ry < r.yc + r.yh - 2; ry++) {
      for (let rx = r.xc + 1; rx < r.xc + r.xw - 2; rx++) {
        openSpots.push({x: rx, y: ry})
      }
    }
  }
  distributeItems(openSpots, roomsSorted[roomsSorted.length - 1])
  // place hero in upper left room to start
  placeHeroStart(roomsSorted[0])
  return {
    'grid': newGrid,
    'items': newItems,
    'hero': newHero
  }
}

const generateRoom = (count) => {
  let sizemin = Math.floor(4 + ((200 - count) / 70))
  // make Room dimensions
  let rw = sizemin + Math.floor(Math.random() * sizemin * 1.6)
  let rh = sizemin + Math.floor(Math.random() * sizemin * 1.3)
  // make Room position
  let rx = Math.floor(Math.random() * (83 - rw))
  let ry = Math.floor(Math.random() * (41 - rh))
  // check if position empty
  let empty = true
  for (let row = ry; row <= ry + rh; row++) {
    for (let col = rx; col <= rx + rw; col++) {
      if (newGrid[row][col] !== 'rock') {
        empty = false
        break
      }
    }
  }
  if (empty) {
    newRooms.push({
      'yc': ry + 1,
      'yh': rh - 2,
      'xc': rx + 1,
      'xw': rw - 2
    })
    for (let row = ry + 1; row < ry + rh; row++) {
      for (let col = rx + 1; col < rx + rw; col++) {
        newGrid[row][col] = 'open'
      }
    }
  }
}

const generateTunnel = (roomArr, slotNum) => {
  // set current room
  let curr = roomArr[slotNum]
  // pick random spot inside current room
  let cury = curr.yc + Math.floor(Math.random() * curr.yh)
  let curx = curr.xc + Math.floor(Math.random() * curr.xw)
  // find nearest connection to previous room
  let nearest = {'len': 200, 'prev': null, 'dir': null}
  for (let i = 0; i < slotNum; i++) {
    let prev = roomArr[i]
    if (cury >= prev.yc && cury <= prev.yc + prev.yh) {
      if (curx > prev.xc && curr.xc - (prev.xc + prev.xw) < nearest.len) {
        nearest = {'len': curr.xc - (prev.xc + prev.xw), 'prev': i, 'dir': 'LR'}
      }
      if (curx < prev.xc && prev.xc - (curr.xc + curr.xw) < nearest.len) {
        nearest = {'len': prev.xc - (curr.xc + curr.xw), 'prev': i, 'dir': 'LR'}
      }
    }
    if (curx >= prev.xc && curx <= prev.xc + prev.xw) {
      if (cury > prev.yc && curr.yc - (prev.yc + prev.yh) < nearest.len) {
        nearest = {'len': curr.yc - (prev.yc + prev.yh), 'prev': i, 'dir': 'UD'}
      }
      if (cury < prev.yc && prev.yc - (curr.yc + curr.yh) < nearest.len) {
        nearest = {'len': prev.yc - (curr.yc + curr.yh), 'prev': i, 'dir': 'UD'}
      }
    }
  }
  // if random spot doesn't make a connection, try again from upper left corner
  if (nearest.dir === null) {
    cury = curr.yc + 1
    curx = curr.xc + 1
    for (let i = 0; i < slotNum; i++) {
      let prev = roomArr[i]
      if (cury >= prev.yc && cury <= prev.yc + prev.yh) {
        if (curx > prev.xc && curr.xc - (prev.xc + prev.xw) < nearest.len) {
          nearest = {'len': curr.xc - (prev.xc + prev.xw), 'prev': i, 'dir': 'LR'}
        }
        if (curx < prev.xc && prev.xc - (curr.xc + curr.xw) < nearest.len) {
          nearest = {'len': prev.xc - (curr.xc + curr.xw), 'prev': i, 'dir': 'LR'}
        }
      }
      if (curx >= prev.xc && curx <= prev.xc + prev.xw) {
        if (cury > prev.yc && curr.yc - (prev.yc + prev.yh) < nearest.len) {
          nearest = {'len': curr.yc - (prev.yc + prev.yh), 'prev': i, 'dir': 'UD'}
        }
        if (cury < prev.yc && prev.yc - (curr.yc + curr.yh) < nearest.len) {
          nearest = {'len': prev.yc - (curr.yc + curr.yh), 'prev': i, 'dir': 'UD'}
        }
      }
    }
  }
  // if still no connection, draw crooked tunnel
  if (nearest.dir === null) {
    let zigy = curr.yc + Math.ceil(curr.yh / 2)
    let zigx = curr.xc + Math.ceil(curr.xw / 2)
    let zagy = roomArr[slotNum - 1].yc + Math.ceil(roomArr[slotNum - 1].yh / 2)
    let zagx = roomArr[slotNum - 1].xc + Math.ceil(roomArr[slotNum - 1].xw / 2)
    let rowAcross = Math.min(zagy, zigy)
    let lowcolAcross = Math.min(zagx, zigx)
    let highcolAcross = Math.max(zagx, zigx)
    let colDown = (zigy > zagy && zigx > zagx) ? Math.max(zagx, zigx) : Math.min(zagx, zigx)
    let lowrowDown = Math.min(zagy, zigy)
    let highrowDown = Math.max(zagy, zigy)
    for (let colAcross = lowcolAcross; colAcross <= highcolAcross; colAcross++) {
      newGrid[rowAcross][colAcross] = 'open'
    }
    for (let rowDown = lowrowDown; rowDown <= highrowDown; rowDown++) {
      newGrid[rowDown][colDown] = 'open'
    }
  }
  // if connection found, draw the tunnel
  if (nearest.dir === 'LR') {
    let row = cury
    let lowcol = Math.min(curx, roomArr[nearest.prev].xc)
    let highcol = Math.max(curx, roomArr[nearest.prev].xc)
    for (let col = lowcol; col <= highcol; col++) {
      newGrid[row][col] = 'open'
    }
  }
  if (nearest.dir === 'UD') {
    let col = curx
    let lowrow = Math.min(cury, roomArr[nearest.prev].yc)
    let highrow = Math.max(cury, roomArr[nearest.prev].yc)
    for (let row = lowrow; row <= highrow; row++) {
      newGrid[row][col] = 'open'
    }
  }
}

const placeHeroStart = (room) => {
  let startx = room.xc + Math.floor(Math.random() * room.xw)
  let starty = room.yc + Math.floor(Math.random() * room.yh)
  newHero = {'x': startx, 'y': starty, 'visible': true}
}

const distributeItems = (openSpots, finalRoom) => {
  let monsterCount = 8
  let healthCount = 14
  let itemFillup = []
  while (monsterCount > 0) {
    let index = Math.floor(Math.random() * openSpots.length)
    let spot = openSpots[index]
    itemFillup.push({'type': 'monster', 'x': spot.x, 'y': spot.y})
    openSpots.splice(index, 1)
    monsterCount--
  }
  while (healthCount > 0) {
    let index = Math.floor(Math.random() * openSpots.length)
    let spot = openSpots[index]
    itemFillup.push({'type': 'healthpack', 'x': spot.x, 'y': spot.y})
    openSpots.splice(index, 1)
    healthCount--
  }
  let windex = Math.floor(Math.random() * openSpots.length / 4)
  let wspot = openSpots[windex]
  itemFillup.push({'type': 'weapon', 'x': wspot.x, 'y': wspot.y})
  let ex = finalRoom.xc + 1 + Math.floor(Math.random() * (finalRoom.xw - 2))
  let ey = finalRoom.yc + 1 + Math.floor(Math.random() * (finalRoom.yh - 2))
  itemFillup.push({'type': 'exit', 'x': ex, 'y': ey})
  newItems = itemFillup
}

export default generateDungeon
