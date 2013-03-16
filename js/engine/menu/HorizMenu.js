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
 
 
var HorizMenu = Menu.extend({
    _init: function(args) {
        this._super(args);
        this._lineTop = args.lineTop;
        this._textLefts = args.textLefts;
        this._pointerLefts = args.pointerLefts;
    },
    
    /* Draw the pointer at the current selection */
    drawPointer: function() {

        // Get the left at which the pointer should be
        var drawLeft = this._pointerLefts[this._current % this._num];

        // Draw pointer image
        var img = g_imageData.images["pointer"].img;
        textCtx.drawImage(img, drawLeft, this._lineTop + 2);
        
        this._pointer = true;
    },
    
    /* Clear the pointer at the current selection */
    clearPointer: function() {

        // Get the left at which the pointer should be
        var drawLeft = this._pointerLefts[this._current % this._num];
        
        // Size of pointer image is 16, 11
        textCtx.clearRect(drawLeft, this._lineTop + 2, 16, 11);
        
        this._pointer = false;
    },
    
    /* Override this to draw text differently */
    drawText: function() {
        for (var i = 0; i < this._num; ++i) {
        
            // Determine if text should be selectable
            textCtx.fillStyle = this._flags ? (this._flags[i] ? "gray" : "white") : "white";
            
            // Draw the text
            textCtx.fillText(this._texts[i], this._textLefts[i], this._lineTop);
        }
    }
});