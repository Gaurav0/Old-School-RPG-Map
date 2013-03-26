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
        21: {
              id: SUBMAP_POOR_HOUSE,
              tileset: {
                  imgRef: "InqIndoors",
                  width: 256,
                  height: 8704
              },
              xmlUrl: "xml/PoorHouse.tmx.xml",
              randomEncounters: false,
              overWorld: false,
              exit: {
                  at: "bottom",
                  toMapId: SUBMAP_CASTLE_TOWN_MAP_LEFT,
                  toX: 7,
                  toY: 28,
                  toScrollX: 7,
                  toScrollY: 18,
                  facing: FACING_DOWN
              }
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
              overWorld: false,
              exit: {
                  at: "bottom",
                  toMapId: SUBMAP_CASTLE_TOWN_MAP_LEFT,
                  toX: 4,
                  toY: 14,
                  toScrollX: 0,
                  toScrollY: 8,
                  facing: FACING_DOWN
              }
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
              overWorld: false,
              exit: {
                  at: "bottom",
                  toMapId: SUBMAP_CASTLE_TOWN_MAP_LEFT,
                  toX: 26,
                  toY: 13,
                  toScrollX: 17,
                  toScrollY: 7,
                  facing: FACING_DOWN
              }
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
                toMapId: SUBMAP_CASTLE_TOWN_STORAGEROOM,
                toX: 10,
                toY: 18,
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
              }
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
              overWorld: false,
              exit: {
                  at: "edges",
                  toMapId: SUBMAP_CASTLE_TOWN,
                  toX: 18,
                  toY: 15,
                  toScrollX: 7,
                  toScrollY: 9,
                  facing: FACING_LEFT
              }
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
              }],
              exit: {
                at: "bottom",
                toMapId: SUBMAP_WORLD_MAP,
                toX: 35, 
                toY: 5, 
                toScrollX: 27,
                toScrollY: 2,
                facing: FACING_DOWN
              }
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


