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
 

var ItemMenu = Menu.extend({
    _init: function(mainMenu) {
        this._mainMenu = mainMenu;
        this._items = [];
        var numItems = this._getItems();
        var texts = this._getTexts();
        var flags = this._getFlags();
        var callbacks = this.createCallbacks(numItems);
        var menu = this;
        this._super({
            type: ITEM_MENU,
            numberSelections: numItems,
            drawBox: true,
            left: 150,
            top: 0,
            width: 250,
            height: 200,
            radius: 25,
            thickness: 4,
            pointerLeft: 170,
            textLeft: 186,
            heights: [ 20, 48, 76, 104, 132, 160 ],
            texts: texts,
            flags: flags,
            font: "bold 20px monospace",
            callbacks: callbacks,
            canESC: true,
            afterCallback: function() { menu._mainMenu.setCurrentMenu(menu._mainMenu); },
            afterClear: function() { menu._mainMenu.returnTo(); }
        });
    },
    
    _getItems: function() {
        var numItems = 0;
        var itemMenu = this;
        g_player.forEachItemInInventory(function(itemId, amt) {
            if (amt > 0) {
                var item = {};
                item.name = g_itemData.items[itemId].name;
                item.type = g_itemData.items[itemId].type;
                item.amt = amt;
                item.id = itemId;
                item.canUse = (item.type == ITEMTYPE_HEAL_ONE);
                itemMenu._items.push(item);
                numItems++;
            }
        });
        
        return numItems;
    },
    
    _getTexts: function() {
        var texts = [];
        for (var i = 0; i < this._items.length; ++i) {
            var item = this._items[i];
            var amt2 = (item.amt < 10) ? " " + item.amt : item.amt;
            texts[i] = item.name + ":" + amt2;
        }
        return texts;
    },
    
    _getFlags: function() {
        return _.map(this._items, function(item, index) {
            return !item.canUse;
        });
    },

    callback: function(i) {
        var item = this._items[i];
        this.clear();
        this._mainMenu.clear();
        var theItem = g_itemData.items[item.id];
        theItem.use(g_player);
        g_player.removeFromInventory(item.id);
    }
});