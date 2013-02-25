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

/* Class representing progress bar information */ 
var Progress = Class.extend({
    _init: function() {
        this._resources = {};
        this._count = 0;
        this._loaded = 0;
        this._setupFinished = false;
        var progress = this;
        this._failTimeout = window.setTimeout(function() {
            progress.onFail();
        }, LOAD_TIMEOUT);
    },
    
    /* Any resource to be loaded during game start */
    addResource: function(url, res) {
        this._resources[url] = new Resource(url, res);
        this._count++;
    },
    
    /* Must call this in order to complete loading */
    finishSetup: function() {
        this._setupFinished = true;
        if (this.isLoadComplete()) {
            window.clearTimeout(this._failTimeout);
            this.onComplete();
        }
    },
    
    /* Must call this on each resource as it loads */
    setLoaded: function(url) {
        this._resources[url].setLoaded();
        this._loaded++;
        if (this.isLoadComplete()) {
            window.clearTimeout(this._failTimeout);
            this.onComplete();
        }
    },
    
    /* Returns true if all resources have been loaded and finishSetup() called */
    isLoadComplete: function() {
        return this._setupFinished && this._count == this._loaded;
    },
    
    /* Really dumb, doesn't take into account sizes of each resource */
    getPercentLoaded: function() {
        return this._loaded / this._count;
    },
    
    // Returns an array of urls to resources that have not loaded
    getList: function() {
        var list = [];
        for (res in this._resources)
            if (!this._resources[res].isLoaded())
                list.push(res);
        return list
    },
    
    onComplete: function() {
        // What happens when loading is complete?
    },
    
    onFail: function() {
        // What happens when loading fails?
    },
});

/* Helper class representing a resource with a url to be loaded for the progress class */
var Resource = Class.extend({
    _init: function(url, res) {
        this._url = url;
        this._res = res;
        this._loaded = false;
    },
    
    isLoaded: function() {
        return this._loaded;
    },
    
    setLoaded: function() {
        this._loaded = true;
    }
});