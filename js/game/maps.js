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


var SUBMAP_WORLD_MAP = 0;
var SUBMAP_CASTLE_EXTERIOR = 1;
var SUBMAP_CASTLE_TAVERN = 2;
var SUBMAP_FOREST_DUNGEON = 3;
var SUBMAP_CASTLE_ROOM = 4;
var SUBMAP_CASTLE_ARMORY = 5;
var SUBMAP_CASTLE_LIBRARY = 6;
var SUBMAP_CASTLE_INFIRMARY = 7;
var SUBMAP_TOWN = 8;
var SUBMAP_TOWN_HOUSEA = 9;
var SUBMAP_TOWN_HOUSEB = 10;
var SUBMAP_TOWN_HOUSEC = 11;
var SUBMAP_TOWN_LIBRARY = 12;
var SUBMAP_MOUNTAIN_PASS = 13;
var SUBMAP_MOUNTAIN_PASS2 = 14;
var SUBMAP_CASTLE_TOWN = 15;
var SUBMAP_CASTLE_TOWN_MAP_RIGHT = 16;
var SUBMAP_CASTLE_TOWN_THRONE_ROOM = 17;
var SUBMAP_CASTLE_TOWN_MAP_LEFT = 18;
var SUBMAP_CASTLE_TOWN_STORAGEROOM = 19;
var SUBMAP_LAVISH_HOUSE = 20;
var SUBMAP_POOR_HOUSE = 21;
var SUBMAP_BRICK_HOUSE = 22;
var SUBMAP_KINGDOM = 23;
var SUBMAP_FIRST_TOWER_FIRST_FLOOR = 24;
var SUBMAP_FIRST_TOWER_SECOND_FLOOR = 25;
var SUBMAP_SECOND_TOWER_FIRST_FLOOR = 26;
var SUBMAP_SECOND_TOWER_SECOND_FLOOR = 27;
var SUBMAP_KINGDOM_CAVE_ONE = 28;
var SUBMAP_KINGDOM_CAVE_TWO = 29;
var SUBMAP_KINGDOM_ARMORY = 30;
var SUBMAP_KINGDOM_ITEMS = 31;
var SUBMAP_CASTLE_ARMORY = 32;
var SUBMAP_CASTLE_ITEMS = 33;




var g_themeMusic = "theme";

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
            music: "explore",
            battleMusic: "danger",
            overWorld: true,
            load: function() {
                g_player = new Player(23, 13, "trevor", 0, FACING_DOWN, PLAYER_TREVOR);
                g_menu.setOnNewGame(function() {
                    g_worldmap.goToMap(g_player, 0, 23, 13, 17, 8, FACING_DOWN);
                });
            },
            entrances: [{
                fromX: 23,
                fromY: 14,
                toMapId: SUBMAP_TOWN,
                toX: 9,
                toY: 18,
                toScrollX: 4,
                toScrollY: 9,
                facing: FACING_UP,
                onEnter: function() {
                    g_player.restore();
                }
            }, {
              //Mountain entrance (left)
                fromX: 13,
                fromY: 2,
                toMapId: SUBMAP_MOUNTAIN_PASS,
                toX: 1,
                toY: 9,
                toScrollX: 0,
                toScrollY: 5,
                facing: FACING_RIGHT
            }, {
              //Mountain entrance (right)
                fromX: 15,
                fromY: 3,
                toMapId: SUBMAP_MOUNTAIN_PASS,
                toX: 18,
                toY: 9,
                toScrollX: 7,
                toScrollY: 5,
                facing: FACING_LEFT
            }, {
                fromX: 35,
                fromY: 4,
                toMapId: SUBMAP_CASTLE_TOWN,
                toX: 9,
                toY: 18,
                toScrollX: 4,
                toScrollY: 9,
                facing: FACING_UP
            }, {
                fromX: 21,
                fromY: 18,
                toMapId: SUBMAP_KINGDOM,
                toX: 30,
                toY: 57,
                toScrollX: 24,
                toScrollY: 49,
                facing: FACING_UP
            }, {
                fromX: 13,
                fromY: 9,
                toMapId: SUBMAP_FOREST_DUNGEON,
                toX: 9,
                toY: 28,
                toScrollX: 3,
                toScrollY: 19,
                facing: FACING_UP
            }]
        },
        33: {
              id: SUBMAP_CASTLE_ITEMS,
              tileset: {
                  imgRef: "Combined",
                  width: 5760,
                  height: 8704
              },
              xmlUrl: "xml/CastleItems.tmx.xml",
              randomEncounters: false,
              music: "town",
              overWorld: false, 
              exit: {
                  at: "bottom",
                  toMapId: SUBMAP_CASTLE_TOWN,
                  toX: 18,
                  toY: 9,
                  toScrollX: 16,
                  toScrollY: 5,
                  facing: FACING_DOWN
              },
              npcs:[{
              imgRef: "boy",
              locX: 5,
              locY: 8,
              facing: FACING_DOWN,
              displayText: "I bought a super-special-awesome potion \nhere.",
              walks: false,
          },{
              imgRef: "woman1",
              locX: 14,
              locY: 10,
              facing: FACING_LEFT,
              displayText: "Welcome to the item shop.",
              callback: function() {
                  g_shop.displayShop([
                      ITEM_POTION,
                      ITEM_BOMB
                    ], true);
                },
                walks: false
          }],
          actions: [{
              locX: 12,
              locY: 10,
              dir: FACING_RIGHT,
              onAction: function() {
                  g_mapData.submaps[SUBMAP_KINGDOM_ITEMS].npcs[1].npc.action();
                }
          }]

        },
        32: {
              id: SUBMAP_CASTLE_ARMORY,
              tileset: {
                  imgRef: "Combined",
                  width: 5760,
                  height: 8704
              },
              xmlUrl: "xml/CastleArmory.tmx.xml",
              randomEncounters: false,
              music: "town",
              overWorld: false,
              exit: {
                  at: "bottom",
                  toMapId: SUBMAP_CASTLE_TOWN,
                  toX: 2,
                  toY: 9,
                  toScrollX: 0,
                  toScrollY: 5,
                  facing: FACING_DOWN
              },
               npcs: [{
                imgRef: "man1",
                locX: 5,
                locY: 5,
                facing: FACING_DOWN,
                displayText: "Welcome to the weapon shop.",
                callback: function() {
                    g_shop.displayShop([
                        ITEM_COPPER_SWORD,
                        ITEM_BRONZE_SWORD,
                        ITEM_COPPER_SWORD,
                        ITEM_IRON_SWORD
                      ], false);
                },
                walks: false
            }, {
                imgRef: "man2",
                locX: 10,
                locY: 5,
                facing: FACING_DOWN,
                displayText: "Welcome to the armor shop.",
                callback: function() {
                  g_shop.displayShop([
                    ITEM_CAP,
                    ITEM_LEATHER_HELMET,
                    ITEM_TIN_SHIELD,
                    ITEM_LEATHER_ARMOR,
                    ITEM_CHAIN_MAIL 
                  ], false);
              }  
            },{
                imgRef: "man1",
                locX: 3,
                locY: 10,
                facing: FACING_DOWN,
                displayText: "The weapons here may be unfamilar to \nyou.",
                walks: true,
                zone: {
                  x: 3,
                  y: 10,
                  w: 3,
                  h: 2
                }
            },{
                imgRef: "woman2",
                locX: 11,
                locY: 11,
                facing: FACING_LEFT,
                displayText: "Weapons are so barbaric. Why do we need \nthem anyways?",
                walks: false
            }],
            actions: [{
              locX: 5,
              locY: 8,
              dir: FACING_UP,
              onAction: function() {
                  g_mapData.submaps[SUBMAP_CASTLE_ARMORY].npcs[0].npc.action();
              }
            }, {
                locX: 10,
                locY: 8,
                dir: FACING_UP,
                onAction: function() {
                  g_mapData.submaps[SUBMAP_CASTLE_ARMORY].npcs[1].npc.action();
            }
          }]

        },
        31: {
              id: SUBMAP_KINGDOM_ITEMS,
              tileset: {
                  imgRef: "Combined",
                  width: 5760,
                  height: 8704
            },
            xmlUrl: "xml/KingdomItems.tmx.xml",
            randomEncounters: false,
            music: "town",
            overWorld: false,
            exit: {
                at: "bottom",
                toMapId: SUBMAP_KINGDOM,
                toX: 7,
                toY: 20,
                toScrollX: 2,
                toScrollY: 16,
                facing: FACING_DOWN
          },
          npcs:[{
              imgRef: "boy",
              locX: 5,
              locY: 8,
              facing: FACING_DOWN,
              displayText: "The items here are one of a kind.",
              walks: false,
          },{
              imgRef: "woman1",
              locX: 12,
              locY: 10,
              facing: FACING_LEFT,
              displayText: "Welcome to the item shop.",
              callback: function() {
                  g_shop.displayShop([
                      ITEM_POTION,
                      ITEM_BOMB
                    ], true);
                },
                walks: false
          }],
          actions: [{
              locX: 10,
              locY: 10,
              dir: FACING_RIGHT,
              onAction: function() {
                  g_mapData.submaps[SUBMAP_KINGDOM_ITEMS].npcs[1].npc.action();
                }
          }]
        },
        30: {
              id: SUBMAP_KINGDOM_ARMORY,
              tileset: {
                  imgRef: "Combined",
                  width: 5760,
                  height: 8704
            },
            xmlUrl: "xml/KingdomArmory.tmx.xml",
            randomEncounters: false,
            music: "town",
            overWorld: false,
            exit: {
                at: "bottom",
                toMapId: SUBMAP_KINGDOM,
                toX: 5,
                toY: 15,
                toScrollX: 0,
                toScrollY: 10,
                facing: FACING_DOWN
            },
            npcs: [{
                imgRef: "man1",
                locX: 2,
                locY: 5,
                facing: FACING_RIGHT,
                displayText: "Welcome to the weapon shop.",
                callback: function() {
                    g_shop.displayShop([
                        ITEM_COPPER_SWORD,
                        ITEM_BRONZE_SWORD,
                        ITEM_STEEL_SWORD,
                        ITEM_BROAD_SWORD
                      ], false);
                },
                walks: false
            }, {
                imgRef: "man2",
                locX: 2,
                locY: 7,
                facing: FACING_RIGHT,
                displayText: "Welcome to the armor shop.",
                callback: function() {
                  g_shop.displayShop([
                    ITEM_LEATHER_ARMOR,
                    ITEM_CHAIN_MAIL,
                    ITEM_IRON_HELMET,
                    ITEM_IRON_SHIELD,
                    ITEM_HALF_PLATE_MAI
                  ], false);
              }  
            }],
            actions: [{
              locX: 4,
              locY: 5,
              dir: FACING_LEFT,
              onAction: function() {
                  g_mapData.submaps[SUBMAP_KINGDOM_ARMORY].npcs[0].npc.action();
              }
            }, {
                locX: 4,
                locY: 7,
                dir: FACING_LEFT,
                onAction: function() {
                  g_mapData.submaps[SUBMAP_KINGDOM_ARMORY].npcs[1].npc.action();
            }
          }]
        },
        29: {
              id: SUBMAP_KINGDOM_CAVE_TWO,
              tileset: {
                  imgRef: "Combined",
                  width: 5760,
                  height: 8704
            },
            xmlUrl: "xml/TownCaveTwo.tmx.xml",
            randomEncounters: false,
            music: "dark",
            overWorld: false,
            exit: {
                at: "bottom",
                toMapId: SUBMAP_KINGDOM,
                toX: 3,
                toY: 8,
                toScrollX: 0,
                toScrollY: 3,
                facing: FACING_DOWN
            }
        },
        28: {
              id: SUBMAP_KINGDOM_CAVE_ONE,
              tileset: {
                  imgRef: "Combined",
                  width: 5760,
                  height: 8704
            },
            xmlUrl: "xml/TownCaveOne.tmx.xml",
            randomEncounters: false,
            music: "dark",
            overWorld: false,
            exit: {
                at: "bottom",
                toMapId: SUBMAP_KINGDOM,
                toX: 3,
                toY: 37,
                toScrollX: 0,
                toScrollY: 33,
                facing: FACING_DOWN
            },
            npcs: [{
              imgRef: "soldier",
              locX: 4,
              locY: 6,
              displayText: "What am I doing here? What are you \ndoing here?",
              walks: true,
              zone: {
                x: 3,
                y: 6,
                w: 4,
                h: 2
              }
          }]
        },
        27: {
              id: SUBMAP_SECOND_TOWER_SECOND_FLOOR,
              tileset: {
                  imgRef: "Combined",
                  width: 5760,
                  height: 8704
              },
              xmlUrl: "xml/SecondTowerSecondFloor.tmx.xml",
              randomEncounters: false,
              music: "castle",
              overWorld: false,
              entrances: [{
                  fromX: 1,
                  fromY: 4,
                  toMapId: SUBMAP_SECOND_TOWER_FIRST_FLOOR,
                  toX: 1,
                  toY: 6,
                  toScrollX: 0,
                  toScrollY: 3,
                  facing: FACING_DOWN
            }, {
                  fromX: 1,
                  fromY: 3,
                  toMapId: SUBMAP_SECOND_TOWER_FIRST_FLOOR,
                  toX: 1,
                  toY: 6,
                  toScrollX: 0,
                  toScrollY: 3,
                  facing: FACING_DOWN
            }]
        },
        26: {
              id: SUBMAP_SECOND_TOWER_FIRST_FLOOR,
              tileset: {
                  imgRef: "Combined",
                  width: 5760,
                  height: 8704
              },
              xmlUrl: "xml/SecondTowerFloor.tmx.xml",
              randomEncounters: false,
              music: "castle",
              overWorld: false,
              entrances: [{
                  fromX: 1,
                  fromY: 5,
                  toMapId: SUBMAP_SECOND_TOWER_SECOND_FLOOR,
                  toX: 1,
                  toY: 5,
                  toScrollX: 0,
                  toScrollY: 2,
                  facing: FACING_DOWN
              }, {
                  fromX: 7,
                  fromY: 14,
                  toMapId: SUBMAP_KINGDOM,
                  toX: 38,
                  toY: 30,
                  toScrollX: 33,
                  toScrollY: 25,
                  facing: FACING_DOWN
              }, {
                  fromX: 8,
                  fromY: 14,
                  toMapId: SUBMAP_KINGDOM,
                  toX: 38,
                  toY: 30,
                  toScrollX: 33,
                  toScrollY: 25,
                  facing: FACING_DOWN
              }, {
                  fromX: 6,
                  fromY: 14,
                  toMapId: SUBMAP_KINGDOM,
                  toX: 38,
                  toY: 30,
                  toScrollX: 33,
                  toScrollY: 25,
                  facing: FACING_DOWN
             }, {
                  fromX: 1,
                  fromY: 4,
                  toMapId: SUBMAP_SECOND_TOWER_SECOND_FLOOR,
                  toX: 1,
                  toY: 5,
                  toScrollX: 2,
                  toScrollY: 2,
                  facing: FACING_DOWN
          }]
        },
        25: {
              id: SUBMAP_FIRST_TOWER_SECOND_FLOOR,
              tileset: {
                  imgRef: "Combined",
                  width: 5760,
                  height: 8704
              },
              xmlUrl: "xml/FirstTowerSecondFloor.tmx.xml",
              randomEncounters: false,
              music: "castle",
              overWorld: false,
              entrances: [{
                  fromX: 13,
                  fromY: 5,
                  toMapId: SUBMAP_FIRST_TOWER_FIRST_FLOOR,
                  toX: 13,
                  toY: 5,
                  toScrollX: 2,
                  toScrollY: 2,
                  facing: FACING_DOWN
              },{
                  fromX: 13,
                  fromY: 4,
                  toMapId: SUBMAP_FIRST_TOWER_FIRST_FLOOR,
                  toX: 13,
                  toY: 5,
                  toScrollX: 3,
                  toScrollY: 2,
                  facing: FACING_DOWN
            }]
        },
        24: {
              id: SUBMAP_FIRST_TOWER_FIRST_FLOOR,
              tileset: {  
                  imgRef: "Combined",
                  width: 5760,
                  height: 8704
              },
              xmlUrl: "xml/FirstTowerFloor.tmx.xml",
              randomEncounters: false,
              music: "castle",
              overWorld: false,
              entrances: [{
                  fromX: 13,
                  fromY: 4,
                  toMapId: SUBMAP_FIRST_TOWER_SECOND_FLOOR,
                  toX: 13,
                  toY: 6,
                  toScrollX: 2,
                  toScrollY: 2,
                  facing: FACING_DOWN
            }, {
                  fromX: 6,
                  fromY: 14,
                  toMapId: SUBMAP_KINGDOM,
                  toX: 22,
                  toY: 29,
                  toScrollX: 17,
                  toScrollY: 23,
                  facing: FACING_DOWN
            }, {
                  fromX: 7,
                  fromY: 14,
                  toMapId: SUBMAP_KINGDOM,
                  toX: 22,
                  toY: 29,
                  toScrollX: 17,
                  toScrollY: 23,
                  facing: FACING_DOWN
            }, {

                  fromX: 13,
                  fromY: 3,
                  toMapId: SUBMAP_FIRST_TOWER_SECOND_FLOOR,
                  toX: 13,
                  toY: 6,
                  toScrollX: 2,
                  toScrollY: 2,
                  facing: FACING_DOWN
            }]
        },
        23: {
              id: SUBMAP_KINGDOM,
              tileset: {
                  imgRef: "Combined",
                  width: 5760,
                  height: 8704
              },
              xmlUrl: "xml/HugeKingdom.tmx.xml",
              randomEncounters: false,
              music: "castle",
              overWorld: false,
              entrances: [{
                  fromX: 22,
                  fromY: 29,
                  toMapId: SUBMAP_FIRST_TOWER_FIRST_FLOOR,
                  toX: 6,
                  toY: 13,
                  toScrollX: 1,
                  toScrollY: 4,
                  facing: FACING_UP
              }, {
                  fromX: 38,
                  fromY: 29,
                  toMapId: SUBMAP_SECOND_TOWER_FIRST_FLOOR,
                  toX: 6,
                  toY: 13,
                  toScrollX: 1,
                  toScrollY: 4,
                  facing: FACING_UP
              }, {
                  fromX: 3,
                  fromY: 36,
                  toMapId: SUBMAP_KINGDOM_CAVE_ONE,
                  toX: 6, 
                  toY: 13,
                  toScrollX: 1,
                  toScrollY: 4,
                  facing: FACING_UP
              }, {
                  fromX: 4,
                  fromY: 36,
                  toMapId: SUBMAP_KINGDOM_CAVE_ONE,
                  toX: 7,
                  toY: 13,
                  toScrollX: 1,
                  toScrollY: 4,
                  facing: FACING_UP
              }, {
                  fromX: 2,
                  fromY: 7,
                  toMapId: SUBMAP_KINGDOM_CAVE_TWO,
                  toX: 6,
                  toY: 13,
                  toScrollX: 1,
                  toScrollY: 4,
                  facing: FACING_UP
              }, {
                  fromX: 3,
                  fromY: 7,
                  toMapId: SUBMAP_KINGDOM_CAVE_TWO,
                  toX: 7,
                  toY: 13,
                  toScrollX: 1,
                  toScrollY: 4,
                  facing: FACING_UP
              }, {
                  fromX: 5,
                  fromY: 14,
                  toMapId: SUBMAP_KINGDOM_ARMORY,
                  toX: 6,
                  toY: 13,
                  toScrollX: 1,
                  toScrollY: 4,
                  facing: FACING_UP
              }, {
                  fromX: 7,
                  fromY: 19,
                  toMapId: SUBMAP_KINGDOM_ITEMS,
                  toX: 6,
                  toY: 13,
                  toScrollX: 1,
                  toScrollY: 4,
                  facing: FACING_UP
              }],
              exit: {
                  at: "bottom",
                  toMapId: SUBMAP_WORLD_MAP,
                  toX: 21,
                  toY: 19,
                  toScrollX: 15,
                  toScrollY: 14,
                  facing: FACING_DOWN
              },
              npcs: [{
                imgRef: "boy",
                locX: 4,
                locY: 41,
                displayText: "This is my favorite spot.",
                facing: FACING_RIGHT,
                walks: true,
                zone: {
                  x: 4,
                  y: 41,
                  w: 4,
                  h: 5
                }
              },{
               imgRef: "man1",
               locX: 26,
               locY: 45,
               displayText: "Welcome to our grand kingdom.",
               facing: FACING_RIGHT,
               walks: true,
               zone: {
                 x: 4,
                 y: 45,
                 w: 26,
                 h: 3
               }
             },{
                imgRef: "woman2",
                locX: 49,
                locY: 14,
                displayText: "You will always be remembered.",
                facing: FACING_UP,
                walks: false
             },{
               imgRef: "man2",
               locX: 51,
               locY: 14,
               displayText: "This is the price of war.",
               facing: FACING_UP,
               walks: false
             },{
               imgRef: "woman1",
               locX: 58,
               locY: 10,
               facing: FACING_UP,
               displayText: "The waterfront is always beautiful.",
               walks: true,
               zone: {
                 x: 4,
                 y: 10,
                 w: 58,
                 h: 3
               }
            },{
              imgRef: "boy",
              locX: 1,
              locY: 9,
              facing: FACING_DOWN,
              displayText: "I wonder what is inside that cave, but I \nam too scared to enter.",
              walks: true,
              zone: {
                x: 2,
                y: 9,
                w: 1,
                h: 2
              }
            },{
                imgRef: "woman1",
                locX: 9,
                locY: 20,
                displayText: "You can find powerful potions in this \nshop.",
                facing: FACING_DOWN,
                walks: false
            },{
                imgRef: "soldier",
                locX: 28,
                locY: 36,
                displayText: "You don't look suspicious. Please proceed.",
                facing: FACING_DOWN,
                walks: false
            },{
                imgRef: "soldier",
                locX: 32,
                locY: 36,
                displayText: "The King is a renowned warrior. Tread \nlightly.",
                facing: FACING_DOWN,
                walks: false
            },{
                imgRef: "man2",
                locX: 1,
                locY: 25,
                displayText: "Our King build this domain over several decades.",
                facing: FACING_DOWN,
                walks: true,
                zone: {
                  x: 2,
                  y: 25,
                  w: 1,
                  h: 2
            }
          }]
            
        },
        22: {
              id: SUBMAP_BRICK_HOUSE,
              tileset: {
                  imgRef: "InqIndoors",
                  width: 256,
                  height: 8704
              },
              xmlUrl: "xml/BrickHouse.tmx.xml",
              randomEncounters: false,
              music: "town",
              overWorld: false,
              exit: {
                  at: "bottom",
                  toMapId: SUBMAP_CASTLE_TOWN_MAP_LEFT,
                  toX: 18,
                  toY: 19,
                  toScrollX: 11,
                  toScrollY: 16,
                  facing: FACING_DOWN
              },
              npcs: [{
                  imgRef: "boy",
                  locX: 13,
                  locY: 10,
                  facing: FACING_LEFT,
                  displayText: "My parents are forcing me to finish \nmy homework before I go out. Drat!",
                  walks: true,
                  zone: {
                    x: 4,
                    y: 10,
                    w: 13,
                    h: 3
                  }
              },{
                  imgRef: "woman1",
                  locX: 15,
                  locY: 16,
                  facing: FACING_RIGHT,
                  displayText: "They say the kingdom to the west \nis mobilizing their forces.",
                  walks: false
              },{
                  imgRef: "man1",
                  locX: 18,
                  locY: 15,
                  facing: FACING_LEFT,
                  displayText: "I once dreamed of becoming a knight. \nNow I'm just living a peaceful life \nas a father.",
                  walks: false
              }]
        },
        21: {
              id: SUBMAP_POOR_HOUSE,
              tileset: {
                  imgRef: "InqIndoors",
                  width: 256,
                  height: 8704
              },
              xmlUrl: "xml/PoorHouse.tmx.xml",
              randomEncounters: false,
              music: "town",
              overWorld: false,
              exit: {
                  at: "bottom",
                  toMapId: SUBMAP_CASTLE_TOWN_MAP_LEFT,
                  toX: 7,
                  toY: 28,
                  toScrollX: 2,
                  toScrollY: 19,
                  facing: FACING_DOWN
              },
              npcs: [{
                imgRef: "man2",
                locX: 6,
                locY: 13,
                facing: FACING_RIGHT,
                displayText: "Don't mind all the bottles. I'm fine, \nreally.",
                walks: true,
                zone: {
                  x: 2,
                  y: 13,
                  w: 6,
                  h: 2
                }
            },{
                imgRef: "woman2",
                locX: 4,
                locY: 16,
                facing: FACING_DOWN,
                displayText: "We may be poor, but we live a happy life.",
                walks: true,
                zone: {
                  x: 2,
                  y: 16,
                  w: 4,
                  h: 3
                }
            },{
                imgRef: "boy",
                locX: 18,
                locY: 15,
                facing: FACING_UP,
                displayText: "Wh-h-at am I doing with these swords? \nNothing, I swear!",
                walks: false
            }]
        },
        20: {
              id: SUBMAP_LAVISH_HOUSE,
              tileset: { 
                  imgRef: "InqIndoors",
                  width: 256,
                  height: 8704
              },
              xmlUrl: "xml/LavishHouse.tmx.xml",
              randomEncounters: false,
              music: "town",
              overWorld: false,
              exit: {
                  at: "bottom",
                  toMapId: SUBMAP_CASTLE_TOWN_MAP_LEFT,
                  toX: 4,
                  toY: 14,
                  toScrollX: 0,
                  toScrollY: 8,
                  facing: FACING_DOWN
              },
              npcs: [{
                  imgRef: "woman2",
                  locX: 15,
                  locY: 11,
                  facing: FACING_DOWN,
                  displayText: "How dare a cretin like you barge \nin my home!",
                  walks: true,
                  zone: {
                    x: 3,
                    y: 11,
                    w: 15,
                    h: 2
                  }
              },{
                  imgRef: "woman1",
                  locX: 18,
                  locY: 16,
                  facing: FACING_LEFT,
                  displayText: "Don't mind my sister, she's \nalways like that.",
                  walks: true,
                  zone: {
                    x: 2,
                    y: 16,
                    w: 18,
                    h: 2
                  }
              },{
                  imgRef: "man2",
                  locX: 3,
                  locY: 8,
                  facing: FACING_RIGHT,
                  displayText: "What do you think of my fine abode?\nI know you're envious, but please don't \nsteal anything.",
                  walks: true,
                  zone: {
                    x: 2,
                    y: 8,
                    w: 3,
                    h: 5
                  }
              },{
                  imgRef: "boy",
                  locX: 16,
                  locY: 7,
                  facing: FACING_UP,
                  displayText: "Having rich parents isn't as \ngood as it seems. I never get to play with other kids.",
                  walks: true,
                  zone: {
                    x: 4,
                    y: 7,
                    w: 16,
                    h: 4
                  }
              },{
                  imgRef: "soldier",
                  locX: 8,
                  locY: 11,
                  facing: FACING_DOWN,
                  displayText: "This family is so rich that they \nhired me for protection. If you ask me, \nthey're a bunch of rich snobs.",
                  walks: false
              }]     
        },
        19: {
              id: SUBMAP_CASTLE_TOWN_STORAGEROOM,
              tileset: {
                  imgRef: "BiggerTown",
                  width: 960,
                  height: 960
              },
              xmlUrl: "xml/Storage.tmx.xml",
              randomEncounters: false,
              music: "town",
              overWorld: false,
              exit: {
                  at: "bottom",
                  toMapId: SUBMAP_CASTLE_TOWN_MAP_LEFT,
                  toX: 26,
                  toY: 13,
                  toScrollX: 17,
                  toScrollY: 7,
                  facing: FACING_DOWN
              },
              npcs: [{
                  imgRef: "boy",
                  locX: 10,
                  locY: 8,
                  facing: FACING_RIGHT,
                  displayText: "Our supplies are always full due to \nthe harvest.",
                  walks: true,
                  zone: {
                    x: 5,
                    y: 8,
                    w: 10,
                    h: 3
                  }
              },{
                  imgRef: "man1",
                  locX: 5,
                  locY: 16,
                  facing: FACING_LEFT,
                  displayText: "Lifting these boxes is grueling on \nan old man. Ack, my back!",
                  walks: true,
                  zone: {
                    x: 4,
                    y: 16,
                    w: 5,
                    h: 2
                  }
            }]
        },
        18: {
              id: SUBMAP_CASTLE_TOWN_MAP_LEFT,
              tileset: {
                  imgRef: "BiggerTown",
                  width: 960,
                  height: 960
              },
              xmlUrl: "xml/BiggerTown.tmx.xml",
              randomEncounters: false,
              music: "castle",
              overWorld: false,
              entrances: [{
                fromX: 26,
                fromY: 12,
                toMapId: SUBMAP_CASTLE_TOWN_STORAGEROOM,
                toX: 10,
                toY: 18, 
                toScrollX: 4,
                toScrollY: 9,
                facing: FACING_UP
            }, {
                fromX: 4,
                fromY: 12,
                toMapId: SUBMAP_LAVISH_HOUSE,
                toX: 7,
                toY: 16,
                toScrollX: 2,
                toScrollY: 9,
                facing: FACING_UP
            }, { 
                fromX: 7,
                fromY: 27,
                toMapId: SUBMAP_POOR_HOUSE,
                toX: 10,
                toY: 18,
                toScrollX: 5,
                toScrollY: 9,
                facing: FACING_UP
            }, {
                fromX: 18,
                fromY: 18,
                toMapId: SUBMAP_BRICK_HOUSE,
                toX: 10,
                toY: 17,
                toScrollX: 4,
                toScrollY: 9,
                facing: FACING_UP
            }],
            exit: {
                at: "edges",
                toMapId: SUBMAP_CASTLE_TOWN,
                toX: 1,
                toY: 15,
                toScrollX: 0,
                toScrollY: 9,
                facing: FACING_RIGHT
              },
              npcs: [{
                imgRef: "man2",
                locX: 15,
                locY: 10,
                facing: FACING_UP,
                displayText: "Thanks to the ocean, we never run out \nof water.",
                walks: false
              },{
                imgRef: "boy",
                locX: 13,
                locY: 17,
                facing: FACING_LEFT,
                displayText: "I love playing with the leaves during \nautumn.",
                walks: true,
                zone: {
                    x: 3,
                    y: 17,
                    w: 13,
                    h: 2
                }
              },{
                imgRef: "boy",
                locX: 18,
                locY: 22,
                facing: FACING_DOWN,
                displayText: "What lies beyond the ocean? Someday I'll \nfind out.",
                walks: false
              },{
                imgRef: "man1",
                locX: 3,
                locY: 20,
                facing: FACING_RIGHT,
                displayText: "The man on the other side of town \nspeaks gibberish all the time.",
                walks: true,
                zone: {
                  x: 4,
                  y: 20,
                  w: 3,
                  h: 3
                }
              },{
                imgRef: "woman2",
                locX: 25,
                locY: 17,
                facing: FACING_DOWN,
                displayText: "Welcome to our town! Make yourself \nat home.",
                walks: true,
                zone: {
                  x: 3,
                  y: 17,
                  w: 25,
                  h: 2
                }
              }]
        },
        17: {
              id: SUBMAP_CASTLE_TOWN_THRONE_ROOM,
              tileset: {
                  imgRef: "InqIndoors",
                  width:  256,
                  height: 8704
              },
              xmlUrl: "xml/ThroneRoom.tmx.xml",
              randomEncounters: false,
              music: "castle",
              overWorld: false,
              exit: {
                  at: "bottom",
                  toMapId: SUBMAP_CASTLE_TOWN,
                  toX: 10,
                  toY: 9,
                  toScrollX: 4, 
                  toScrollY: 5,
                  facing: FACING_DOWN
              }
        },
        16: {
              id: SUBMAP_CASTLE_TOWN_MAP_RIGHT,
              tileset: {
                  imgRef: "BigTown",
                  width:  960,
                  height: 960
              },
              xmlUrl: "xml/BigTown.tmx.xml",
              randomEncounters: false,
              music: "castle",
              overWorld: false,
              exit: {
                  at: "edges",
                  toMapId: SUBMAP_CASTLE_TOWN,
                  toX: 18,
                  toY: 15,
                  toScrollX: 7,
                  toScrollY: 9,
                  facing: FACING_LEFT
              },
              npcs: [{
                imgRef: "boy",
                locX: 2,
                locY: 11,
                displayText: "Welcome to the odd side of town.",
                walks: true,
                zone: {
                  x: 3,
                  y: 11,
                  w: 2,
                  h: 2
                }
              },{
                imgRef: "man2",
                locX: 14,
                locY: 10,
                displayText: "Can I help you?",
                walks: true,
                zone: {
                  x: 2,
                  y: 10,
                  w: 14,
                  h: 2
                }
              }]
        },
        15: {
              id: SUBMAP_CASTLE_TOWN,
              tileset: {
                  imgRef: "BigCastle",
                  width: 512,
                  height: 512
              },
              xmlUrl: "xml/CastleTown.tmx.xml",
              randomEncounters: false,
              music: "castle",
              overWorld: false,
              entrances: [{
                fromX: 19, 
                fromY: 15,
                toMapId: SUBMAP_CASTLE_TOWN_MAP_RIGHT,
                toX: 1,
                toY: 11,
                toScrollX: 0,
                toScrollY: 6,
                facing: FACING_RIGHT
              }, {
                fromX: 10,
                fromY: 7,
                toMapId: SUBMAP_CASTLE_TOWN_THRONE_ROOM,
                toX: 10,
                toY: 18,
                toScrollX: 4,
                toScrollY: 9,
                facing: FACING_UP
              }, {
                fromX: 0,
                fromY: 15,
                toMapId: SUBMAP_CASTLE_TOWN_MAP_LEFT,
                toX: 29,
                toY: 20,
                toScrollX: 17,
                toScrollY: 15,
                facing: FACING_DOWN
              },{
                fromX: 2,
                fromY: 8,
                toMapId: SUBMAP_CASTLE_ARMORY,
                toX: 6,
                toY: 13,
                toScrollX: 1,
                toScrollY: 4,
                facing: FACING_UP
              },{
                fromX: 18,
                fromY: 8,
                toMapId: SUBMAP_CASTLE_ITEMS,
                toX: 6,
                toY: 13,
                toScrollX: 1,
                toScrollY: 4,
                facing: FACING_UP
              }],
              exit: {
                at: "bottom",
                toMapId: SUBMAP_WORLD_MAP,
                toX: 35, 
                toY: 5, 
                toScrollX: 27,
                toScrollY: 2,
                facing: FACING_DOWN
              },
              npcs: [{
                  imgRef: "soldier",
                  locX: 8,
                  locY: 8,
                  facing: FACING_DOWN,
                  displayText: "You came from over the mountains to see \nour King?",
                  walks: false
              },{
                  imgRef: "soldier",
                  locX: 12,
                  locY: 8,
                  facing: FACING_DOWN,
                  displayText: "Our kingdom is properous due to our \nrightful ruler.",
                  walks: false
              }]
        },
        14: {
              id: SUBMAP_MOUNTAIN_PASS2,
              tileset: {
                  imgRef: "MountainPass",
                  width: 512,
                  height: 512
              },
              xmlUrl: "xml/Mountain2.tmx.xml",
              randomEncounters: false,
              music: "dark",
              overWorld: false,
              exit: {
                at: "bottom",
                toMapId: SUBMAP_MOUNTAIN_PASS,
                toX: 9, 
                toY: 1,
                toScrollX: 4,
                toScrollY: 0, 
                facing: FACING_DOWN
              }
        },
        13: {
              id: SUBMAP_MOUNTAIN_PASS,
              tileset: {
                  imgRef: "MountainPass",
                  width: 512,
                  height: 512
              },
              xmlUrl: "xml/Mountain.tmx.xml",
              randomEncounters: false,
              overWorld: false,
              music: "dark",
              entrances: [{
              //Exit to left of Mountain Pass
                fromX: 0,
                fromY: 9,
                toMapId: SUBMAP_WORLD_MAP,
                toX: 13,
                toY: 3,
                toScrollX: 5,
                toScrollY: 0,
                facing: FACING_UP
            }, {
              //Exit to left of Mountain Pass
                fromX: 0,
                fromY: 10,
                toMapId: SUBMAP_WORLD_MAP,
                toX: 13,
                toY: 3,
                toScrollX: 5,
                toScrollY: 0,
                facing: FACING_UP
            }, {
              //Exit to right of Mountain pass
                fromX: 19,
                fromY: 8,
                toMapId: SUBMAP_WORLD_MAP,
                toX: 15,
                toY: 4,
                toScrollX: 9,
                toScrollY: 0,
                facing: FACING_RIGHT
            }],
            exit: {
                at: "top",
                toMapId: SUBMAP_MOUNTAIN_PASS2,
                toX: 9,
                toY: 17,
                toScrollX: 4,
                toScrollY: 9,
                facing: FACING_UP
              }
        },
        9: {
            id: SUBMAP_TOWN_HOUSEA,
            tileset: {
                imgRef: "InqIndoors",
                width: 256,
                height: 8704
            },
            xmlUrl: "xml/House11.tmx.xml",
            randomEncounters: false,
            music: "town",
            overWorld: false,
            exit: {
                at: "bottom",
                toMapId: SUBMAP_TOWN,
                toX: 1,
                toY: 6,
                toScrollX: 0,
                toScrollY: 2,
                facing: FACING_DOWN
            }
        }, 
        10: {
            id: SUBMAP_TOWN_HOUSEB,
            tileset: {
                imgRef: "InqIndoors",
                width: 256,
                height: 8704
            },
            xmlUrl: "xml/House2.tmx.xml",
            randomEncounters: false,
            music: "town",
            overWorld: false,
            exit: {
                at: "bottom",
                toMapId: SUBMAP_TOWN,
                toX: 15,
                toY: 7,
                toScrollX: 7,
                toScrollY: 2,
                facing: FACING_DOWN
            }
        },
        11: {
            id: SUBMAP_TOWN_HOUSEC,
            tileset: {
                imgRef: "InqIndoors",
                width: 256,
                height: 8704
            },
            xmlUrl: "xml/House3.tmx.xml",
            randomEncounters: false,
            music: "town",
            overWorld: false,
            exit: {
                at: "bottom",
                toMapId: SUBMAP_TOWN,
                toX: 2,
                toY: 16,
                toScrollX: 0,
                toScrollY: 9,
                facing: FACING_DOWN
            },
            npcs: [{
                imgRef: "woman1",
                locX: 5,
                locY: 4,
                facing: FACING_RIGHT,
                displayText: "My husband has not returned yet. It has \nbeen three days since he left for the \ndark forest.",
                walks: false
            }]

        },
        12: {
            id: SUBMAP_TOWN_LIBRARY,
            tileset: {
                imgRef: "InqIndoors",
                width: 256,
                height: 8704
            },
            xmlUrl: "xml/House4.tmx.xml",
            randomEncounters: false,
            music: "town",
            overWorld: false,
            exit: {
                at: "bottom",
                toMapId: SUBMAP_TOWN,
                toX: 17,
                toY: 16,
                toScrollX: 7, 
                toScrollY: 9,
                facing: FACING_DOWN
            },
            npcs: [{
                imgRef: "boy",
                locX: 11,
                locY: 12,
                facing: FACING_RIGHT,
                displayText: "When I am not doing chores, I enjoy a \ngood read.",
                walks: false
            }, {
                imgRef: "woman1",
                locX: 2,
                locY: 6,
                facing: FACING_UP,
                displayText: "Do you need help finding a book?",
                walks: false
            }, { 
                imgRef: "man1",
                locX: 13,
                locY: 7, 
                facing: FACING_UP,
                displayText: "Our town is small yet humble.",
                walks: false
            },{
                imgRef: "woman2",
                locX: 2,
                locY: 11,
                facing: FACING_LEFT,
                displayText: "Despite being new, this library is full \nof books!",
                walks: false  
            }, {
                imgRef: "man2",
                locX: 7,
                locY: 3,
                facing: FACING_UP,
                displayText: "Boy, the King sure did let himself go....",
                walks: false
            }]
        },
        8: {
            id: SUBMAP_TOWN,
            tileset: {
              imgRef: "BrowserQuest",
              width: 256,
              height: 2560
            },
            xmlUrl: "xml/Town3.tmx.xml",
            randomEncounters: false,
            music: "town",
            overWorld: true,
            entrances: [{
                fromX: 1,
                fromY: 5,
                toMapId: SUBMAP_TOWN_HOUSEA,
                toX: 7,
                toY: 13,
                toScrollX: 2,
                toScrollY: 4,
                facing: FACING_UP
            }, { 
                fromX: 15,
                fromY: 6,
                toMapId: SUBMAP_TOWN_HOUSEB,
                toX: 6,
                toY: 13,
                toScrollX: 0,
                toScrollY: 4,
                facing: FACING_UP
            }, { 
                fromX: 2,
                fromY: 15,
                toMapId: SUBMAP_TOWN_HOUSEC,
                toX: 7,
                toY: 13,
                toScrollX: 2,
                toScrollY: 4,
                facing: FACING_UP
            }, {   
                fromX: 17,
                fromY: 15,
                toMapId: SUBMAP_TOWN_LIBRARY,
                toX: 6,
                toY: 13,
                toScrollX: 1,
                toScrollY: 4,
                facing: FACING_UP
            }, {
                fromX: 9,
                fromY: 0,
                toMapId: SUBMAP_CASTLE_EXTERIOR,
                toX: 12,
                toY: 17,
                toScrollX: 6, 
                toScrollY: 9,
                facing: FACING_UP
            }, {
                fromX: 10,
                fromY: 0,
                toMapId: SUBMAP_CASTLE_EXTERIOR,
                toX: 12,
                toY: 17,
                toScrollX: 6, 
                toScrollY: 9,
                facing: FACING_UP
            }],
            exit: {
                at: "bottom",
                toMapId: SUBMAP_WORLD_MAP,
                toX: 23,
                toY: 14,
                toScrollX: 17,
                toScrollY: 9,
                facing: FACING_DOWN
            }, 
            npcs: [{
                imgRef: "woman1",
                locX: 2,
                locY: 8,
                facing: FACING_DOWN,
                displayText: "Our town is small, but we manage to get \nby.",
                walks: false
            }, {
                imgRef: "boy",
                locX: 7,
                locY: 15,
                facing: FACING_RIGHT, 
                displayText: "My older brother went to the forest to \nlook for my father, but they have not \nreturned yet...sniff.",
                walks: true,
                zone: {
                    x: 4,
                    y: 15,
                    w: 7,
                    h: 3
                }
            }, {
                imgRef: "man1",
                locX: 8,
                locY: 2,
                facing: FACING_RIGHT,
                displayText: "Welcome to the town of (Town name).",
                walks: false
            },{
                imgRef: "soldier",
                locX: 12,
                locY: 18,
                facing: FACING_LEFT,
                displayText: "The king is recruiting all able men to \nvanquish the terror within the forest.",
                walks: false
            }]
        }, 6: {
            id: SUBMAP_CASTLE_LIBRARY,
            tileset: {
                imgRef: "InqIndoors",
                width: 256,
                height: 8704
            },
            xmlUrl: "xml/Library.tmx.xml",
            randomEnounters: false,
            music: "castle",
            overWorld: false,
            exit: {
                at: "bottom",
                toMapId: SUBMAP_CASTLE_ROOM,
                toX: 9,
                toY: 5,
                toScrollX: 4,
                toScrollY: 0,
                facing: FACING_DOWN
            },
            npcs: [ {
                imgRef: "man1",
                locX: 3,
                locY: 8,
                facing: FACING_UP,
                displayText: "Knowing when to flee can be crucial to \nfighting another day.",
                walks: false
            },{
                imgRef: "boy",
                locX: 6,
                locY: 17,
                facing: FACING_LEFT,
                displayText: "Be sure to save often and watch your \nhealth.",
                walks: false
            }, {
                imgRef: "soldier",
                locX: 16,
                locY: 8,
                facing: FACING_UP,
                displayText: "Gaining experience will make you strong \nlike me! Bwahahaha! *cough* *wheeze*",
                walks: false
            } ]
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
                toX: 2,
                toY: 5,
                toScrollX: 0,
                toScrollY: 0,
                facing: FACING_DOWN
            },
            chests: [{
                imgRef: "chest",
                locX: 4,
                locY: 8,
                event: "ac1",
                action: function() {
                    this.onOpenFindItem("You found 2 potions.", ITEM_POTION, 2);
                }
            }, {
                imgRef: "chest",
                locX: 2,
                locY: 9,
                event: "ac2",
                action: function() {
                    this.onOpenFindItem("You found 1 potion.", ITEM_POTION, 1);
                }
            }, {
                imgRef: "chest",
                locX: 12,
                locY: 6,
                event: "ac3",
                action: function() {
                    this.onOpenFindGold(30);
                }
            }]
        }, 7: {
            id: SUBMAP_CASTLE_INFIRMARY,
            tileset: {
                imgRef: "InqIndoors",
                width: 256,
                height: 8704
            },
            xmlUrl: "xml/Infirmary.tmx.xml",
            randomEncounters: false,
            music: "castle",
            overWorld: false,
            exit: {
                at: "bottom",
                toMapId: SUBMAP_CASTLE_ROOM,
                toX: 16,
                toY: 5,
                toScrollX: 7,
                toScrollY: 0,
                facing: FACING_DOWN
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
                displayText: function() {
                    return g_game.isFlagSet("fb") ?
                        "My nurse says the Rat King is dead. \nShe must be lying to keep me here." :
                        "I want to challenge the Rat King again, \nbut I still can't move...";
                },
                walks: false
            }, {
                imgRef: "soldier",
                locX: 13,
                locY: 8,
                facing: FACING_RIGHT,
                displayText: function() {
                    return g_game.isFlagSet("fb") ?
                        "You defeated the Rat King.\nYou must go to see our king\nand um, collect your reward." :
                        "The King is looking for a powerful hero\nto defeat the treacherous Rat King.";
                    },
                walks: false
            }, {
                imgRef: "boy",
                locX: 3,
                locY: 17,
                facing: FACING_RIGHT,
                displayText: "If I was a little older, I would join \nthe knights and make a difference.",
                walks: false
            }],
            actions: [{
                locX: 16,
                locY: 17,
                dir: FACING_RIGHT,
                onAction: function() {
                    g_mapData.submaps[SUBMAP_CASTLE_INFIRMARY].npcs[0].npc.action();
                }
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
            music: "castle",
            overWorld: false,
            //Add entrances 
            entrances: [{
                fromX: 2, 
                fromY: 4,
                toMapId: SUBMAP_CASTLE_ARMORY,
                toX: 9,
                toY: 18,
                toScrollX: 4,
                toScrollY: 9,
                facing: FACING_UP
            }, {
                fromX: 3,
                fromY: 4,
                toMapId: SUBMAP_CASTLE_ARMORY,
                toX: 10, 
                toY: 18,
                toScrollX: 4,
                toScrollY: 9,
                facing: FACING_UP
            }, {
                fromX: 9,
                fromY: 4,
                toMapId: SUBMAP_CASTLE_LIBRARY,
                toX: 10,
                toY: 17,
                toScrollX: 4,
                toScrollY: 9,
                facing: FACING_UP
            }, {
                fromX: 10,
                fromY: 4,
                toMapId: SUBMAP_CASTLE_LIBRARY,
                toX: 10,
                toY: 17,
                toScrollX: 4,
                toScrollY: 9,
                facing: FACING_UP
            }, {
                fromX: 16,
                fromY: 4,
                toMapId: SUBMAP_CASTLE_INFIRMARY,
                toX: 9,
                toY: 17,
                toScrollX: 4,
                toScrollY: 9,
                facing: FACING_UP
            }, {
                fromX: 17,
                fromY: 4,
                toMapId: SUBMAP_CASTLE_INFIRMARY,
                toX: 10,
                toY: 17,
                toScrollX: 4,
                toScrollY: 9,
                facing: FACING_UP
            }],
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
            }]
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
            music: 'castle',
            entrances: [{
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
            }],
            //Scrolling is working now
            exit: {
                at: "edges",
                toMapId: SUBMAP_TOWN,
                toX: 9,
                toY: 1,
                toScrollX: 4,
                toScrollY: 0,
                facing: FACING_DOWN
            },
            npcs: [{
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
            }]
        }, 2: {
            id: SUBMAP_CASTLE_TAVERN,
            tileset: {
                imgRef: "InqIndoors",
                width: 256,
                height: 8704
            },
            xmlUrl: "xml/CastleShops.tmx.xml",
            randomEncounters: false,
            music: "castle",
            overWorld: false,
            //Add entrances to SUBMAP_CASTLE_ROOM
            entrances: [{
                fromX: 9,
                fromY: 15,
                toMapId: SUBMAP_CASTLE_ROOM,
                toX: 10,
                toY: 18,
                toScrollX: 4,
                toScrollY: 9,
                facing: FACING_UP
            }, {
                fromX: 10,
                fromY: 15,
                toMapId: SUBMAP_CASTLE_ROOM,
                toX: 10,
                toY: 18,
                toScrollX: 4,
                toScrollY: 9,
                facing: FACING_UP
            }, {
                fromX: 11,
                fromY: 15,
                toMapId: SUBMAP_CASTLE_ROOM,
                toX: 10,
                toY: 18,
                toScrollX: 4,
                toScrollY: 9,
                facing: FACING_UP
            }, { 
                fromX: 8,
                fromY: 15,
                toMapId: SUBMAP_CASTLE_ROOM,
                toX: 10,
                toY: 18,
                toScrollX: 4,
                toScrollY: 9,
                facing: FACING_UP
            }],
            exit: {
                at: "bottom",
                toMapId: SUBMAP_CASTLE_EXTERIOR,
                toX: 12,
                toY: 12,
                toScrollX: 6,
                toScrollY: 7,
                facing: FACING_DOWN
            },
            npcs: [{
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
                walks: true,
                zone: {
                    x: 3,
                    y: 6,
                    w: 13,
                    h: 8
                }
            }, {
                imgRef: "boy",
                locX: 16,
                locY: 17,
                facing: FACING_LEFT,
                displayText: "Whenever I return to the castle,\nI feel completely refreshed and\nrestored.",
                walks: true,
                zone: {
                    x: 2,
                    y: 17,
                    w: 17,
                    h: 3
                }
            }],
            actions: [{
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
            }]
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
            background: "forestbk",
            overWorld: false,
            music: 'dark',
            battleMusic: 'danger',
            load: function() {
            
                // Boss monster
                var mapId = SUBMAP_FOREST_DUNGEON;
                var map = g_worldmap.getSubMap(mapId);
                var boss = new Sprite(11, 7, 32, 58, "enemies", mapId, 664, 249);
                boss.action = function() {
                    g_textDisplay.setCallback(function() {
                        keyBuffer = 0;
                        g_battle = new Battle();
                        g_battle.setupEncounter("A rat king", [ 10 ], "forestbk");
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
            chests: [{
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
            }]
        }
    }
};


