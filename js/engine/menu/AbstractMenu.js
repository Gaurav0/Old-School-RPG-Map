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

/* Class for an abstract "menu" with no implementation */
var AbstractMenu = Class.extend({
    _init: function(args) {
        this._displayed = false;
        this._num = args.numberSelections;
        this._drawBox = args.drawBox;
        this._left = args.left;
        this._top = args.top;
        this._width = args.width;
        this._height = args.height;
        this._radius = args.radius;
        this._thickness = args.thickness;
        this._textLeft = args.textLeft;
        this._heights = args.heights;
        this._texts = args.texts;
        this._font = args.font;
        this._canESC = true;
        this._afterCallback = (args.afterCallback) ? args.afterCallback : function() {};
        this._beforeClear = (args.beforeClear) ? args.beforeClear : function() {};
        this._afterClear = (args.afterClear) ? args.afterClear : function() {};
    },
    
    /* Display the menu */
    display: function() {
        console.log("AbstractMenu.display");
        if (this._drawBox)
            drawBox(menuCtx, this._left, this._top, this._width, this._height, this._radius, this._thickness);
        
        /* Draw Text */
        textCtx.font = this._font;
        textCtx.textBaseline = "top";
        this.drawText();
        
        if (this._num > 0)
            this.drawPointer();
        
        this._displayed = true;
    },
    
    /* true if menu is currently being displayed */
    isDisplayed: function() {
        return this._displayed;
    },
    
    /* Completely clear the menu */
    clear: function() {
        if (this._drawBox)
            menuCtx.clearRect(this._left, this._top, this._width, this._height);
        
        textCtx.clearRect(this._left, this._top, this._width, this._height);
        
        this._displayed = false;
    },
    
    /* Override this to draw pointer */
    drawPointer: function() {
        // no implementation
    },
    
    /* Override this to clear pointer */
    clearPointer: function() {
        // no implementation
    },
    
    /* Override this to draw text differently */
    drawText: function() {
        for (var i = 0; i < this._num; ++i) {
            
            // Draw the text
            textCtx.fillText(this._texts[i], this._textLeft, this._heights[i]);
        }
    },
    
    /* Handle Arrow Key Input */
    handleKey: function(key) {
        // no implementation
    },
    
    /* Handle Enter Key Input */
    handleEnter: function() {
        this.handleESC();
        this._afterCallback();
    },
    
    /* Handle ESC Key Input */
    handleESC: function() {
        if (this._displayed)
            if (this._canESC) {
                this._beforeClear();
                this.clear();
                this._afterClear();
            }
    }
});