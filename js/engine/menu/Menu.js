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
 

/* Class for a menu */
var Menu = AbstractMenu.extend({
    _init: function(args) {
        this._super(args);
        this._current = 0;
        this._pointer = false;
        this._pointerLeft = args.pointerLeft;
        this._flags = args.flags;
        this._callbacks = args.callbacks;
        this._canESC = args.canESC;
        this._onFlag = args.onFlag ? args.onFlag : function() {};
    },
    
    /* Draw the pointer at the current selection */
    drawPointer: function() {

        // Get the height at which the pointer should be
        var drawHeight = this._heights[this._current % this._num];

        // Draw pointer image
        var img = g_imageData.images["pointer"].img;
        textCtx.drawImage(img, this._pointerLeft, drawHeight + 2);
        
        this._pointer = true;
    },
    
    /* Clear the pointer at the current selection */
    clearPointer: function() {

        // Get the height at which the pointer should be
        var drawHeight = this._heights[this._current % this._num];
        
        // Size of pointer image is 16, 11
        textCtx.clearRect(this._pointerLeft, drawHeight + 2, 16, 11);
        
        this._pointer = false;
    },
    
    /* Override this to draw text differently */
    drawText: function() {
        for (var i = 0; i < this._num; ++i) {
        
            // Determine if text should be selectable
            textCtx.fillStyle = this._flags ? (this._flags[i] ? "gray" : "white") : "white";
            
            // Draw the text
            textCtx.fillText(this._texts[i], this._textLeft, this._heights[i]);
        }
    },
    
    /* Handle Arrow Key Input */
    handleKey: function(key) {
        if (this._displayed) {
            this.clearPointer();
            switch(key) {
                case DOWN_ARROW:
                case RIGHT_ARROW:
                    this._current++;
                    this._current %= this._num;
                    break;
                case UP_ARROW:
                case LEFT_ARROW:
                    this._current--;
                    if (this._current < 0)
                        this._current += this._num;
                    break;
            }
            this.drawPointer();
        }
    },
    
    /* Handle Enter Key Input: Call appropriate callback */
    handleEnter: function() {
        if (this._displayed) {
            if (this._flags && this._flags[this._current]) {
                // not useable
                this._onFlag();
            } else if (this._num > 0) {
                this._beforeCallback();                
                this._callbacks[this._current]();
                this._afterCallback();
            } else {
                this.handleESC();
            }
        }
    },
    
    /* For subclasses that would prefer a single callback function
     * Expects there to exist a function callback, taking a single
     * argument, the index of the currently selected option from the
     * menu. */
    createCallbacks: function(num) {
        var callbacks = [];
        var menu = this;
        for (var i = 0; i < num; ++i)
            callbacks[i] = (function(i) {
                return function() {
                    menu.callback(i);
                };
            })(i);
        return callbacks;
    }
});