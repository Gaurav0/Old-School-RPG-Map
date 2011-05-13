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

/* Class representing a game, used to store progress
 * and functions to call whenever a game is loaded */
var Game = Class.extend({
    _init: function() {
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
    
    save: function() {
        amplify.store("save1_version", CURRENT_VERSION);
        amplify.store("save1_player", g_player.createSaveData());
        amplify.store("save1_worldmap", g_worldmap.createSaveData());
        amplify.store("save1_game", g_game.createSaveData());
    },
    
    load: function() {
        if (!amplify.store("save1_version"))
            throw new NoSaveException();
        if (amplify.store("save1_version") != CURRENT_VERSION)
            throw new OldVersionException();
        g_player.loadSaveData(amplify.store("save1_player"));
        g_worldmap.loadSaveData(amplify.store("save1_worldmap"));
        g_game.loadSaveData(amplify.store("save1_game"));
        for (var i = 0; i < this._loadFunctions.length; ++i)
            this._loadFunctions[i]();
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