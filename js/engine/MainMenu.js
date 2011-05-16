/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Old School RPG Map.
 *
 * The Initial Developer of the Original Code is Jono Xia.
 * Portions created by the Initial Developer are Copyright (C) 2007
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Jono Xia <jono@mozilla.com>
 *   Gaurav Munjal <Gaurav0@aol.com>
 *   Jebb Burditt <jebb.burditt@gmail.com>
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

var MAIN_MENU = 0;
var ITEM_MENU = 1;
var SPELL_MENU = 2;
var EQUIP_MENU = 3;
var STATUS_MENU = 4;
var SAVE_MENU = 5;
var LOAD_MENU = 6;
var NOT_IMPLEMENTED_MENU = 7;
var EQUIP_SUBMENU = 8;
var TITLESCREEN_MENU = 9;

var MAIN_MENU_ITEM = 0;
var MAIN_MENU_SPELL = 1;
var MAIN_MENU_EQUIP = 2;
var MAIN_MENU_STATUS = 3;
var MAIN_MENU_SAVE = 4;
var MAIN_MENU_LOAD = 5;

var NUM_MAIN_MENU_ACTIONS = 6;
var NUM_SAVE_SLOTS = 4;

var EQUIP_WEAPON = 0;
var EQUIP_ARMOR = 1;
var EQUIP_HELMET = 2;
var EQUIP_SHIELD = 3;

var TITLESCREEN_MENU_NEW_GAME = 0;
var TITLESCREEN_MENU_LOAD_GAME = 1;

/* Class for main menu */
var MainMenu = Class.extend({
    _init: function() {
        this._menuDisplayed = false;
        this._currentMenu = MAIN_MENU;
        this._currentAction = MAIN_MENU_ITEM;
        this._arrow = false;
        this._lineHeight = [ 20, 48, 76, 104, 132, 160 ];
        this._itemId = [];
        this._numItems = 0;
        this._canUseItem = [];
        this._itemSelection = 0;
        this._spellId = [];
        this._numSpells = 0;
        this._canUseSpell = [];
        this._spellSelection = 0;
        this._equipSelection = 0;
        this._equipOptionSelection = 0;
        this._numEquipOptions = 0;
        this._equipHeight = [ 20, 60, 100, 140 ];
        this._equipSubHeight = [ 220, 240, 260, 280, 300 ];
        this._equipOptionId = [];
        this._saveHeight = [ 20, 60, 100, 140 ];
        this._saveSelection = 0;
        this._onNewGame = null;
    },
    
    menuDisplayed: function() {
        return this._menuDisplayed;
    },
    
    // set function to call when new game is started.
    setOnNewGame: function(callback) {
        this._onNewGame = callback;
    },
    
    // displays Main Menu
    displayMenu: function() {
        drawBox(menuCtx, 0, 0, 150, 200, 25, 4);
        
        // Draw Text
        textCtx.font = "bold 20px monospace";
        textCtx.fillStyle = "white";
        textCtx.textBaseline = "top";
        textCtx.fillText("Item", 42, this._lineHeight[0]);
        textCtx.fillText("Spell", 42, this._lineHeight[1]);
        textCtx.fillText("Equip", 42, this._lineHeight[2]);
        textCtx.fillText("Status", 42, this._lineHeight[3]);
        textCtx.fillText("Save", 42, this._lineHeight[4]);
        textCtx.fillText("Load", 42, this._lineHeight[5]);
        
        this.drawArrow();
        
        this._currentMenu = MAIN_MENU;
        this._menuDisplayed = true;
    },
    
    clearMenu: function() {
        menuCtx.clearRect(0, 0, menuCanvas.width, menuCanvas.height);
        textCtx.clearRect(0, 0, textCanvas.width, textCanvas.height);
        
        this._menuDisplayed = false;
    },
    
    displayTitleScreenMenu: function() {
        drawBox(menuCtx, 0, 0, 150, 90, 25, 4);
        
        // Draw Text
        textCtx.font = "bold 18px monospace";
        textCtx.fillStyle = "white";
        textCtx.textBaseline = "top";
        textCtx.fillText("New Game", 34, this._lineHeight[0]);
        textCtx.fillText("Load Game", 34, this._lineHeight[1]);
        
        this._currentMenu = TITLESCREEN_MENU;
        this._currentAction = TITLESCREEN_MENU_NEW_GAME;
        this.drawTitleScreenAction();        
        this._menuDisplayed = true;
    },
    
    displayNotImplementedMenu: function() {
        drawBox(menuCtx, 150, 220, 260, 50, 10, 2);
        
        // Draw Text
        textCtx.font = "bold 20px monospace";
        textCtx.fillStyle = "white";
        textCtx.textBaseline = "top";
        textCtx.fillText("Not yet implemented.", 163, 235);
        
        this._currentMenu = NOT_IMPLEMENTED_MENU;
    },
    
    clearNotImplementedMenu: function() {
        menuCtx.clearRect(150, 220, 260, 50);
        textCtx.clearRect(150, 220, 260, 50);
        
        this._currentMenu = MAIN_MENU;
    },
    
    displayItemMenu: function() {
        drawBox(menuCtx, 150, 0, 250, 200, 25, 4);
        
        // Text properties
        textCtx.font = "bold 20px monospace";
        textCtx.textBaseline = "top";
        
        // Display items in inventory
        this._itemId = [];
        this._canUseItem = [];
        var numItems = 0;
        var menu = this;
        g_player.forEachItemInInventory(function(itemId, amt) {
            if (amt > 0) {
                var itemName = g_itemData.items[itemId].name;
                var itemType = g_itemData.items[itemId].type;
                var amt2 = (amt < 10) ? " " + amt : amt;
                if (numItems <= 6)
                    if (itemType == ITEMTYPE_HEAL_ONE) {
                        textCtx.fillStyle = "white";
                        menu._canUseItem[numItems] = true;
                    } else {
                        textCtx.fillStyle = "gray";
                        menu._canUseItem[numItems] = false;
                    }
                    textCtx.fillText(itemName + ":" + amt2, 186, menu._lineHeight[numItems]);
                menu._itemId[numItems] = itemId;
                numItems++;
            }
        });
        
        this._numItems = numItems;
        this._currentMenu = ITEM_MENU;
        if (numItems > 0) {
            this._itemSelection = 0;
            this.drawItemSelection();
        }
    },
    
    clearSubMenu: function() {
        menuCtx.clearRect(150, 0, 250, 200);
        textCtx.clearRect(150, 0, 250, 200);
        
        if (g_titlescreen)
            this._currentMenu = TITLESCREEN_MENU;
        else
            this._currentMenu = MAIN_MENU;
    },
    
    displaySpellMenu: function() {
        drawBox(menuCtx, 150, 0, 250, 200, 25, 4);
        
        // Text properties
        textCtx.font = "bold 20px monospace";
        textCtx.textBaseline = "top";
        
        // Display items in inventory
        this._spellId = [];
        this._canUseSpell = [];
        var numSpells = 0;
        var menu = this;
        g_player.forEachSpell(function(spellId) {
            var spellName = g_spellData.spells[spellId].name;
            var spellType = g_spellData.spells[spellId].type;
            if (numSpells <= 6)
                if (spellType == SPELLTYPE_HEAL_ONE) {
                    textCtx.fillStyle = "white";
                    menu._canUseSpell[numSpells] = true;
                } else {
                    textCtx.fillStyle = "gray";
                    menu._canUseSpell[numSpells] = false;
                }
                textCtx.fillText(spellName, 186, menu._lineHeight[numSpells]);
            menu._spellId[numSpells] = spellId;
            numSpells++;
        });
        
        this._numSpells = numSpells;
        this._currentMenu = SPELL_MENU;
        if (numSpells > 0) {
            this._spellSelection = 0;
            this.drawSpellSelection();
        }
    },
    
    displayEquipMenu: function() {
        drawBox(menuCtx, 150, 0, 250, 200, 25, 4);
        
        // Text properties
        textCtx.font = "bold 16px monospace";
        textCtx.fillStyle = "white";
        textCtx.textBaseline = "top";
        
        // Equipment of g_player
        textCtx.fillText("Weapon:", 195, 20);
        textCtx.fillText(g_itemData.items[g_player.getWeapon()].name, 210, 40);
        textCtx.fillText("Armor:", 195, 60);
        textCtx.fillText(g_itemData.items[g_player.getArmor()].name, 210, 80);
        textCtx.fillText("Helmet:", 195, 100);
        textCtx.fillText(g_itemData.items[g_player.getHelmet()].name, 210, 120);
        textCtx.fillText("Shield:", 195, 140);
        textCtx.fillText(g_itemData.items[g_player.getShield()].name, 210, 160);
        
        this.drawEquipSelection();
        this._currentMenu = EQUIP_MENU;
    },
    
    displayEquipSubMenu: function() {
        // Get properties
        var itemType = -1;
        switch(this._equipSelection) {
            case EQUIP_WEAPON:
                itemType = ITEMTYPE_WEAPON;
                break;
            case EQUIP_ARMOR:
                itemType = ITEMTYPE_ARMOR;
                break;
            case EQUIP_HELMET:
                itemType = ITEMTYPE_HELMET;
                break;
            case EQUIP_SHIELD:
                itemType = ITEMTYPE_SHIELD;
                break;
        }
        if (itemType == -1)
            return;
        
        drawBox(menuCtx, 150, 200, 250, 150, 25, 4);
        
        // Text properties
        textCtx.font = "bold 16px monospace";
        textCtx.fillStyle = "white";
        textCtx.textBaseline = "top";
        
        this._equipOptionId = [];
        var menu = this;
        var numEquipOptions = 0;
        g_player.forEachItemInInventory(function(itemId, amt) {
            if (amt > 0) {
                var item = g_itemData.items[itemId];
                if (item.type == itemType && numEquipOptions < 5) {
                    textCtx.fillText(item.name, 195, menu._equipSubHeight[numEquipOptions]);
                    menu._equipOptionId[numEquipOptions] = itemId;
                    ++numEquipOptions;
                }
            }
        });
        
        this._numEquipOptions = numEquipOptions;
        this._equipOptionSelection = 0;
        this._currentMenu = EQUIP_SUBMENU;
        if (numEquipOptions > 0)
            this.drawEquipOptionSelection();
    },
    
    clearEquipSubMenu: function() {
        menuCtx.clearRect(150, 200, 250, 150);
        textCtx.clearRect(150, 200, 250, 150);
        
        this._currentMenu = EQUIP_MENU;
    },
    
    displayStatusMenu: function() {
        drawBox(menuCtx, 150, 0, 250, 200, 25, 4);
        
        // Text properties
        textCtx.font = "bold 14px monospace";
        textCtx.fillStyle = "white";
        textCtx.textBaseline = "top";
        
        // Properties of g_player
        textCtx.fillText("HP:      " + g_player.getHP() + "/" + g_player.getMaxHP(), 180, 18);
        textCtx.fillText("MP:      " + g_player.getMP() + "/" + g_player.getMaxMP(), 180, 36);
        textCtx.fillText("Attack:  " + g_player.getAttack(), 180, 54);
        textCtx.fillText("Defense: " + g_player.getDefense(), 180, 72);
        textCtx.fillText("Level:   " + g_player.getLevel(), 180, 90);
        textCtx.fillText("Exp:     " + g_player.getExp() + "/" + g_player.getNextExp(), 180, 108);
        textCtx.fillText("Gold:    " + g_player.getGold(), 180, 126);
        
        this._currentMenu = STATUS_MENU;
    },
    
    displaySaveMenu: function() {
        drawBox(menuCtx, 150, 0, 250, 200, 25, 4);
        textCtx.textBaseline = "top";
        
        // Show Save Slot data
        for (var i = 1; i <= NUM_SAVE_SLOTS; ++i) {
            textCtx.font = "bold 16px monospace";
            textCtx.fillStyle = "white";
            textCtx.fillText("Save Slot " + i + ":", 195, 40 * i - 20);
            if (g_game.hasSaveInfo(i)) {
                textCtx.font = "bold 14px monospace";
                textCtx.fillText(g_game.getSaveInfo(i), 210, 40 * i);
            } else {
                textCtx.font = "italic 14px serif";
                textCtx.fillText("Empty", 210, 40 * i);
            }
        }
        
        this.drawSaveSelection();
        this._currentMenu = SAVE_MENU;
    },
    
    displayLoadMenu: function() {
        drawBox(menuCtx, 150, 0, 250, 200, 25, 4);
        textCtx.textBaseline = "top";
        
        // Show Save Slot data
        for (var i = 1; i <= NUM_SAVE_SLOTS; ++i) {
            if (g_game.hasSaveInfo(i)) {
                textCtx.font = "bold 16px monospace";
                textCtx.fillStyle = "white";
                textCtx.fillText("Save Slot " + i + ":", 195, 40 * i - 20);
                textCtx.font = "bold 14px monospace";
                textCtx.fillText(g_game.getSaveInfo(i), 210, 40 * i);
            } else {
                textCtx.font = "bold 16px monospace";
                textCtx.fillStyle = "gray";
                textCtx.fillText("Save Slot " + i + ":", 195, 40 * i - 20);
                textCtx.font = "italic 14px serif";
                textCtx.fillText("Empty", 210, 40 * i);
            }
        }
        
        this.drawSaveSelection();
        this._currentMenu = LOAD_MENU;
    },
    
    /* Draws an arrow next to the current menu item in main menu */
    drawArrow: function() {
        var arrowChar = "\u25ba";
        textCtx.font = "bold 20px monospace";
        textCtx.fillStyle = "white";
        textCtx.textBaseline = "top";
        var drawHeight = this._lineHeight[this._currentAction % NUM_MAIN_MENU_ACTIONS];        
        textCtx.fillText(arrowChar, 26, drawHeight);
        this._arrow = true;
    },
    
    /* Erases the arrow next to the current menu item in main menu */
    clearArrow: function() {
        var drawHeight = this._lineHeight[this._currentAction % NUM_MAIN_MENU_ACTIONS];
        textCtx.clearRect(25, drawHeight, 16, 20);
        this._arrow = false;
    },
    
    /* Draws an arrow next to the current titlescreen action */
    drawTitleScreenAction: function() {
        var arrowChar = "\u25ba";
        textCtx.font = "bold 18px monospace";
        textCtx.fillStyle = "white";
        textCtx.textBaseline = "top";
        var drawHeight = this._lineHeight[this._currentAction];        
        textCtx.fillText(arrowChar, 20, drawHeight);
        this._arrow = true;
    },
    
    /* Erases the arrow next to the current titlescreen action */
    clearTitleScreenAction: function() {
        var drawHeight = this._lineHeight[this._currentAction];
        textCtx.clearRect(19, drawHeight, 15, 19);
        this._arrow = false;
    },
    
    /* Draws an arrow next to currently selected item */
    drawItemSelection: function() {
        
        var arrowChar = "\u25ba";
        textCtx.font = "bold 20px monospace";
        textCtx.fillStyle = "white";
        textCtx.textBaseline = "top";
        textCtx.fillText(arrowChar, 166, this._lineHeight[this._itemSelection]);
    },
    
    /* Erases the arrow next to currently selected item */
    clearItemSelection: function() {
        textCtx.clearRect(165, this._lineHeight[this._itemSelection], 21, 20);
    },
    
    /* Draws an arrow next to currently selected spell */
    drawSpellSelection: function() {
        
        var arrowChar = "\u25ba";
        textCtx.font = "bold 20px monospace";
        textCtx.fillStyle = "white";
        textCtx.textBaseline = "top";
        textCtx.fillText(arrowChar, 166, this._lineHeight[this._spellSelection]);
    },
    
    /* Erases the arrow next to currently selected spell */
    clearSpellSelection: function() {
        textCtx.clearRect(165, this._lineHeight[this._spellSelection], 21, 20);
    },
    
    /* Draws an arrow next to currently selected equipment selection */
    drawEquipSelection: function() {
        
        var arrowChar = "\u25ba";
        textCtx.font = "bold 18px monospace";
        textCtx.fillStyle = "white";
        textCtx.textBaseline = "top";
        textCtx.fillText(arrowChar, 176, this._equipHeight[this._equipSelection]);
    },
    
    /* Erases the arrow next to currently selected equipment selection */
    clearEquipSelection: function() {
        textCtx.clearRect(175, this._equipHeight[this._equipSelection], 19, 18);
    },
    
    /* Draws an arrow next to currently selected equipment selection */
    drawEquipOptionSelection: function() {
        
        var arrowChar = "\u25ba";
        textCtx.font = "bold 16px monospace";
        textCtx.fillStyle = "white";
        textCtx.textBaseline = "top";
        textCtx.fillText(arrowChar, 176, this._equipSubHeight[this._equipOptionSelection]);
    },
    
    /* Erases the arrow next to currently selected equipment selection */
    clearEquipOptionSelection: function() {
        textCtx.clearRect(175, this._equipSubHeight[this._equipOptionSelection], 17, 16);
    },
    
    /* Draws an arrow next to currently selected save slot */
    drawSaveSelection: function() {
        
        var arrowChar = "\u25ba";
        textCtx.font = "bold 18px monospace";
        textCtx.fillStyle = "white";
        textCtx.textBaseline = "top";
        textCtx.fillText(arrowChar, 176, this._saveHeight[this._saveSelection]);
    },
    
    /* Erases the arrow next to currently selected save slot */
    clearSaveSelection: function() {
        textCtx.clearRect(175, this._saveHeight[this._saveSelection], 19, 18);
    },
    
    /* Handles arrow key input for main menu */
    handleInput: function(key) {
        if (this._currentMenu == MAIN_MENU) {
            this.clearArrow();
            switch(key) {
                case DOWN_ARROW:
                case RIGHT_ARROW:
                    this._currentAction++;
                    this._currentAction %= NUM_MAIN_MENU_ACTIONS;
                    break;
                case UP_ARROW:
                case LEFT_ARROW:
                    this._currentAction--;
                    if (this._currentAction < 0)
                        this._currentAction += NUM_MAIN_MENU_ACTIONS;
                    break;
            }
            this.drawArrow();
        } else if (this._currentMenu == TITLESCREEN_MENU) {
            this.clearTitleScreenAction();
            switch(key) {
                case DOWN_ARROW:
                case RIGHT_ARROW:
                    this._currentAction++;
                    this._currentAction %= 2;
                    break;
                case UP_ARROW:
                case LEFT_ARROW:
                    this._currentAction--;
                    if (this._currentAction < 0)
                        this._currentAction += 2;
                    break;
            }
            this.drawTitleScreenAction();
        } else if (this._currentMenu == ITEM_MENU && this._numItems > 0) {
            this.clearItemSelection();
            switch(key) {
                case DOWN_ARROW:
                case RIGHT_ARROW:
                    this._itemSelection++;
                    this._itemSelection %= this._numItems;
                    break;
                case UP_ARROW:
                case LEFT_ARROW:
                    this._itemSelection--;
                    if (this._itemSelection < 0)
                        this._itemSelection += this._numItems;
                    break;
            }
            this.drawItemSelection();
        } else if (this._currentMenu == SPELL_MENU && this._numSpells > 0) {
            this.clearSpellSelection();
            switch(key) {
                case DOWN_ARROW:
                case RIGHT_ARROW:
                    this._spellSelection++;
                    this._spellSelection %= this._numSpells;
                    break;
                case UP_ARROW:
                case LEFT_ARROW:
                    this._spellSelection--;
                    if (this._spellSelection < 0)
                        this._spellSelection += this._numSpells;
                    break;
            }
            this.drawSpellSelection();
        } else if (this._currentMenu == EQUIP_MENU) {
            this.clearEquipSelection();
            switch(key) {
                case DOWN_ARROW:
                case RIGHT_ARROW:
                    this._equipSelection++;
                    this._equipSelection %= 4;
                    break;
                case UP_ARROW:
                case LEFT_ARROW:
                    this._equipSelection--;
                    if (this._equipSelection < 0)
                        this._equipSelection += 4;
                    break;
            }
            this.drawEquipSelection();
        } else if (this._currentMenu == EQUIP_SUBMENU) {
            this.clearEquipOptionSelection();
            switch(key) {
                case DOWN_ARROW:
                case RIGHT_ARROW:
                    this._equipOptionSelection++;
                    this._equipOptionSelection %= this._numEquipOptions;
                    break;
                case UP_ARROW:
                case LEFT_ARROW:
                    this._equipOptionSelection--;
                    if (this._equipOptionSelection < 0)
                        this._equipOptionSelection += this._numEquipOptions;
                    break;
            }
            this.drawEquipOptionSelection();
        } else if (this._currentMenu == SAVE_MENU || this._currentMenu == LOAD_MENU) {
            this.clearSaveSelection();
            switch(key) {
                case DOWN_ARROW:
                case RIGHT_ARROW:
                    this._saveSelection++;
                    this._saveSelection %= NUM_SAVE_SLOTS;
                    break;
                case UP_ARROW:
                case LEFT_ARROW:
                    this._saveSelection--;
                    if (this._saveSelection < 0)
                        this._saveSelection += NUM_SAVE_SLOTS;
                    break;
            }
            this.drawSaveSelection();
        }
    },
    
    handleEnter: function() {
        if (this._currentMenu == MAIN_MENU) {
            this.clearArrow();
            switch (this._currentAction) {
                case MAIN_MENU_ITEM:
                    this.displayItemMenu();
                    break;
                case MAIN_MENU_SPELL:
                    this.displaySpellMenu();
                    break;
                case MAIN_MENU_EQUIP:
                    this.displayEquipMenu();
                    break;
                case MAIN_MENU_STATUS:
                    this.displayStatusMenu();
                    break;
                case MAIN_MENU_SAVE:
                    this.displaySaveMenu();
                    break;
                case MAIN_MENU_LOAD:
                    this.displayLoadMenu();
                    break;
            }
        } else if (this._currentMenu == TITLESCREEN_MENU) {
            this.clearTitleScreenAction();
            switch (this._currentAction) {
                case TITLESCREEN_MENU_NEW_GAME:
                    this.clearMenu();
                    g_game.reset();
                    this._onNewGame();
                    g_titlescreen = false;
                    break;
                case TITLESCREEN_MENU_LOAD_GAME:
                    this.displayLoadMenu();
                    break;
            }
        } else if (this._currentMenu == ITEM_MENU && this._numItems > 0) {
            if (this._canUseItem[this._itemSelection]) {
                this.clearSubMenu();
                this.clearMenu();
                var itemId = this._itemId[this._itemSelection];
                var item = g_itemData.items[itemId];
                item.use(g_player);
                g_player.removeFromInventory(itemId);
            }
        } else if (this._currentMenu == SPELL_MENU && this._numSpells > 0) {
            if (this._canUseSpell[this._spellSelection]) {
                this.clearSubMenu();
                this.clearMenu();
                var spellId = this._spellId[this._spellSelection];
                var spell = g_spellData.spells[spellId];
                if (g_player.getMP() >= spell.mpCost) {
                    spell.use(g_player);
                    g_player.useMP(spell.mpCost);
                } else {
                    g_textDisplay.displayText("You do not have enough mp to use " + spell.name + ".");
                }
            }
        } else if (this._currentMenu == EQUIP_MENU) {
            this.displayEquipSubMenu();
        } else if (this._currentMenu == EQUIP_SUBMENU && this._numEquipOptions > 0) {
            this.clearEquipSubMenu();
            this.changeEquip();
            this.clearSubMenu();
            this.displayEquipMenu();
        } else if (this._currentMenu == SAVE_MENU) {
            this.clearSubMenu();
            this.clearMenu();
            var slot = this._saveSelection + 1;
            g_game.save(slot);
            g_textDisplay.displayText("Game saved to slot " + slot + ".");
        } else if (this._currentMenu == LOAD_MENU) {
            this.clearSubMenu();
            this.clearMenu();
            this.loadGame();
            if (g_titlescreen)
                g_titlescreen = false;
        }
    },
    
    handleEsc: function() {
        switch (this._currentMenu) {
            case MAIN_MENU:
                this.clearMenu();
                break;
            case ITEM_MENU:
            case SPELL_MENU:
            case EQUIP_MENU:
            case STATUS_MENU:
            case SAVE_MENU:
            case LOAD_MENU:
                this.clearSubMenu();
                if (g_titlescreen)
                    this.drawTitleScreenAction();
                else
                    this.drawArrow();
                break;
            case EQUIP_SUBMENU:
                this.clearEquipSubMenu();
                break;
            case NOT_IMPLEMENTED_MENU:
                this.clearNotImplementedMenu();
                this.drawArrow();
        }
    },
    
    changeEquip: function() {
        var currentlyEquippedItemId;
        var toEquipItemId = this._equipOptionId[this._equipOptionSelection];
        switch(this._equipSelection) {
            case EQUIP_WEAPON:
                currentlyEquippedItemId = g_player.getWeapon();
                g_player.equipWeapon(toEquipItemId);
                break;
            case EQUIP_ARMOR:
                currentlyEquippedItemId = g_player.getArmor();
                g_player.equipArmor(toEquipItemId);
                break;
            case EQUIP_HELMET:
                currentlyEquippedItemId = g_player.getHelmet();
                g_player.equipHelmet(toEquipItemId);
                break;
            case EQUIP_SHIELD:
                currentlyEquippedItemId = g_player.getShield();
                g_player.equipShield(toEquipItemId);
                break;
        }
        g_player.removeFromInventory(toEquipItemId);
        g_player.addToInventory(currentlyEquippedItemId);
    },
    
    loadGame: function() {
        var slot = this._saveSelection + 1;
        try {
            g_game.load(slot);
            spriteCtx.clearRect(0, 0, spriteCanvas.width, spriteCanvas.height);
            g_worldmap.goToMap(g_player, g_player.getSubMap(), g_player.getX(), g_player.getY(), g_worldmap.getScrollX(), g_worldmap.getScrollY(), g_player.getDir());
        } catch (e) {
            if (e instanceof NoSaveException)
                g_textDisplay.displayText("There is no saved game in slot" + slot + ".");
            else if (e instanceof OldVersionException)
                g_textDisplay.displayText("The game saved is from an old,\nincompatible version.");
            else
                throw e;
        }
    }
});