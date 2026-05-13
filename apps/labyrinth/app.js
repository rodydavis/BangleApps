// Labyrinth Marble Run
g.clear();

var TILE = 16;
var ball = { x: 0, y: 0, vx: 0, vy: 0, r: 5 };
var currentLevel = 0;
var interval;

var levels = [
  [
    "###########",
    "#S    #   #",
    "##### # # #",
    "#   #   # #",
    "# # ##### #",
    "# # #     #",
    "# ### ### #",
    "#     # E #",
    "####### ###",
    "#         #",
    "###########"
  ],
  [
    "###########",
    "#S        #",
    "# ####### #",
    "# #     # #",
    "# # ### # #",
    "# # #E# # #",
    "# # ### # #",
    "# #     # #",
    "# ####### #",
    "#         #",
    "###########"
  ]
];

function loadLevel(idx) {
  if (idx >= levels.length) {
    g.clear();
    g.setFont("Vector", 20).setFontAlign(0,0);
    g.drawString("You Win!", g.getWidth()/2, g.getHeight()/2);
    if (interval) clearInterval(interval);
    return;
  }
  
  currentLevel = idx;
  var lvl = levels[currentLevel];
  for (var y = 0; y < 11; y++) {
    for (var x = 0; x < 11; x++) {
      if (lvl[y][x] === 'S') {
        ball.x = x * TILE + TILE / 2;
        ball.y = y * TILE + TILE / 2;
        ball.vx = 0;
        ball.vy = 0;
      }
    }
  }
}

function checkCollision(x, y) {
  var r = ball.r;
  var corners = [
    {cx: x - r, cy: y - r},
    {cx: x + r, cy: y - r},
    {cx: x - r, cy: y + r},
    {cx: x + r, cy: y + r}
  ];
  var lvl = levels[currentLevel];
  for (var i = 0; i < 4; i++) {
    var tx = Math.floor(corners[i].cx / TILE);
    var ty = Math.floor(corners[i].cy / TILE);
    if (tx < 0 || tx > 10 || ty < 0 || ty > 10) return true;
    if (lvl[ty] && lvl[ty][tx] === '#') return true;
  }
  return false;
}

function updatePhysics() {
  var acc = Bangle.getAccel();
  
  // Bangle.js 2 accelerometer mapping
  // Accelerometer values are usually between -1 and +1
  // We multiply to get a responsive acceleration
  ball.vx -= acc.x * 2.5;
  ball.vy -= acc.y * 2.5;
  
  // Apply friction
  ball.vx *= 0.85;
  ball.vy *= 0.85;
  
  // Move X
  ball.x += ball.vx;
  if (checkCollision(ball.x, ball.y)) {
    ball.x -= ball.vx;
    ball.vx *= -0.5; // Bounce
  }
  
  // Move Y
  ball.y += ball.vy;
  if (checkCollision(ball.x, ball.y)) {
    ball.y -= ball.vy;
    ball.vy *= -0.5; // Bounce
  }
  
  // Check goal
  var tx = Math.floor(ball.x / TILE);
  var ty = Math.floor(ball.y / TILE);
  var lvl = levels[currentLevel];
  if (lvl[ty] && lvl[ty][tx] === 'E') {
    // Reached end, go to next level
    loadLevel(currentLevel + 1);
    return;
  }
  
  draw();
}

function draw() {
  if (currentLevel >= levels.length) return;
  
  // Double buffer by drawing to screen directly but only changing what moved
  // Actually, full clear is okay for 11x11 rects, but `g.clear()` can flicker.
  // Instead of g.clear(), let's use a background and just redraw over.
  // But drawing 121 rects per frame at 20fps might be slightly slow on Espruino.
  // A better approach is to only clear the old ball position, but we don't have it saved.
  // Let's try drawing the whole maze once, and then just clearing/redrawing the ball!
  
  // Wait, if we draw the maze once, we just clear the ball's bounding box and redraw it, 
  // along with any intersecting walls.
  // Since we want simple code, we'll draw the full maze every frame for now, 
  // but using `g.reset().clearRect(Bangle.appRect)` might flicker.
  // Let's use an offscreen graphics buffer if we need to, but there is no memory.
  // Actually, standard is to just draw directly.
  
  g.reset().clearRect(Bangle.appRect);
  
  var lvl = levels[currentLevel];
  for (var y = 0; y < 11; y++) {
    for (var x = 0; x < 11; x++) {
      var cell = lvl[y][x];
      if (cell === '#') {
        g.setColor(g.theme.fg);
        g.fillRect(x * TILE, y * TILE, x * TILE + TILE - 1, y * TILE + TILE - 1);
      } else if (cell === 'E') {
        g.setColor("#0f0"); // Green for goal
        g.fillRect(x * TILE, y * TILE, x * TILE + TILE - 1, y * TILE + TILE - 1);
      }
    }
  }
  
  // Draw ball
  g.setColor("#f00"); // Red ball
  g.fillCircle(ball.x, ball.y, ball.r);
  
  // Screen is updated
}

Bangle.setUI({
  mode: "custom",
  back: function() {
    if (interval) clearInterval(interval);
    Bangle.removeAllListeners();
    load();
  }
});

loadLevel(0);
// Initial draw will happen in physics loop
interval = setInterval(updatePhysics, 50); // 20 fps
