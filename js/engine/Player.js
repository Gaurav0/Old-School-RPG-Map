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

/* Class representing a main character that can fight in battles. */
var Player = Character.extend({
    _init: function(x, y, imgRef, subMapId, dir, playerId) {
        this._super(x, y, imgRef, subMapId, dir);
        this._player = g_playerData.players[playerId];
        this.reset();
    },
    
    reset: function() {
        this._name = this._player.name;
        this._exp = this._player.exp;
        this._gold = this._player.gold;
        this._level = this._player.level;
        this._maxHP = this._player.maxHP;
        this._maxMP = this._player.maxMP;
        this._hp = this._player.maxHP;
        this._mp = this._player.maxMP;
        this._attack = this._player.attack;
        this._defense = this._player.defense;
        this._levels = this._player.levels;
        this._weapon = this._player.weapon;
        this._armor = this._player.armor;
        this._helmet = this._player.helmet;
        this._shield = this._player.shield;
        this._inventory = this._player.inventory;
        this._spells = this._player.spells;
    },
    
    getName: function() {
        return this._name;
    },
    
    getExp: function() {
        return this._exp;
    },
    
    getNextExp: function() {
        return this._levels[this._level];
    },
    
    getGold: function() {
        return this._gold;
    },
    
    getMaxHP: function() {
        return this._maxHP;
    },
    
    getMaxMP: function() {
        return this._maxMP;
    },
    
    getHP: function() {
        return this._hp;
    },
    
    getMP: function() {
        return this._mp;
    },
    
    getAttack: function() {
        return this._attack + g_itemData.items[this._weapon].attack;
    },
    
    getDefense: function() {
        return this._defense +
            g_itemData.items[this._armor].defense +
            g_itemData.items[this._helmet].defense +
            g_itemData.items[this._shield].defense;
    },
    
    getLevel: function() {
        return this._level;
    },
    
    getWeapon: function() {
        return this._weapon;
    },
    
    getArmor: function() {
        return this._armor;
    },
    
    getHelmet: function() {
        return this._helmet;
    },
    
    getShield: function() {
        return this._shield;
    },
    
    isDead: function() {
        return this._hp <= 0;
    },
    
    damage: function(dmg) {
        this._hp -= dmg;
    },
    
    heal: function(amt) {
        this._hp += amt;
        if (this._hp > this._maxHP)
            this._hp = this._maxHP;
    },
    
    useMP: function(amt) {
        this._mp -= amt;
    },
    
    gainMP: function(amt) {
        this._mp += amt;
        if (this._mp > this._maxMP)
            this._mp = this._maxMP;
    },
    
    restore: function() {
        this._hp = this._maxHP;
        this._mp = this._maxMP;
    },
    
    earnExp: function(amt) {
        this._exp += amt;
        if (this._level < this._player.max_levels && this._exp >= this.getNextExp()) {
            this._level++;
            
            // Stat changes upon earning new level here
            this._attack += this._player.attack_increase;
            this._defense += this._player.defense_increase;
            this._maxHP += this._player.maxHP_increase;
            this._maxMP += this._player.maxMP_increase;
            
            return true;
        }
        return false;
    },
    
    earnGold: function(amt) {
        this._gold += amt;
    },
    
    spendGold: function(amt) {
        this._gold -= amt;
    },
    
    equipWeapon: function(itemId) {
        this._weapon = itemId;
    },
    
    equipArmor: function(itemId) {
        this._armor = itemId;
    },
    
    equipHelmet: function(itemId) {
        this._helmet = itemId;
    },
    
    equipShield: function(itemId) {
        this._shield = itemId;
    },
    
    addToInventory: function(item, amt) {
        if (amt == undefined)
            amt = 1;
        if (this._inventory[item])
            this._inventory[item] += amt;
        else
            this._inventory[item] = amt;
    },
    
    numInInventory: function(item) {
        return parseInt(this._inventory[item]);
    },
    
    removeFromInventory: function(item, amt) {
        if (amt == undefined)
            amt = 1;
        this._inventory[item] -= amt;
    },
    
    /* calls a function for each item in the inventory
     * callback function takes itemId and amt parameters */
    forEachItemInInventory: function(callback) {
        for (var i in this._inventory)
            callback(i, this._inventory[i]);
    },
    
    learnSpell: function(spellId) {
        this._spells.push(spellId);
    },
    
    /* calls a function for each spell known to the character */
    forEachSpell: function(callback) {
        for (var spellId in this._spells)
            callback(spellId);
    },
    
    createSaveData: function() {
        return {
            exp: this._exp,
            gold: this._gold,
            level: this._level,
            maxHP: this._maxHP,
            maxMP: this._maxMP,
            hp: this._hp, 
            mp: this._mp,
            attack: this._attack,
            defense: this._defense,
            weapon: this._weapon,
            armor: this._armor,
            helmet: this._helmet,
            shield: this._shield,
            inventory: this._inventory,
            spells: this._spells,
            x: this._x,
            y: this._y,
            subMap: this._subMap,
            dir: this._dir
        };
    },

    /* load save data */
    loadSaveData: function(playerData) {
        this._exp = playerData.exp;
        this._gold = playerData.gold;
        this._level = playerData.level;
        this._maxHP = playerData.maxHP;
        this._maxMP = playerData.maxMP;
        this._hp = playerData.hp;
        this._mp = playerData.mp;
        this._attack = playerData.attack;
        this._defense = playerData.defense;
        this._weapon = playerData.weapon;
        this._armor = playerData.armor;
        this._helmet = playerData.helmet;
        this._shield = playerData.shield;
        this._inventory = playerData.inventory;
        this._spells = playerData.spells;
        this._x = playerData.x;
        this._y = playerData.y;
        this._subMap = playerData.subMap;
        this._dir = playerData.dir;
    }
});