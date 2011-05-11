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
        this._subMapList[0] = mainMap;

        // Are we busy with animations?
        this._animating = false;
        
        // Are we scrolling?
        this._scrolling = false;
        
        // Function to run after animation
        this._runAfterAnimation = null;
    },

    getSubMap: function(id) {
        return this._subMapList[id];
    },

    getScrollX: function() {
        return this._scrollX;
    },

    getScrollY: function() {
        return this._scrollY;
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
     * Uses submap id provided as index. */
    addSubMap: function(subMapId, subMap) {
        this._subMapList[subMapId] = subMap;
    },

    /* Moves sprite to the submap identified by mapId at point x,y
     * and changes view to match. */
    goToMap: function(sprite, mapId, x, y, scrollX, scrollY, dir) {
        sprite.clear();
        var oldMap = this._subMapList[this._currentSubMap];
        oldMap.onExit();
        oldMap.clearSprites();
        this._currentSubMap = mapId;
        sprite.enterNewSubMap(mapId, x, y, dir);
        this.goTo(scrollX, scrollY);
        var newMap = this._subMapList[mapId];
        newMap.drawSprites();
        newMap.onEnter();
        sprite.plot();
    },
    
    // Moves map on screen to provided coordinates
    goTo: function(scrollX, scrollY) {
        this._scrollX = scrollX;
        this._scrollY = scrollY;
        this.redraw();
    },
    
    // Run when action key is hit
    doAction: function() {
        this._subMapList[this._currentSubMap].doAction();
    },
    
    // Draw all the sprites
    drawSprites: function() {
        this._subMapList[this._currentSubMap].drawSprites();
    },
    
    // Clear all the sprites
    clearSprites: function() {
        this._subMapList[this._currentSubMap].clearSprites();
    },
    
    isAnimating: function() {
        return this._animating;
    },
    
    startAnimating: function() {
        this._animating = true;
    },
    
    finishAnimating: function() {
        this._animating = false;
        if (this._runAfterAnimation) {
            this._runAfterAnimation();
            this._runAfterAnimation = null;
        }
    },
    
    isScrolling: function() {
        return this._scrolling;
    },
    
    startScrolling: function() {
        this._scrolling = true;
    },
    
    finishScrolling: function() {
        this._scrolling = false;
    },
    
    // Will run callback after animation is complete.
    runAfterAnimation: function(callback) {
        this._runAfterAnimation = callback;
    },
    
    createSaveData: function() {
        return {
            scrollX: this._scrollX,
            scrollY: this._scrollY
        };
    },

    loadSaveData: function(worldMapData) {
        this._scrollX = worldMapData.scrollX;
        this._scrollY = worldMapData.scrollY;
    }
});