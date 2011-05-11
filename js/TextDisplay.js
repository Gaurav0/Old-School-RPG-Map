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

/* Class representing text display */
var TextDisplay = Class.extend({
    _init: function() {
        this._textDisplayed = false;
        this._callback = null;
    },
    
    setCallback: function(callback) {
        this._callback = callback;
    },
    
    textDisplayed: function() {
        return this._textDisplayed;
    },
    
    displayText: function(txt) {
        
        textCtx.fillStyle = "rgba(0, 0, 100, 0.75)";
        textCtx.fillRect(0, 236, textCanvas.width, 100);
        textCtx.fillStyle = "white";
        textCtx.font = "bold 16px monospace";
        textCtx.textBaseline = "top";
        var txtArray = txt.split("\n");
        var i = 0
        do
            textCtx.fillText(txtArray[i], 10, 246 + 22 * i);
        while (txtArray.length > ++i)
        this._textDisplayed = true;
    },
    
    clearText: function() {
        textCtx.clearRect(0, 236, textCanvas.width, 100);
        this._textDisplayed = false;
        
        if (this._callback) {
            this._callback();
            this._callback = null;
        }
    }
});