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
        this._currentMenu = SHOP_MENU;
        this._currentAction = SHOP_BUY;
        this._arrow = false;
        this._lineHeight = [ 12, 40, 68 ];
        this._drawHeight = [ 35, 55, 75, 95, 115, 135, 155, 175, 195, 215 ];
        this._itemList = null;
        this._buySelection = 0;
        this._sellSelection = 0;
        this._numItems = 0;
        this._itemId = [];
        this._quantity = 1;
        this._maxquantity = 99;
        this._price = 0;
        this._quantityDisplayed = false;
        this._toDisplayQuantity = false;
    },
    
    shopDisplayed: function() {
        return this._shopDisplayed;
    },
    
    displayShop: function(itemList, toDisplayQty) {
        this._toDisplayQuantity = toDisplayQty;
    
        drawBox(menuCtx, 0, 0, 100, 100, 15, 3);
        
        // Draw Text
        textCtx.font = "bold 20px monospace";
        textCtx.fillStyle = "white";
        textCtx.textBaseline = "top";
        textCtx.fillText("Buy", 32, this._lineHeight[0]);
        textCtx.fillText("Sell", 32, this._lineHeight[1]);
        textCtx.fillText("Exit", 32, this._lineHeight[2]);
        
        this.displayGold();
        this.drawArrow();
        
        this._itemList = itemList;
        this._shopDisplayed = true;
    },
    
    clearShop: function() {
        menuCtx.clearRect(0, 0, menuCanvas.width, menuCanvas.height);
        textCtx.clearRect(0, 0, textCanvas.width, textCanvas.height);
        
        this._itemList = null;
        this._shopDisplayed = false;
        g_textDisplay.displayText("Thank you for your business.\nPlease come again.");
    },
    
    displayGold: function() {
        drawBox(menuCtx, 0, 120, 100, 40, 10, 2);
        
        // Draw Text
        textCtx.font = "bold 20px monospace";
        textCtx.fillStyle = "white";
        textCtx.textBaseline = "top";
        textCtx.fillText(g_player.getGold() + "G", 16, 130);
    },
    
    clearGold: function() {
        menuCtx.clearRect(0, 120, 100, 50);
        textCtx.clearRect(0, 120, 100, 50);
    },
    
    /* Draws an arrow next to the current shop action in shop menu */
    drawArrow: function() {
        var arrowChar = "\u25ba";
        textCtx.font = "bold 20px monospace";
        textCtx.fillStyle = "white";
        textCtx.textBaseline = "top";
        var drawHeight = this._lineHeight[this._currentAction % 3];        
        textCtx.fillText(arrowChar, 15, drawHeight);
        this._arrow = true;
    },
    
    /* Erases the arrow next to the current shop action in shop menu */
    clearArrow: function() {
        var drawHeight = this._lineHeight[this._currentAction % 3];
        textCtx.clearRect(14, drawHeight, 16, 20);
        this._arrow = false;
    },
    
    displayBuyMenu: function() {
        drawBox(menuCtx, 100, 0, 300, 250, 40, 5);
        
        // Text properties
        textCtx.font = "bold 16px monospace";
        textCtx.fillStyle = "white";
        textCtx.textBaseline = "top";
        
        for (var i = 0; i < this._itemList.length; ++i) {
            var itemId = this._itemList[i];
            var itemName = g_itemData.items[itemId].name;
            var itemCost = g_itemData.items[itemId].cost;
            var displayName = itemName;
            while (displayName.length < 15)
                displayName += " ";
            var displayCost = itemCost.toString();
            while (displayCost.length < 5)
                displayCost = " " + displayCost;
            textCtx.fillText(displayName + " " + displayCost + "G", 144, this._drawHeight[i]);
        }
        
        this._currentMenu = BUY_MENU;
        this._buySelection = 0;
        this.drawBuySelection();
    },
    
    displaySellMenu: function() {
        drawBox(menuCtx, 100, 0, 300, 250, 40, 5);
        
        // Text properties
        textCtx.font = "bold 14px monospace";
        textCtx.fillStyle = "white";
        textCtx.textBaseline = "top";
        
        // Display items in inventory
        this._itemId = [];
        var numItems = 0;
        var shop = this;
        g_player.forEachItemInInventory(function(itemId, amt) {
            if (amt > 0) {
                var itemName = g_itemData.items[itemId].name;
                var itemCost = g_itemData.items[itemId].cost;
                var sellPrice = Math.floor(itemCost * 0.75);
                var displayAmt = (amt >= 10) ? amt : " " + amt;
                var displayPrice = sellPrice.toString();
                while (displayPrice.length < 5)
                    displayPrice = " " + displayPrice;
                var displayName = itemName;
                while (displayName.length < 15)
                    displayName += " ";
                if (numItems < 10)
                    textCtx.fillText(
                        displayName + " " + displayAmt + " " + displayPrice + "G",
                        150, shop._drawHeight[numItems]);
                shop._itemId[numItems] = itemId;
                numItems++;
            }
        });
        
        this._numItems = numItems;
        this._currentMenu = SELL_MENU;
        if (numItems > 0) {
            this._sellSelection = 0;
            this.drawSellSelection();
        }
    },
    
    clearSubMenu: function() {
        menuCtx.clearRect(100, 0, 300, 250);
        textCtx.clearRect(100, 0, 300, 250);
        
        this._currentMenu = SHOP_MENU;
    },
    
    displayQuantityDialog: function() {
        this._quantity = 1;
        
        var itemId, price;
        if (this._currentMenu == BUY_MENU) {
            itemId = this._itemList[this._buySelection];
            price = g_itemData.items[itemId].cost;
            this._maxQuantity = 99;
        } else if (this._currentMenu == SELL_MENU) {
            itemId = this._itemId[this._sellSelection];
            price = g_itemData.items[itemId].cost;
            price = Math.floor(price * SELL_PRICE_RATIO);
            this._maxQuantity = g_player.numInInventory(itemId);
        }
        this._price = price;
        
        drawBox(menuCtx, 100, 250, 300, 50, 10, 3);
        
        // Text properties
        textCtx.font = "bold 16px monospace";
        textCtx.fillStyle = "white";
        textCtx.textBaseline = "top";
        
        textCtx.fillText("Quantity: " + this._quantity + "  Cost: " + this._quantity * price + "G", 120, 266);
        
        this._quantityDisplayed = true;
    },
    
    clearQuantityDialog: function() {
        menuCtx.clearRect(100, 250, 300, 50);
        textCtx.clearRect(100, 250, 300, 50);
        
        this._quantityDisplayed = false;
    },
    
    /* Draws an arrow next to currently selected item to buy */
    drawBuySelection: function() {
        
        var arrowChar = "\u25ba";
        textCtx.font = "bold 16px monospace";
        textCtx.fillStyle = "white";
        textCtx.textBaseline = "top";
        textCtx.fillText(arrowChar, 128, this._drawHeight[this._buySelection]);
    },
    
    /* Erases the arrow next to currently selected item to buy*/
    clearBuySelection: function() {
        textCtx.clearRect(127, this._drawHeight[this._buySelection], 17, 16);
    },
    
    /* Draws an arrow next to currently selected item to buy */
    drawSellSelection: function() {
        
        var arrowChar = "\u25ba";
        textCtx.font = "bold 14px monospace";
        textCtx.fillStyle = "white";
        textCtx.textBaseline = "top";
        textCtx.fillText(arrowChar, 136, this._drawHeight[this._sellSelection]);
    },
    
    /* Erases the arrow next to currently selected item to buy*/
    clearSellSelection: function() {
        textCtx.clearRect(135, this._drawHeight[this._sellSelection], 15, 14);
    },
    
    increaseQuantity: function() {
        if (this._quantity < this._maxQuantity)
            this._quantity++;
        
        textCtx.clearRect(100, 250, 300, 50);
        textCtx.fillText("Quantity: " + this._quantity + "  Cost: " + this._quantity * this._price + "G", 120, 266);
    },
    
    decreaseQuantity: function() {
        if (this._quantity > 1)
            this._quantity--;
        
        textCtx.clearRect(100, 250, 300, 50);
        textCtx.fillText("Quantity: " + this._quantity + "  Cost: " + this._quantity * this._price + "G", 120, 266);
    },
    
    handleInput: function(key) {
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
        } else if (this._currentMenu == SHOP_MENU) {
            this.clearArrow();
            switch(key) {
                case DOWN_ARROW:
                case RIGHT_ARROW:
                    this._currentAction++;
                    this._currentAction %= 3;
                    break;
                case UP_ARROW:
                case LEFT_ARROW:
                    this._currentAction--;
                    if (this._currentAction < 0)
                        this._currentAction += 3;
                    break;
            }
            this.drawArrow();
        } else if (this._currentMenu == BUY_MENU) {
            this.clearBuySelection();
            switch(key) {
                case DOWN_ARROW:
                case RIGHT_ARROW:
                    this._buySelection++;
                    this._buySelection %= this._itemList.length;
                    break;
                case UP_ARROW:
                case LEFT_ARROW:
                    this._buySelection--;
                    if (this._buySelection < 0)
                        this._buySelection += this._itemList.length;
                    break;
            }
            this.drawBuySelection();
        } else if (this._currentMenu == SELL_MENU && this._numItems > 0) {
            this.clearSellSelection();
            switch(key) {
                case DOWN_ARROW:
                case RIGHT_ARROW:
                    this._sellSelection++;
                    this._sellSelection %= this._numItems;
                    break;
                case UP_ARROW:
                case LEFT_ARROW:
                    this._sellSelection--;
                    if (this._sellSelection < 0)
                        this._sellSelection += this._numItems;
                    break;
            }
            this.drawSellSelection();
        }
    },
    
    handleEnter: function() {
        if (this._quantityDisplayed) {
            if (this._currentMenu == BUY_MENU)
                this.buyItems();
            else
                this.sellItems();
        } else if (this._currentMenu == SHOP_MENU) {
            switch (this._currentAction) {
                case SHOP_BUY:
                    this.displayBuyMenu();
                    break;
                case SHOP_SELL:
                    this.displaySellMenu();
                    break;
                case SHOP_EXIT:
                    this.clearShop();
                    break;
            }
        } else if (this._currentMenu == BUY_MENU) {
            if (this._toDisplayQuantity)
                this.displayQuantityDialog();
            else
                this.buyItem();
        } else if (this._currentMenu == SELL_MENU && this._numItems > 0) {
            if (g_player.numInInventory(this._itemId[this._sellSelection]) > 1)
                this.displayQuantityDialog();
            else
                this.sellItem();
        }
    },
    
    handleEsc: function() {
        if (this._quantityDisplayed)
            this.clearQuantityDialog();
        else if (this._currentMenu == SHOP_MENU)
            this.clearShop();
        else
            this.clearSubMenu();
    },
    
    buyItem: function() {
        this.clearSubMenu();
        
        var itemId = this._itemList[this._buySelection];
        var itemName = g_itemData.items[itemId].name;
        var itemCost = g_itemData.items[itemId].cost;
        var gold = g_player.getGold();
        if (gold >= itemCost) {
            g_player.spendGold(itemCost);
            g_player.addToInventory(itemId, 1);
            g_textDisplay.displayText("You purchased 1 " +
                itemName + " for " + itemCost + "G.");
            this.clearGold();
            this.displayGold();
        } else {
            g_textDisplay.displayText("You do not have enough gold\nto buy a " +
                itemName + ".\nYou only have " + gold + "G.");
        }
    },
    
    buyItems: function() {
        this.clearQuantityDialog();
        this.clearSubMenu();
        
        var itemId = this._itemList[this._buySelection];
        var itemName = g_itemData.items[itemId].name;
        var itemCost = g_itemData.items[itemId].cost;
        var gold = g_player.getGold();
        var totalCost = itemCost * this._quantity;
        if (gold >= totalCost) {
            g_player.spendGold(itemCost * this._quantity);
            g_player.addToInventory(itemId, this._quantity);
            g_textDisplay.displayText("You purchased " + this._quantity + " " +
                itemName + "s for " + totalCost + "G.");
            this.clearGold();
            this.displayGold();
        } else {
            g_textDisplay.displayText("You do not have enough gold\nto buy " +
                this._quantity + " " + itemName + "s.\nYou only have " + gold + "G.");
        }
    },
    
    sellItem: function() {
        this.clearSubMenu();
        
        var itemId = this._itemId[this._sellSelection];
        var itemName = g_itemData.items[itemId].name;
        var itemCost = g_itemData.items[itemId].cost;
        var sellPrice = Math.floor(itemCost * SELL_PRICE_RATIO);
        g_player.removeFromInventory(itemId);
        g_player.earnGold(sellPrice);
        this.clearGold();
        this.displayGold();
        g_textDisplay.displayText("You sold 1 " + itemName + " for " + sellPrice + "G.");
    },
    
    sellItems: function() {
        this.clearQuantityDialog();
        this.clearSubMenu();
        
        var itemId = this._itemId[this._sellSelection];
        var itemName = g_itemData.items[itemId].name;
        var itemCost = g_itemData.items[itemId].cost;
        var sellPrice = Math.floor(itemCost * SELL_PRICE_RATIO);
        var totalCost = sellPrice * this._quantity;
        g_player.removeFromInventory(itemId, this._quantity);
        g_player.earnGold(totalCost);
        this.clearGold();
        this.displayGold();
        g_textDisplay.displayText("You sold " + this._quantity + " " + itemName + "s for " + totalCost + "G.");
    }
});