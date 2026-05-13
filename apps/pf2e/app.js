var Storage = require("Storage");

// Load the character data
var charData = Storage.readJSON("pf2e.data.json", true);
if (!charData || !charData.build) {
  E.showAlert("No Data found!").then(() => load());
}
var b = charData.build;

// Helper to calculate ability modifiers
function getMod(score) {
  return Math.floor((score - 10) / 2);
}

// Helper to format modifiers (e.g. +4 or -1)
function fmt(val) {
  return (val >= 0 ? "+" : "") + val;
}

// Helper for proficiency bonus
function getProf(val) {
  return val > 0 ? (b.level + val) : 0;
}

// Get item bonus for saves
function getItemBonus(saveName) {
  if (b.mods && b.mods[saveName] && b.mods[saveName]["Item Bonus"]) {
    return b.mods[saveName]["Item Bonus"];
  }
  return 0;
}

// Skill to Ability map
var skillsMap = {
  acrobatics: "dex", arcana: "int", athletics: "str", crafting: "int",
  deception: "cha", diplomacy: "cha", intimidation: "cha", medicine: "wis",
  nature: "wis", occultism: "int", performance: "cha", religion: "wis",
  society: "int", stealth: "dex", survival: "wis", thievery: "dex"
};

function showMainMenu() {
  var menu = {
    "": { title: b.name, back: () => load() },
    "Overview": () => showOverview(),
    "Abilities": () => showAbilities(),
    "Defenses": () => showDefenses(),
    "Skills": () => showSkills(),
    "Weapons": () => showWeapons(),
    "Equipment": () => showEquipment()
  };
  E.showMenu(menu);
}

function showOverview() {
  // HP = Ancestry + (Class + Con) * Level
  var maxHp = b.attributes.ancestryhp + (b.attributes.classhp + getMod(b.abilities.con)) * b.level;
  
  var menu = {
    "": { title: "Overview", back: () => showMainMenu() },
    "Class": { value: b.class },
    "Level": { value: b.level },
    "HP (Max)": { value: maxHp },
    "AC": { value: b.acTotal ? b.acTotal.acTotal : "Unknown" },
    "Speed": { value: b.attributes.speed }
  };
  E.showMenu(menu);
}

function showAbilities() {
  var menu = {
    "": { title: "Abilities", back: () => showMainMenu() },
    "STR": { value: b.abilities.str + " (" + fmt(getMod(b.abilities.str)) + ")" },
    "DEX": { value: b.abilities.dex + " (" + fmt(getMod(b.abilities.dex)) + ")" },
    "CON": { value: b.abilities.con + " (" + fmt(getMod(b.abilities.con)) + ")" },
    "INT": { value: b.abilities.int + " (" + fmt(getMod(b.abilities.int)) + ")" },
    "WIS": { value: b.abilities.wis + " (" + fmt(getMod(b.abilities.wis)) + ")" },
    "CHA": { value: b.abilities.cha + " (" + fmt(getMod(b.abilities.cha)) + ")" }
  };
  E.showMenu(menu);
}

function showDefenses() {
  var fort = getMod(b.abilities.con) + getProf(b.proficiencies.fortitude) + getItemBonus("Fortitude");
  var ref = getMod(b.abilities.dex) + getProf(b.proficiencies.reflex) + getItemBonus("Reflex");
  var will = getMod(b.abilities.wis) + getProf(b.proficiencies.will) + getItemBonus("Will");
  var perc = getMod(b.abilities.wis) + getProf(b.proficiencies.perception);
  
  var menu = {
    "": { title: "Defenses", back: () => showMainMenu() },
    "AC": { value: b.acTotal ? b.acTotal.acTotal : "?" },
    "Fortitude": { value: fmt(fort) },
    "Reflex": { value: fmt(ref) },
    "Will": { value: fmt(will) },
    "Perception": { value: fmt(perc) }
  };
  E.showMenu(menu);
}

function showSkills() {
  var menu = {
    "": { title: "Skills", back: () => showMainMenu() }
  };
  for (var skill in skillsMap) {
    var total = getMod(b.abilities[skillsMap[skill]]) + getProf(b.proficiencies[skill]);
    var name = skill.charAt(0).toUpperCase() + skill.slice(1);
    menu[name] = { value: fmt(total) };
  }
  E.showMenu(menu);
}

function showWeapons() {
  var menu = {
    "": { title: "Weapons", back: () => showMainMenu() }
  };
  if (b.weapons && b.weapons.length > 0) {
    b.weapons.forEach((w) => {
      // Just show the attack bonus and damage dice
      var atk = fmt(w.attack);
      var dmg = w.die + (w.damageBonus ? fmt(w.damageBonus) : "");
      menu[w.display] = () => E.showAlert(atk + "\n" + dmg + " " + w.damageType).then(() => showWeapons());
    });
  } else {
    menu["No weapons"] = () => {};
  }
  E.showMenu(menu);
}

function showEquipment() {
  var menu = {
    "": { title: "Equipment", back: () => showMainMenu() }
  };
  if (b.equipment && b.equipment.length > 0) {
    b.equipment.forEach((item) => {
      // item is array like ["Backpack", 1, "Invested"]
      var name = item[0];
      var qty = item[1];
      menu[name] = { value: "x" + qty };
    });
  } else {
    menu["No equipment"] = () => {};
  }
  E.showMenu(menu);
}

// Start app
g.clear();
showMainMenu();
