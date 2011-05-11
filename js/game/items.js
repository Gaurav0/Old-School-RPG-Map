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
 
var ITEMTYPE_HEAL_ONE = 1;
// var ITEMTYPE_HEAL_ALL = 2;
// var ITEMTYPE_ATTACK_ONE = 3;
var ITEMTYPE_ATTACK_ALL = 4;
var ITEMTYPE_WEAPON = 5;
var ITEMTYPE_ARMOR = 6;
var ITEMTYPE_HELMET = 7;
var ITEMTYPE_SHIELD = 8;

var ITEM_POTION = 0;
var ITEM_BOMB = 1;
var ITEM_ETHER = 2;
var ITEM_TIN_SWORD = 10;
var ITEM_COPPER_SWORD = 11;
var ITEM_BRONZE_SWORD = 12;
var ITEM_IRON_SWORD = 13;
var ITEM_STEEL_SWORD = 14;
var ITEM_BROAD_SWORD = 15;
var ITEM_GREAT_SWORD = 16;
var ITEM_CLOTHES = 20;
var ITEM_LEATHER_ARMOR = 21;
var ITEM_CHAIN_MAIL = 22;
var ITEM_HALF_PLATE_MAIL = 23;
var ITEM_FULL_PLATE_MAIL = 24;
var ITEM_CAP = 30;
var ITEM_LEATHER_HELMET = 31;
var ITEM_BRONZE_HELMET = 32;
var ITEM_IRON_HELMET = 33;
var ITEM_STEEL_HELMET = 34;
var ITEM_TIN_SHIELD = 40;
var ITEM_COPPER_SHIELD = 41;
var ITEM_BRONZE_SHIELD = 42;
var ITEM_IRON_SHIELD = 43;
var ITEM_STEEL_SHIELD = 44;

var g_itemData = {
    "items": { 
        0: {
            "id": ITEM_POTION,
            "name": "Potion",
            "type": ITEMTYPE_HEAL_ONE,
            "cost": 15,
            "usable": true,
            "use": function(target) {
                var amt = 100 + Math.floor(Math.random() * 100);
                target.heal(amt);
                printText(target.getName() + " healed for " + amt + " points.");
            }
        }, 1: {
            "id": ITEM_BOMB,
            "name": "Bomb",
            "type": ITEMTYPE_ATTACK_ALL,
            "cost": 35,
            "usable": true,
            "use": function() {
                g_battle.forEachMonster(function(monster, id) {
                    var amt = 50 + Math.floor(Math.random() * 100);
                    amt -= monster.getDefense();
                    if (amt < 1)
                        amt = 1;
                    monster.damage(amt);
                    g_battle.writeMsg("The " + monster.getName() + " was hit for ");
                    g_battle.writeMsg(amt + " damage.");
                    if (monster.isDead())
                        g_battle.earnReward(monster, id);
                });
            }
        }, 2: {
            "id": ITEM_ETHER,
            "name": "Ether",
            "type": ITEMTYPE_HEAL_ONE,
            "cost": 100,
            "usable": true,
            "use": function(target) {
                var amt = 25 + Math.floor(Math.random() * 25);
                target.gainMP(amt);
                printText(target.getName() + " healed for " + amt + " magic points.");
            }
        }, 10: {
            "id": ITEM_TIN_SWORD,
            "name": "Tin Sword",
            "type": ITEMTYPE_WEAPON,
            "cost": 10,
            "usable": false,
            "attack": 5
        }, 11: {
            "id": ITEM_COPPER_SWORD,
            "name": "Copper Sword",
            "type": ITEMTYPE_WEAPON,
            "cost": 30,
            "usable": false,
            "attack": 10
        }, 12: {
            "id": ITEM_BRONZE_SWORD,
            "name": "Bronze Sword",
            "type": ITEMTYPE_WEAPON,
            "cost": 90,
            "usable": false,
            "attack": 15
        }, 13: {
            "id": ITEM_IRON_SWORD,
            "name": "Iron Sword",
            "type": ITEMTYPE_WEAPON,
            "cost": 270,
            "usable": false,
            "attack": 20
        }, 14: {
            "id": ITEM_STEEL_SWORD,
            "name": "Steel Sword",
            "type": ITEMTYPE_WEAPON,
            "cost": 810,
            "usable": false,
            "attack": 25
        }, 15: {
            "id": ITEM_BROAD_SWORD,
            "name": "Broad Sword",
            "type": ITEMTYPE_WEAPON,
            "cost": 2430,
            "usable": false,
            "attack": 30
        }, 16: {
            "id": ITEM_GREAT_SWORD,
            "name": "Great Sword",
            "type": ITEMTYPE_WEAPON,
            "cost": 7290,
            "usable": false,
            "attack": 35
        }, 20: {
            "id": ITEM_CLOTHES,
            "name": "Clothes",
            "type": ITEMTYPE_ARMOR,
            "cost": 10,
            "usable": false,
            "defense": 1
        }, 21: {
            "id": ITEM_LEATHER_ARMOR,
            "name": "Leather Armor",
            "type": ITEMTYPE_ARMOR,
            "cost": 50,
            "usable": false,
            "defense": 4
        }, 22: {
            "id": ITEM_CHAIN_MAIL,
            "name": "Chain Mail",
            "type": ITEMTYPE_ARMOR,
            "cost": 250,
            "usable": false,
            "defense": 7
        }, 23: {
            "id": ITEM_HALF_PLATE_MAIL,
            "name": "Half Plate Mail",
            "type": ITEMTYPE_ARMOR,
            "cost": 1250,
            "usable": false,
            "defense": 10
        }, 24: {
            "id": ITEM_FULL_PLATE_MAIL,
            "name": "Full Plate Mail",
            "type": ITEMTYPE_ARMOR,
            "cost": 6250,
            "usable": false,
            "defense": 13
        }, 30: {
            "id": ITEM_CAP,
            "name": "Cap",
            "type": ITEMTYPE_HELMET,
            "cost": 5,
            "usable": false,
            "defense": 1
        }, 31: {
            "id": ITEM_LEATHER_HELMET,
            "name": "Leather Helmet",
            "type": ITEMTYPE_HELMET,
            "cost": 30,
            "usable": false,
            "defense": 2
        }, 32: {
            "id": ITEM_BRONZE_HELMET,
            "name": "Bronze Helmet",
            "type": ITEMTYPE_HELMET,
            "cost": 150,
            "usable": false,
            "defense": 4
        }, 33: {
            "id": ITEM_IRON_HELMET,
            "name": "Iron Helmet",
            "type": ITEMTYPE_HELMET,
            "cost": 600,
            "usable": false,
            "defense": 6
        }, 34: {
            "id": ITEM_STEEL_HELMET,
            "name": "Steel Helmet",
            "type": ITEMTYPE_HELMET,
            "cost": 1800,
            "usable": false,
            "defense": 8
        }, 40: {
            "id": ITEM_TIN_SHIELD,
            "name": "Tin Shield",
            "type": ITEMTYPE_SHIELD,
            "cost": 35,
            "usable": false,
            "defense": 1
        }, 41: {
            "id": ITEM_COPPER_SHIELD,
            "name": "Copper Shield",
            "type": ITEMTYPE_SHIELD,
            "cost": 90,
            "usable": false,
            "defense": 2
        }, 42: {
            "id": ITEM_BRONZE_SHIELD,
            "name": "Bronze Shield",
            "type": ITEMTYPE_SHIELD,
            "cost": 230,
            "usable": false,
            "defense": 4
        }, 43: {
            "id": ITEM_IRON_SHIELD,
            "name": "Iron Shield",
            "type": ITEMTYPE_SHIELD,
            "cost": 700,
            "usable": false,
            "defense": 6
        }, 44: {
            "id": ITEM_STEEL_SHIELD,
            "name": "Steel Shield",
            "type": ITEMTYPE_SHIELD,
            "cost": 2100,
            "usable": false,
            "defense": 8
        }
    }
};