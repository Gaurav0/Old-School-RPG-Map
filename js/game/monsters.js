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

var g_encounterData = { 
    "zones": [ {
        "zone": "1",
        "encounters": [ {
            "name": "A slime",
            "monsters": [ 0 ]
        }, {
            "name": "A rat",
            "monsters": [ 1 ]
        }, {
            "name": "A snake",
            "monsters": [ 2 ]
        }, {
            "name": "2 slimes",
            "monsters": [ 0, 0 ]
        }, {
            "name": "3 slimes",
            "monsters": [ 0, 0, 0 ]
        }, {
            "name": "A rat and a slime",
            "monsters": [ 1, 0 ]
        }]
    }, {
        "zone": "2",
        "encounters": [ {
            "name": "3 snakes",
            "monsters": [ 2, 2, 2 ]
        }, {
            "name": "3 blue slimes",
            "monsters": [ 3, 3, 3 ]
        }, {
            "name": "A red slime",
            "monsters": [ 5 ]
        }, {
            "name": "2 red slimes",
            "monsters": [ 5, 5 ]
        }, {
            "name": "A cocatrice",
            "monsters": [ 4 ]
        }, {
            "name": "A white rat",
            "monsters": [ 6 ]
        }]
    }, {
        "zone": "3",
        "encounters": [ {
            "name": "2 red slimes",
            "monsters": [ 5, 5 ]
        }, {
            "name": "3 red slimes",
            "monsters": [ 5, 5, 5 ]
        }, {
            "name": "A cocatrice",
            "monsters": [ 4 ]
        }, {
            "name": "A white rat",
            "monsters": [ 6 ]
        }, {
            "name": "A cobra",
            "monsters": [ 7 ]
        }, {
            "name": "A wolf",
            "monsters": [ 8 ]
        }]
    }, {
        "zone": "4",
        "encounters": [ {
            "name": "2 cobras",
            "monsters": [ 7, 7 ]
        }, {
            "name": "2 wolves",
            "monsters": [ 8, 8 ]
        }, {
            "name": "3 cocatrices",
            "monsters": [ 4, 4, 4 ]
        }, {
            "name": "3 white rats",
            "monsters": [ 6, 6, 6 ]
        }, {
            "name": "A wolf and a cobra",
            "monsters": [ 8, 7 ]
        }, {
            "name": "A mage",
            "monsters": [ 9 ]
        }]
    }, {
        "zone": "5",
        "encounters": [ {
            "name": "2 cobras",
            "monsters": [ 7, 7 ]
        }, {
            "name": "2 wolves",
            "monsters": [ 8, 8 ]
        }, {
            "name": "3 cocatrices",
            "monsters": [ 4, 4, 4 ]
        }, {
            "name": "3 white rats",
            "monsters": [ 6, 6, 6 ]
        }, {
            "name": "A wolf and a cobra",
            "monsters": [ 8, 7 ]
        }, {
            "name": "A mage",
            "monsters": [ 9 ]
        }]
    }, {
        "zone": "6",
        "encounters": [ {
            "name": "2 cobras",
            "monsters": [ 7, 7 ]
        }, {
            "name": "2 wolves",
            "monsters": [ 8, 8 ]
        }, {
            "name": "3 cocatrices",
            "monsters": [ 4, 4, 4 ]
        }, {
            "name": "3 white rats",
            "monsters": [ 6, 6, 6 ]
        }, {
            "name": "A wolf and a cobra",
            "monsters": [ 8, 7 ]
        }, {
            "name": "A mage",
            "monsters": [ 9 ]
        }]
    }, {
        "zone": "forest",
        "encounters": [ {
            "name": "3 rats",
            "monsters": [ 1, 1, 1 ]
        }, {
            "name": "A blue slime",
            "monsters": [ 3 ]
        }, {
            "name": "2 blue slimes",
            "monsters": [ 3, 3 ]
        }, {
            "name": "A snake",
            "monsters": [ 2 ]
        }, {
            "name": "A snake and a rat",
            "monsters": [ 2, 1 ]
        }, {
            "name": "A cocatrice",
            "monsters": [ 4 ]
        }]
    }]
};

var g_monsterData = { 
    "monsters": [ {
        "id": 0,
        "name": "slime",
        "hp": 15,
        "attack": 10,
        "defense": 0,
        "exp": 5,
        "gold": 5,
        "imgRef": "enemies",
        "left": 4,
        "top": 109,
        "width": 31,
        "height": 24
    }, {
        "id": 1,
        "name": "rat",
        "hp": 25,
        "attack": 15,
        "defense": 2,
        "exp": 10,
        "gold": 5,
        "imgRef": "enemies",
        "left": 7,
        "top": 498,
        "width": 63,
        "height": 55
    }, {
        "id": 2,
        "name": "snake",
        "hp": 30,
        "attack": 20,
        "defense": 6,
        "exp": 15,
        "gold": 10,
        "imgRef": "enemies",
        "left": 7,
        "top": 160,
        "width": 48,
        "height": 59
    }, {
        "id": 3,
        "name": "blue slime",
        "hp": 20,
        "attack": 20,
        "defense": 20,
        "exp": 20,
        "gold": 10,
        "imgRef": "enemies",
        "left":78,
        "top": 109,
        "width": 31,
        "height": 24
    }, {
        "id": 4,
        "name": "cocatrice",
        "hp": 45,
        "attack": 32,
        "defense": 16,
        "exp": 30,
        "gold": 30,
        "imgRef": "enemies",
        "left": 14,
        "top": 329,
        "width": 47,
        "height": 67
    }, {
        "id": 5,
        "name": "red slime",
        "hp": 30,
        "attack": 30,
        "defense": 30,
        "exp": 30,
        "gold": 15,
        "imgRef": "enemies",
        "left":41,
        "top": 109,
        "width": 31,
        "height": 24
    }, {
        "id": 6,
        "name": "white rat",
        "hp": 55,
        "attack": 38,
        "defense": 20,
        "exp": 40,
        "gold": 30,
        "imgRef": "enemies",
        "left": 145,
        "top": 498,
        "width": 63,
        "height": 55
    }, {
        "id": 7,
        "name": "cobra",
        "hp": 60,
        "attack": 42,
        "defense": 30,
        "exp": 40,
        "gold": 40,
        "imgRef": "enemies",
        "left": 67,
        "top": 160,
        "width": 48,
        "height": 59
    }, {
        "id": 8,
        "name": "wolf",
        "hp": 68,
        "attack": 46,
        "defense": 28,
        "exp": 50,
        "gold": 25,
        "imgRef": "enemies",
        "left": 7,
        "top": 685,
        "width": 47,
        "height": 55
    }, {
        "id": 9,
        "name": "mage",
        "hp": 100,
        "attack": 55,
        "defense": 20,
        "exp": 60,
        "gold": 40,
        "imgRef": "enemies",
        "left": 640,
        "top": 153,
        "width": 32,
        "height": 33,
        "special": function(source) {
        
            // Mage will try to heal the weakest monster in encounter
            var lowId = -1;
            var lowHP = 9999;
            g_battle.writeMsg("The " + source.getName() + " casts Heal.");
            g_battle.forEachMonster(function(monster, id) {
                if (!monster.isDead() && monster.getHP() < lowHP) {
                    lowHP = monster.getHP();
                    lowId = id;
                }
            });
            var monster = g_battle._monsterList[lowId];
            var amt = 50 + Math.floor(Math.random() * 50);
            monster.heal(amt);
            g_battle.writeMsg("The " + monster.getName() + " was healed for " + amt + ".");
        }
    }, {
        "id": 10,
        "name": "rat king",
        "hp": 200,
        "attack": 55,
        "defense": 35,
        "exp": 120,
        "gold": 80,
        "imgRef": "enemies",
        "left": 653,
        "top": 249,
        "width": 47,
        "height": 58
    }]
};