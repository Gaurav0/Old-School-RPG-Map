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

/* Class for main menu */
var MainMenu = Menu.extend({
    _init: function() {
        var menu = this;
        this._super({
            numberSelections: NUM_MAIN_MENU_ACTIONS,
            drawBox: true,
            left: 0,
            top: 0,
            width: 150,
            height: 200,
            radius: 25,
            thickness: 4,
            pointerLeft: 24,
            textLeft: 42,
            heights: [ 20, 48, 76, 104, 132, 160 ],
            texts: [ "Item", "Spell", "Equip", "Status", "Save", "Load" ],
            // flags: flags,
            font: "bold 20px monospace",
            callbacks: [
                menu.displayItemMenu,
                menu.displaySpellMenu,
                menu.displayEquipMenu,
                menu.displayStatusMenu,
                menu.displaySaveMenu,
                menu.displayLoadMenu
            ],
            canESC: true,
            // afterClear: function() { mainMenu.returnTo(); }
        });    
    
        if (g_titlescreen) {
            this._currentMenuType = TITLESCREEN_MENU;
            this._currentMenu = new TitleScreenMenu(this);
            this._titleScreenMenu = this._currentMenu;
        } else {
            this._currentMenuType = MAIN_MENU;
            this._currentMenu = this;            
        }
    },
    
    /* Get the current menu */
    getCurrentMenu: function() {
        return this._currentMenu;
    },
    
    // Called after one of the submenus is cleared
    returnTo: function() {
        this._currentMenuType = MAIN_MENU;
        this._currentMenu = this;
        this.drawPointer();
    },
    
    setDisplayed: function(displayed) {
        this._displayed = displayed;
    },
    
    displayTitleScreenMenu: function() {
        var menu = this._titleScreenMenu ? this._titleScreenMenu : new TitleScreenMenu(this);
        menu.display();
        this._currentMenuType = TITLESCREEN_MENU;
        this._currentMenu = menu;
        this._displayed = true;
    },
    
    clearTitleScreenMenu: function() {
        this._displayed = false;
    },
    
    displayNotImplementedMenu: function() {
        var menu = new NotImplementedMenu();
        menu.display();
        this._currentMenuType = NOT_IMPLEMENTED_MENU;
        this._currentMenu = menu;
    },
    
    displayItemMenu: function() {
        var menu = new ItemMenu();
        menu.display();
        this._currentMenuType = ITEM_MENU;
        this._currentMenu = menu;
    },
    
    displaySpellMenu: function() {
        var menu = new SpellMenu();
        menu.display();
        this._currentMenuType = SPELL_MENU;
        this._currentMenu = menu;
    },
    
    displayEquipMenu: function() {
        var menu = new EquipMenu();
        menu.display();
        this._currentMenuType = EQUIP_MENU;
        this._currentMenu = menu;
    },
    
    displayStatusMenu: function() {
        var menu = new StatusMenu();
        menu.display();
        this._currentMenuType = STATUS_MENU;
        this._currentMenu = menu;
    },
    
    displaySaveMenu: function() {
        var menu = new SaveMenu();
        menu.display();
        this._currentMenuType = SAVE_MENU;
        this._currentMenu = menu;
    },
    
    displayLoadMenu: function() {
        var menu = new LoadMenu();
        menu.display();
        this._currentMenuType = LOAD_MENU;
        this._currentMenu = menu;
    },
    
    /* Handles arrow key input for main menu */
    handleKey: function(key) {
        if (this._currentMenu == this)
           this._super();
        else
           this._currentMenu.handleKey(key);
    },
    
    /* Called when enter key is pressed and main menu has focus */
    handleEnter: function() {
        console.log("MainMenu.handleEnter");
        if (this._currentMenu == this)
           this._super();
        else
           this._currentMenu.handleEnter();
    },
    
    /* Called when ESC key is pressed and main menu has focus */
    handleEsc: function() {
        if (this._currentMenu == this)
           this._super();
        else
           this._currentMenu.handleESC();
    }
});


/* Class for Not Implemented Menu */
var NotImplementedMenu = AbstractMenu.extend({

    _init: function(mainMenu) {
        this._super({
            numberSelections: 0,
            drawBox: true,
            left: 150,
            top: 0,
            width: 250,
            height: 200,
            radius: 25,
            thickness: 4,
            textLeft: 170,
            heights: [],
            texts: [],
            font: "bold 20px monospace",
            afterClear: function() { mainMenu.returnTo(); }
        });
    }
});


/* Class for Status Menu */
var StatusMenu = AbstractMenu.extend({

    _init: function(mainMenu) {
        var texts = this._getTexts();
        this._super({
            numberSelections: 7,
            drawBox: true,
            left: 150,
            top: 0,
            width: 250,
            height: 200,
            radius: 25,
            thickness: 4,
            textLeft: 180,
            heights: [ 18, 36, 54, 72, 90, 108, 126 ],
            texts: texts,
            font: "bold 14px monospace",
            afterClear: function() { mainMenu.returnTo(); }
        });
    },
    
    _getTexts: function() {
        var texts = [];
        
        // Properties of g_player
        texts[0] = "HP:      " + g_player.getHP() + "/" + g_player.getMaxHP();
        texts[1] = "MP:      " + g_player.getMP() + "/" + g_player.getMaxMP();
        texts[2] = "Attack:  " + g_player.getAttack();
        texts[3] = "Defense: " + g_player.getDefense();
        texts[4] = "Level:   " + g_player.getLevel();
        texts[5] = "Exp:     " + g_player.getExp() + "/" + g_player.getNextExp();
        texts[6] = "Gold:    " + g_player.getGold();
    }
});