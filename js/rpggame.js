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

/* rpggame.js: All game specific code here. */

/* Main Game setup code */
$(document).ready(function() {
    g_game = new Game();
    var url = "images/World3.png"; // url of worlmap's tileset
    var img = new Image();
    var worldTileset = new Tileset(256, 1152, url, img);
    img.src = url;
    img.onload = function() {
        loadXml("WorldMap1.tmx.xml", function(mapXml) {
            g_worldmap = new WorldMap(mapXml, worldTileset);
            var img = new Image();
            g_player = new Player(23, 13, img, 0, FACING_DOWN, PLAYER_TREVOR);
            g_worldmap.goTo(17, 8);
            img.onload = function() {
                g_player.plot();
            };
            
            // src set must be after onload function set due to bug in IE9
            img.src = "images/Trevor.png";
            
            // Temporary background
            var meadow = new Image();
            meadow.src = "images/meadow.png";
            
            
            // Setup random encounters
            for (var x = 0; x < g_worldmap.getXLimit(); ++x)
                for (var y = 0; y < g_worldmap.getYLimit(); ++y) {
                    var square = g_worldmap.getSquareAt(x, y);
                    if (square.passable()) {
                        square.onEnter = function() {
                            if (Math.random() < BATTLE_FREQ) {
                                keyBuffer = 0;
                                g_battle = new Battle();
                                var zone = this.getZone();
                                g_battle.setupRandomEncounter(zone, meadow);
                                g_battle.draw();
                            }
                        };
                    }
                }

            var url2 = "images/InqCastle.png";
            var img2 = new Image();
            var tileset2 = new Tileset(256, 2304, url2, img2);
            img2.src = url2;
            img2.onload = function() {
                loadXml("Castle1.tmx.xml", function(mapXml) {
                    setupCastleMap(mapXml, tileset2);
                });
            };
            
            var url3 = "images/Elfwood Forest.png";
            var img3 = new Image();
            var tileset3 = new Tileset(256, 576, url3, img3);
            img3.src = url3;
            img3.onload = function() {
                loadXml("Forest1.tmx.xml", function(mapXml) {
                    setupForestMap(mapXml, tileset3);
                });
            };
        });
    };
    
    g_enemies = new Image();
    g_enemies.src = "images/enemies-t2.png";
});

/* Castle submap setup code */
function setupCastleMap(mapXml, tileset) {
    var map = new SubMap(mapXml, tileset, false);
    var mapId = SUBMAP_CASTLE_EXTERIOR;
    g_worldmap.addSubMap(mapId, map);
    
    // Exit at edges of map
    var xLimit = map.getXLimit();
    var yLimit = map.getYLimit();
    for (var x = 0; x < xLimit; ++x) {
        for (var y = 0; y < yLimit; ++y) {
            if (x == 0 || y == 0 || x == xLimit - 1 || y == yLimit - 1) {
                var square = map.getSquareAt(x, y);
                square.onEnter = function() {
                    g_worldmap.goToMap(g_player, 0, 23, 14, 17, 9, FACING_DOWN);
                };
            }
        }
    }
    
    // Entrance from worldmap
    g_worldmap.getSubMap(0).getSquareAt(23, 14).onEnter = function() {
        g_worldmap.goToMap(g_player, mapId, 12, 18, 6, 9, FACING_UP);
        g_player.restore();
    };
    
    // Soldier NPCs
    var img = new Image();
    var soldier1 = new Character(10, 14, img, mapId, FACING_DOWN);
    img.src = "images/Soldier2.png";
    soldier1.action = function() {
        this.facePlayer();
        g_textDisplay.displayText("You may enter the castle now.");
    };
    map.addSprite(soldier1);
    var soldier2 = new Character(14, 14, img, mapId, FACING_DOWN);
    soldier2.action = function() {
        this.facePlayer();
        g_textDisplay.displayText("But the interior is still under\nconstruction.");
    };
    map.addSprite(soldier2);
    
    // Submap of this submap
    var url4 = "images/Inq XP MI- Medieval Indoors.png";
    var img4 = new Image();
    var tileset4 = new Tileset(256, 8704, url4, img4);
    img4.src = url4;
    img4.onload = function() {
        loadXml("CastleShops.tmx.xml", function(mapXml) {
            setupCastleShopsMap(mapXml, tileset4, mapId);
        });
    };
}

/* Castle Shops submap setup code */
function setupCastleShopsMap(mapXml, tileset, parentMapId) {
    var map = new SubMap(mapXml, tileset, false);
    var mapId = SUBMAP_CASTLE_TAVERN;
    g_worldmap.addSubMap(mapId, map);
    
    // Exit at bottom of map
    var xLimit = map.getXLimit();
    var yLimit = map.getYLimit();
    for (var x = 0; x < xLimit; ++x) {
        for (var y = 0; y < yLimit; ++y) {
            if (y == yLimit - 1) {
                var square = map.getSquareAt(x, y);
                square.onEnter = function() {
                    g_worldmap.goToMap(g_player, 
                        parentMapId, 12, 12, 6, 7, FACING_DOWN);
                };
            }
        }
    }
    
    // Entrance from parent Map
    for (var i = 11; i <= 13; ++i)
        g_worldmap.getSubMap(parentMapId).getSquareAt(i, 12).onEnter = function() {
            g_worldmap.goToMap(g_player, mapId, 10, 18, 4, 9, FACING_UP);
        };
        
    // NPCs
    var img1 = new Image();
    var npc1 = new Character(1, 8, img1, mapId, FACING_RIGHT);
    img1.src = "images/Man1.png";
    npc1.action = function() {
        g_textDisplay.setCallback(function() {
            g_shop.displayShop([
                ITEM_COPPER_SWORD,
                ITEM_BRONZE_SWORD,
                ITEM_IRON_SWORD,
                ITEM_STEEL_SWORD
            ]);
        });
        g_textDisplay.displayText("Welcome to the weapon shop.");
    };
    map.addSprite(npc1);
    var img2 = new Image();
    var npc2 = new Character(18, 8, img2, mapId, FACING_LEFT);
    img2.src = "images/Man2.png";
    npc2.action = function() {
        g_textDisplay.setCallback(function() {
            g_shop.displayShop([
                ITEM_LEATHER_ARMOR,
                ITEM_CHAIN_MAIL,
                ITEM_HALF_PLATE_MAIL,
                ITEM_LEATHER_HELMET,
                ITEM_BRONZE_HELMET,
                ITEM_IRON_HELMET,
                ITEM_COPPER_SHIELD,
                ITEM_BRONZE_SHIELD,
                ITEM_IRON_SHIELD
            ]);
        });
        g_textDisplay.displayText("Welcome to the armor shop.");
    };
    map.addSprite(npc2);
    var img3 = new Image();
    var npc3 = new Character(1, 12, img3, mapId, FACING_RIGHT);
    img3.src = "images/Woman2.png";
    npc3.action = function() {
        g_textDisplay.setCallback(function() {
            g_shop.displayShop([ITEM_POTION, ITEM_BOMB, ITEM_ETHER]);
        });
        g_textDisplay.displayText("Welcome to the item shop.");
    };
    map.addSprite(npc3);
    var img4 = new Image();
    var npc4 = new Character(10, 12, img4, mapId, FACING_DOWN);
    img4.src = "images/Woman1.png";
    npc4.action = function() {
        this.facePlayer();
        g_textDisplay.displayText("Welcome to the castle's tavern.");
    };
    map.addSprite(npc4);
    var img5 = new Image();
    var npc5 = new Character(16, 17, img5, mapId, FACING_LEFT);
    img5.src = "images/Boy.png";
    npc5.action = function() {
        this.facePlayer();
        var msg = "Whenever I return to the castle,\n";
        msg += "I feel completely refreshed and\nrestored."
        g_textDisplay.displayText(msg);
    };
    map.addSprite(npc5);
    
    // Talk to NPCs 1-3 across counter
    map.getSquareAt(3, 8).onAction = function() {
        if (g_player.getDir() == FACING_LEFT)
            npc1.action();
    };
    map.getSquareAt(16, 8).onAction = function() {
        if (g_player.getDir() == FACING_RIGHT)
            npc2.action();
    };
    map.getSquareAt(3, 12).onAction = function() {
        if (g_player.getDir() == FACING_LEFT)
            npc3.action();
    };
}

/* Forest submap setup code */
function setupForestMap(mapXml, tileset) {
    var map = new SubMap(mapXml, tileset, false);
    var mapId = SUBMAP_FOREST_DUNGEON;
    g_worldmap.addSubMap(mapId, map);
    var xLimit = map.getXLimit();
    var yLimit = map.getYLimit();
    
    // Temporary background
    var meadow = new Image();
    meadow.src = "images/meadow.png";
    
    // Setup random encounters
    for (var x = 0; x < xLimit; ++x)
        for (var y = 0; y < yLimit; ++y) {
            var square = map.getSquareAt(x, y);
            if (square.passable()) {
                square.onEnter = function() {
                    if (Math.random() < BATTLE_FREQ) {
                        keyBuffer = 0;
                        g_battle = new Battle();
                        g_battle.setupRandomEncounter("forest", meadow);
                        g_battle.draw();
                    }
                };
            }
        }
    
    // Exit at bottom of map
    for (var x = 0; x < xLimit; ++x) {
        for (var y = 0; y < yLimit; ++y) {
            if (y == yLimit - 1) {
                var square = map.getSquareAt(x, y);
                square.onEnter = function() {
                    g_worldmap.goToMap(g_player, 0, 13, 9, 7, 4, FACING_DOWN);
                };
            }
        }
    }
    
    // Entrance from worldmap
    g_worldmap.getSubMap(0).getSquareAt(13, 9).onEnter = function() {
        g_worldmap.goToMap(g_player, mapId, 9, 28, 3, 19, FACING_UP);
    };
    
    // Treasure chests
    g_chest = new Image();
    g_chest.src = "images/Chest2.png";
    var chest1 = new Chest(3, 27, mapId);
    chest1.action = function() {
        this.onOpenFindItem("You found 5 potions.", ITEM_POTION, 5);
    };
    map.addSprite(chest1);
    var chest2 = new Chest(17, 11, mapId);
    chest2.action = function() {
        this.onOpenFindItem("You found 3 bombs.", ITEM_BOMB, 3);
    };
    map.addSprite(chest2);
    var chest3 = new Chest(16, 2, mapId);
    chest3.action = function() {
        this.onOpenLearnSpell(SPELL_HEAL);
    };
    map.addSprite(chest3);
    var chest4 = new Chest(3, 7, mapId);
    chest4.action = function() {
        this.onOpenLearnSpell(SPELL_BOMB);
    };
    map.addSprite(chest4);
    
    // Boss monster
    var boss = new Sprite(11, 7, 32, 58, g_enemies, mapId, 664, 249);
    boss.action = function() {
        g_textDisplay.setCallback(function() {
            keyBuffer = 0;
            g_battle = new Battle();
            g_battle.setupEncounter("A rat king", [ 10 ], meadow);
            g_battle.onWin = function() {
                g_game.setFlag("fb");
                boss.clear();
                map.removeSprite(boss);
            };
            g_battle.draw();
        });
        g_textDisplay.displayText("I am the rat king.\nI rule this domain.\nPrepare to die.");
    };
    g_game.addLoadFunction(function() {
        if (!g_game.isFlagSet("fb")) {
            if (!map.hasSprite(boss))
                map.addSprite(boss);
        } else {
            boss.clear();
            map.removeSprite(boss);
        }
    });
}

/* Maps */
var SUBMAP_WORLD_MAP = 0;
var SUBMAP_CASTLE_EXTERIOR = 1;
var SUBMAP_CASTLE_TAVERN = 2;
var SUBMAP_FOREST_DUNGEON = 3;

/* Items */
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

// Monsters
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
        "left": 640,
        "top": 153,
        "width": 32,
        "height": 33,
        "special": function(source) {
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
        "left": 653,
        "top": 249,
        "width": 47,
        "height": 58
    }]
};

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