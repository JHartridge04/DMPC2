let table
let canvas


let boxSize = 40
let gap = 70
let startX = 80
let startY = 220


async function setup() {
  table = await loadTable('js/effortLog.csv', ',', 'header')

  canvas = createCanvas(windowWidth, windowHeight)
  textFont('monospace')
}

function draw() {
  background(250)

  // how many squares fit on one line before wrapping
  let perRow = max(1, floor((width - startX * 2) / gap))
  let hovered = -1

  // title: the number the platform shows
  noStroke()
  fill(30)
  textSize(28)
  textAlign(LEFT, TOP)
  text(table.getRowCount() + ' contributions', startX, 50)
  fill(120)
  textSize(14)
  text('Every square looks the same. Hover to see what is lost.', startX, 90)

  for (let i = 0; i < table.getRowCount(); i++){
    let x = startX + (i % perRow) * gap
    let y = startY + floor(i / perRow) * gap * 2

    let hours = table.getNum(i, 'hours_worked')
    let over = mouseX > x && mouseX < x + boxSize && mouseY > y && mouseY < y + boxSize
    if (over) {
      hovered = i
    }

    // the hidden effort: a faint circle sized by hours worked
    let ghostSize = map(hours, 0, 20, 0, 260)
    noStroke()
    if (over) {
      fill(200, 60, 60, 90)
    } else {
      fill(200, 60, 60, 18)
    }
    circle(x + boxSize / 2, y + boxSize / 2, ghostSize)

    // the visible data point: every commit is the same green square
    if (over) {
      stroke(30)
    } else {
      noStroke()
    }
    fill(64, 196, 99)
    rect(x, y, boxSize, boxSize, 4)
  }

  if (hovered >= 0) {
    drawDetails(hovered)
  }
}

// panel showing everything the square leaves out
function drawDetails(i) {
  // shorten long commit messages so they fit in the panel
  let message = table.getString(i, 'message')
  if (message.length > 42) {
    message = message.substring(0, 42) + '...'
  }

  let lines = [
    table.getString(i, 'date') + '  ' + table.getString(i, 'time'),
    '"' + message + '"',
    '',
    'counted as:     1 contribution',
    '',
    'hours worked:   ' + table.getString(i, 'hours_worked'),
    'attempts:       ' + table.getString(i, 'attempts'),
    'searches:       ' + table.getString(i, 'searches'),
    'energy:         ' + table.getString(i, 'energy'),
    'gave up:        ' + table.getString(i, 'gave_up'),
    'lines added:    +' + table.getString(i, 'lines_added'),
    'lines deleted:  -' + table.getString(i, 'lines_deleted')
  ]

  let note = table.getString(i, 'note').trim()
  if (note != '') {
    lines.push('')
    lines.push('note: ' + note)
  }

  let lineHeight = 20
  let panelW = 420
  let panelH = lines.length * lineHeight + 30

  // keep the panel on screen
  let px = min(mouseX + 20, width - panelW - 10)
  let py = min(mouseY + 20, height - panelH - 10)

  stroke(30)
  fill(255, 245)
  rect(px, py, panelW, panelH, 6)

  noStroke()
  fill(30)
  textSize(14)
  textAlign(LEFT, TOP)
  for (let j = 0; j < lines.length; j++){
    text(lines[j], px + 15, py + 15 + j * lineHeight)
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight)
}
