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
 
 
var NUM_TITLESCREEN_MENU_ACTIONS = 2; 

var TITLESCREEN_MENU_NEW_GAME = 0;
var TITLESCREEN_MENU_LOAD_GAME = 1;

/* Class for the initial menu shown on the title screen */ 
var TitleScreenMenu = Menu.extend({
    _init: function(mainMenu) {
        var menu = this;
        this._mainMenu = mainMenu;
    
        this._super({
            numberSelections: NUM_TITLESCREEN_MENU_ACTIONS,
            drawBox: true,
            left: 0,
            top: 0,
            width: 175,
            height: 90,
            radius: 25,
            thickness: 4,
            pointerLeft: 24,
            textLeft: 44,
            heights: [ 20, 48 ],
            texts: [ "New Game", "Load Game" ],
            // flags: flags,
            font: "bold 20px monospace",
            callbacks: [
                function() { menu.onNewGame(); },
                function() { menu.displayLoadMenu(); }
            ],
            canESC: true,
            afterClear: function() { g_menu.clearTitleScreenMenu(); }
        });
        
        this._onNewGame = null;
        this._currentMenuType = TITLESCREEN_MENU;
        this._currentMenu = this;
    },
    
    // display needs to update mainMenu._displayed
    display: function() {
        this._mainMenu.setDisplayed(true);
        this._super();
    },

    // clear needs to update mainMenu._displayed    
    clear: function() {
        this._mainMenu.setDisplayed(false);
        this._super();
    },
    
    // runs when a new game is started.
    onNewGame: function() {
        console.log(this instanceof Class);
        this.clear();
        this._onNewGame();
        g_titlescreen = false;
        this._mainMenu.setCurrentMenu(this._mainMenu);
    },
    
    // set function to call when new game is started.
    setOnNewGame: function(callback) {
        this._onNewGame = callback;
    },
    
    // Called after one of the submenus is cleared
    returnTo: function() {
        this._currentMenuType = MAIN_MENU;
        this._currentMenu = this;
        this.drawPointer();
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
        console.log("TitleScreenMenu.handleEnter");
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