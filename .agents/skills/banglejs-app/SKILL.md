---
name: banglejs-app
description: Guidelines for creating a standard Bangle.js application.
---

# Creating a Bangle.js App

When creating a new Bangle.js application, follow these structural guidelines.

## Directory Structure
Create a new folder in `apps/<your_app_name>` containing the following required files:
- `app.js`: The main application logic.
- `metadata.json`: The configuration file describing the app.
- `app.png` or `app-icon.js`: The application icon (usually 48x48 pixels).
- `README.md`: Documentation for your app.

## metadata.json
Your `metadata.json` must look similar to this:
```json
{
  "id": "<your_app_id>",
  "name": "Human Readable Name",
  "shortName": "Short Name",
  "version": "0.01",
  "author": "Your Name",
  "description": "A detailed description of the app",
  "icon": "app.png",
  "tags": "",
  "supports" : ["BANGLEJS2"],
  "readme": "README.md",
  "storage": [
    {"name":"<your_app_id>.app.js","url":"app.js"},
    {"name":"<your_app_id>.img","url":"app-icon.js","evaluate":true}
  ]
}
```

## app.js
The main file should handle UI initialization and rendering.

```javascript
// Clear the screen
g.clear();

// Example draw function
function draw() {
  g.reset().clearRect(Bangle.appRect);
  g.setFont("Vector", 20).setFontAlign(0,0).drawString("Hello World", g.getWidth()/2, g.getHeight()/2);
}

// Set up UI interactions
Bangle.setUI({mode: "updown"}, function(dir) {
  if (dir < 0) {
    // Up pressed
  } else if (dir > 0) {
    // Down pressed
  } else {
    // Button pressed
  }
});

// Initial draw
draw();

// Load and draw widgets (standard practice for apps)
Bangle.loadWidgets();
Bangle.drawWidgets();
```
