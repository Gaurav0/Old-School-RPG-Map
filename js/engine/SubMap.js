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
 *   David Leonard <sephirothcloud1025@yahoo.com>
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
        this._animation = new Animation();
        
        // Create mapSquares table used to cache passable / zone info.
        var waterTiles = null;
        if ($(mapXml).find('layer[name="Water"]').length > 0)
            waterTiles = $(mapXml).find('layer[name="Water"]').find('tile');
        var baseTiles = $(mapXml).find('layer[name="Base"]').find('tile');
        var impassableTiles = $(mapXml).find('layer[name="Impassable"]').find('tile');
        var zoneTiles = $(mapXml).find('layer[name="Zones"]');
        if (zoneTiles.length > 0)
            zoneTiles = zoneTiles.find('tile');
        for (var y = 0; y < this._yLimit; y++) {
            var mapSquareRow = [];
            for (var x = 0; x < this._xLimit; x++) {
                var idx = y * this._xLimit + x;
                
                // passable if base layer has water tile or Impassable layer has any tile
                var passable = true;
                if (waterTiles != null)
                    passable = passable && (parseInt(waterTiles.eq(idx).attr('gid')) == 0);
                passable = passable && (parseInt(impassableTiles.eq(idx).attr('gid')) == 0);
                
                // zone tiles
                var zone = 0;
                if (zoneTiles.length > 0) {
                    zone = parseInt(zoneTiles.eq(idx).attr('gid'));
                    if (zone > 0)
                        zone -= 288;
                }
                
                var square = new MapSquare(this, x, y, passable, zone);
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

    getTileset: function() {
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
    
    /* Add a sprite to the submap. */
    addSprite: function(sprite) {
        this._spriteList.push(sprite);
        return this._spriteList.length - 1;
    },
    
    /* Remove a sprite from the submap */
    removeSprite: function(sprite) {
        var index;
        for (var i = 0; i < this._spriteList.length; ++i) {
            if (this._spriteList[i] == sprite)
                index = i;
        }
        this._spriteList.splice(index, 1);
    },
    
    /* True if the submap contains the sprite */
    hasSprite: function(sprite) {
        for (var i = 0; i < this._spriteList.length; ++i) {
            if (this._spriteList[i] == sprite)
                return true;
        }
        return false;
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
    
    onEnter: function() {
        // What happens when map is entered?
    },
    
    onExit: function() {
        // What happens when map is exited?
    },
    
    /* Draws all the sprites on the map */
    drawSprites: function() {
        for (var i = 0; i < this._spriteList.length; ++i) {
            var sprite = this._spriteList[i];
            sprite.plot();
            if (sprite instanceof Character && sprite.doesWalk())
                sprite.startWalking();
        }
    },
    
    /* Clear all the sprites on the map */
    clearSprites: function() {
        for (var i = 0; i < this._spriteList.length; ++i) {
            var sprite = this._spriteList[i];
            sprite.clear();
            if (sprite instanceof Character && sprite.doesWalk())
                sprite.stopWalking();
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
        
        $(this._mapXml).find('map layer').each(function()
        {
            var visible = $(this).attr('visible');
            if (visible != "0") {
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
            }
        });
    },
    
    /* This function does the scrolling animation */
    animate: function(fromX, fromY, toX, toY) {
        g_worldmap.startAnimating();
        g_worldmap.startScrolling();
        this._prevOffsetX = deltaX * TILE_WIDTH;
        this._prevOffsetY = deltaY * TILE_HEIGHT;
        var deltaX = toX - fromX;
        var deltaY = toY - fromY;
        var numSteps = ((deltaY != 0) ? TILE_HEIGHT: TILE_WIDTH ) / SCROLL_FACTOR;
        var submap = this;
        submap.animateSub(fromX, fromY, 0, 0, deltaX, deltaY, numSteps);
    },
    
    // Recursive part of Submap.animate, the scrolling animation.
    animateSub: function(fromX, fromY, offsetX, offsetY, deltaX, deltaY, numSteps) {
        this._animation.update();
        
        // Don't redraw sprites the last time, or the plot will not be cleared.
        if (numSteps > 0) {
        
            for (var i = 0; i < this._spriteList.length; ++i) {
                var sprite = this._spriteList[i];
                if (sprite instanceof Character && (sprite.isWalking() || sprite.wasWalking())) {
                    sprite.clear(offsetX + deltaX * TILE_WIDTH + sprite._lastOffsetX,
                                 offsetY + deltaY * TILE_HEIGHT + sprite._lastOffsetY);
                    sprite.clear(offsetX + deltaX * TILE_WIDTH + sprite._destOffsetX,
                                 offsetY + deltaY * TILE_HEIGHT + sprite._destOffsetY);
                    if (!sprite.isWalking())
                        sprite._wasWalking = false;
                } else {
                    // this._x and this._y already changed, so offset by a tile size
                    sprite.clear(offsetX + deltaX * TILE_WIDTH,
                                 offsetY + deltaY * TILE_HEIGHT);
                }
            }
        
            this._prevOffsetX = offsetX + deltaX * TILE_WIDTH;
            this._prevOffsetY = offsetY + deltaY * TILE_HEIGHT;
            // offset map in opposite direction of scroll
            offsetX -= deltaX * SCROLL_FACTOR;
            offsetY -= deltaY * SCROLL_FACTOR;
            
            for (var i = 0; i < this._spriteList.length; ++i) {
                var sprite = this._spriteList[i];
                if (sprite instanceof Character && sprite.isWalking()) {
                    sprite.plot(sprite._sourceOffsetX, 0,
                        offsetX + deltaX * TILE_WIDTH + sprite._destOffsetX,
                        offsetY + deltaY * TILE_HEIGHT + sprite._destOffsetY);
                    sprite._wasWalking = true;
                } else {
                    sprite.plot(0, 0, offsetX + deltaX * TILE_WIDTH,
                                      offsetY + deltaY * TILE_HEIGHT);
                }
            }
            
            // Save last offsets for later
            this._lastOffsetX = offsetX + deltaX * TILE_WIDTH;
            this._lastOffsetY = offsetY + deltaY * TILE_HEIGHT;
        } else if (sprite instanceof Character && (sprite.isWalking() || sprite.wasWalking())) {
            sprite.clear(sprite._lastOffsetX, sprite._lastOffsetY);
            sprite.clear(sprite._destOffsetX, sprite._destOffsetY);
            sprite.plot(0, 0, sprite._destOffsetX, sprite._destOffsetY);
        }
        
        // Redraw submap *after* redrawing sprites to avoid shift illusion
        this.redraw(fromX, fromY, offsetX, offsetY);
        
        if (numSteps > 0) {
            var submap = this;
            window.setTimeout(function() {
                submap.animateSub(fromX, fromY, offsetX, offsetY, deltaX, deltaY, --numSteps);
            }, this._animation.getDelay());
        }
        else {
            g_worldmap.finishAnimating();
            g_worldmap.finishScrolling();
            this._lastOffsetX = undefined;
            this._lastOffsetY = undefined;
            handleBufferedKey();
        }
    }
});