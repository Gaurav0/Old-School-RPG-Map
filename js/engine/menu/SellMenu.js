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
 
 
var SellMenu = Menu.extend({
    _init: function(parent, shop) {
        var menu = this;
        this._parent = parent;
        this._shop = shop;
        this._items = [];
        var numItems = this._getItems();
        var texts = this._getTexts();
        // var flags = this._getFlags();
        var callbacks = this.createCallbacks(numItems);
        this._super({
            type: SELL_MENU,
            numberSelections: numItems,
            drawBox: true,
            left: 100,
            top: 0,
            width: 300,
            height: 250,
            radius: 40,
            thickness: 5,
            pointerLeft: 124,
            textLeft: 144,
            heights: [ 35, 55, 75, 95, 115, 135, 155, 175, 195, 215 ],
            texts: texts,
            // flags: flags,
            font: "bold 14px monospace",
            callbacks: callbacks,
            canESC: true,
            // beforeCallback: function() { menu.clear(); },
            // afterCallback: function() { menu._parent.setCurrentMenu(menu._parent); },
            afterClear: function() { menu._parent.returnTo(); }
        });
    },
    
    _getItems: function() {
        var numItems = 0;
        var itemMenu = this;
        g_player.forEachItemInInventory(function(itemId, amt) {
            if (amt > 0) {
                var item = {};
                item.id = itemId;
                item.name = g_itemData.items[itemId].name;
                item.amt = amt;
                item.cost = g_itemData.items[itemId].cost;
                item.sellPrice = Math.floor(item.cost * SELL_PRICE_RATIO);
                console.log("item.sellPrice: " + item.sellPrice);
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
            var amt = item.amt;
            var displayAmt = (amt >= 10) ? amt : " " + amt;
            var displayPrice = item.sellPrice.toString();
            while (displayPrice.length < 5)
                displayPrice = " " + displayPrice;
            var displayName = item.name;
            while (displayName.length < 15)
                displayName += " ";
            texts[i] = displayName + " " + displayAmt + " " + displayPrice + "G";
        }
        return texts;
    },

    callback: function(i) {
        this._shop.handleSale(this._items[i]);
    }
});