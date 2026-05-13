---
name: banglejs-widget
description: Guidelines for creating a Bangle.js widget.
---

# Creating a Bangle.js Widget

Widgets run in the background alongside standard applications and usually occupy the top or bottom of the screen.

## Directory Structure
Create a new folder in `apps/<your_widget_name>` containing:
- `widget.js`: The widget logic.
- `metadata.json`: The configuration file.
- `icon.png`: An optional icon.
- `README.md`: Documentation.

## metadata.json
Your `metadata.json` must define `"type": "widget"`, and specify `.wid.js` in storage:
```json
{
  "id": "<your_widget_id>",
  "name": "Widget Name",
  "shortName": "Short Name",
  "version": "0.01",
  "author": "Your Name",
  "description": "Widget description",
  "icon": "icon.png",
  "type": "widget",
  "tags": "widget",
  "supports" : ["BANGLEJS2"],
  "readme": "README.md",
  "storage": [
    {"name":"<your_widget_id>.wid.js","url":"widget.js"}
  ]
}
```

## widget.js
Widgets must execute within an IIFE (Immediately Invoked Function Expression) to avoid leaking global variables.

```javascript
/* run widgets in their own function scope if they need to define local
variables so they don't interfere with currently-running apps */
(() => {
  // add your widget
  WIDGETS["<your_widget_id>"] = {
    area: "tl", // tl (top left), tr (top right), bl (bottom left), br (bottom right)
    width: 28, // width in pixels. Call Bangle.drawWidgets() to re-layout if this changes
    draw: function() {
      g.reset(); // reset the graphics context to defaults (color/font/etc)
      // add your code
      g.drawString("X", this.x, this.y);
    } // called to draw the widget
  };
})();
```
