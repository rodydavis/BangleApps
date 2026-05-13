---
name: banglejs-clock
description: Guidelines for creating a Bangle.js clock face.
---

# Creating a Bangle.js Clock Face

When creating a clock face for Bangle.js, follow these structural guidelines.

## Directory Structure
Create a new folder in `apps/<your_clock_name>` containing the following required files:
- `app.js`: The clock face logic.
- `metadata.json`: The configuration file.
- `icon.png`: The application icon.
- `README.md`: Documentation for your clock face.

## metadata.json
Your `metadata.json` must define `"type": "clock"`:
```json
{
  "id": "<your_clock_id>",
  "name": "Clock Name",
  "shortName": "Short Name",
  "version": "0.01",
  "author": "Your Name",
  "description": "Clock description",
  "icon": "icon.png",
  "type": "clock",
  "tags": "clock",
  "supports" : ["BANGLEJS2"],
  "readme": "README.md",
  "storage": [
    {"name":"<your_clock_id>.app.js","url":"app.js"}
  ]
}
```

## app.js
Clocks usually execute in an isolated block or using efficient scheduling to save battery.

```javascript
{
  let drawTimeout;

  // schedule a draw for the next minute
  let queueDraw = function() {
    if (drawTimeout) clearTimeout(drawTimeout);
    drawTimeout = setTimeout(function() {
      drawTimeout = undefined;
      draw();
    }, 60000 - (Date.now() % 60000));
  };

  let draw = function() {
    queueDraw();
    g.reset();
    var x = g.getWidth()/2;
    var y = g.getHeight()/2;
    
    var date = new Date();
    var timeStr = require("locale").time(date,1);
    
    g.setFontAlign(0,0).setFont("Vector",48);
    g.clearRect(0, y-20, g.getWidth(), y+25);
    g.drawString(timeStr, x, y);
  };

  g.clear();
  draw();

  // Show launcher when button pressed and handle memory management
  Bangle.setUI({mode:"clock", remove:function() {
    if (drawTimeout) clearTimeout(drawTimeout);
    drawTimeout = undefined;
  }});
  
  Bangle.loadWidgets();
  Bangle.drawWidgets();
}
```
