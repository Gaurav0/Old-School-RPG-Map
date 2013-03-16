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
 

/* Class representing a game, used to keep track of
 * progress, provides functions to save and load the 
 * game, and maintains a list of functions to call
 * whenever a game is loaded */
var Game = Class.extend({
    _init: function(titlescreenImgRef) {
        this._titlescreenImgRef = titlescreenImgRef;
        this._flags = {};
        this._loadFunctions = [];
    },
    
    isFlagSet: function(flag) {
        return !!this._flags[flag];
    },
    
    setFlag: function(flag) {
        this._flags[flag] = true;
    },
    
    addLoadFunction: function(callback) {
        this._loadFunctions.push(callback);
    },
    
    // Saves game to LocalStorage
    save: function(slot) {
        amplify.store("save" + slot, {
            version: CURRENT_VERSION,
            timestamp: new Date().toString(),
            player: g_player.createSaveData(),
            worldmap: g_worldmap.createSaveData(),
            game: this.createSaveData()
        });
    },
    
    // Loads game to LocalStorage
    load: function(slot) {
        var data = amplify.store("save" + slot);
        if (!data)
            throw new NoSaveException();
        if (data.version != CURRENT_VERSION)
            throw new OldVersionException();
        g_player.loadSaveData(data.player);
        g_worldmap.loadSaveData(data.worldmap);
        this.loadSaveData(data.game);
        for (var i = 0; i < this._loadFunctions.length; ++i)
            this._loadFunctions[i]();
    },
    
    // Resets Game to beginning
    reset: function() {
        this._flags = {};
        for (var i = 0; i < this._loadFunctions.length; ++i)
            this._loadFunctions[i]();
        g_player.reset();
    },
    
    showTitleScreen: function() {
        mapCtx.drawImage(g_imageData.images[this._titlescreenImgRef].img, 0, 0);
        g_menu.setCurrentMenu(new TitleScreenMenu(g_menu));
    },
    
    hasSaveInfo: function(slot) {
        return !!amplify.store("save" + slot);
    },
    
    getSaveInfo: function(slot) {
        var timestamp = new Date(amplify.store("save" + slot).timestamp);
        return dateFormat(timestamp, "ddd, mmm d h:MM TT");
    },
    
    createSaveData: function() {
        return this._flags;
    },
    
    loadSaveData: function(gameData) {
        this._flags = gameData;
    }
});

var NoSaveException = Class.extend({});
var OldVersionException = Class.extend({});