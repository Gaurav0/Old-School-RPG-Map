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


/*
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
*/

var NUM_SAVE_SLOTS = 4;

var SaveMenu = Menu.extend({
    _init: function(mainMenu) {
        var callbacks = this.createCallbacks(NUM_SAVE_SLOTS);
        this._super({
            numberSelections: NUM_SAVE_SLOTS,
            drawBox: true,
            left: 150,
            top: 0,
            width: 250,
            height: 200,
            radius: 25,
            thickness: 4,
            pointerLeft: 170,
            textLeft: 195,
            heights: [ 20, 60, 100, 140 ],
            font: "bold 16px monospace",
            callbacks: callbacks,
            canESC: true,
            afterClear: function() { mainMenu.returnTo(); }
        });
        this._mainMenu = mainMenu;
    },
    
    drawText: function() {

        // Show Save Slot data
        for (var i = 1; i <= NUM_SAVE_SLOTS; ++i) {
            textCtx.font = "bold 16px monospace";
            textCtx.fillText("Save Slot " + i + ":", this._textLeft, this._heights[i - 1]);
            if (g_game.hasSaveInfo(i)) {
                textCtx.font = "bold 14px monospace";
                textCtx.fillText(g_game.getSaveInfo(i), this._textLeft + 15, this._heights[i - 1] + 20);
            } else {
                textCtx.font = "italic 14px serif";
                textCtx.fillText("Empty", this._textLeft + 15, this._heights[i - 1] + 20);
            }
        }
    },

    callback: function(i) {
        this.clear();
        this._mainMenu.clear();
        var slot = i + 1;
        g_game.save(slot);
        g_textDisplay.displayText("Game saved to slot " + slot + ".");
    }
});