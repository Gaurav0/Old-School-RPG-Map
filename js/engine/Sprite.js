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
 

/* Class representing an object that can move around the map, such
 * as a player character, or have multiple views and events, such as a
 * treasure chest. Sprite objects are drawn superimposed on
 * the map using a separate canvas with z-index=1 and absolute
 * positioning (these CSS styles are defined in rpgdemo.css) */
var Sprite = Class.extend({
    _init: function(x, y, width, height, imgRef, subMapId, sx, sy) {
        this._x = x;
        this._y = y;
        this._width = width;
        this._height = height;
        this._subMap = subMapId;
        this._img = g_imageData.images[imgRef].img;
        this._sx = (sx != undefined ? sx : 0);
        this._sy = (sy != undefined ? sy : 0);
    },
    
    getX: function() {
        return this._x;
    },
    
    getY: function() {
        return this._y;
    },
    
    getSubMap: function() {
        return this._subMap;
    },
    
    isAt: function(x, y) {
        return this._x == x && this._y == y;
    },
    
    /* Draws the sprite onto the map (unless its position is offscreen,
     * or on a different map): */
    plot: function(sourceOffsetX, sourceOffsetY, destOffsetX, destOffsetY) {
        if (g_worldmap.getCurrentSubMapId() != this._subMap) {
            return;
        }
        if (!g_worldmap.isOnScreen(this._x, this._y)) {
            return;
        }

        var sw = this._width;
        var sh = this._height;
        var dsw = this._width;
        var dsh = this._height;

        // If overworld map, clamp sprite height to tile height
        var map = g_worldmap.getSubMap(this._subMap);
        if (map.isOverWorld()) {
            dsw = Math.ceil(TILE_WIDTH * TILE_HEIGHT / SPRITE_HEIGHT);
            dsh = TILE_HEIGHT;
        }

        // get coordinates on screen to draw at
        var screenCoords = g_worldmap.transform(this._x, this._y);
        var dx = screenCoords[0];
        var dy = screenCoords[1];

        // Adjust for difference between tile and sprite sizes
        dx += Math.floor((TILE_WIDTH - dsw) / 2); // center for x
        dy += TILE_HEIGHT - dsh;                  // upward for y

        // apply sourceOffsetX and sourceOffsetY if available
        var sx = this._sx;
        if (sourceOffsetX != undefined)
            sx += sourceOffsetX;
        var sy = this._sy;
        if (sourceOffsetY != undefined)
            sy += sourceOffsetY;

        // apply destOffsetX and destOffsetY if available
        if (destOffsetX != undefined)
            dx += destOffsetX;
        if (destOffsetY != undefined)
            dy += destOffsetY;

        // draw the sprite!
        spriteCtx.drawImage(this._img, sx, sy, sw, sh, dx, dy, dsw, dsh);

        if (!map.isOverWorld()) {
            if (this == g_player) {
            
                // if another sprite below the player, replot it
                var sprite = map.getSpriteAt(this._x, this._y + 1);
                if (sprite != null) {
                    if (g_worldmap.isScrolling()) {
                        if (map._lastOffsetX != undefined)
                            sprite.plot(0, 0, map._lastOffsetX, map._lastOffsetY);
                    } else
                        sprite.plot();
                }
                
                // if another sprite below the player's previous location, replot it
                var sprite = map.getSpriteAt(this._prevX, this._prevY + 1);
                if (sprite != null) {
                    if (g_worldmap.isScrolling()) {
                        if (map._lastOffsetX != undefined)
                            sprite.plot(0, 0, map._lastOffsetX, map._lastOffsetY);
                        else
                            sprite.plot(0, 0, (this._x - this._prevX) * TILE_WIDTH,
                                              (this._y - this._prevY) * TILE_HEIGHT);
                    } else
                        sprite.plot();
                }
                    
            } else {

                // if player sprite below current location, replot it.
                if (g_player.isAt(this._x, this._y + 1))
                    g_player.plot();
            }
        }
    },

    // clears sprite canvas of this sprite
    clear: function(destOffsetX, destOffsetY) {
        if (g_worldmap.getCurrentSubMapId() != this._subMap) {
            return;
        }
        if (!g_worldmap.isOnScreen(this._x, this._y)) {
            return;
        }
        
        var screenCoords = g_worldmap.transform(this._x, this._y);
        var dx = screenCoords[0];
        var dy = screenCoords[1];
        var dsw = this._width;
        var dsh = this._height;
        
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
        
        if (!map.isOverWorld()) {
            if (this == g_player) {
                
                // if sprite above current location, replot it.
                var spriteAbove = map.getSpriteAt(this._x, this._y - 1);
                if (spriteAbove != null)
                    if (g_worldmap.isScrolling()) {
                        if (map._lastOffsetX !== undefined)
                            spriteAbove.plot(0, 0, map._lastOffsetX, map._lastOffsetY);
                    } else
                        spriteAbove.plot();

                // if sprite above or below previous location, replot it.
                var spriteAbove = map.getSpriteAt(this._prevX, this._prevY - 1);
                if (spriteAbove != null)
                    if (g_worldmap.isScrolling()) {
                        if (map._lastOffsetX !== undefined)
                            spriteAbove.plot(0, 0, map._lastOffsetX, map._lastOffsetY);
                    } else if (spriteAbove instanceof Character && spriteAbove.isWalking())
                        spriteAbove.plot(spriteAbove._destOffsetX, spriteAbove._destOffsetY);
                    else
                        spriteAbove.plot();
                var spriteBelow = map.getSpriteAt(this._prevX, this._prevY + 1);
                if (spriteBelow != null)
                    if (g_worldmap.isScrolling()) {
                        if (map._lastOffsetX != undefined)
                            spriteBelow.plot(0, 0, map._lastOffsetX, map._lastOffsetY);
                    } else if (spriteBelow instanceof Character && spriteBelow.isWalking())
                        spriteBelow.plot(spriteBelow._destOffsetX, spriteBelow._destOffsetY);
                    else
                        spriteBelow.plot();
                    
            } else if (!g_worldmap.isScrolling()) {

                // if player sprite above or below current location, replot it.
                if (g_player.isAt(this._x, this._y - 1))
                    g_player.plot();
                if (g_player.isAt(this._x, this._y + 1))
                    g_player.plot();
            }
        }
    },
    
    action: function() {
        // What happens when this sprite is acted on?
    }
});