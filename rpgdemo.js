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

// Tested in Firefox 3.6, Firefox 4b6, Chrome 7, Safari 5/Win, Opera 10.63, IE9b1.

// How many pixels is one square of the map
var TILE_WIDTH = 32;
var TILE_HEIGHT = 32;

/* How many map squares to display at a time (in both x and y dimensions) in
 * the screen view */
var TILES_ON_SCREEN_X = 13;
var TILES_ON_SCREEN_Y = 11;

/* The auto-scrolling code will scroll the map to try to keep the player
 * character sprite's position between square 3 and square 7 of the screen
 * view */
var MIN_SCREEN_SQUARE_X = 5;
var MAX_SCREEN_SQUARE_X = 7;
var MIN_SCREEN_SQUARE_Y = 4;
var MAX_SCREEN_SQUARE_Y = 6;

// Maximum frames per second
var FPS = 25;

// Scroll factor for animation
var SCROLL_FACTOR = 4;

// Are we busy with animations?
var animating = false;

// Class representing a single square on the map:
function MapSquare(subMap, x, y, passable) {
    if (subMap) {
        this._mapSquareInit(subMap, x, y, passable);
    }
}
MapSquare.prototype = {
    _mapSquareInit: function(subMap, x, y, passable) {
        this._subMap = subMap;
        this._x = x;
        this._y = y;
        this._passable = passable;
    },

    get x() {
        return this._x;
    },

    get y() {
        return this._y;
    },

    /* Returns true if the player character can move through this square.
     * We're assuming a square is either passable or not; this method will
     * need additional arguments if you want to make squares that are
     * passable by some characters but not by others, etc.*/
    passable: function() {
        return this._passable;
    },

    onEnter: function(player) {
        // Not implemented - What happens when the player steps on this square?
    }
};

/* Consider implementing subclasses of MapSquare to create special squares
 * like town and dungeon entrances. */


/* Class representing an individual self-contained map region - for instance, 
 * a single dungeon level would be a SubMap; the overworld would be another.*/
function SubMap(mapXml, tileset) {
    this._init(mapXml, tileset);
}
SubMap.prototype = {
    /* Initialize a SubMap by passing in a Tiled format loaded xml
     * and a tileset instance .*/
    _init: function(mapXml, tileset) {
        this._layer = $(mapXml).find('map layer').eq(0);
        this._xLimit = parseInt($(this._layer).attr('width'));
        this._yLimit = parseInt($(this._layer).attr('height'));
        this._mapXml = mapXml;
        this._tileset = tileset;
        this._mapSquares = [];
        
        // Create mapSquares table used to cache passable info.
        var baseTiles = $(mapXml).find('layer[name="Base"]').find('tile');
        var impassableTiles = $(mapXml).find('layer[name="Impassable"]').find('tile');
        for (var y = 0; y < this._yLimit; y++) {
            var mapSquareRow = [];
            for (var x = 0; x < this._xLimit; x++) {
                var idx = y * this._xLimit + x;
                
                // passable if base layer has water tile or Impassable layer has any tile
                var passable = parseInt(baseTiles.eq(idx).attr('gid')) != 87;
                passable = passable && (parseInt(impassableTiles.eq(idx).attr('gid')) == 0);
                
                var square = new MapSquare(this, x, y, passable);
                mapSquareRow.push(square);
            }
            this._mapSquares.push(mapSquareRow);
        }
    },

    getXLimit: function() {
        return this._xLimit;
    },

    getYLimit: function() {
        return this._yLimit;
    },

    get tileset() {
        return this._tileset;
    },

    /* True if the point x, y (in world coordinates) is within the bounds
     * of the submap. */
    pointInBounds: function(x, y) {
        if (x < 0 || x >= this._xLimit) {
            return false;
        }
        if (y < 0 || y >= this._yLimit) {
            return false;
        }

        return true;
    },

    /* True if the square at position x, y (in world coordinates) is within
     * the bounds of the submap. */
    isPassable: function(x, y) {
        return this._mapSquares[y][x].passable();
    },

    /* Returns the MapSquare instance at position x, y (in world
     * coordinates). */
    getSquareAt: function(x, y) {
        if (!this.pointInBounds(x, y)) {
            return null;
        }
        return this._mapSquares[y][x];
    },
    
    /* This function renders the current view of the map into this
     * canvas. */
    redraw: function(scrollX, scrollY, offsetX, offsetY) {
        
        var xLimit = this._xLimit;
        var tileset = this._tileset;
        var startX = (offsetX > 0) ? -1 : 0;
        var startY = (offsetY > 0) ? -1 : 0;
        var endX = (offsetX < 0) ? TILES_ON_SCREEN_X + 1 : TILES_ON_SCREEN_X;
        var endY = (offsetY < 0) ? TILES_ON_SCREEN_Y + 1 : TILES_ON_SCREEN_Y;
        
        $(this._mapXml).find('map layer data').each(function()
        {
            var tiles = $(this).find('tile');
            for (var y = startY; y < endY; ++y) {
                for (var x = startX; x < endX; ++x) {
                    var idx = (y + scrollY) * xLimit + x + scrollX;
                    var gid = tiles.eq(idx).attr('gid');
                    if (gid > 0) {
                        tileset.drawClip(gid, x, y, offsetX, offsetY);
                    }
                }
            }
        });
    },
    
    /* This function does the scrolling animation */
    animate: function(fromX, fromY, toX, toY) {
        animating = true;
        var deltaX = (toX - fromX) * SCROLL_FACTOR;
        var deltaY = (toY - fromY) * SCROLL_FACTOR;
        var numSteps = ((deltaY != 0) ? TILE_HEIGHT: TILE_WIDTH ) / SCROLL_FACTOR;
        //_submap = this;
        animateSubmap(this, fromX, fromY, 0, 0, deltaX, deltaY, numSteps);
    }
};

// Recursive part of Submap.animate
function animateSubmap(submap, fromX, fromY, offsetX, offsetY, deltaX, deltaY, numSteps) {
    submap.redraw(fromX, fromY, offsetX, offsetY);
    offsetX -= deltaX;
    offsetY -= deltaY;
    if (numSteps > 0)
        window.setTimeout(function() {
            animateSubmap(submap, fromX, fromY, offsetX, offsetY, deltaX, deltaY, --numSteps);
        }, 1000/FPS);
    else {
        animating = false;
        handleBufferedKey();
    }
}


/* Main map manager class.  This class is a container for any number
 * of sub-maps; it's assumed that the default map is an 'overworld' or
 * main world map; it's initialized by the mapXml and tileset that
 * you pass in.  You can also call addSubMap to add additional sub-maps.*/
function WorldMap(mapXml, tileset) {
    this._init(mapXml, tileset);
}
WorldMap.prototype = {
    _init: function(mapXml, tileset) {
        this._subMapList = [];
        this._currentSubMap = 0;
        this._scrollX = 0;
        this._scrollY = 0;

        var mainMap = new SubMap(mapXml, tileset);
        this._subMapList.push(mainMap); // main map is id = 0
    },

    getSubMap: function(id) {
        return this._subMapList[id];
    },

    getCurrentSubMapId: function() {
        return this._currentSubMap;
    },

    getXLimit: function() {
        return this._subMapList[this._currentSubMap].getXLimit();
    },

    getYLimit: function() {
        return this._subMapList[this._currentSubMap].getYLimit();
    },

    // Returns true if the given point (world coordinates) is
    // in-bounds for the active sub-map.
    pointInBounds: function(x, y) {
        return this._subMapList[this._currentSubMap].pointInBounds(x, y);
    },

    // Returns true if the given point (world coordinates) is passable
    // to the player character.
    isPassable: function(x, y) {
        return this._subMapList[this._currentSubMap].isPassable(x, y);
    },

    getSquareAt: function(x, y) {
        var square = this._subMapList[this._currentSubMap].getSquareAt(x, y);
        return square;
    },

    // transforms world coords (in squares) to screen coords (in pixels):
    transform: function( worldX, worldY ) {
        var screenX = TILE_WIDTH * (worldX - this._scrollX);
        var screenY = TILE_HEIGHT * (worldY - this._scrollY);
        return [screenX, screenY];
    },

    // Returns true if the given point is currently on-screen
    isOnScreen: function( worldX, worldY ) {
        var screenX = worldX - this._scrollX;
        var screenY = worldY - this._scrollY;
        return (screenX > -1 && screenX < TILES_ON_SCREEN_X
                && screenY > -1 && screenY < TILES_ON_SCREEN_Y);
    },

    // plotAt, but also scrolls screen if this is too close to the edge and it's
    // possible to scroll.
    autoScrollToPlayer: function( x, y ) {
        var scrolled = false;
        var screenX = x - this._scrollX;
        var screenY = y - this._scrollY;
        var scrollVal = 0;
        if (screenX < MIN_SCREEN_SQUARE_X) {
            scrolled = this.scroll( (screenX - MIN_SCREEN_SQUARE_X), 0 ) || scrolled;
        } else if (screenX > MAX_SCREEN_SQUARE_X) {
            scrolled = this.scroll( (screenX - MAX_SCREEN_SQUARE_X), 0 ) || scrolled;
        }
        if (screenY < MIN_SCREEN_SQUARE_Y) {
            scrolled = this.scroll( 0, (screenY - MIN_SCREEN_SQUARE_Y) ) || scrolled;
        } else if (screenY > MAX_SCREEN_SQUARE_Y) {
            scrolled = this.scroll( 0, (screenY - MAX_SCREEN_SQUARE_Y) ) || scrolled;
        }
        return scrolled;
    },

    /* Scrolls the current view of the map horizontally by deltaX squares
     * and vertically by deltaY squares.  Positive number means the view
     * is moving to the right relative to the underlying world map. */
    scroll: function( deltaX, deltaY ) {
        
        var scrollX = this._scrollX + deltaX;
        var scrollY = this._scrollY + deltaY;
        
        // These lines not working in IE9b1: Internal Error.
        // var xLimit = this.xLimit;
        // var yLimit = this.yLimit;
        // Temp workaround:
        var xLimit = this.getXLimit();
        var yLimit = this.getYLimit();
        
        if (scrollX < 0)
            scrollX = 0;
        if (scrollX + TILES_ON_SCREEN_X > xLimit)
            scrollX = xLimit - TILES_ON_SCREEN_X;
        if (scrollY < 0)
            scrollY = 0;
        if (scrollY + TILES_ON_SCREEN_Y > yLimit)
            scrollY = yLimit - TILES_ON_SCREEN_Y;

        if (scrollX != this._scrollX || scrollY != this._scrollY) {
            this.animate(scrollX, scrollY); 
            this._scrollX = scrollX;
            this._scrollY = scrollY;
            return true;
        }
        return false;
    },

    /* This function renders the current view of the map into this
     * canvas. */
    redraw: function() {
        this._subMapList[this._currentSubMap].redraw(this._scrollX, this._scrollY, 0, 0);
    },
    
    animate: function(newScrollX, newScrollY) {
        this._subMapList[this._currentSubMap].animate(this._scrollX, this._scrollY, newScrollX, newScrollY);
    },

    /* Adds a new sub-map from the given to the world map list.
     * Returns new map id so client code can keep it for reference.*/
    addSubMap: function(subMap) {
        this._subMapList.push(subMap);
        return this._subMapList.length - 1;
    },

    /* Moves sprite to the submap identified by mapId at point x,y
     * and changes view to match. */
    goToMap: function(sprite, mapId, x, y, scrollX, scrollY, dir) {
        sprite.clear();
        this._currentSubMap = mapId;
        sprite.enterNewSubMap(mapId, x, y, dir);
        this.goTo(scrollX, scrollY);
        sprite.plot();
    },
    
    goTo: function(scrollX, scrollY) {
        this._scrollX = scrollX;
        this._scrollY = scrollY;
        this.redraw();
    }
};

var FACING_UP = 0;
var FACING_RIGHT = 1;
var FACING_DOWN = 2;
var FACING_LEFT = 3;
var SPRITE_WIDTH = 24;
var SPRITE_HEIGHT = 32;

/* Class representing an object that can move around the map, such
 * as a player character. Sprite objects are drawn superimposed on
 * the map using a separate canvas with z-index=1 and absolute
 * positioning (these CSS styles are defined in rpgdemo.css) */
function Sprite(id, x, y, img, map, subMapId, dir) {
    if (id) {
        this._init(id, x, y, img, map, subMapId, dir);
    }
}
Sprite.prototype = {
   _init: function(x, y, img, map, subMapId, dir) {
        this._x = x;
        this._y = y;
        this._dir = dir;
        this._subMap = subMapId;
        this._img = img;
        this._worldMap = map;
    },

    /* Draws the sprite onto the map (unless its position is offscreen,
     * or on a different map):*/
    plot: function(sourceOffsetX, destOffsetX, destOffsetY) {
        if (this._worldMap.getCurrentSubMapId() != this._subMap) {
            return;
        }
        if (!this._worldMap.isOnScreen(this._x, this._y)) {
            return;
        }
        
        var sw = SPRITE_WIDTH;
        var sh = SPRITE_HEIGHT;

        var screenCoords = this._worldMap.transform(this._x, this._y);
        var dx = screenCoords[0];
        var dy = screenCoords[1];
        
        // select sprite from sprite image based on direction
        var sy = SPRITE_HEIGHT * this._dir;
        
        // apply sourceOffsetX if available
        var sx = SPRITE_WIDTH;
        if (sourceOffsetX != undefined)
            sx += sourceOffsetX; 
            
        // apply destOffsetX and destOffsetY if available
        if (destOffsetX != undefined)
            dx += destOffsetX;
        if (destOffsetY != undefined)
            dy += destOffsetY;
        
        // Quick fix for race condition
        if (walking && !destOffsetX && !destOffsetY)
            return;
        
        // alert("sx: " + sx + " sy: " + sy + " dx: " + dx + " dy: " + dy);
        
        // draw the sprite!
        spriteCtx.drawImage(this._img, sx, sy, sw, sh, dx + 6, dy, sw, sh);
    },

    // clears sprite canvas of this sprite
    clear: function(destOffsetX, destOffsetY) {        
        var screenCoords = this._worldMap.transform(this._x, this._y);
        var dx = screenCoords[0];
        var dy = screenCoords[1];
            
        // apply destOffsetX and destOffsetY if available
        if (destOffsetX != undefined)
            dx += destOffsetX;
        if (destOffsetY != undefined)
            dy += destOffsetY;
                
        spriteCtx.clearRect(dx + 6, dy, SPRITE_WIDTH, SPRITE_HEIGHT);
    },

    /* Sprite will attempt to move by deltaX in the east-west dimension
     * and deltaY in the north-south dimension.  Returns true if success
     * and false if blocked somehow. */
    move: function( deltaX, deltaY, dir ) {
        this._dir = dir;
        
        var newX = this._x + deltaX;
        var newY = this._y + deltaY;
        
        // Make sure you're not walking off edge of the world and
        // the square we're trying to enter is passable:
        if (!this._worldMap.pointInBounds(newX, newY) ||
                !this._worldMap.isPassable(newX, newY)) {
            if (!animating) {
                this.clear();
                this.plot();
            }
            return false;
        }
            
        this.clear();
        this._x += deltaX;
        this._y += deltaY;

        var scrolling = this._worldMap.autoScrollToPlayer( this._x, this._y );
        if (scrolling)
            this.scrollAnimation();
        else
            this.walkAnimation(deltaX, deltaY);

        // Any effects of stepping on the new square:
        var sprite = this;
        entered = false;
        runAfterAnimation(function() {
            if (!entered)
                sprite.getSquareUnderfoot().onEnter();
            entered = true;
        });
        
        return true;
    },

    enterNewSubMap: function(subMapId, x, y, dir) {
        this._x = x;
        this._y = y;
        this._dir = dir;
        this._subMap = subMapId;
    },

    getSquareUnderfoot: function() {
        return this._worldMap.getSquareAt(this._x, this._y);
    },
    
    scrollAnimation: function() {
        if (animating) {
            scrollAnimationSub(this, 0);
        }
    },
    
    walkAnimation: function(deltaX, deltaY) {
        if (animating) {
            window.setTimeout(function() {
                walkAnimationPoll(this, deltaX, deltaY);
            }, FPS / 1000);
        } else {
            animating = true;
            walking = true;
            var numSteps =  ((deltaY != 0) ? TILE_HEIGHT : TILE_WIDTH) / SCROLL_FACTOR;
            var destOffsetX = -deltaX * TILE_WIDTH;
            var destOffsetY = -deltaY * TILE_HEIGHT;
            walkAnimationSub(this, 0, deltaX, deltaY, destOffsetX, destOffsetY, numSteps);
        }
    }
};

// Polls and runs callback after animation is complete.
function runAfterAnimation(callback) {
    if (!animating)
        callback();
    else
        window.setTimeout(function() {
            runAfterAnimation(callback);
        }, FPS/1000);
}

// Are we currently walking?
var walking = false;

// Have we just entered a new area? (Prevent enter chaining.)
var entered = false;

function scrollAnimationSub(sprite, animStage) {
    if (animating) {
        var sourceOffsetX = 0;
        if (animStage == 1)
            sourceOffsetX = -SPRITE_WIDTH;
        else if (animStage == 3)
            sourceOffsetX = SPRITE_WIDTH;
        sprite.plot(sourceOffsetX);
        window.setTimeout(function() {
            scrollAnimationSub(sprite, (animStage + 1) % 4);
        }, 1000/FPS);
    } else {
        sprite.clear();
        sprite.plot();
    }
}

// Polls until we can start walk animation
function walkAnimationPoll(sprite, deltaX, deltaY) {
    if (animating)
        window.setTimeout(function() {
            walkAnimationPoll(sprite, deltaX, deltaY);
        }, FPS / 1000);
    else
        sprite.walkAnimation(deltaX, deltaY);
}

function walkAnimationSub(sprite, animStage, deltaX, deltaY, destOffsetX, destOffsetY, numSteps) {
    if (numSteps > 1) {
        sprite.clear(destOffsetX, destOffsetY);
        var sourceOffsetX = 0;
        if (animStage == 1)
            sourceOffsetX = -SPRITE_WIDTH;
        else if (animStage == 3)
            sourceOffsetX = SPRITE_WIDTH;
        destOffsetX += deltaX * SCROLL_FACTOR;
        destOffsetY += deltaY * SCROLL_FACTOR;
        sprite.plot(sourceOffsetX, destOffsetX, destOffsetY);
        window.setTimeout(function() {
            walkAnimationSub(sprite, (animStage + 1) % 4, deltaX, deltaY, destOffsetX, destOffsetY, --numSteps);
        }, 1000/FPS);
    } else {
        animating = false;
        walking = false;
        sprite.clear(destOffsetX, destOffsetY);
        sprite.plot();
        handleBufferedKey();
    }
}


/* Class representing a tileset image */
function Tileset(width, height, url, img) {
    this.init(width, height, url, img);
}
Tileset.prototype = {
    init: function(width, height, url, img) {
        this._width = width;
        this._height = height;
        this._url = url;
        this._img = img;
        
    },
    
    /* draws a single layer for a single tile on the map canvas */
    drawClip: function(gid, scrollX, scrollY, offsetX, offsetY) {
        var gid = parseInt(gid);
        gid--; //tmx is 1-based, not 0-based.  We need to sub 1 to get to a proper mapping.

        var tw = TILE_WIDTH;
        var th = TILE_HEIGHT;
        var perRow = this._width / tw;

        var sx = (gid % perRow) * tw;
        var sy = Math.floor(gid / perRow) * th;
        var dx = scrollX * tw + offsetX;
        var dy = scrollY * th + offsetY;
        
        // alert("sx: " + sx + " sy: " + sy + " dx: " + dx + " dy: " + dy);

        mapCtx.drawImage(this._img, sx, sy, tw, th, dx, dy, tw, th);
    }
    
}

var mapCanvas = document.getElementById("map");
var mapCtx = mapCanvas.getContext("2d");
var spriteCanvas = document.getElementById("sprites");
var spriteCtx = spriteCanvas.getContext("2d");

var g_player = null;
var worldmap = null;

// Utility function to load the xml for a tileset
// Callback function must have mapXml parameter.
function loadXml(xmlUrl, callback) {
    $.ajax({
        type: "GET",
        url: xmlUrl,
        dataType: "xml",
        success: callback,
        error: function(a,b,c) {
            alert('error:' + b);
        }
    });
}
    

/* Main Game setup code */
$(document).ready(function() {
    var url = "images/World3.png";
    var img = new Image();
    var worldTileset = new Tileset(256, 1152, url, img);
    img.src = url;
    img.onload = function() {
        loadXml("WorldMap1.tmx.xml", function(mapXml) {
            worldmap = new WorldMap(mapXml, worldTileset);
            var img = new Image();
            g_player = new Sprite(23, 13, img, worldmap, 0, FACING_DOWN);
            worldmap.goTo(17, 8);
            img.onload = function() {
                g_player.plot();
            };
            img.src = "images/Char1.png"; // src set must be after onload function set due to bug in IE9b1

            var url2 = "images/InqCastle.png"
            var img2 = new Image();
            var tileset2 = new Tileset(256, 2304, url2, img2);
            img2.src = url2;
            img2.onload = function() {
                loadXml("Castle1.tmx.xml", function(mapXml) {
                    setupCastleMap(mapXml, tileset2);
                });
            };
        });
    };
});

/* Castle submap setup code */
function setupCastleMap(mapXml, tileset) {
    var map = new SubMap(mapXml, tileset);
    var mapId = worldmap.addSubMap(map);
    var xLimit = map.getXLimit();
    var yLimit = map.getYLimit();
    for (var x = 0; x < xLimit; ++x) {
        for (var y = 0; y < yLimit; ++y) {
            if (x == 0 || y == 0 || x == xLimit - 1 || y == yLimit - 1) {
                var square = map.getSquareAt(x, y);
                square.onEnter = function() {
                    worldmap.goToMap(g_player, 0, 23, 14, 17, 9, FACING_DOWN);
                }
            }
        }
    }
    worldmap.getSubMap(0).getSquareAt(23, 14).onEnter = function() {
        worldmap.goToMap(g_player, mapId, 12, 18, 6, 9, FACING_UP);
    }
}

/* Input Handling */
var DOWN_ARROW = 40;
var UP_ARROW = 38;
var LEFT_ARROW = 37;
var RIGHT_ARROW = 39;
var keyBuffer = 0;

function handleKeyPress(event) {
    if (g_player) {
        if (animating)
            keyBuffer = event.keyCode;
        switch (event.keyCode) {
            case DOWN_ARROW:
                if (!animating)
                    g_player.move(0, 1, FACING_DOWN);
                event.preventDefault();
                break;
            case UP_ARROW:
                if (!animating)
                    g_player.move(0, -1, FACING_UP);
                event.preventDefault();
                break;
            case RIGHT_ARROW:
                if (!animating)
                    g_player.move(1, 0, FACING_RIGHT);
                event.preventDefault();
                break;
            case LEFT_ARROW:
                if (!animating)
                    g_player.move(-1, 0, FACING_LEFT);
                event.preventDefault();
                break;
        }
    }
}

function handleBufferedKey() {
    if (keyBuffer) {
        switch (keyBuffer) {
            case DOWN_ARROW:
                g_player.move(0, 1, FACING_DOWN);
                break;
            case UP_ARROW:
                g_player.move(0, -1, FACING_UP);
                break;
            case RIGHT_ARROW:
                g_player.move(1, 0, FACING_RIGHT);
                break;
            case LEFT_ARROW:
                g_player.move(-1, 0, FACING_LEFT);
                break;
        }
    }
    keyBuffer = 0;
}

if (window.opera || $.browser.mozilla)
    $(window).keypress(handleKeyPress);
else
    $(window).keydown(handleKeyPress);