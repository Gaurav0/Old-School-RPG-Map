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


/* Class representing a battle */
var Battle = Class.extend({
    _init: function() {
        
        // Initialize properties
        this._background = null;
        this._encounter = null;
        this._monsterList = null;
        this._currentAction = BATTLE_MENU_ATTACK;
        this._mainMenu = new BattleMenu(this);
        this._currentMenu = this._mainMenu;
        this._over = false;
        this._win = false;
        this._line = 0;
        this._txt = "";        
        this._totalExp = 0;
        this._totalGold = 0;
        this._monsterWillAttack = true;
        this._defending = false;
        this._ignoringKeys = false;
        this._writing = false;
        this._delay = 0;
        
        var screenHeight = mapCanvas.height;
        this._textHeight = [
            screenHeight - 132,
            screenHeight - 110,
            screenHeight - 86,
            screenHeight - 62,
            screenHeight - 38
        ];
    },
    
    /* Setup random encounter */
    setupRandomEncounter: function(zone, backgroundRef) {
        
        this._background = g_imageData.images[backgroundRef].img;
        
        // Get encounter data associated with zone
        var zoneXml = null;
        for (var i = 0; i < g_encounterData.zones.length; ++i)
            if (g_encounterData.zones[i].zone == zone)
                zoneXml = g_encounterData.zones[i];
        if (zoneXml != null) {
            
            // Choose an encounter randomly
            var len = zoneXml.encounters.length;
            var r = Math.floor(Math.random() * len);
            this._encounter = zoneXml.encounters[r];

            // Create monster list
            this._monsterList = [];
            for (var j = 0; j < this._encounter.monsters.length; ++j) {
                var monsterId = this._encounter.monsters[j];
                for (var k = 0; k < g_monsterData.monsters.length; ++k)
                    if (g_monsterData.monsters[k].id == monsterId) {
                        var monster = new Monster(g_monsterData.monsters[k]);
                        this._monsterList.push(monster);
                    }
            }
        }
        
        if (keyDown)
            this._ignoringKeys = true;
    },
    
    /* Setup scripted encounter (for boss monsters, etc.) */
    setupEncounter: function(name, aryMonsters, backgroundRef) {
        
        this._background = g_imageData.images[backgroundRef].img;
        
        // Create encounter object
        this._encounter = {
            "name": name,
            "monsters": aryMonsters
        };
        
        // Create monster list
        this._monsterList = [];
        for (var i = 0; i < aryMonsters.length; ++i) {
            var monsterId = aryMonsters[i];
            for (var j = 0; j < g_monsterData.monsters.length; ++j)
                if (g_monsterData.monsters[j].id == monsterId) {
                    var monster = new Monster(g_monsterData.monsters[j]);
                    this._monsterList.push(monster);
                }
        }
        
        if (keyDown)
            this._ignoringKeys = true;
    },
    
    /* Draws battle screen */
    draw: function() {
        var screenWidth = mapCanvas.width;
        var screenHeight = mapCanvas.height;

        // Draw battle background
        mapCtx.drawImage(this._background, 0, 0, screenWidth, screenHeight);

        spriteCtx.clearRect(0, 0, screenWidth, screenHeight);
        this.drawPlayer();
        this.drawHealthBar();
        this.drawManaBar();
        this.drawMonsters();
        
        this._mainMenu.display();
        drawBox(menuCtx, 133, screenHeight - 150, screenWidth - 133, 150, 15, 3);

        textCtx.font = "bold 16px sans-serif";
        var txt = this._encounter.name + " appeared!";
        textCtx.fillText(txt, 154, this._textHeight[0]);
        this._line = 1;
        this._txt = txt;
    },
    
    /* Draws player on battle screen */
    drawPlayer: function() {
        
        spriteCtx.drawImage(g_player._img,
            SPRITE_WIDTH,                        // source x
            FACING_LEFT * SPRITE_HEIGHT,         // source y
            SPRITE_WIDTH,                        // source width
            SPRITE_HEIGHT,                       // source height
            spriteCanvas.width - 3 * TILE_WIDTH, // dest x
            2 * TILE_HEIGHT,                     // dest y
            SPRITE_WIDTH,                        // dest width
            SPRITE_HEIGHT);                      // dest height
    },
    
    /* Erases player on battle screen */
    clearPlayer: function() {
        
        spriteCtx.clearRect(
            spriteCanvas.width - 3 * TILE_WIDTH, // x
            2 * TILE_HEIGHT,                     // y
            SPRITE_WIDTH,                        // width
            SPRITE_HEIGHT);                      // height
    },
    
    /* Draws enemies on battle screen */
    drawMonsters: function() {
        
        var destLeft = 2 * TILE_WIDTH;
        for (var i = 0; i < this._monsterList.length; ++i) {
            var monster = this._monsterList[i];
            var img = g_imageData.images[monster.getImageRef()].img;
            spriteCtx.drawImage(img,
                monster.getLeft(),
                monster.getTop(),
                monster.getWidth(),
                monster.getHeight(),
                destLeft,
                3 * TILE_HEIGHT,
                monster.getWidth(),
                monster.getHeight());
            
            monster.setLoc(destLeft);
            destLeft += monster.getWidth() + 15;
        }
    },
    
    /* Erases enemy on battle screen */
    clearMonster: function(id) {
        
        var monster = this._monsterList[id];
        spriteCtx.clearRect(
            monster.getLoc(),
            3 * TILE_HEIGHT,
            monster.getWidth(),
            monster.getHeight());
    },
    
    /* Draws health bar on battle screen */
    drawHealthBar: function() {
        var x = spriteCanvas.width - 2 * TILE_WIDTH + 0.5;
        var y = 2 * TILE_HEIGHT + 0.5;
        var w = 10;
        var h = SPRITE_HEIGHT;
        var pct = g_player.getHP() / g_player.getMaxHP();
        if (pct < 0)
            pct = 0;
        var yh = y + Math.round((1 - pct) * h);
        var hh = h - (yh - y);
        
        // alert("y:" + y + " yh:" + yh + " h:" + h + " hh:" + hh);
        
        spriteCtx.fillStyle = "red";
        spriteCtx.fillRect(x, yh, w, hh);
        spriteCtx.strokeStyle = "black";
        spriteCtx.strokeRect(x, y, w, h);
    },
    
    /* Draws MP bar on battle screen */
    drawManaBar: function() {
        var x = spriteCanvas.width - 2 * TILE_WIDTH + 10.5;
        var y = 2 * TILE_HEIGHT + 0.5;
        var w = 10;
        var h = SPRITE_HEIGHT;
        var pct = g_player.getMP() / g_player.getMaxMP();
        if (pct < 0)
            pct = 0;
        var yh = y + Math.round((1 - pct) * h);
        var hh = h - (yh - y);
        
        // alert("y:" + y + " yh:" + yh + " h:" + h + " hh:" + hh);
        
        spriteCtx.fillStyle = "#ccccff";
        spriteCtx.fillRect(x, yh, w, hh);
        spriteCtx.strokeStyle = "black";
        spriteCtx.strokeRect(x, y, w, h);
    },
    
    /* Erases Health Bar on battle screen */
    clearHealthBar: function() {
        var x = spriteCanvas.width - 2 * TILE_WIDTH + 0.5;
        var y = 2 * TILE_HEIGHT + 0.5;
        var w = 10;
        var h = SPRITE_HEIGHT;
        
        spriteCtx.clearRect(x, y, w, h);
    },
    
    /* Erases MP Bar on battle screen */
    clearManaBar: function() {
        var x = spriteCanvas.width - 2 * TILE_WIDTH + 10.5;
        var y = 2 * TILE_HEIGHT + 0.5;
        var w = 10;
        var h = SPRITE_HEIGHT;
        
        spriteCtx.clearRect(x, y, w, h);
    },
    
    /* Draws health bar on battle screen */
    updateHealthBar: function(health) {
        this.clearHealthBar();
        
        var x = spriteCanvas.width - 2 * TILE_WIDTH + 0.5;
        var y = 2 * TILE_HEIGHT + 0.5;
        var w = 10;
        var h = SPRITE_HEIGHT;
        var pct = health / g_player.getMaxHP();
        if (pct < 0)
            pct = 0;
        var yh = y + Math.round((1 - pct) * h);
        var hh = h - (yh - y);
        
        // alert("y:" + y + " yh:" + yh + " h:" + h + " hh:" + hh);
        
        spriteCtx.fillStyle = "red";
        spriteCtx.fillRect(x, yh, w, hh);
        spriteCtx.strokeStyle = "black";
        spriteCtx.strokeRect(x, y, w, h);
    },
    
    /* Writes a message line on bottom right box of battle screen */
    writeMsg: function(msg) {
        this._writing = true;
        this._mainMenu.clearPointer();
        window.setTimeout(function() {
            g_battle.drawText();
            var line = g_battle._line <= 4 ? g_battle._line : 4;
            textCtx.fillText(msg, 154, g_battle._textHeight[line]);
            g_battle._txt += "\n" + msg;
            g_battle._line++;
            g_battle._delay -= MESSAGE_DELAY;
            if (g_battle._delay == 0) {
                g_battle._writing = false;
                if (!g_battle._over)
                    g_battle._mainMenu.drawPointer();
            }
        }, this._delay);
        this._delay += MESSAGE_DELAY;
    },
    
    /* Draws the previously written text */
    drawText: function() {
        
        textCtx.font = "bold 16px sans-serif";
        textCtx.fillStyle = "white";
        textCtx.textBaseline = "top";

        this.clearText();
        var prevText = this._txt.split("\n");
        if (this._line <= 4) {
            for (var i = 0; i < this._line; ++i)
                textCtx.fillText(prevText[i], 154, this._textHeight[i]);
        } else {
            for (var i = 0; i < 4; ++i) {
                var lineText = prevText[prevText.length - 4 + i];
                textCtx.fillText(lineText, 154, this._textHeight[i]);
            }
        }
    },
    
    /* Clears text in bottom right box of battle screen */
    clearText: function() {
        textCtx.clearRect(154,
            this._textHeight[0],
            textCanvas.width - 154,
            textCanvas.height - this._textHeight[0]);
    },
    
    /* End of the battle */
    end: function() {
        menuCtx.clearRect(0, 0, menuCanvas.width, menuCanvas.height);
        spriteCtx.clearRect(0, 0, spriteCanvas.width, spriteCanvas.height);
        textCtx.clearRect(0, 0, textCanvas.width, textCanvas.height);
        if (!g_player.isDead()) {
            g_worldmap.redraw();
            g_worldmap.drawSprites();
            g_player.plot();
        
            // Callback functions for after the battle is over.
            if (this._win)
                this.onWin();
            this.onExit();
        } else {
            g_titlescreen = true;
            g_game.showTitleScreen();
        }
        
        g_battle = null;
    },
    
    /* Handles input while battling for up, down, left, and right arrow keys */
    handleKey: function(key) {
        if (!this._writing && !this._ignoringKeys && !this.over && !g_player.isDead()) {
            this._currentMenu.handleKey(key);
        }
    },
    
    /* Handles input of enter key or spacebar while battling */
    handleEnter: function() {
        if (!this._writing && !g_player.isDead()) {
            if (this._over)
                this.end();
            else {
                this._defending = false;
                this._monsterWillAttack = true;
                this._currentMenu.handleEnter();
                this.finishTurn();
            }
        }
    },
    
    /* handles input of ESC key while battling. */
    handleESC: function() {
        if (this._over) {
            this.end();
        } else {
            this._currentMenu.handleESC();
        }
    },
    
    /* handles key up event */
    handleKeyUp: function() {
        this._ignoringKeys = false;
    },
    
    setMonsterWillAttack: function(willAttack) {
        this._monsterWillAttack = willAttack;
    },
    
    /* called from battle menu to begin the attack of the monster */
    beginAttack: function() {
        this._currentAction = BATTLE_MENU_ATTACK;
        if (this._monsterList.length == 1) {
            this.attack(0);
            this.finishTurn();
        } else {

            // There is more than one monster, enter selecting mode.
            this._currentMenu = new MonsterMenu(this._currentMenu, this, this._monsterList); 
            this._currentMenu.selectFirstLiveMonster();
            this._currentMenu.display();
            this._monsterWillAttack = false;
        }
    },
    
    /* called from battle menu to begin defending */
    defend: function() {
        this._defending = true;
        this.writeMsg("You defended.");
        this.finishTurn();
    },
    
    /* Finish turn after selecting monster and performing action */
    finishTurn: function() {
        
        // Monster's turn
        if (!this._over && this._monsterWillAttack)
            this.monsterTurn(false);
        
        // Update Health Bar
        if (this._monsterWillAttack) {
            this.runAfterWriting(function() {
                g_battle.clearHealthBar();
                g_battle.clearManaBar();
                g_battle.drawHealthBar();
                g_battle.drawManaBar();
                if (!g_battle._over) {
                    g_battle._currentMenu = g_battle._mainMenu;
                    g_battle._mainMenu.returnTo(false);
                }
            });
        }
        
        this._defending = false;
        this._monsterWillAttack = false;
    },
    
    /* Utility function to run callback function when writing is finished */
    runAfterWriting: function(callback) {
        if (this._writing) {
            window.setTimeout(function() {
                g_battle.runAfterWriting(callback);
            });
        } else
            callback();
    },
    
    /* Utility function to call a function for each monster currently alive
     * callback function takes a monster and id. */
    forEachMonster: function(callback) {
        for (var i = 0; i < this._monsterList.length; ++i)
            if (!this._monsterList[i].isDead())
                callback(this._monsterList[i], i);
    },
    
    // Earn gold & exp associated with killing a monster
    earnReward: function(monster, id) {
        var battle = this;
        window.setTimeout(function() {
            battle.clearMonster(id);
        }, this._delay);
        this.writeMsg("The " + monster.getName() + " was killed.");
        this._totalExp += monster.getExp();
        this._totalGold += monster.getGold();

        // If all monsters are dead...
        for (var i = 0; i < this._monsterList.length; ++i)
            if (!this._monsterList[i].isDead())
                return;

        // End battle and award exp & gold to player.
        g_player.earnGold(this._totalGold);
        var gainedLevel = g_player.earnExp(this._totalExp);
        this.writeMsg("You have earned " + this._totalExp + " exp");
        this.writeMsg("and " + this._totalGold + " GP.");
        if (gainedLevel)
            this.writeMsg("You gained a level!");
        this._over = true;
        this._win = true;
        this._mainMenu.clearPointer();
    },
    
    doActionToMonster: function(id) {
        switch (this._currentAction) {
            case BATTLE_MENU_ATTACK:
                this.attack(id);
                this.finishTurn();
                break;
            case BATTLE_MENU_DEFEND:
                this._defending = true;
                break;
            case BATTLE_MENU_ITEM:
                // not implemented
                break;
            case BATTLE_MENU_SPELL:
                // not implemented
                break;
            case BATTLE_MENU_RUN:
                // not possible
                break;
        }
    },
    
    /* Player attacks monster with id provided */
    attack: function(id) {
        
        // Basic battle system; determine damage from attack and defense
        var monster = this._monsterList[id];
        var rand = Math.random();
        if (rand > 0.95) {
            this.writeMsg("You missed!");
        } else {
            var damage = g_player.getAttack() - monster.getDefense();
            if (rand > 0.9) {
                this.writeMsg("Critical Hit!");
                damage *= 2;
            }
            if (damage < 1)
                damage = 1;
            damage -= Math.floor(Math.random() * damage / 2);
            this.writeMsg("You attacked for " + damage + " damage.");
            monster.damage(damage);

            // If monster is dead, earn exp & gold associated.
            if (monster.isDead()) {
                this.earnReward(monster, id);
            }
        }
    },
    
    /* Monsters attack the player */
    monsterTurn: function() {
        for (var i = 0; i < this._monsterList.length; ++i) {
            var monster = this._monsterList[i];
            if (!monster.isDead()) {
                if (monster.hasSpecialAttack() && Math.random() < 0.5)
                    monster.useSpecialAttack();
                else {
                    // Basic battle system; determine damage from attack and defense
                    var rand = Math.random();
                    if (rand > 0.9) {
                        this.writeMsg("The " + monster.getName() + " missed!");
                    } else {
                        var damage = monster.getAttack() - g_player.getDefense();
                        if (rand > 0.86) {
                            this.writeMsg("Terrible Hit!");
                            damage = 2 * monster.getAttack() - g_player.getDefense();
                        }
                        if (this._defending)
                            damage = Math.floor(damage / 2.5);
                        if (damage < 1)
                            damage = 1;
                        damage -= Math.floor(Math.random() * damage / 2);
                        g_player.damage(damage);
                        this.writeMsg("The " + monster.getName() + " attacked for");
                        this.writeMsg(damage + " damage.");

                        // Update health bar as you go.
                        var battle = this;
                        var health = g_player.getHP();
                        window.setTimeout(function(health) {
                            return function() {
                                battle.updateHealthBar(health);
                            };
                        }(health), this._delay);
                    }   
                }
                
                // If player is dead, end game!
                if (g_player.isDead()) {
                    this.writeMsg("You died.");
                    this._over = true;
                    this._mainMenu.clearPointer();
                    var battle = this;
                    this.runAfterWriting(function() {
                        battle.clearPlayer();
                    });
                    return;
                }
            }
        }
    },
    
    /* Player will attempt to run */
    run: function() {
        if (Math.random() >= 0.33) {
            this.writeMsg("You start to run.");
            this.monsterTurn(false);
            if (g_player.isDead() || this._over)
                return false;
            if (Math.random() < 0.33) {
                this.writeMsg("You couldn't run away.")
                return false;
            }
        }
        
        this.writeMsg("You ran away.")
        this._over = true;
        this._mainMenu.clearPointer();
        var battle = this;
        this.runAfterWriting(function() {
            battle.clearPlayer();
        });
        return true;
    },
    
    /* Use the selected item. Returns true if an item was used. */
    useItem: function() {
        if (this._itemSelection < this._numItems) {
            var itemId = this._itemId[this._itemSelection];
            var item = g_itemData.items[itemId];
            switch(item.type) {
                case ITEMTYPE_HEAL_ONE:
                    item.use(g_player);
                    break;
                case ITEMTYPE_ATTACK_ALL:
                    item.use();
                    break;
            }
            g_player.removeFromInventory(itemId);
            return true;
        }
        return false;
    },
    
    /* Use the selected spell. Returns true if a spell was used. */
    useSpell: function() {
        if (this._spellSelection < this._numSpells) {
            var spellId = this._spellId[this._spellSelection];
            var spell = g_spellData.spells[spellId];
            if (g_player.getMP() >= spell.mpCost) {
                switch(spell.type) {
                    case SPELLTYPE_HEAL_ONE:
                        spell.use(g_player);
                        break;
                    case SPELLTYPE_ATTACK_ALL:
                        spell.use();
                        break;
                }
                g_player.useMP(spell.mpCost);
                return true;
            } else {
                this.writeMsg("You do not have enough MP");
                this.writeMsg("to cast " + spell.name + ".");
            }
        }
        return false;
    },
    
    onExit: function() {
        // What happens after the battle is over and you exit?
    },
    
    onWin: function() {
        // What happens after the battle is over and you have won?
    }
});