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

/* Main Game setup code */
$(document).ready(function() {
    var titlescreen = new Image();
    titlescreen.onload = function() {
        mapCtx.drawImage(titlescreen, 0, 0);
    };
    
    // src set must be after onload function set due to bug in IE9
    titlescreen.src = "images/titlescreen.png";
    
    g_game = new Game(titlescreen);
    var url = "images/World3.png"; // url of worlmap's tileset
    var img = new Image();
    var worldTileset = new Tileset(256, 1152, url, img);
    img.src = url;
    img.onload = function() {
        loadXml("xml/WorldMap1.tmx.xml", function(mapXml) {
            g_worldmap = new WorldMap(mapXml, worldTileset);
            var img = new Image();
            g_player = new Player(23, 13, img, 0, FACING_DOWN, PLAYER_TREVOR);
            g_menu.setOnNewGame(function() {
                g_worldmap.goToMap(g_player, 0, 23, 13, 17, 8, FACING_DOWN);
            });
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
                loadXml("xml/Castle1.tmx.xml", function(mapXml) {
                    setupCastleMap(mapXml, tileset2);
                });
            };
            
            var url3 = "images/Elfwood_Forest.png";
            var img3 = new Image();
            var tileset3 = new Tileset(256, 576, url3, img3);
            img3.src = url3;
            img3.onload = function() {
                loadXml("xml/Forest1.tmx.xml", function(mapXml) {
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
    var url4 = "images/Inq_XP_Medieval Indoors.png";
    var img4 = new Image();
    var tileset4 = new Tileset(256, 8704, url4, img4);
    img4.src = url4;
    img4.onload = function() {
        loadXml("xml/CastleShops.tmx.xml", function(mapXml) {
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
    var chest1 = new Chest(3, 27, mapId, "fc1");
    chest1.action = function() {
        this.onOpenFindItem("You found 5 potions.", ITEM_POTION, 5);
    };
    map.addSprite(chest1);
    var chest2 = new Chest(17, 11, mapId, "fc2");
    chest2.action = function() {
        this.onOpenFindItem("You found 3 bombs.", ITEM_BOMB, 3);
    };
    map.addSprite(chest2);
    var chest3 = new Chest(16, 2, mapId, "fc3");
    chest3.action = function() {
        this.onOpenLearnSpell(SPELL_HEAL);
    };
    map.addSprite(chest3);
    var chest4 = new Chest(3, 7, mapId, "fc4");
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
    map.addSprite(boss);
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