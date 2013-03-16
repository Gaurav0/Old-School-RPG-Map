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
 

/* Class representing a tileset image 
 * width: width of the image
 * height: height of the image
 * url: url of the image
 * img: Image object in javascript. */
var Tileset = Class.extend({
    _init: function(width, height, imgRef) {
        this._width = width;
        this._height = height;
        this._url = g_imageData.images[imgRef].url;
        this._img = g_imageData.images[imgRef].img;
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