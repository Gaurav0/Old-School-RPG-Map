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


var LoadMenu = SlotMenu.extend({
    _init: function(mainMenu) {
        this._super(mainMenu);
        this._type = LOAD_MENU;
        var menu = this;
        this._afterCallback = function() {
            if (g_titlescreen) {
                g_titlescreen = false;
                g_menu.setCurrentMenu(g_menu);
            } else {
                g_menu.setCurrentMenu(mainMenu);
            }
        };
    },
    
    drawText: function() {
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
    },

    callback: function(i) {        
        this.clear();
        this._mainMenu.clear();
        this.loadGame(i + 1);
    },
    
    loadGame: function(slot) {
        try {
            g_game.load(slot);
            spriteCtx.clearRect(0, 0, spriteCanvas.width, spriteCanvas.height);
            g_worldmap.goToMap(g_player, g_player.getSubMap(), g_player.getX(), g_player.getY(),    g_worldmap.getScrollX(), g_worldmap.getScrollY(), g_player.getDir());
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