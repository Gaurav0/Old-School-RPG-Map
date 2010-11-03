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

// Width and Height of sprites
var SPRITE_WIDTH = 32;
var SPRITE_HEIGHT = 48;

// Maximum frames per second
var FPS = 25;

// Scroll factor for scroll animation
var SCROLL_FACTOR = 4;

// How often to battle
var BATTLE_FREQ = 0.3;

// Class representing a single square on the map:
var MapSquare = Class.extend({
    _init: function(subMap, x, y, passable) {
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

    /* Returns true if the player character can move through this square. */
    passable: function() {
        return this._passable;
    },

    onEnter: function(player) {
        // What happens when the player steps on this square?
    }
});


/* Class representing an individual self-contained map region - for instance, 
 * a single dungeon level would be a SubMap; the overworld would be another.*/
var SubMap = Class.extend({
    /* Initialize a SubMap by passing in a Tiled format loaded xml
     * and a tileset instance .*/
    _init: function(mapXml, tileset, overworld) {
        this._layer = $(mapXml).find('map layer').eq(0);
        this._xLimit = parseInt($(this._layer).attr('width'));
        this._yLimit = parseInt($(this._layer).attr('height'));
        this._mapXml = mapXml;
        this._tileset = tileset;
        this._overworld = overworld;
        this._spriteList = [];
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
    
    isOverWorld: function() {
        return this._overworld;
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
    
    /* True if the square at position x, y (in world coordinates) is occupied
     * by another character */
    isOccupied: function(x, y) {
        var occupied = false;
        for (var i = 0; i < this._spriteList.length; ++i) {
            var sprite = this._spriteList[i];
            if (sprite.isAt(x, y))
                occupied = true;
        }
        return occupied;
    },

    /* Returns the MapSquare instance at position x, y (in world
     * coordinates). */
    getSquareAt: function(x, y) {
        if (!this.pointInBounds(x, y)) {
            return null;
        }
        return this._mapSquares[y][x];
    },
    
    /* Add a sprite (NPC) to the submap. */
    addSprite: function(sprite) {
        this._spriteList.push(sprite);
        return this._spriteList.length - 1;
    },
    
    /* Determines if any sprites are located at (x,y) on this submap */
    getSpriteAt: function(x, y) {
        for (var i = 0; i < this._spriteList.length; ++i) {
            var sprite = this._spriteList[i];
            if (sprite.isAt(x, y))
                return sprite;
        }
        return null;
    },
    
    /* What happens when map is entered: all sprites on map are plotted. */
    onEnter: function() {
        for (var i = 0; i < this._spriteList.length; ++i) {
            this._spriteList[i].plot();
        }
    },
    
    /* What happens when map is exited: all sprites on map are cleared. */
    onExit: function() {
        for (var i = 0; i < this._spriteList.length; ++i) {
            this._spriteList[i].clear();
        }
    },
    
    /* Run when action key is hit. Looks at square where player sprite is
     * facing and performs an action based on the square */
    doAction: function() {
        var coords = g_player.getFacingCoords();
        var x = coords[0];
        var y = coords[1];
        var sprite = this.getSpriteAt(x, y);
        if (sprite != null) {
            sprite.faceOpposite(g_player.getDir());
            sprite.action();
        }
    },
    
    /* This function renders the current view of the map into this
     * canvas. */
    redraw: function(scrollX, scrollY, offsetX, offsetY) {
        
        var xLimit = this._xLimit;
        var tileset = this._tileset;
        
        // Which tiles do we need on the screen, based on the offset?
        var startX = (offsetX > 0) ? -1 : 0;
        var startY = (offsetY > 0) ? -1 : 0;
        var endX = (offsetX < 0) ? TILES_ON_SCREEN_X + 1 : TILES_ON_SCREEN_X;
        var endY = (offsetY < 0) ? TILES_ON_SCREEN_Y + 1 : TILES_ON_SCREEN_Y;
        
        $(this._mapXml).find('map layer data').each(function()
        {
            var tiles = $(this).find('tile');
            for (var y = startY; y < endY; ++y) {
                for (var x = startX; x < endX; ++x) {
                    
                    // index of tile we want
                    var idx = (y + scrollY) * xLimit + x + scrollX;
                    
                    // id in tileset to draw
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
        g_worldmap.animating = true;
        var deltaX = toX - fromX;
        var deltaY = toY - fromY;
        var numSteps = ((deltaY != 0) ? TILE_HEIGHT: TILE_WIDTH ) / SCROLL_FACTOR;
        var submap = this;
        window.setTimeout(function() {
            submap.animateSub(fromX, fromY, 0, 0, deltaX, deltaY, numSteps);
        }, 1);
    },
    
    // Recursive part of Submap.animate, the scrolling animation.
    animateSub: function(fromX, fromY, offsetX, offsetY, deltaX, deltaY, numSteps) {
        
        // Don't redraw sprites the last time, or the plot will not be cleared.
        if (numSteps > 0) {
            for (var i = 0; i < this._spriteList.length; ++i) {
                
                // this._x and this._y already changed, so offset by a tile size
                this._spriteList[i].clear(offsetX + deltaX * TILE_WIDTH,
                                          offsetY + deltaY * TILE_HEIGHT);
            }
            
            // offset map in opposite direction of scroll
            offsetX -= deltaX * SCROLL_FACTOR;
            offsetY -= deltaY * SCROLL_FACTOR;
            
            for (var i = 0; i < this._spriteList.length; ++i) {
                this._spriteList[i].plot(0, offsetX + deltaX * TILE_WIDTH,
                                            offsetY + deltaY * TILE_HEIGHT);
            }
        }
        
        // Redraw submap *after* redrawing sprites to avoid shift illusion
        this.redraw(fromX, fromY, offsetX, offsetY);
        
        if (numSteps > 0) {
            var submap = this;
            window.setTimeout(function() {
                submap.animateSub(fromX, fromY, offsetX, offsetY, deltaX, deltaY, --numSteps);
            }, 1000 / FPS);
        }
        else {
            g_worldmap.animating = false;
            window.setTimeout(handleBufferedKey, 1);
        }
    }
});


/* Main map manager class.  This class is a container for any number
 * of sub-maps; it's assumed that the default map is an 'overworld' or
 * main world map; it's initialized by the mapXml and tileset that
 * you pass in.  You can also call addSubMap to add additional sub-maps.*/
var WorldMap = Class.extend({
    _init: function(mapXml, tileset) {
        this._subMapList = [];
        this._currentSubMap = 0;
        this._scrollX = 0;
        this._scrollY = 0;

        var mainMap = new SubMap(mapXml, tileset, true);
        this._subMapList.push(mainMap); // main map is id = 0

        // Are we busy with animations?
        this.animating = false;
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
    
    isOverWorld: function() {
        return this._subMapList[this._currentSubMap].isOverWorld();
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
    
    // Returns true if the given point (world coordinates) is occupied
    // by another character.
    isOccupied: function(x, y) {
        return this._subMapList[this._currentSubMap].isOccupied(x, y);
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
        
        // includes one less / one more for benefit of scrolling animation
        return (screenX >= -1 && screenX <= TILES_ON_SCREEN_X
                && screenY >= -1 && screenY <= TILES_ON_SCREEN_Y);
    },

    // Scrolls screen if this is too close to the edge and it's
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
        
        var xLimit = this.getXLimit();
        var yLimit = this.getYLimit();
        
        // Make sure we aren't moving off edge of map
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
    
    /* This function does the scrolling animation */
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
        var oldMap = this._subMapList[this._currentSubMap];
        oldMap.onExit();
        this._currentSubMap = mapId;
        sprite.enterNewSubMap(mapId, x, y, dir);
        this.goTo(scrollX, scrollY);
        var newMap = this._subMapList[mapId];
        newMap.onEnter();
        sprite.plot();
    },
    
    goTo: function(scrollX, scrollY) {
        this._scrollX = scrollX;
        this._scrollY = scrollY;
        this.redraw();
    },
    
    // Run when action key is hit
    doAction: function() {
        this._subMapList[this._currentSubMap].doAction();
    },
    
    // Polls and runs callback after animation is complete.
    runAfterAnimation: function(callback) {
        if (!this.animating)
            callback();
        else {
            var worldmap = this;
            window.setTimeout(function() {
                worldmap.runAfterAnimation(callback);
            }, 1);
        }
    }
});

var FACING_UP = 0;
var FACING_RIGHT = 1;
var FACING_DOWN = 2;
var FACING_LEFT = 3;

/* Class representing an object that can move around the map, such
 * as a player character. Sprite objects are drawn superimposed on
 * the map using a separate canvas with z-index=1 and absolute
 * positioning (these CSS styles are defined in rpgdemo.css) */
var Sprite = Class.extend({
   _init: function(x, y, img, subMapId, dir) {
        this._x = x;
        this._y = y;
        this._dir = dir;
        this._subMap = subMapId;
        this._img = img;

        // Are we currently walking?
        this._walking = false;

        // Have we just entered a new area? (Prevent enter chaining.)
        this._entered = false;
    },
    
    getDir: function() {
        return this._dir;
    },
    
    isAt: function(x, y) {
        return this._x == x && this._y == y;
    },
    
    /* Get coordinates the sprite is facing */
    getFacingCoords: function() {
        var x = this._x;
        var y = this._y
        switch(this._dir) {
            case FACING_UP:
                y--;
                break;
            case FACING_DOWN:
                y++;
                break;
            case FACING_LEFT:
                x--;
                break;
            case FACING_RIGHT:
                x++;
                break;
        }
        return [ x, y ];
    },
    
    /* Faces the direction *opposite* the one passed in */
    faceOpposite: function(dir) {
        switch(dir) {
            case FACING_UP:
                this._dir = FACING_DOWN;
                break;
            case FACING_DOWN:
                this._dir = FACING_UP;
                break;
            case FACING_LEFT:
                this._dir = FACING_RIGHT;
                break;
            case FACING_RIGHT:
                this._dir = FACING_LEFT;
                break;
        }
        this.clear();
        this.plot();
    },

    /* Draws the sprite onto the map (unless its position is offscreen,
     * or on a different map):*/
    plot: function(sourceOffsetX, destOffsetX, destOffsetY) {
        if (g_worldmap.getCurrentSubMapId() != this._subMap) {
            return;
        }
        if (!g_worldmap.isOnScreen(this._x, this._y)) {
            return;
        }
        
        var sw = SPRITE_WIDTH;
        var sh = SPRITE_HEIGHT;
        var dsw = SPRITE_WIDTH;
        var dsh = SPRITE_HEIGHT;
        
        // If overworld map, clamp sprite height to tile height
        var map = g_worldmap.getSubMap(this._subMap);
        if (map.isOverWorld()) {
            dsw = Math.ceil(TILE_WIDTH * TILE_HEIGHT / SPRITE_HEIGHT);
            dsh = TILE_HEIGHT;
        }

        var screenCoords = g_worldmap.transform(this._x, this._y);
        var dx = screenCoords[0];
        var dy = screenCoords[1];
        
        // Adjust for difference between tile and sprite sizes
        dx += Math.floor((TILE_WIDTH - dsw) / 2); // center for x
        dy += TILE_HEIGHT - dsh;     // upward for y
        
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
        if (this._walking && destOffsetX === undefined && destOffsetY === undefined)
            return;
        
        // alert("sx: " + sx + " sy: " + sy + " dx: " + dx + " dy: " + dy);
        
        // draw the sprite!
        spriteCtx.drawImage(this._img, sx, sy, sw, sh, dx, dy, dsw, dsh);
        
        if (this != g_player && !map.isOverWorld() && !g_worldmap.animating) {
            
            // if player sprite below current location, replot it.
            if(g_player.isAt(this._x, this._y + 1));
                g_player.plot();
        }
    },

    // clears sprite canvas of this sprite
    clear: function(destOffsetX, destOffsetY) {        
        var screenCoords = g_worldmap.transform(this._x, this._y);
        var dx = screenCoords[0];
        var dy = screenCoords[1];
        var dsw = SPRITE_WIDTH;
        var dsh = SPRITE_HEIGHT;
        
        // If overworld map, clamp sprite height to tile height
        var map = g_worldmap.getSubMap(this._subMap);
        if (map.isOverWorld()) {
            dsw = Math.ceil(TILE_WIDTH * TILE_HEIGHT / SPRITE_HEIGHT);
            dsh = TILE_HEIGHT;
        }
        
        // Adjust for difference between tile and sprite sizes
        dx += Math.floor((TILE_WIDTH - dsw) / 2); // center for x
        dy += TILE_HEIGHT - dsh;                  // upward for y
            
        // apply destOffsetX and destOffsetY if available
        if (destOffsetX != undefined)
            dx += destOffsetX;
        if (destOffsetY != undefined)
            dy += destOffsetY;
                
        spriteCtx.clearRect(dx, dy, dsw, dsh);
        
        if (!map.isOverWorld() && this == g_player) {
                    
            // if sprite above previous location, replot it.
            var deltaX = 0;
            if (destOffsetX != undefined) {
                if (destOffsetX > 0)
                    deltaX = 1;
                else if (destOffsetX < 0)
                    deltaX = -1;
            }
            var deltaY = 0;
            if (destOffsetY != undefined) {
                if (destOffsetY > 0)
                    deltaY = 1;
                else if (destOffsetY < 0)
                    deltaY = -1;
            } 
            var spriteAbove = map.getSpriteAt(this._x + deltaX, this._y + deltaY - 1);
            if (spriteAbove != null)
                spriteAbove.plot();
        }
    },

    /* Sprite will attempt to move by deltaX in the east-west dimension
     * and deltaY in the north-south dimension.  Returns true if success
     * and false if blocked somehow. */
    move: function( deltaX, deltaY, dir ) {
        
        this._dir = dir;
        
        var newX = this._x + deltaX;
        var newY = this._y + deltaY;
        
        // Make sure you're not walking off edge of the world and
        // the square we're trying to enter is passable and not occupied:
        if (!g_worldmap.pointInBounds(newX, newY) ||
                !g_worldmap.isPassable(newX, newY) ||
                g_worldmap.isOccupied(newX, newY)) {
            if (!g_worldmap.animating) {
                this.clear();
                this.plot();
            }
            return false;
        }
            
        this.clear();
        this._x += deltaX;
        this._y += deltaY;

        if (this == g_player) {
            var scrolling = g_worldmap.autoScrollToPlayer( this._x, this._y );
            if (scrolling)
                this.scrollAnimation();
            else
                this.walkAnimation(deltaX, deltaY);
                

            // Any effects of stepping on the new square:
            this._entered = false;
            var sprite = this;
            g_worldmap.runAfterAnimation(function() {
                if (!sprite._entered)
                    sprite.getSquareUnderfoot().onEnter();
                sprite._entered = true;
            });
        }
        
        return true;
    },

    // Changes the info when the sprite enters a new submap
    enterNewSubMap: function(subMapId, x, y, dir) {
        this._x = x;
        this._y = y;
        this._dir = dir;
        this._subMap = subMapId;
    },

    // Returns the map square the sprite is standing on.
    getSquareUnderfoot: function() {
        return g_worldmap.getSquareAt(this._x, this._y);
    },
    
    action: function() {
        // What happens when this sprite is acted on?
    },
    
    /* Show sprite as walking as background scrolls */
    scrollAnimation: function() {
        if (g_worldmap.animating) {
            this.scrollAnimationSub(0);
        }
    },
    
    /* Recursive part of sprite.scrollAnimation */
    scrollAnimationSub: function(animStage) {
        if (g_worldmap.animating && !g_battle) {
            
            // Determine source offset in sprite image based on animation stage.
            var sourceOffsetX = 0;
            if (animStage == 1)
                sourceOffsetX = -SPRITE_WIDTH;
            else if (animStage == 3)
                sourceOffsetX = SPRITE_WIDTH;
            this.plot(sourceOffsetX);
            
            var sprite = this;
            window.setTimeout(function() {
                sprite.scrollAnimationSub((animStage + 1) % 4);
            }, 1000 / FPS);
        } else if (!g_battle) {
            this.clear();
            this.plot();
        }
    },
    
    /* Shows the sprite walking from one square to another */
    walkAnimation: function(deltaX, deltaY) {
        if (g_worldmap.animating) {
            var sprite = this;
            window.setTimeout(function() {
                sprite.walkAnimationPoll(deltaX, deltaY);
            }, 1000 / FPS);
        } else if (!g_battle) {
            g_worldmap.animating = true;
            this._walking = true;
            var numSteps =  ((deltaY != 0) ? TILE_HEIGHT : TILE_WIDTH) / SCROLL_FACTOR;
            var destOffsetX = -deltaX * TILE_WIDTH;
            var destOffsetY = -deltaY * TILE_HEIGHT;
            this.walkAnimationSub(0, deltaX, deltaY, destOffsetX, destOffsetY, numSteps);
        }
    },
    
    // Polls until we can start walk animation
    walkAnimationPoll: function(deltaX, deltaY) {
        if (g_worldmap.animating) {
            var sprite = this;
            window.setTimeout(function() {
                sprite.walkAnimationPoll(deltaX, deltaY);
            }, 1000 / FPS);
        } else
            this.walkAnimation(deltaX, deltaY);
    },
    
    /* Recursive part of sprite.walkAnimation */
    walkAnimationSub: function(animStage, deltaX, deltaY, destOffsetX, destOffsetY, numSteps) {
        if (numSteps > 1 && !g_battle) {
            this.clear(destOffsetX, destOffsetY);
            
            // Determine source offset in sprite image based on animation stage.
            var sourceOffsetX = 0;
            if (animStage == 1)
                sourceOffsetX = -SPRITE_WIDTH;
            else if (animStage == 3)
                sourceOffsetX = SPRITE_WIDTH;
    
            destOffsetX += deltaX * SCROLL_FACTOR;
            destOffsetY += deltaY * SCROLL_FACTOR;
            this.plot(sourceOffsetX, destOffsetX, destOffsetY);
            
            var sprite = this;
            window.setTimeout(function() {
                sprite.walkAnimationSub((animStage + 1) % 4, deltaX, deltaY, destOffsetX, destOffsetY, --numSteps);
            }, 1000 / FPS);
        } else {
            g_worldmap.animating = false;
            this._walking = false;
            if (!g_battle) {
                this.clear(destOffsetX, destOffsetY); // clear last image drawn
                this.plot();
                window.setTimeout(handleBufferedKey, 1);
            }
        }
    }
});

/* Class representing a main character that can fight in battles,
 * carry things, move independently, etc. */
var Player = Sprite.extend({
    _init: function(x, y, img, subMapId, dir) {
        this._super(x, y, img, subMapId, dir);
        this._exp = 0;
        this._gold = 0;
        this._level = 1;
        this._maxHP = 10;
        this._maxMP = 5;
        this._hp = 10;
        this._mp = 5;
        this._attack = 2;
        this._defense = 1;
        this._levels = [ 5, 11, 20, 31, 44, 60, 82, 112, 156, 198,
            256, 325, 425, 560, 775, 1000, 1300, 1700, 2300, 3100,
            4400, 6000, 8200, 11200, 15600, 19800, 25600, 32500, 42500, 56000
        ];
    },
    
    getExp: function() {
        return this._exp;
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
        return this._attack;
    },
    
    getDefense: function() {
        return this._defense;
    },
    
    isDead: function() {
        return this._hp <= 0;
    },
    
    damage: function(dmg) {
        this._hp -= dmg;
    },
    
    heal: function(amt) {
        this._hp += dmg;
        if (this._hp > this._maxHP)
            this._hp = this._maxHP;
    },
    
    restore: function() {
        this._hp = this._maxHP;
        this._mp = this._maxMP;
    },
    
    earnExp: function(amt) {
        this._exp += amt;
        if (this._level < 30 && this._exp >= this._levels[this._level]) {
            this._level++;
            this._attack += Math.ceil(this._level / 4);
            this._defense += Math.ceil(this._level / 5);
            this._maxHP += this._level;
            this._maxMP += Math.ceil(this._level / 2);
            return true;
        }
        return false;
    },
    
    earnGold: function(amt) {
        this._gold += amt;
    }
});


/* Class representing a tileset image 
 * width: width of the image
 * height: height of the image
 * url: url of the image
 * img: Image object in javascript. */
var Tileset = Class.extend({
    _init: function(width, height, url, img) {
        this._width = width;
        this._height = height;
        this._url = url;
        this._img = img;
        
    },
    
    /* draws a single layer for a single tile on the map canvas */
    drawClip: function(gid, scrollX, scrollY, offsetX, offsetY) {
        var gid = parseInt(gid);
        gid--; //tmx is 1-based, not 0-based.  We need to subtract 1 to get to a proper mapping.

        var tw = TILE_WIDTH;
        var th = TILE_HEIGHT;
        
        // # of tiles per row in tileset image
        var perRow = this._width / tw;

        // x and y in tileset image from where to copy
        var sx = (gid % perRow) * tw;
        var sy = Math.floor(gid / perRow) * th;
        
        // x and y in canvas to copy to.
        var dx = scrollX * tw + offsetX;
        var dy = scrollY * th + offsetY;
        
        // alert("sx: " + sx + " sy: " + sy + " dx: " + dx + " dy: " + dy);

        mapCtx.drawImage(this._img, sx, sy, tw, th, dx, dy, tw, th);
    }   
});

/* Class representing text display */
var TextDisplay = Class.extend({
    _init: function() {
        this._textDisplayed = false;
    },
    
    textDisplayed: function() {
        return this._textDisplayed;
    },
    
    displayText: function(txt) {
        
        textCtx.fillStyle = "rgba(0, 0, 200, 0.25)";
        textCtx.fillRect(0, 236, textCanvas.width, 100);
        textCtx.fillStyle = "white";
        textCtx.font = "bold 16px monospace";
        textCtx.textBaseline = "top";
        textCtx.fillText(txt, 10, 246);
        this._textDisplayed = true;
    },
    
    clearText: function() {
        textCtx.clearRect(0, 236, textCanvas.width, 100);
        this._textDisplayed = false;
    }
});

var MENU_ATTACK = 0;
var MENU_DEFEND = 1;
var MENU_SPELL = 2;
var MENU_ITEM = 3;

/* Class representing a battle */
var Battle = Class.extend({
    _init: function() {
        var len = g_monsterData.monsters.length;
        var i = Math.floor(Math.random() * len);
        this._monster = g_monsterData.monsters[i];
        this._monsterHP = this._monster.hp;
        this._currentItem = MENU_ATTACK;
        this._over = false;
        this._line = 0;
        this._txt = "";
        
        var screenHeight = mapCanvas.height;
        this._lineHeight = [
            screenHeight - 130, 
            screenHeight - 100, 
            screenHeight - 70, 
            screenHeight - 40
        ];
        this._textHeight = [
            screenHeight - 132, 
            screenHeight - 110, 
            screenHeight - 86, 
            screenHeight - 62,
            screenHeight - 38
        ];
    },
    
    draw: function() {
        var screenWidth = mapCanvas.width;
        var screenHeight = mapCanvas.height;

        // Change this to background pic later
        mapCtx.fillStyle = "#0080ff";
        mapCtx.fillRect(0, 0, screenWidth, screenHeight);

        spriteCtx.clearRect(0, 0, screenWidth, screenHeight);
        spriteCtx.drawImage(g_player._img,
            SPRITE_WIDTH,                      // source x
            FACING_LEFT * SPRITE_HEIGHT,       // source y
            SPRITE_WIDTH,                      // source width
            SPRITE_HEIGHT,                     // source height
            screenWidth - 2 * TILE_WIDTH,      // dest x
            2 * TILE_HEIGHT,                   // dest y
            SPRITE_WIDTH,                      // dest width
            SPRITE_HEIGHT);                    // dest height

        var monster = this._monster;
        spriteCtx.drawImage(g_enemies,
            monster.left,
            monster.top,
            monster.width,
            monster.height,
            2 * TILE_WIDTH,
            3 * TILE_HEIGHT,
            monster.width,
            monster.height);

        spriteCtx.drawImage(g_box, 0, 0, 200, 200, 0, screenHeight - 150, 150, 150);
        spriteCtx.drawImage(g_box, 0, 0, 100, 200, 140, screenHeight - 150, 75, 150);
        spriteCtx.drawImage(g_box, 50, 0, 100, 200, 215, screenHeight - 150, screenWidth - 290, 150);
        spriteCtx.drawImage(g_box, 100, 0, 100, 200, screenWidth - 75, screenHeight - 150, 75, 150);

        textCtx.font = "bold 20px monospace";
        textCtx.fillStyle = "white";
        textCtx.textBaseline = "top";
        textCtx.fillText("Attack", 36, this._lineHeight[0]);
        textCtx.fillText("Defend", 36, this._lineHeight[1]);
        textCtx.fillText("Spell", 36, this._lineHeight[2]);
        textCtx.fillText("Item", 36, this._lineHeight[3]);

        textCtx.font = "bold 16px sans-serif";
        var txt = "A " + monster.name + " appeared!";
        textCtx.fillText(txt, 160, this._textHeight[0]);
        this._line = 1;
        this._txt = txt;
        
        this.drawArrow();
    },
    
    writeMsg: function(msg) {
        textCtx.font = "bold 16px sans-serif";
        textCtx.fillStyle = "white";
        textCtx.textBaseline = "top";
        if (this._line <= 4)
            textCtx.fillText(msg, 160, this._textHeight[this._line]);
        else {
            textCtx.clearRect(160,
                this._textHeight[0],
                textCanvas.width - 160,
                textCanvas.height - this._textHeight[0]);
            var prevText = this._txt.split("\n");
            for (var i = 0; i < 4; ++i) {
                var lineText = prevText[prevText.length - 4 + i];
                textCtx.fillText(lineText, 160, this._textHeight[i]);
            }
            textCtx.fillText(msg, 160, this._textHeight[4]);
        }
        this._txt += "\n" + msg;
        this._line++;
    },
    
    end: function() {
        spriteCtx.clearRect(0, 0, spriteCanvas.width, spriteCanvas.height);
        textCtx.clearRect(0, 0, textCanvas.width, textCanvas.height);
        g_worldmap.redraw();
        g_player.plot();
        g_battle = null;
    },
    
    drawArrow: function() {
        var arrowChar = "\u25ba";
        textCtx.font = "bold 20px monospace";
        textCtx.fillStyle = "white";
        textCtx.textBaseline = "top";
        var drawHeight = this._lineHeight[this._currentItem];        
        textCtx.fillText(arrowChar, 20, drawHeight);
    },
    
    clearArrow: function() {
        var drawHeight = this._lineHeight[this._currentItem];
        textCtx.clearRect(20, drawHeight, 15, 20);
    },
    
    handleInput: function(key) {
        if (!this._over && !g_player.isDead()) {
            this.clearArrow();
            switch(key) {
                case DOWN_ARROW:
                    this._currentItem = (this._currentItem + 1) % 4;
                    break;
                case UP_ARROW:
                    this._currentItem = this._currentItem - 1;
                    if (this._currentItem < 0)
                        this._currentItem = this._currentItem + 4;
                    break;
            }
            this.drawArrow();
        }
    },
    
    handleEnter: function() {
        if (!g_player.isDead()) {
            if (this._over)
                this.end();
            else {
                var defending = false;
                switch(this._currentItem) {
                    case MENU_ATTACK:
                        this.attack();
                        break;
                    case MENU_DEFEND:
                        this.writeMsg("You defended.");
                        defending = true;
                        break;
                    case MENU_SPELL:
                        this.writeMsg("You used a spell.");
                        break;
                    case MENU_ITEM:
                        this.writeMsg("You used an item.");
                        break;
                }
                if (!this._over)
                    this.monsterTurn(defending);
            }
        }
    },
    
    attack: function() {
        var damage = g_player.getAttack() - this._monster.defense;
        if (damage < 1)
            damage = 1;
        var rand = Math.floor(Math.random() * damage / 2);
        damage -= rand;
        this.writeMsg("You attacked for " + damage + " damage.");
        this._monsterHP -= damage;
        if (this._monsterHP <= 0) {
            this.writeMsg("The " + this._monster.name + " was killed.");
            g_player.earnGold(this._monster.gold);
            var gainedLevel = g_player.earnExp(this._monster.exp);
            this.writeMsg("You have earned " + this._monster.exp + " exp");
            this.writeMsg("and " + this._monster.gold + " GP.");
            if (gainedLevel)
                this.writeMsg("You gained a level!");
            this._over = true;
            this.clearArrow();
        }
    },
    
    monsterTurn: function(defending) {
        this.writeMsg("The " + this._monster.name + " attacked for");
        var damage = this._monster.attack - g_player.getDefense();
        if (defending)
            damage = Math.floor(damage / 2.5);
        if (damage < 1)
            damage = 1;
        var rand = Math.floor(Math.random() * damage / 2);
        damage -= rand;
        this.writeMsg(damage + " damage.");
        g_player.damage(damage);
        if (g_player.isDead()) {
            this.writeMsg("You died.");
            this._over = true;
            this.clearArrow();
        }
    }
});

/* Globals */

// 3 Canvases and counting
var mapCanvas = document.getElementById("map");
var mapCtx = mapCanvas.getContext("2d");
var spriteCanvas = document.getElementById("sprites");
var spriteCtx = spriteCanvas.getContext("2d");
var textCanvas = document.getElementById("textCanvas");
var textCtx = textCanvas.getContext("2d");

var g_player = null;
var g_worldmap = null;
var g_enemies = null;
var g_box = null;
var g_textDisplay = new TextDisplay();
var g_battle = null;

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
    var url = "images/World3.png"; // url of worlmap's tileset
    var img = new Image();
    var worldTileset = new Tileset(256, 1152, url, img);
    img.src = url;
    img.onload = function() {
        loadXml("WorldMap1.tmx.xml", function(mapXml) {
            g_worldmap = new WorldMap(mapXml, worldTileset);
            var img = new Image();
            g_player = new Player(23, 13, img, 0, FACING_DOWN);
            g_worldmap.goTo(17, 8);
            img.onload = function() {
                g_player.plot();
            };
            
            // src set must be after onload function set due to bug in IE9b1
            img.src = "images/Trevor.png";
            
            for (var x = 0; x < g_worldmap.getXLimit(); ++x)
                for (var y = 0; y < g_worldmap.getYLimit(); ++y) {
                    var square = g_worldmap.getSquareAt(x, y);
                    if (square.passable())
                        square.onEnter = function() {
                            if (Math.random() < BATTLE_FREQ) {
                                keyBuffer = 0;
                                g_battle = new Battle();
                                g_battle.draw();
                            }
                        };
                }

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
    
    g_enemies = new Image();
    g_enemies.src = "images/enemies-t.png";
    g_box = new Image();
    g_box.src = "images/box-highres.png";
});

/* Castle submap setup code */
function setupCastleMap(mapXml, tileset) {
    var map = new SubMap(mapXml, tileset, false);
    var mapId = g_worldmap.addSubMap(map);
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
    g_worldmap.getSubMap(0).getSquareAt(23, 14).onEnter = function() {
        g_worldmap.goToMap(g_player, mapId, 12, 18, 6, 9, FACING_UP);
        g_player.restore();
    };
    var img = new Image();
    var soldier1 = new Sprite(10, 14, img, mapId, FACING_DOWN);
    img.src = "images/Soldier2.png";
    soldier1.action = function() {
        g_textDisplay.displayText("You cannot enter the castle yet.");
    };
    map.addSprite(soldier1);
    var soldier2 = new Sprite(14, 14, img, mapId, FACING_DOWN);
    soldier2.action = function() {
        g_textDisplay.displayText("The interior is under construction.");
    };
    map.addSprite(soldier2);
}

/* Input Handling */
var DOWN_ARROW = 40;
var UP_ARROW = 38;
var LEFT_ARROW = 37;
var RIGHT_ARROW = 39;
var SPACEBAR = 32;
var ENTER = 13;
var keyBuffer = 0;

function handleKeyPress(event) {
    if (g_worldmap && g_player) {
        if (!event.ctrlKey && !event.altKey && !event.metaKey) {
            var key = event.keyCode ? event.keyCode : event.charCode ? event.charCode : 0;
            if (g_worldmap.animating)
                keyBuffer = key;
            switch (key) {
                case DOWN_ARROW:
                    if (g_battle)
                        g_battle.handleInput(key);
                    else if (!g_worldmap.animating)
                        g_player.move(0, 1, FACING_DOWN);
                    event.preventDefault();
                    break;
                case UP_ARROW:
                    if (g_battle)
                        g_battle.handleInput(key);
                    else if (!g_worldmap.animating)
                        g_player.move(0, -1, FACING_UP);
                    event.preventDefault();
                    break;
                case RIGHT_ARROW:
                    if (g_battle)
                        g_battle.handleInput(key);
                    else if (!g_worldmap.animating)
                        g_player.move(1, 0, FACING_RIGHT);
                    event.preventDefault();
                    break;
                case LEFT_ARROW:
                    if (g_battle)
                        g_battle.handleInput(key);
                    else if (!g_worldmap.animating)
                        g_player.move(-1, 0, FACING_LEFT);
                    event.preventDefault();
                    break;
                case SPACEBAR:
                case ENTER:
                    if (g_battle) {
                        g_battle.handleEnter();
                    }
                    else if (!g_worldmap.animating) {
                        if (g_textDisplay.textDisplayed())
                            g_textDisplay.clearText();
                        else
                            g_worldmap.doAction();
                    }
                    event.preventDefault();
                    break;
            }
        }
    }
}

function handleBufferedKey() {
    if (keyBuffer && !g_battle) {
        var key = keyBuffer;
        keyBuffer = 0;
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
            case SPACEBAR:
            case ENTER:
                if (g_textDisplay.textDisplayed())
                    g_textDisplay.clearText();
                else
                    g_worldmap.doAction();
                break;
        }
    }
}

if (window.opera || $.browser.mozilla)
    $(window).keypress(handleKeyPress);
else
    $(window).keydown(handleKeyPress);

var g_monsterData = { "monsters" : [ {
        "name": "slime",
        "hp": 3,
        "attack": 1,
        "defense": 0,
        "exp": 1,
        "gold": 1,
        "left": 4,
        "top": 109,
        "width": 31,
        "height": 24
    }, {
        "name": "rat",
        "hp": 5,
        "attack": 2,
        "defense": 0,
        "exp": 2,
        "gold": 1,
        "left": 7,
        "top": 498,
        "width": 63,
        "height": 55
    }, {
        "name": "snake",
        "hp": 6,
        "attack": 2,
        "defense": 1,
        "exp": 2,
        "gold": 2,
        "left": 7,
        "top": 160,
        "width": 48,
        "height": 59
    }
]}; 