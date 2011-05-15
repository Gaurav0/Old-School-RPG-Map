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

// Current Version used for savegame compatibility checking
var CURRENT_VERSION = "0.1pre 20110514"

// How many pixels is one square of the map
var TILE_WIDTH = 32;
var TILE_HEIGHT = 32;

/* How many map squares to display at a time (in both x and y dimensions) in
 * the screen view */
var TILES_ON_SCREEN_X = 13;
var TILES_ON_SCREEN_Y = 11;

/* The auto-scrolling code will scroll the map to try to keep the player
 * character sprite's position between square 3 and square 7 of the screen
 * view */
var MIN_SCREEN_SQUARE_X = 5;
var MAX_SCREEN_SQUARE_X = 7;
var MIN_SCREEN_SQUARE_Y = 4;
var MAX_SCREEN_SQUARE_Y = 6;

// Width and Height of sprites
var SPRITE_WIDTH = 32;
var SPRITE_HEIGHT = 48;

// Maximum frames per second
var FPS = 25;

// Scroll factor for scroll animation
var SCROLL_FACTOR = 4;

// How often to battle
var BATTLE_FREQ = 0.14;

// How long to wait in ms between writing lines
var MESSAGE_DELAY = 500;

/* Globals */

// 4 Canvases and counting
var mapCanvas = document.getElementById("mapCanvas");
var mapCtx = mapCanvas.getContext("2d");
var spriteCanvas = document.getElementById("spriteCanvas");
var spriteCtx = spriteCanvas.getContext("2d");
var menuCanvas = document.getElementById("menuCanvas");
var menuCtx = menuCanvas.getContext("2d");
var textCanvas = document.getElementById("textCanvas");
var textCtx = textCanvas.getContext("2d");

var g_game = null;
var g_player = null;
var g_worldmap = null;
var g_titlescreen = true;
var g_enemies = null;
var g_textDisplay = new TextDisplay();
var g_menu = new MainMenu();
var g_shop = new Shop();
var g_battle = null;
var g_chest = null;

// Utility function to load the xml for a tileset
// Callback function must have mapXml parameter.
function loadXml(xmlUrl, callback) {
    $.ajax({
        type: "GET",
        url: xmlUrl,
        dataType: "xml",
        success: callback,
        error: function(a,b,c) {
            alert('error:' + b);
        }
    });
}

// Utility function to print a message to user
// regardless of whether in battle or on map
function printText(msg) {
    if (g_battle)
        g_battle.writeMsg(msg);
    else
        g_textDisplay.displayText(msg);
}

// Procedurally generate gui box similar to
// http://opengameart.org/content/rpg-gui-block-element
function drawBox(ctx, x, y, width, height, radius, lineWidth) {
    
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = "white";
    
    var left = x + 2 * lineWidth;
    var top = y + 2 * lineWidth;
    var right = x + width - 2 * lineWidth;
    var bottom = y + height - 2 * lineWidth;
    
    ctx.beginPath();
    ctx.moveTo(left + radius, top);
    ctx.lineTo(right - radius, top);
    ctx.quadraticCurveTo(right, top, right, top + radius);
    ctx.lineTo(right, bottom - radius);
    ctx.quadraticCurveTo(right, bottom, right - radius, bottom);
    ctx.lineTo(left + radius, bottom);
    ctx.quadraticCurveTo(left, bottom, left, bottom - radius);
    ctx.lineTo(left, top + radius);
    ctx.quadraticCurveTo(left, top, left + radius, top);
    ctx.closePath();
    
    ctx.shadowOffsetX = lineWidth / 2;
    ctx.shadowOffsetY = lineWidth / 2;
    ctx.shadowBlur = lineWidth;
    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    
    var grd = ctx.createLinearGradient(x, y, x, y + height);
    grd.addColorStop(0, "#0066FF");
    grd.addColorStop(1, "#000099");
    ctx.fillStyle = grd;
    ctx.fill();    
    ctx.stroke();
    
    //Turn off the shadow
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.shadowBlur = 0;
    ctx.shadowColor = "transparent";
}

/* Input Handling */
var DOWN_ARROW = 40;
var UP_ARROW = 38;
var LEFT_ARROW = 37;
var RIGHT_ARROW = 39;
var SPACEBAR = 32;
var ENTER = 13;
var ESC = 27;
var keyBuffer = 0;
var keyDown = false;

function handleKeyPress(event) {
    if (!event.ctrlKey && !event.altKey && !event.metaKey) {
        var key = event.keyCode ? event.keyCode : event.charCode ? event.charCode : 0;
        keyDown = true;
        handleKey(key, event);
    }
}

function handleKeyUp() {
    keyDown = false;
    if (g_battle)
        g_battle.handleKeyUp();
}

function handleKey(key, event) {
    if (g_worldmap && g_player) {
        if (g_worldmap.isAnimating()) {
            keyBuffer = key;
            event.preventDefault();
        } else {
            switch (key) {
                case DOWN_ARROW:
                    if (g_menu.menuDisplayed())
                        g_menu.handleInput(key);
                    else if (g_shop.shopDisplayed())
                        g_shop.handleInput(key);
                    else if (g_battle)
                        g_battle.handleInput(key);
                    else if (!g_titlescreen && !g_worldmap.isAnimating())
                        g_player.move(0, 1, FACING_DOWN);
                    event.preventDefault();
                    break;
                case UP_ARROW:
                    if (g_menu.menuDisplayed())
                        g_menu.handleInput(key);
                    else if (g_shop.shopDisplayed())
                        g_shop.handleInput(key);
                    else if (g_battle)
                        g_battle.handleInput(key);
                    else if (!g_titlescreen && !g_worldmap.isAnimating())
                        g_player.move(0, -1, FACING_UP);
                    event.preventDefault();
                    break;
                case RIGHT_ARROW:
                    if (g_menu.menuDisplayed())
                        g_menu.handleInput(key);
                    else if (g_shop.shopDisplayed())
                        g_shop.handleInput(key);
                    else if (g_battle)
                        g_battle.handleInput(key);
                    else if (!g_titlescreen && !g_worldmap.isAnimating())
                        g_player.move(1, 0, FACING_RIGHT);
                    event.preventDefault();
                    break;
                case LEFT_ARROW:
                    if (g_menu.menuDisplayed())
                        g_menu.handleInput(key);
                    else if (g_shop.shopDisplayed())
                        g_shop.handleInput(key);
                    else if (g_battle)
                        g_battle.handleInput(key);
                    else if (!g_titlescreen && !g_worldmap.isAnimating())
                        g_player.move(-1, 0, FACING_LEFT);
                    event.preventDefault();
                    break;
                case SPACEBAR:
                case ENTER:
                    if (g_textDisplay.textDisplayed())
                        g_textDisplay.clearText();
                    else if (g_menu.menuDisplayed())
                        g_menu.handleEnter();
                    else if (g_titlescreen)
                        g_menu.displayTitleScreenMenu();
                    else if (g_shop.shopDisplayed())
                        g_shop.handleEnter();
                    else if (g_battle)
                        g_battle.handleEnter();
                    else if (!g_worldmap.isAnimating()) {
                        g_worldmap.doAction();
                        g_player.getSquareUnderfoot().onAction();
                    }
                    event.preventDefault();
                    break;
                case ESC:
                    if (g_textDisplay.textDisplayed())
                        g_textDisplay.clearText();
                    else if (g_menu.menuDisplayed())
                        g_menu.handleEsc();
                    else if (g_shop.shopDisplayed())
                        g_shop.handleEsc();
                    else if (g_battle)
                        g_battle.handleEsc();
                    else if (g_titlescreen)
                        g_menu.displayTitleScreenMenu();
                    else
                        g_menu.displayMenu();
                    event.preventDefault();
                    break;
            }
        }
    }
}

function handleBufferedKey() {
    if (keyBuffer && !g_battle && !g_worldmap.isAnimating()) {
        var key = keyBuffer;
        keyBuffer = 0;
        switch (key) {
            case DOWN_ARROW:
                g_player.move(0, 1, FACING_DOWN);
                break;
            case UP_ARROW:
                g_player.move(0, -1, FACING_UP);
                break;
            case RIGHT_ARROW:
                g_player.move(1, 0, FACING_RIGHT);
                break;
            case LEFT_ARROW:
                g_player.move(-1, 0, FACING_LEFT);
                break;
            case SPACEBAR:
            case ENTER:
                if (g_textDisplay.textDisplayed())
                    g_textDisplay.clearText();
                else
                    g_worldmap.doAction();
                break;
        }
    }
}

if (window.opera || $.browser.mozilla)
    $(window).keypress(handleKeyPress);
else
    $(window).keydown(handleKeyPress);
$(window).keyup(handleKeyUp);

$(document).ready(function() {
    var showpad = document.getElementById("showpad");
    showpad.onclick = function() {
        if (showpad.innerHTML == "Show Gamepad") {
            var gamepad = document.getElementById("gamepad");
            gamepad.style.display = "block";
            showpad.innerHTML = "Hide Gamepad";
            var nokeyb = document.getElementById("nokeyb");
            nokeyb.style.display = "none";
        } else {
            var gamepad = document.getElementById("gamepad");
            gamepad.style.display = "none";
            showpad.innerHTML = "Show Gamepad";
            var nokeyb = document.getElementById("nokeyb");
            nokeyb.style.display = "inline";
        }
    };
    
    var upButton = document.getElementById("upButton");
    upButton.onclick = function(event) { handleKey(UP_ARROW, event); }
    var downButton = document.getElementById("downButton");
    downButton.onclick = function(event) { handleKey(DOWN_ARROW, event); }
    var leftButton = document.getElementById("leftButton");
    leftButton.onclick = function(event) { handleKey(LEFT_ARROW, event); }
    var rightButton = document.getElementById("rightButton");
    rightButton.onclick = function(event) { handleKey(RIGHT_ARROW, event); }
    var escButton = document.getElementById("escButton");
    escButton.onclick = function(event) { handleKey(ESC, event); }
    var enterButton = document.getElementById("enterButton");
    enterButton.onclick = function(event) { handleKey(ENTER, event); }
});