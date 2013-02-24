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


var NUM_EQUIP_TYPES = 4;

var EQUIP_WEAPON = 0;
var EQUIP_ARMOR = 1;
var EQUIP_HELMET = 2;
var EQUIP_SHIELD = 3;

var EquipMenu = Menu.extend({
    _init: function(mainMenu) {
        var callbacks = this.createCallbacks(NUM_EQUIP_TYPES);
        this._super({
            numberSelections: NUM_EQUIP_TYPES,
            drawBox: true,
            left: 150,
            top: 0,
            width: 250,
            height: 200,
            radius: 25,
            thickness: 4,
            pointerLeft: 170,
            textLeft: 195,
            heights: [ 20, 60, 100, 140 ],
            font: "bold 16px monospace",
            callbacks: callbacks,
            canESC: true,
            afterClear: function() { mainMenu.returnTo(); }
        });
        this._mainMenu = mainMenu;
    },
    
    drawText: function() {
        textCtx.fillText("Weapon:", this._textLeft, this._heights[0]);
        textCtx.fillText(g_itemData.items[g_player.getWeapon()].name, 210, 40);
        textCtx.fillText("Armor:", this._textLeft, this._heights[1]);
        textCtx.fillText(g_itemData.items[g_player.getArmor()].name, 210, 80);
        textCtx.fillText("Helmet:", this._textLeft, this._heights[2]);
        textCtx.fillText(g_itemData.items[g_player.getHelmet()].name, 210, 120);
        textCtx.fillText("Shield:", this._textLeft, this._heights[3]);
        textCtx.fillText(g_itemData.items[g_player.getShield()].name, 210, 160);
    },
    
    callback: function(equipType) {
        var equipSubMenu = new EquipSubMenu(this._mainMenu, this, equipType);
        equipSubMenu.display();
    },
    
    _createCallbacks: function() {
        var callbacks = [];
        for (var i = 0; i < NUM_EQUIP_TYPES; ++i)
            callbacks[i] = function() {
                callback(i);
            };
    },
    
    returnTo: function() {
        this.clear();
        this._callbacks = this._createCallbacks();
        this.display();
    }
});

var EquipSubMenu = Menu.extend({
    _init: function(mainMenu, parent, equipType) {
        this._equipType = equipType;
        this._parent = parent;
        var numItems = this._getItems();
        var texts = this._getTexts();
        var callbacks = this._createCallbacks();
        this._super({
            numberSelections: numItems,
            drawBox: true,
            left: 150,
            top: 200,
            width: 250,
            height: 150,
            radius: 25,
            thickness: 4,
            pointerLeft: 170,
            textLeft: 195,
            heights: [ 220, 240, 260, 280, 300 ],
            texts: texts,
            font: "bold 16px monospace",
            callbacks: callbacks,
            canESC: true,
            afterClear: function() { mainMenu.returnTo(); }
        });
        this._mainMenu = mainMenu;
    },
    
    _getItems: function() {
        this._items = [];
        var numItems = 0;
        g_player.forEachItemInInventory(function(itemId, amt) {
            if (amt > 0) {
                var type = g_itemData.items[itemId].type;
                if (type == this._equipType) {
                    var item = {};
                    item.name = g_itemData.items[itemId].name;
                    item.type = g_itemData.items[itemId].type;
                    item.amt = amt;
                    item.id = itemId;
                    this._items.push(item);
                    numItems++;
                }
            }
        });
        
        return numItems;
    },
    
    _getTexts: function() {
        var texts = [];
        for (var i = 0; i < this._items.length; ++i) {
            var item = this._items[i];
            texts[i] = item.name;
        }
    },

    callback: function(i) {
        this.changeEquip(i);
        this.clear();
        this._parent.returnTo();
    },
    
    /* changes equipment to that selected from equip submenu,
       determine which equipment to unload based on equip type */
    changeEquip: function(i) {
        var currentlyEquippedItemId;
        var toEquipItemId = this._items[i].id;
        switch(this._equipType) {
            case EQUIP_WEAPON:
                currentlyEquippedItemId = g_player.getWeapon();
                g_player.equipWeapon(toEquipItemId);
                break;
            case EQUIP_ARMOR:
                currentlyEquippedItemId = g_player.getArmor();
                g_player.equipArmor(toEquipItemId);
                break;
            case EQUIP_HELMET:
                currentlyEquippedItemId = g_player.getHelmet();
                g_player.equipHelmet(toEquipItemId);
                break;
            case EQUIP_SHIELD:
                currentlyEquippedItemId = g_player.getShield();
                g_player.equipShield(toEquipItemId);
                break;
        }
        g_player.removeFromInventory(toEquipItemId);
        g_player.addToInventory(currentlyEquippedItemId);
    }
});