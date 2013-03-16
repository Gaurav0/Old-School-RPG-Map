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
 *   David Leonard <sephirothcloud1025@yahoo.com>
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
 
 

var BATTLE_MAIN_MENU = 0;
var BATTLE_ITEM_MENU = 1;
var BATTLE_SPELL_MENU = 2;
var BATTLE_MONSTER_MENU = 3;

var BATTLE_MENU_ATTACK = 0;
var BATTLE_MENU_DEFEND = 1;
var BATTLE_MENU_SPELL = 2;
var BATTLE_MENU_ITEM = 3;
var BATTLE_MENU_RUN = 4;

var NUM_BATTLE_MENU_ACTIONS_SHOWN = 4;

/* Class for the main battle menu */
var BattleMenu = Menu.extend({
    _init: function(battle) {
        var menu = this;
        this._battle = battle;
        var screenHeight = mapCanvas.height;
        this._texts1 = [ "Attack", "Defend", "Spell", "Item" ];
        this._super({
            type: BATTLE_MAIN_MENU,
            numberSelections: NUM_BATTLE_MENU_ACTIONS_SHOWN,
            drawBox: true,
            left: 0,
            top: screenHeight - 150,
            width: 140,
            height: 150,
            radius: 15,
            thickness: 3,
            pointerLeft: 16,
            textLeft: 36,
            heights: [
                screenHeight - 130, 
                screenHeight - 100, 
                screenHeight - 70, 
                screenHeight - 40
            ],
            texts: this._texts1,
            // flags: flags,
            font: "bold 20px monospace",
            callbacks: [
                function() { menu._battle.beginAttack(); },
                function() { menu._battle.defend(); },
                function() { menu.displaySpellMenu(); },
                function() { menu.displayItemMenu(); },
                function() { menu._battle.run(); }
            ],
            canESC: false
        });
        this._texts2 = [ "Run" ];
        this._currentMenu = this;
    },
    
    /* Get the current menu */
    getCurrentMenu: function() {
        return this._currentMenu;
    },
    
    /* Set the current menu */
    setCurrentMenu: function(menu) {
        this._currentMenu = menu;
    },
    
    // Called after one of the submenus is cleared
    returnTo: function(clear) {
        this._currentMenu = this;
        this.drawPointer();
        if (clear) {
            this._battle.clearText();
            this._battle.drawText();
        }
    },
    
    setDisplayed: function(displayed) {
        this._displayed = displayed;
    },
    
    displayItemMenu: function() {
        this._battle.clearText();
        var menu = new BattleItemMenu(this, this._battle);
        menu.display();
        this._currentMenu = menu;
        this._battle.setMonsterWillAttack(false);
    },
    
    displaySpellMenu: function() {
        this._battle.clearText();
        var menu = new BattleSpellMenu(this, this._battle);
        menu.display();
        this._currentMenu = menu;
        this._battle.setMonsterWillAttack(false);
    },
    
    /* Handles arrow key input for battle menu */
    handleKey: function(key) {
        if (this._currentMenu == this) {
            if (this._displayed) {
                this.clearPointer();
                switch(key) {
                    case DOWN_ARROW:
                        this._current++;
                        this._current %= this._num;
                        break;
                    case UP_ARROW:
                        this._current--;
                        if (this._current < 0)
                            this._current += this._num;
                        break;
                    case RIGHT_ARROW:
                    case LEFT_ARROW:
                        if (this._texts == this._texts1) {
                            this._texts = this._texts2;
                            this._num = 1;
                            this._savedCurrent = this._current;
                            this._current = 0;
                            this.clear();
                            this.display();
                        } else {
                            this._texts = this._texts1;
                            this._num = NUM_BATTLE_MENU_ACTIONS_SHOWN;
                            this._current = this._savedCurrent;
                            this.clear();
                            this.display();
                        }
                        break;
                }
                this.drawPointer();
            }
        } else
           this._currentMenu.handleKey(key);
    },
    
    /* Called when enter key is pressed and battle menu has focus */
    handleEnter: function() {
        if (this._currentMenu == this)
            if (this._texts == this._texts1) {
                this._callbacks[this._current]();
            } else
                this._callbacks[BATTLE_MENU_RUN]();
        else
           this._currentMenu.handleEnter();
    },
    
    /* Called when ESC key is pressed and battle menu has focus */
    handleESC: function() {
        if (this._currentMenu == this && this._canESC)
           this._super();
        else
           this._currentMenu.handleESC();
    }
});