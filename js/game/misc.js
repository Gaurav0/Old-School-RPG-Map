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

/* Maps */
var SUBMAP_WORLD_MAP = 0;
var SUBMAP_CASTLE_EXTERIOR = 1;
var SUBMAP_CASTLE_TAVERN = 2;
var SUBMAP_FOREST_DUNGEON = 3;

/* Spells */
var SPELLTYPE_HEAL_ONE = 1;
// var SPELLTYPE_HEAL_ALL = 2;
// var SPELLTYPE_ATTACK_ONE = 3;
var SPELLTYPE_ATTACK_ALL = 4;

var SPELL_HEAL = 0;
var SPELL_BOMB = 1;

var g_spellData = {
    "spells": [ {
        "id": SPELL_HEAL,
        "name": "Heal",
        "mpCost": 5,
        "type": SPELLTYPE_HEAL_ONE,
        "use": function(target) {
            var amt = 100 + Math.floor(Math.random() * 100);
            target.heal(amt);
            printText(target.getName() + " healed for " + amt + " points.");
        }
    }, {
        "id": SPELL_BOMB,
        "name": "Bomb",
        "mpCost": 8,
        "type": SPELLTYPE_ATTACK_ALL,
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
    }]
};

/* Characters */

var PLAYER_TREVOR = 0;

var g_playerData = {
    players: [ {
        id: 0,
        name: "You",
        level: 1,
        maxHP: 100,
        maxMP: 5,
        attack: 12,
        defense: 0,
        exp: 0,
        gold: 0,
        weapon: ITEM_TIN_SWORD,
        armor: ITEM_CLOTHES,
        helmet: ITEM_CAP,
        shield: ITEM_TIN_SHIELD,
        inventory: [],
        spells: [],
        levels: [ 0, 50, 110, 200, 350, 600, 1000, 1500, 2250, 3375, 5000,
            7500, 11250, 16875, 25000, 37500, 56250, 84375, 126500, 189750, 284625,
            426900, 640350, 960525, 1440750, 2161125, 3241650, 4862475, 7293700, 10940550, 16410825
        ],
        max_levels: 30,
        maxHP_increase: 20,
        maxMP_increase: 5,
        attack_increase: 2,
        defense_increase: 1
    }]
};