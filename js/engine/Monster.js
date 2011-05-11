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

/* Class representing an enemy in battles */
var Monster = Class.extend({
    _init: function(monster) {
        this._monster = monster;
        this._maxHP = monster.hp;
        this._hp = monster.hp;
        this._loc = 0;
    },
    
    getHP: function() {
        return this._hp;
    },
    
    damage: function(amt) {
        this._hp -= amt;
    },
    
    heal: function(amt) {
        this._hp += amt;
        if (this._hp > this._maxHP)
            this._hp = this._maxHP;
    },
    
    isDead: function() {
        return this._hp <= 0;
    },
    
    getLoc: function() {
        return this._loc;
    },
    
    setLoc: function(loc) {
        this._loc = loc;
    },
    
    getName: function() {
        return this._monster.name;
    },
    
    getAttack: function() {
        return this._monster.attack;
    },
    
    getDefense: function() {
        return this._monster.defense;
    },
    
    getExp: function() {
        return this._monster.exp;
    },
    
    getGold: function() {
        return this._monster.gold;
    },
    
    getLeft: function() {
        return this._monster.left;
    },
    
    getTop: function() {
        return this._monster.top;
    },
    
    getWidth: function() {
        return this._monster.width;
    },
    
    getHeight: function() {
        return this._monster.height;
    },
    
    hasSpecialAttack: function() {
        return !!this._monster.special;
    },
    
    useSpecialAttack: function() {
        this._monster.special(this);
    }
});