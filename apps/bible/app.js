var Storage = require("Storage");
var index = Storage.readJSON("bible.idx.json");
var dictionary = Storage.readJSON("bible.dict.json");

var state = {
  book: 0,
  chapter: 0,
  scroll: 0
};

function decode(text) {
  var res = "";
  for (var i=0; i<text.length; i++) {
    var c = text.charCodeAt(i);
    if (c>=128) res += dictionary[c-128];
    else res += text[i];
  }
  return res;
}

function showReader(bookIdx, chapterIdx, verseIdx) {
  state.book = bookIdx;
  state.chapter = chapterIdx;
  state.scroll = 0;
  
  var book = index[bookIdx];
  var ch = book.chapters[chapterIdx];
  var rawText = Storage.read(book.file, ch.off, ch.len);
  var text = decode(rawText);
  var lines = g.wrapString(text, g.getWidth() - 10);
  
  if (verseIdx > 0) {
    var search = (chapterIdx + 1) + ":" + (verseIdx + 1);
    for (var i=0; i<lines.length; i++) {
      if (lines[i].startsWith(search)) {
        state.scroll = i * 20;
        break;
      }
    }
  }

  function draw() {
    g.clear(1);
    g.setFont("Vector", 16);
    g.setColor(g.theme.fg);
    var y = 24 - state.scroll;
    for (var i=0; i<lines.length; i++) {
      if (y > -20 && y < g.getHeight()) {
        g.drawString(lines[i], 5, y);
      }
      y += 20;
    }
    // Header
    g.setColor(g.theme.bg);
    g.fillRect(0,0,g.getWidth(), 22);
    g.setColor(g.theme.fg);
    g.setFont("6x8", 1);
    g.drawString(book.name + " " + (chapterIdx+1), 5, 5);
    g.flip();
  }

  Bangle.on("drag", e => {
    state.scroll -= e.dy;
    if (state.scroll < 0) state.scroll = 0;
    var maxScroll = lines.length * 20 - g.getHeight() + 40;
    if (state.scroll > maxScroll) state.scroll = maxScroll;
    draw();
  });

  Bangle.setUI({
    mode: "updown",
    back: () => {
      Bangle.removeAllListeners();
      showChapterPicker(bookIdx);
    }
  });
  
  Bangle.on("swipe", dir => {
    if (dir < 0) { // Next Chapter
      if (chapterIdx < book.chapters.length - 1) {
        Bangle.removeAllListeners();
        showReader(bookIdx, chapterIdx + 1, 0);
      } else if (bookIdx < index.length - 1) {
        Bangle.removeAllListeners();
        showReader(bookIdx + 1, 0, 0);
      }
    } else if (dir > 0) { // Prev Chapter
      if (chapterIdx > 0) {
        Bangle.removeAllListeners();
        showReader(bookIdx, chapterIdx - 1, 0);
      } else if (bookIdx > 0) {
        Bangle.removeAllListeners();
        var prevBook = index[bookIdx - 1];
        showReader(bookIdx - 1, prevBook.chapters.length - 1, 0);
      }
    }
  });
  
  draw();
}

function showVersePicker(bookIdx, chapterIdx) {
  var book = index[bookIdx];
  var ch = book.chapters[chapterIdx];
  var menu = {
    "": { title: "Verse" },
    "< Back": () => showChapterPicker(bookIdx)
  };
  for (var i=0; i<ch.verses; i++) {
    (function(v) {
      menu["Verse " + (v+1)] = () => showReader(bookIdx, chapterIdx, v);
    })(i);
  }
  E.showMenu(menu);
}

function showChapterPicker(bookIdx) {
  var book = index[bookIdx];
  var menu = {
    "": { title: book.name },
    "< Back": () => showBookPicker()
  };
  for (var i=0; i<book.chapters.length; i++) {
    (function(ch) {
      menu["Chapter " + (ch+1)] = () => showVersePicker(bookIdx, ch);
    })(i);
  }
  E.showMenu(menu);
}

function showBookPicker() {
  var menu = { "": { title: "Bible" } };
  index.forEach((book, i) => {
    (function(idx) {
      menu[book.name] = () => showChapterPicker(idx);
    })(i);
  });
  E.showMenu(menu);
}

showBookPicker();
