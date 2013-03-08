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

var NUM_SHOP_ACTIONS = 3;

var SHOP_BUY = 0;
var SHOP_SELL = 1;
var SHOP_EXIT = 2;

/* Class for the main shop menu */
var ShopMenu = Menu.extend({
    _init: function(shop) {
        this._shop = shop;
        var menu = this;
        this._super({
            type: SHOP_MENU,
            numberSelections: NUM_SHOP_ACTIONS,
            drawBox: true,
            left: 0,
            top: 0,
            width: 100,
            height: 100,
            radius: 15,
            thickness: 3,
            pointerLeft: 13,
            textLeft: 32,
            heights: [ 12, 40, 68 ],
            texts: [ "Buy", "Sell", "Exit" ],
            // flags: flags,
            font: "bold 20px monospace",
            callbacks: [
                function() { menu.displayBuyMenu(); },
                function() { menu.displaySellMenu(); },
                function() { menu.handleESC(); }
            ],
            afterClear: function() { menu.afterClear(); },
            canESC: true
        });
        this._currentMenu = this;
    },
    
    getShop: function() {
        return this._shop;
    },
    
    // Called after one of the submenus is cleared
    returnTo: function() {
        this._currentMenu = this;
        this.clear();
        this.display();
        this.drawPointer();
    },
    
    /* Runs after the shop menu is cleared */
    afterClear: function() {
        g_textDisplay.displayText("Thank you for your business.\nPlease come again.");
    },
    
    display: function() {
        this._super();
        this.displayGold();
    },
    
    clear: function() {
        this._super();
        this.clearGold();
    },
    
    /* Displays the amount of gold you have in bottom while shopping */
    displayGold: function() {
        drawBox(menuCtx, 0, 120, 100, 40, 10, 2);
        
        // Draw Text
        textCtx.font = "bold 20px monospace";
        textCtx.fillStyle = "white";
        textCtx.textBaseline = "top";
        textCtx.fillText(g_player.getGold() + "G", 16, 130);
    },
    
    /* Clear the box displaying the gold */
    clearGold: function() {
        menuCtx.clearRect(0, 120, 100, 50);
        textCtx.clearRect(0, 120, 100, 50);
    },
    
    displayBuyMenu: function() {
        var menu = new BuyMenu(this, this.getShop(), this.getShop().getItemList());
        menu.display();
        this._currentMenu = menu;
    },
    
    displaySellMenu: function() {
        var menu = new SellMenu(this, this.getShop());
        menu.display();
        this._currentMenu = menu;
    },
    
    /* Get the current menu */
    getCurrentMenu: function() {
        return this._currentMenu;
    },
    
    /* Set the current menu */
    setCurrentMenu: function(menu) {
        this._currentMenu = menu;
    },
    
    /* Handles arrow key input for shop menu */
    handleKey: function(key) {
        if (this._currentMenu == this)
           this._super(key);
        else
           this._currentMenu.handleKey(key);
    },
    
    /* Called when enter key is pressed and shop menu has focus */
    handleEnter: function() {
        if (this._currentMenu == this)
           this._super();
        else
           this._currentMenu.handleEnter();
    },
    
    /* Called when ESC key is pressed and shop menu has focus */
    handleESC: function() {
        if (this._currentMenu == this)
           this._super();
        else
           this._currentMenu.handleESC();
    }
});