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

 /*BrowserQuest Specs:
    width: 320 pixels
    height: 1568 pixels
*/

var SUBMAP_WORLD_MAP = 0;
var SUBMAP_CASTLE_EXTERIOR = 1;
var SUBMAP_CASTLE_TAVERN = 2;
var SUBMAP_FOREST_DUNGEON = 3;
var SUBMAP_CASTLE_ROOM = 4;
var SUBMAP_CASTLE_ARMORY = 5;
var SUBMAP_CASTLE_LIBRARY = 6;
var SUBMAP_CASTLE_INFIRMARY = 7;

var g_mapData = {
    "submaps": {
        0: {
            id: SUBMAP_WORLD_MAP,
            tileset: {
                imgRef: "world",
                width: 256,
                height: 1152
            },
            xmlUrl: "xml/WorldMap1.tmx.xml",
            randomEncounters: true,
            background: "meadow",
            overWorld: true,
            load: function() {
                g_player = new Player(23, 13, "trevor", 0, FACING_DOWN, PLAYER_TREVOR);
                g_menu.setOnNewGame(function() {
                    g_worldmap.goToMap(g_player, 0, 23, 13, 17, 8, FACING_DOWN);
                });
            },
            entrances: [ {
                    fromX: 23,
                    fromY: 14,
                    toMapId: SUBMAP_CASTLE_EXTERIOR,
                    toX: 12,
                    toY: 18,
                    toScrollX: 6,
                    toScrollY: 9,
                    facing: FACING_UP,
                    onEnter: function() {
                        g_player.restore();
                    }
                }, {
                    fromX: 13,
                    fromY: 9,
                    toMapId: SUBMAP_FOREST_DUNGEON,
                    toX: 9,
                    toY: 28,
                    toScrollX: 3,
                    toScrollY: 19,
                    facing: FACING_UP
                }
            ]
        }, 6: {
              id: SUBMAP_CASTLE_LIBRARY,
              tileset: {
                  imgRef: "InqIndoors",
                  width: 256,
                  height: 8704
              },
              xmlUrl: "xml/Library.tmx.xml",
              randomEnounters: false,
              overWorld: false,
              exit: {
                  at: "bottom",
                  toMapId: SUBMAP_CASTLE_ROOM,
                  toX: 9,
                  toY: 5,
                  toScrollX: 4,
                  toScrollY: 9,
                  facing: FACING_UP
              }
       }, 5: {
              id: SUBMAP_CASTLE_ARMORY,
              tileset: {
                  imgRef: "InqIndoors",
                  width: 256,
                  height: 8704
              },
              xmlUrl: "xml/Armory.tmx.xml",
              randomEncounters: false,
              overWorld: false,
              exit: {
                    at: "bottom", 
                    toMapId: SUBMAP_CASTLE_ROOM,
                    toX: 4,
                    toY: 9,
                    toScrollX: 3,
                    toScrollY: 6,
                    facing: FACING_UP
              },
              chests: [{
                      imgRef: "chest",
                      locX: 4,
                      locY: 8,
                      event: "fc5",
                      action: function() {
                        this.onOpenFindItem("You found 2 potions.", ITEM_POTION, 2);
                      }
            }, {
                      imgRef: "chest",
                      locX: 2,
                      locY: 9,
                      event: "fc6",
                      action: function() {
                      this.onOpenFindItem("You found 1 potion.", ITEM_POTION, 1);
                }
            }
          ]
      }, 7: {
            id: SUBMAP_CASTLE_INFIRMARY,
            tileset: {
                imgRef: "InqIndoors",
                width: 256,
                height: 8704
            },
            xmlUrl: "xml/Infirmary.tmx.xml",
            randomEncounters: false,
            overWorld: false,
            exit: {
                at: "bottom",
                toMapId: SUBMAP_CASTLE_ROOM,
                toX: 16,
                toY: 5,
                toScrollX: 4,
                toScrollY: 9,
                facing: FACING_UP
          },
          npcs: [{ 
                imgRef: "woman1",
                locX: 18,
                locY: 17,
                facing: FACING_LEFT,
                displayText: "Would you like to rest here?",
                walks: false
          }, {
                imgRef: "soldier",
                locX: 3,
                locY: 8,
                facing: FACING_UP,
                displayText: "I want to challenge the Rat King again, \nbut I still can't move...",
                walks: false
          }, {
                imgRef: "soldier",
                locX: 13,
                locY: 8,
                facing: FACING_RIGHT,
                displayText: "The King is looking for a powerful hero to \ndefeat the treacherous Rat King.",
                walks: false
          }, {
                imgRef: "boy",
                locX: 3,
                locY: 17,
                facing: FACING_RIGHT,
                displayText: "If I was a little older, I would join the \nknights and make a difference.",
                walks: false
          }]
      }, 4:{
            id: SUBMAP_CASTLE_ROOM,
            tileset: {
                imgRef: "InqIndoors",
                width: 256,
                height: 8704
            },
            xmlUrl: "xml/CastleRoom.tmx.xml",
            randomEncounters: false,
            overWorld: false,
            //Add entrances 
            entrances: [{
                fromX: 2, 
                fromY: 4,
                toMapId: SUBMAP_CASTLE_ARMORY,
                toX: 9,
                toY: 19,
                toScrollX: 4,
                toScrollY: 9,
                facing: FACING_UP
            }, {
                fromX: 3,
                fromY: 4,
                toMapId: SUBMAP_CASTLE_ARMORY,
                toX: 10, 
                toY: 14,
                toScrollX: 4,
                toScrollY: 9,
                facing: FACING_UP
            }, {
                fromX: 9,
                fromY: 4,
                toMapId: SUBMAP_CASTLE_LIBRARY,
                toX: 10,
                toY: 18,
                toScrollX: 4,
                toScrollY: 9,
                facing: FACING_UP
            }, {
                fromX: 10,
                fromY: 4,
                toMapId: SUBMAP_CASTLE_LIBRARY,
                toX: 10,
                toY: 18,
                toScrollX: 4,
                toScrollY: 9,
                facing: FACING_UP
            }, {
                fromX: 16,
                fromY: 4,
                toMapId: SUBMAP_CASTLE_INFIRMARY,
                toX: 9,
                toY: 18,
                toScrollX: 4,
                toScrollY: 9,
                facing: FACING_UP
            }, {
                fromX: 17,
                fromY: 4,
                toMapId: SUBMAP_CASTLE_INFIRMARY,
                toX: 10,
                toY: 18,
                toScrollX: 4,
                toScrollY: 9,
                facing: FACING_UP
            }
          ],
            exit: {
                at: "bottom",
                toMapId: SUBMAP_CASTLE_TAVERN,
                toX: 10,
                toY: 18,
                toScrollX: 4,
                toScrollY: 9,
                facing: FACING_UP
        },
        npcs: [{
              imgRef: "soldier",
              locX: 6,
              locY: 16,
              facing: FACING_DOWN,
              displayText: "Welcome to the main floor.",
              walks: false
        }, {
              imgRef: "soldier",
              locX: 13,
              locY: 16,
              facing: FACING_DOWN,
              displayText: "Feel free to have a look around.",
              walks: false
        }, {
              imgRef: "soldier",
              locX: 1,
              locY: 5,
              facing: FACING_DOWN,
              displayText: "Help yourself to the items in the Armory.",
              walks: false
        }, {
              imgRef: "soldier",
              locX: 15,
              locY: 5,
              facing: FACING_RIGHT,
              displayText: "The Infirmary gets more crowded day by \nday due to the monsters...",
              walks: false
        }, {
              imgRef: "woman2",
              locX: 11,
              locY: 5,
              facing: FACING_LEFT,
              displayText: "There are so many books in the library,\nI could spend an eternity there!",
              walks: false
        }
            

        ]
      }, 1: {
            id: SUBMAP_CASTLE_EXTERIOR,
            tileset: {
                imgRef: "InqCastle",
                width: 256,
                height: 2304
            },
            xmlUrl: "xml/Castle1.tmx.xml",
            randomEncounters: false,
            overWorld: false,
            entrances: [ {
                    fromX: 11,
                    fromY: 12,
                    toMapId: SUBMAP_CASTLE_TAVERN,
                    toX: 10,
                    toY: 18,
                    toScrollX: 4,
                    toScrollY: 9,
                    facing: FACING_UP
                }, {
                    fromX: 12,
                    fromY: 12,
                    toMapId: SUBMAP_CASTLE_TAVERN,
                    toX: 10,
                    toY: 18,
                    toScrollX: 4,
                    toScrollY: 9,
                    facing: FACING_UP
                }, {
                    fromX: 13,
                    fromY: 12,
                    toMapId: SUBMAP_CASTLE_TAVERN,
                    toX: 10,
                    toY: 18,
                    toScrollX: 4,
                    toScrollY: 9,
                    facing: FACING_UP
                }
            ],
            exit: {
                at: "edges",
                toMapId: SUBMAP_WORLD_MAP,
                toX: 23,
                toY: 14,
                toScrollX: 17,
                toScrollY: 9,
                facing: FACING_DOWN
            },
            npcs: [ {
                    imgRef: "soldier",
                    locX: 10,
                    locY: 14,
                    facing: FACING_DOWN,
                    displayText: "You may enter the castle now.",
                    walks: false
                }, {
                    imgRef: "soldier",
                    locX: 14,
                    locY: 14,
                    facing: FACING_DOWN,
                    displayText: "But the interior is still under\nconstruction.",
                    walks: false
                }
            ]
        }, 2: {
            id: SUBMAP_CASTLE_TAVERN,
            tileset: {
                imgRef: "InqIndoors",
                width: 256,
                height: 8704
            },
            xmlUrl: "xml/CastleShops.tmx.xml",
            randomEncounters: false,
            overWorld: false,
            //Add entrances to SUBMAP_CASTLE_ROOM
            entrances: [ {
                  fromX: 8,
                  fromY: 16,
                  toMapId: SUBMAP_CASTLE_ROOM,
                  toX: 10,
                  toY: 18,
                  toScrollX: 4,
                  toScrollY: 9,
                  facing: FACING_UP
            }, {
                  fromX: 9,
                  fromY: 16,
                  toMapId: SUBMAP_CASTLE_ROOM,
                  toX: 10,
                  toY: 18,
                  toScrollX: 4,
                  toScrollY: 9,
                  facing: FACING_UP
            }, {
                  fromX: 10,
                  fromY: 16,
                  toMapId: SUBMAP_CASTLE_ROOM,
                  toX: 10,
                  toY: 18,
                  toScrollX: 4,
                  toScrollY: 9,
                  facing: FACING_UP
            }, { 
                  fromX: 11,
                  fromY: 16,
                  toMapId: SUBMAP_CASTLE_ROOM,
                  toX: 10,
                  toY: 18,
                  toScrollX: 4,
                  toScrollY: 9,
                  facing: FACING_UP
            }
          ],
          exit: {
                at: "bottom",
                toMapId: SUBMAP_CASTLE_EXTERIOR,
                toX: 12,
                toY: 12,
                toScrollX: 6,
                toScrollY: 7,
                facing: FACING_DOWN
            },
            npcs: [ {
                    imgRef: "man1",
                    locX: 1,
                    locY: 8,
                    facing: FACING_RIGHT,
                    displayText: "Welcome to the weapon shop.",
                    callback: function() {
                        g_shop.displayShop([
                            ITEM_COPPER_SWORD,
                            ITEM_BRONZE_SWORD,
                            ITEM_IRON_SWORD,
                            ITEM_STEEL_SWORD
                        ], false);
                    },
                    walks: false
                }, {
                    imgRef: "man2",
                    locX: 18,
                    locY: 8,
                    facing: FACING_LEFT,
                    displayText: "Welcome to the armor shop.",
                    callback: function() {
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
                        ], false);
                    },
                    walks: false
                }, {
                    imgRef: "woman2",
                    locX: 1,
                    locY: 12,
                    facing: FACING_RIGHT,
                    displayText: "Welcome to the item shop.",
                    callback: function() {
                        g_shop.displayShop([
                            ITEM_POTION,
                            ITEM_MAX_POTION,
                            ITEM_ELIXER,
                            ITEM_BOMB,
                            ITEM_ETHER
                        ], true);
                    },
                    walks: false
                }, {
                    imgRef: "woman1",
                    locX: 10,
                    locY: 12,
                    facing: FACING_DOWN,
                    displayText: "Welcome to the castle's tavern.",
                    walks: true
                }, {
                    imgRef: "boy",
                    locX: 16,
                    locY: 17,
                    facing: FACING_LEFT,
                    displayText: "Whenever I return to the castle,\nI feel completely refreshed and\nrestored.",
                    walks: true
                }
            ],
            actions: [ {
                    locX: 3,
                    locY: 8,
                    dir: FACING_LEFT,
                    onAction: function() {
                        g_mapData.submaps[SUBMAP_CASTLE_TAVERN].npcs[0].npc.action();
                    }
                }, {
                    locX: 16,
                    locY: 8,
                    dir: FACING_RIGHT,
                    onAction: function() {
                        g_mapData.submaps[SUBMAP_CASTLE_TAVERN].npcs[1].npc.action();
                    }
                }, {
                    locX: 3,
                    locY: 12,
                    dir: FACING_LEFT,
                    onAction: function() {
                        g_mapData.submaps[SUBMAP_CASTLE_TAVERN].npcs[2].npc.action();
                    }
                }
            ]
        }, 3: {
            id: SUBMAP_FOREST_DUNGEON,
            tileset: {
                imgRef: "forest",
                width: 256,
                height: 576
            },
            xmlUrl: "xml/Forest1.tmx.xml",
            randomEncounters: true,
            zone: "forest",
            background: "meadow",
            overWorld: false,
            load: function() {
            
                // Boss monster
                var mapId = SUBMAP_FOREST_DUNGEON;
                var map = g_worldmap.getSubMap(mapId);
                var boss = new Sprite(11, 7, 32, 58, "enemies", mapId, 664, 249);
                boss.action = function() {
                    g_textDisplay.setCallback(function() {
                        keyBuffer = 0;
                        g_battle = new Battle();
                        g_battle.setupEncounter("A rat king", [ 10 ], "meadow");
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
            },
            exit: {
                at: "bottom",
                toMapId: SUBMAP_WORLD_MAP,
                toX: 13,
                toY: 9,
                toScrollX: 7,
                toScrollY: 4,
                facing: FACING_DOWN
            },
            chests: [ {
                    imgRef: "chest",
                    locX: 3,
                    locY: 27,
                    event: "fc1",
                    action: function() {
                        this.onOpenFindItem("You found 5 potions.", ITEM_POTION, 5);
                    }
                }, {
                    imgRef: "chest",
                    locX: 17,
                    locY: 11,
                    event: "fc2",
                    action: function() {
                        this.onOpenFindItem("You found 3 bombs.", ITEM_BOMB, 3);
                    }
                }, {
                    imgRef: "chest",
                    locX: 16,
                    locY: 2,
                    event: "fc3",
                    action: function() {
                        this.onOpenLearnSpell(SPELL_HEAL);
                    }
                }, {
                    imgRef: "chest",
                    locX: 3,
                    locY: 7,
                    event: "fc4",
                    action: function() {
                        this.onOpenLearnSpell(SPELL_BOMB);
                    }
                }
            ]
        }
    }
};


