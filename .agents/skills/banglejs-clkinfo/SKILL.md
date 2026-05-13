---
name: banglejs-clkinfo
description: Guidelines for creating a Bangle.js Clock Info extension.
---

# Creating a Bangle.js Clock Info Extension

Clock Info extensions allow apps (typically clock faces) to display customizable cyclic information widgets (like step counts, battery, or weather) on the screen.

## Directory Structure
Create a new folder in `apps/<your_clkinfo_name>` containing:
- `clkinfo.js`: The extension logic.
- `metadata.json`: The configuration file.
- `README.md`: Documentation.

## metadata.json
Your `metadata.json` must define `"type": "clkinfo"`, and specify `.clkinfo.js` in storage:
```json
{
  "id": "<your_clkinfo_id>",
  "name": "Clock Info Name",
  "shortName": "Short Name",
  "version": "0.01",
  "author": "Your Name",
  "description": "Clock info description",
  "icon": "icon.png",
  "type": "clkinfo",
  "tags": "clkinfo",
  "supports" : ["BANGLEJS2"],
  "readme": "README.md",
  "storage": [
    {"name":"<your_clkinfo_id>.clkinfo.js","url":"clkinfo.js"}
  ]
}
```

## clkinfo.js
The file must return a function returning the extension object. Do not include a trailing semicolon!

```javascript
(function() {
  return {
    name: "Category Name",
    // img: 24x24px image for this list of items (optional)
    items: [
      {
        name : "Item1",
        get : function() { 
          return { 
            text : "TextToDisplay",
            // v : 10, min : 0, max : 100, - optional bar graph
            // img : atob("...") - optional 24x24 image string
          };
        },
        show : function() {
          // Called when this item becomes visible
        },
        hide : function() {
          // Called when this item is hidden
        },
        // run : function() {} // Optional - called when tapped
      }
    ]
  };
}) // must not have a semi-colon!
```
