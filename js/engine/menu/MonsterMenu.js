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
 
 
 var MonsterMenu = HorizMenu.extend({
    _init: function(parent, battle, monsterList) {
        this._parent = parent;
        this._battle = battle;
        this._monsterList = monsterList;
        var callbacks = this.createCallbacks(monsterList.length);
        var monsterLefts = _.map(monsterList, function(monster) { monster.getLoc(); });
        var menu = this;
        this._super({
            type: BATTLE_MONSTER_MENU,
            numberSelections: monsterList.length,
            drawBox: false,
            left: monsterLefts[0] - 10,
            top: 3 * TILE_HEIGHT,
            width: monsterLefts[monsterList.length - 1] + 6,
            height: 11,
            lineTop: 3 * TILE_HEIGHT,
            pointerLefts: _.map(monsterLefts, function(left) { return left - 10; }),
            textLefts: monsterLefts,
            texts: [ "", "", "" ],
            callbacks: callbacks,
            canESC: true,
            afterClear: function() { menu._parent.returnTo(); }         
        });
    },
    
    drawText: function() {
        // do nothing
    },
    
    callback: function(i) {
        this._battle.doActionToMonster(i);
    },
    
    /* Version of handleKey that goes to a live monster */
    handleKey: function(key) {
        console.log("Menu.handleKey:" + key + this._displayed);
        if (this._displayed) {
            this.clearPointer();
            switch(key) {
                case DOWN_ARROW:
                case RIGHT_ARROW:
                    do {
                        this._current++;
                        this._current %= this._num;
                    } while (!this._monsterList[this._current].isDead());
                    break;
                case UP_ARROW:
                case LEFT_ARROW:
                    do {
                        this._current--;
                        if (this._current < 0)
                            this._current += this._num;
                    } while (!this._monsterList[this._current].isDead());
                    break;
            }
            this.drawPointer();
        }
    },
    
    /* Select the first monster that is alive */
    selectFirstLiveMonster: function() {
        for (var i = 0; i < this._monsterList.length; ++i)
            if (!this._monsterList[i].isDead()) {
                this._current = i;
                break;
            }
    }
 });