let cat = {
  x: 88,
  y: 100,
  old_x: 88,
  old_y: 100,
  dir: 'right',
  state: 'idle',
  stateTimer: 0
};

function drawCat() {
  // Clear previous position
  g.clearRect(cat.old_x - 15, cat.old_y - 30, cat.old_x + 45, cat.old_y + 25);
  
  const x = cat.x;
  const y = cat.y;
  const dir = cat.dir;
  const state = cat.state;
  
  cat.old_x = x;
  cat.old_y = y;
  
  g.setColor(0, 0, 0); // black
  
  if (dir === 'right') {
     // body
     g.fillPoly([x,y, x+30,y, x+30,y+20, x,y+20]);
     // head
     g.fillPoly([x+20,y-10, x+40,y-10, x+40,y+10, x+20,y+10]);
     // ears
     g.fillPoly([x+20,y-10, x+25,y-20, x+30,y-10]);
     g.fillPoly([x+30,y-10, x+35,y-20, x+40,y-10]);
     // tail
     if (state === 'walk' && Math.floor(getTime()*2)%2===0) {
        g.drawLine(x, y+5, x-10, y-5);
     } else {
        g.drawLine(x, y+5, x-10, y+15);
     }
     // eyes
     g.setColor(1, 1, 0); // yellow
     g.fillRect(x+28, y-5, x+30, y-3);
     g.fillRect(x+35, y-5, x+37, y-3);
     
  } else {
     // left
     // body
     g.fillPoly([x,y, x+30,y, x+30,y+20, x,y+20]);
     // head
     g.fillPoly([x-10,y-10, x+10,y-10, x+10,y+10, x-10,y+10]);
     // ears
     g.fillPoly([x-10,y-10, x-5,y-20, x,y-10]);
     g.fillPoly([x,y-10, x+5,y-20, x+10,y-10]);
     // tail
     if (state === 'walk' && Math.floor(getTime()*2)%2===0) {
        g.drawLine(x+30, y+5, x+40, y-5);
     } else {
        g.drawLine(x+30, y+5, x+40, y+15);
     }
     // eyes
     g.setColor(1, 1, 0); // yellow
     g.fillRect(x-7, y-5, x-5, y-3);
     g.fillRect(x, y-5, x+2, y-3);
  }
  
  // draw interaction heart
  if (state === 'interact') {
     g.setColor(1, 0, 0); // red
     let hx = dir === 'right' ? x + 30 : x;
     let hy = y - 15;
     g.fillPoly([hx,hy, hx-4,hy-4, hx-4,hy-8, hx-2,hy-10, hx,hy-8, hx+2,hy-10, hx+4,hy-8, hx+4,hy-4]);
  }
}

function updateCat() {
  cat.stateTimer--;
  
  if (cat.state === 'interact') {
    if (cat.stateTimer <= 0) {
      cat.state = 'idle';
      cat.stateTimer = 20;
    }
  } else {
    if (cat.stateTimer <= 0) {
      if (Math.random() > 0.5) {
        cat.state = 'walk';
        cat.dir = Math.random() > 0.5 ? 'left' : 'right';
        cat.stateTimer = 20 + Math.floor(Math.random() * 30);
      } else {
        cat.state = 'idle';
        cat.stateTimer = 20 + Math.floor(Math.random() * 30);
      }
    }
    
    if (cat.state === 'walk') {
      if (cat.dir === 'right') {
        cat.x += 2;
        if (cat.x > g.getWidth() - 40) {
          cat.dir = 'left';
        }
      } else {
        cat.x -= 2;
        if (cat.x < 15) {
          cat.dir = 'right';
        }
      }
    }
  }
  
  drawCat();
}

g.clear();
Bangle.loadWidgets();
Bangle.drawWidgets();

Bangle.on('touch', function(button, xy) {
  cat.state = 'interact';
  cat.stateTimer = 20; 
  drawCat();
});

setInterval(updateCat, 100);
