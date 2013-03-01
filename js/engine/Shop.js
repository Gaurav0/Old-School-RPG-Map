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

 //Hello



var SHOP_MENU = 0;
var BUY_MENU = 1;
var SELL_MENU = 2;

var SHOP_BUY = 0;
var SHOP_SELL = 1;
var SHOP_EXIT = 2;

/* Class for shops */
var Shop = Class.extend({
    _init: function() {
        this._shopDisplayed = false;
        this._quantity = 1;
        this._maxquantity = 99;
        this._price = 0;
        this._quantityDisplayed = false;
        this._toDisplayQuantity = false;
    },
    
    shopDisplayed: function() {
        return this._menu && this._menu.isDisplayed();
    },
    
    getItemList: function() {
        return this._itemList;
    },
    
    displayShop: function(itemList, toDisplayQty) {
        this._itemList = itemList;
        this._toDisplayQuantity = toDisplayQty;
        this._menu = new ShopMenu(this);
        this._menu.display();
    },
    
    displayQuantityDialog: function(item) {
        this._quantity = 1;
        
        var price;
        if (this._menu.getCurrentMenu().getType() == BUY_MENU) {
            price = item.cost;
            this._maxQuantity = 99;
        } else if (this._menu.getCurrentMenu().getType() == SELL_MENU) {
            price = item.sellPrice;
            this._maxQuantity = item.amt;
        }
        this._price = price;
        
        drawBox(menuCtx, 100, 250, 300, 50, 10, 3);
        
        // Text properties
        textCtx.font = "bold 16px monospace";
        textCtx.fillStyle = "white";
        textCtx.textBaseline = "top";
        
        console.log("Shop.displayQuantityDialog: this._quantity: " + this._quantity + " price: " + price + " item.cost " + item.cost);
        textCtx.fillText("Quantity: " + this._quantity + "  Cost: " + this._quantity * price + "G", 120, 266);
        
        this._item = item;
        this._quantityDisplayed = true;
    },
    
    clearQuantityDialog: function() {
        menuCtx.clearRect(100, 250, 300, 50);
        textCtx.clearRect(100, 250, 300, 50);
        
        this._quantityDisplayed = false;
    },
    
    /* Increase the quantity that the user will buy */
    increaseQuantity: function() {
        if (this._quantity < this._maxQuantity)
            this._quantity++;
        
        textCtx.clearRect(100, 250, 300, 50);
        textCtx.fillText("Quantity: " + this._quantity + "  Cost: " + this._quantity * this._price + "G", 120, 266);
    },
    
    /* Decrease the quantity that the user will buy */
    decreaseQuantity: function() {
        if (this._quantity > 1)
            this._quantity--;
        
        textCtx.clearRect(100, 250, 300, 50);
        textCtx.fillText("Quantity: " + this._quantity + "  Cost: " + this._quantity * this._price + "G", 120, 266);
    },
    
    /* Handles arrow key input while any shop is being displayed */
    handleKey: function(key) {
        if (this._quantityDisplayed) {
            switch(key) {
                case UP_ARROW:
                case RIGHT_ARROW:
                    this.increaseQuantity();
                    break;
                case LEFT_ARROW:
                case DOWN_ARROW:
                    this.decreaseQuantity();
                    break;
            }
        } else if (this._menu.isDisplayed()) {
            this._menu.handleKey(key);
        }
    },
    
    /* Handle if enter is pressed while shop is being displayed */
    handleEnter: function() {
        if (this._quantityDisplayed) {
            var menuType = this._menu.getCurrentMenu().getType();
            this._menu.handleESC();
            if (menuType == BUY_MENU)
                this.buyItems();
            else if (menuType == SELL_MENU)
                this.sellItems();
        } else if (this._menu.isDisplayed()) {
            this._menu.handleEnter();
        }
    },
    
    /* Handle ESC key pressed while shop is being displayed */
    handleESC: function() {
        if (this._quantityDisplayed)
            this.clearQuantityDialog();
        else if (this._menu.isDisplayed()) {
            this._menu.handleESC();
        }
    },
    
    /* if toDisplayQty, show Quantity Dialog, otherwise purchase one */
    handlePurchase: function(item) {
        if (this._toDisplayQuantity)
            this.displayQuantityDialog(item);
        else
            this.buyItem(item);
    },
    
    /* if toDisplayQty, show Quantity Dialog, otherwise sell one */
    handleSale: function(item) {
        if (this._toDisplayQuantity)
            this.displayQuantityDialog(item);
        else
            this.sellItem(item);
    },
    
    /* Called when user tries to complete purchase of single item. */
    buyItem: function(item) {
    
        var gold = g_player.getGold();
        if (gold >= item.cost) {
            g_player.spendGold(item.cost);
            g_player.addToInventory(item.id, 1);
            g_textDisplay.displayText("You purchased 1 " +
                item.name + " for " + item.cost + "G.");
            this._menu.clearGold();
            this._menu.displayGold();
        } else {
            g_textDisplay.displayText("You do not have enough gold\nto buy a " +
                item.name + ".\nYou only have " + gold + "G.");
        }
    },
    
    /* Called when user tries to complete purchase of multiple items. */
    buyItems: function() {
        this.clearQuantityDialog();
        
        var item = this._item;
        var gold = g_player.getGold();
        var totalCost = item.cost * this._quantity;
        if (gold >= totalCost) {
            g_player.spendGold(totalCost);
            g_player.addToInventory(item.id, this._quantity);
            g_textDisplay.displayText("You purchased " + this._quantity + " " +
                item.name + "s for " + totalCost + "G.");
            this._menu.clearGold();
            this._menu.displayGold();
        } else {
            g_textDisplay.displayText("You do not have enough gold\nto buy " +
                this._quantity + " " + item.name + "s.\nYou only have " + gold + "G.");
        }
    },
    
    /* Called when user tries to complete sale of single item. */
    sellItem: function(item) {
    
        g_player.removeFromInventory(item.id);
        g_player.earnGold(item.sellPrice);
        this._menu.clearGold();
        this._menu.displayGold();
        g_textDisplay.displayText("You sold 1 " + item.name + " for " + item.sellPrice + "G.");
    },
    
    /* Called when user tries to complete sale of multiple items. */
    sellItems: function() {
        this.clearQuantityDialog();
        var item = this._item;
        
        var totalCost = item.sellPrice * this._quantity;
        g_player.removeFromInventory(item.id, this._quantity);
        g_player.earnGold(totalCost);
        this._menu.clearGold();
        this._menu.displayGold();
        g_textDisplay.displayText("You sold " + this._quantity + " " + item.name + "s for " + totalCost + "G.");
    }
});
