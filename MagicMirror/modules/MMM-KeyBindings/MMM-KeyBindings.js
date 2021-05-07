/* global document, Module, window, Mousetrap, console */
/* Magic Mirror
 * Module: MMM-KeyBindings
 *
 * By shbatm
 * MIT Licensed.
 */
/* jshint esversion:6 */
var global = this;

Module.register("MMM-KeyBindings", {
    defaults: {
        enabledKeyStates: ["KEY_PRESSED", "KEY_LONGPRESSED"], // Other options are 'KEY_UP', 'KEY_DOWN', 
        // 'KEY_HOLD' but evdev.raw_mode must be true to receive
        handleKeys: [], // List of additional keys to handle in this module; blank == standard set
        disableKeys: [], // list of keys to ignore from the default set.
        enableKeyboard: true,
        evdev: {
            enabled: false,
            eventPath: '/dev/input/btremote',
        },
        keyMap: {
            Home: "KEY_HOMEPAGE",
            Enter: "KEY_KPENTER",
            ArrowLeft: "KEY_LEFT",
            ArrowRight: "KEY_RIGHT",
            ArrowUp: "KEY_UP",
            ArrowDown: "KEY_DOWN",
            Menu: "KEY_MENU",
            MediaPlayPause: "KEY_PLAYPAUSE",
            MediaNextTrack: "KEY_FASTFORWARD",
            MediaPreviousTrack: "KEY_REWIND",
            Return: "KEY_BACK"
        },
        actions: [{
            key: "Home",
            state: "KEY_LONGPRESSED",
            instance: "SERVER",
            mode: "DEFAULT",
            notification: "REMOTE_ACTION",
            payload: { action: "MONITORTOGGLE" }
            // Can also be:
            // changeMode: "NEW_MODE"
            // instead of notification & payload
        }]
    },
	
	currentTheme: "tng",

    // Allow for control on muliple instances
    instance: (global.location && ["localhost", "127.0.0.1", "::1", "::ffff:127.0.0.1", undefined, "0.0.0.0"].indexOf(global.location.hostname) > -1) ? "SERVER" : "LOCAL",

    requiresVersion: "2.3.0", // Required version of MagicMirror

    start: function() {
        console.log(this.name + " has started...");

        // Allow Legacy Config Settings:
        if (this.config.evdevKeyMap) {
            this.config.keyMap = this.config.evdevKeyMap;
        }

        if (this.config.evdev.enabled) {
            this.sendSocketNotification("ENABLE_EVDEV", this.config.evdev);
        }

        this.currentKeyPressMode = "DEFAULT";

        // Generate a reverse key map
        this.reverseKeyMap = {};
        for (var eKey in this.config.keyMap) {
            if (this.config.keyMap.hasOwnProperty(eKey)) {
                this.reverseKeyMap[this.config.keyMap[eKey]] = eKey;
            }
        }
		
		var oThisInstance = this;
		oThisInstance.currentTheme = "tng";
		
		//set up the eventhandlers for the on-screen theme buttons
		//makes the most sense to do this here, considering the name of the module
		//register button click events in this module because you can't do it directly
		//outside of electron?  
		document.querySelector("#btntng").addEventListener("click", function(e) {
			//play button sound, then set theme
			//this.sendNotification("PLAY_SOUND", "");
			
			oThisInstance.clearCurrentTheme(true);
			
			oThisInstance.setTNGTheme();
			oThisInstance.currentTheme = "tng";
		});
		document.querySelector("#btnds9").addEventListener("click", function(e) {
			//play button sound, then set theme
			//this.sendNotification("PLAY_SOUND", "");
			
			oThisInstance.clearCurrentTheme(true);
			oThisInstance.setDS9Theme();
			oThisInstance.currentTheme = "ds9";
		});
		document.querySelector("#btnvoy").addEventListener("click", function(e) {
			//play button sound, then set theme
			//this.sendNotification("PLAY_SOUND", "");
			
			oThisInstance.clearCurrentTheme(true);
			oThisInstance.setVOYTheme();
			oThisInstance.currentTheme = "voy";
		});
		document.querySelector("#btnred").addEventListener("click", function(e) {
			//play button sound, then set theme
			//this.sendNotification("PLAY_SOUND", "");
			//console.log("got here red");
			//modify this to have red button toggle on/off?
			//base functions first, then add robustitude
			//remove all classes added by button clicks via function call
			oThisInstance.clearCurrentTheme(true);			
			oThisInstance.setRedTheme();
			oThisInstance.currentTheme = "red";
		});

		//handle keypresses in here since this module isn't funneling actions
		document.addEventListener('keypress', function(e) {			
			//console.log("keypress event " + e.code);
			if (e.code == "KeyN" || e.code == "KeyT") {
				oThisInstance.clearCurrentTheme(true);			
				oThisInstance.setTNGTheme();
				oThisInstance.currentTheme = "tng";
			} else if (e.code == "KeyD") {
				oThisInstance.clearCurrentTheme(true);
				oThisInstance.setDS9Theme();
				oThisInstance.currentTheme = "ds9";
			} else if (e.code == "KeyV") {
				oThisInstance.clearCurrentTheme(true);
				oThisInstance.setVOYTheme();
				oThisInstance.currentTheme = "voy";
			} else if (e.code == "KeyR") {
				oThisInstance.clearCurrentTheme(true);		
				oThisInstance.setRedTheme();
				oThisInstance.currentTheme = "red";
			}
		});

    },

    getScripts: function() {
        return ['keyHandler.js', 'mousetrap.min.js', 'mousetrap-global-bind.min.js'];
    },

    setupMousetrap: function() {
        var self = this;
        var keys = ['home', 'enter', 'left', 'right', 'up', 'down', 'return', 'playpause', 'nexttrack', 'previoustrack', 'Menu'];
        var keyCodes = { 179: 'playpause', 178: 'nexttrack', 177: 'previoustrack', 93: 'Menu' };
        var keyMap = { ContextMenu: "Menu" };

        Mousetrap.addKeycodes(keyCodes);

        // Add extra keys (must be in Mousetrap form)
        // TODO: Add ability to add extra keycodes as well
        keys = keys.concat(this.config.handleKeys);

        // Remove Disabled Keys
        for (var i = this.config.disableKeys.length - 1; i >= 0; i--) {
            var j = keys.indexOf(this.config.disableKeys[i]);
            if (j > -1) {
                keys.splice(j, 1);
            }
        }

        // console.log(keys);

        Mousetrap.bindGlobal(keys, (e) => {
            // Prevent the default action from occuring
            if (e.preventDefault) {
                e.preventDefault();
            } else {
                // internet explorer
                e.returnValue = false;
            }

            var payload = {};
            payload.keyName = e.key;

            // Standardize the name
            if (payload.keyName in keyMap) {
                payload.keyName = keyMap[payload.keyName];
            }

            if (this.config.evdev.rawMode) {
                payload.keyState = e.type;
            } else {
                payload.keyState = "KEY_PRESSED";
            }
            payload.currentMode = self.currentKeyPressMode;
            payload.sender = self.instance;
            payload.instance = self.instance;
            payload.protocol = "mousetrap";
            self.sendNotification("KEYPRESS", payload);
            self.doAction(payload);
        });

        // Squash bad actors:
        Mousetrap.bind(['home', 'Menu'], (e) => {
            e.preventDefault();
            return false;
        }, 'keyup');
    },

    handleEvDevKeyPressEvents: function(payload) {
        // Add the current mode to the payload
        payload.currentMode = this.currentKeyPressMode;

        // Add the sender to the payload (useful if you have multiple clients connected; 
        // the evdev keys only work on the main server)
        payload.sender = "SERVER";
        payload.protocol = "evdev";
        payload.instance = this.instance;

        // Standardize the name
        if (payload.keyName in this.reverseKeyMap) {
            payload.keyName = this.reverseKeyMap[payload.keyName];
        }
        this.sendNotification("KEYPRESS", payload);
        this.doAction(payload);
    },

    // socketNotificationReceived from helper
    socketNotificationReceived: function(notification, payload) {
        // console.log("Working notification system. Notification:", notification, "payload: ", payload);
        if (notification === "KEYPRESS") {
			//console.log("KP socket received| Notification:", notification, "payload: ", payload);
            if (this.config.enabledKeyStates.indexOf(payload.keyState) > -1) {
                this.handleEvDevKeyPressEvents(payload);
            }
        }

		if (notification === "THEME_PERSIST") {
			//console.log("received notification theme change");
			//Log.log("socket notify received theme persist");
			this.clearCurrentTheme(false);
			this.persistTheme();			
		}
    },

    notificationReceived: function(notification, payload, sender) {		
        if (notification === "DOM_OBJECTS_CREATED") {
            if (this.config.enableKeyboard) {
                console.log("Setting up Mousetrap keybindings.");
                this.setupMousetrap();
            }
        }
        if (notification === "KEYPRESS_MODE_CHANGED") {
            this.currentKeyPressMode = payload || "DEFAULT";
        }
		
		//handle notifications to persist theme across newly added elements
		if (notification === "THEME_PERSIST") {			
			//Log.log("notify received theme persist");
			var oSelf = this;
			this.clearCurrentTheme(false);
			this.persistTheme();
			//need this because sometimes it takes a second for new or refreshed elements to register with dom?
			let nTimerID = setTimeout(function() {
				oSelf.clearCurrentTheme(false);
				oSelf.persistTheme();
			}, 1000);
		}
    },
	
	persistTheme: function() {
		switch (this.currentTheme) {
			case "tng":
				//everything new comes in as default theme, so is this call needed?
				//keep rest of stuff since tng is the baseline theme
				this.setTNGTheme();
				break;
			case "red":
				this.setRedTheme();		
				break;
			case "ds9":
				this.setDS9Theme();
				break;
			case "voy":
				this.setVOYTheme();
				break;
			default:
				break;
		}
	},
	
	clearCurrentTheme: function(bResetFlag) {
		switch (this.currentTheme) {
			case "tng":
				Array.from(document.getElementsByClassName("tngactive")).forEach((oElement) => {
					oElement.classList.remove("tngactive");
				});
				//keep rest of stuff since tng is the baseline theme
				break;
			case "red":
				this.clearRedTheme();		
				break;
			case "ds9":
				this.clearDS9Theme();
				break;
			case "voy":
				this.clearVOYTheme();
				break;
			default:
				break;
		}
		if (bResetFlag) {
			//clear all theme-specific class additions
			this.currentTheme = "";
		}
	},
	
	clearRedTheme: function() {
		Array.from(document.getElementsByClassName("redswoop")).forEach((oElement) => {
			oElement.classList.remove("redswoop");
			oElement.classList.remove("pulse");
		});
		Array.from(document.getElementsByClassName("redbordercolor")).forEach((oElement) => {
			oElement.classList.remove("redbordercolor");
		});
		Array.from(document.getElementsByClassName("redmaintitle")).forEach((oElement) => {
			oElement.classList.remove("redmaintitle");
		});
		Array.from(document.getElementsByClassName("redlabel")).forEach((oElement) => {
			oElement.classList.remove("redlabel");
		});

		document.getElementsByTagName("body").item(0).classList.remove("redbasetext");
		document.getElementById("btnred").classList.remove("redactive");
		document.getElementById("btntng").classList.remove("redinactive");
		document.getElementById("btnds9").classList.remove("redinactive");
		document.getElementById("btnvoy").classList.remove("redinactive");
	},
	
	clearDS9Theme: function() {
		Array.from(document.getElementsByClassName("ds9swoop")).forEach((oElement) => {
			oElement.classList.remove("ds9swoop");
		});
		Array.from(document.getElementsByClassName("ds9bordercolor")).forEach((oElement) => {
			oElement.classList.remove("ds9bordercolor");
		});
		//Array.from(document.getElementsByClassName("ds9bordercolor2")).forEach((oElement) => {
		//	oElement.classList.remove("ds9bordercolor2");
		//});
		//Array.from(document.getElementsByClassName("ds9bordercolor3")).forEach((oElement) => {
		//	oElement.classList.remove("ds9bordercolor3");
		//});
		//Array.from(document.getElementsByClassName("ds9bordercolor4")).forEach((oElement) => {
		//	oElement.classList.remove("ds9bordercolor4");
		//});
		Array.from(document.getElementsByClassName("ds9maintitle")).forEach((oElement) => {
			oElement.classList.remove("ds9maintitle");
		});
		Array.from(document.getElementsByClassName("ds9label")).forEach((oElement) => {
			oElement.classList.remove("ds9label");
		});

		document.getElementsByTagName("body").item(0).classList.remove("ds9basetext");
		//document.getElementById("btnred").classList.remove("ds9inactive");
		//document.getElementById("btntng").classList.remove("ds9inactive");
		document.getElementById("btnds9").classList.remove("ds9active");
		//document.getElementById("btnvoy").classList.remove("ds9inactive");
	},
	
	clearVOYTheme: function() {
		Array.from(document.getElementsByClassName("voyswoop")).forEach((oElement) => {
			oElement.classList.remove("voyswoop");
		});
		Array.from(document.getElementsByClassName("voybordercolor")).forEach((oElement) => {
			oElement.classList.remove("voybordercolor");
		});
		//futureproof to support different border colors in each area
		//Array.from(document.getElementsByClassName("voybordercolor2")).forEach((oElement) => {
		//	oElement.classList.remove("voybordercolor2");
		//});
		Array.from(document.getElementsByClassName("voybordercolor3")).forEach((oElement) => {
			oElement.classList.remove("voybordercolor3");
		});
		Array.from(document.getElementsByClassName("voybordercolor4")).forEach((oElement) => {
			oElement.classList.remove("voybordercolor4");
		});
		Array.from(document.getElementsByClassName("voymaintitle")).forEach((oElement) => {
			oElement.classList.remove("voymaintitle");
		});
		Array.from(document.getElementsByClassName("voylabel")).forEach((oElement) => {
			oElement.classList.remove("voylabel");
		});

		document.getElementsByTagName("body").item(0).classList.remove("voybasetext");
		document.getElementById("btnvoy").classList.remove("voyactive");
	},
	
	setRedTheme: function() {
		//add classes connected to this button/theme
		//body font color, bordercolor1, bordercolor2, bordercolor3, bordercolor4
		//swoop1
		//main title color, datalabel 
		Array.from(document.getElementsByClassName("swoop1")).forEach((oElement) => {
			oElement.classList.add("redswoop");			
			oElement.classList.add("pulse");
		});
		Array.from(document.getElementsByClassName("bordercolor1")).forEach((oElement) => {
			oElement.classList.add("redbordercolor");
		});
		Array.from(document.getElementsByClassName("bordercolor2")).forEach((oElement) => {
			oElement.classList.add("redbordercolor");
		});
		Array.from(document.getElementsByClassName("bordercolor3")).forEach((oElement) => {
			oElement.classList.add("redbordercolor");
		});
		Array.from(document.getElementsByClassName("bordercolor4")).forEach((oElement) => {
			oElement.classList.add("redbordercolor");
		});
		Array.from(document.getElementsByClassName("maintitlediv")).forEach((oElement) => {
			oElement.classList.add("redmaintitle");
		});
		Array.from(document.getElementsByClassName("datalabel")).forEach((oElement) => {
			oElement.classList.add("redlabel");
		});			

		//document.getElementsByTagName("body").item(0).style.color = "#DEDEDE";
		document.getElementsByTagName("body").item(0).classList.add("redbasetext");	
		//need to reference current button to set its active color
		document.getElementById("btnred").classList.add("redactive");
		document.getElementById("btntng").classList.add("redinactive");
		document.getElementById("btnds9").classList.add("redinactive");
		document.getElementById("btnvoy").classList.add("redinactive");
		this.currentTheme = "red";
	},
	
	setDS9Theme: function() {
		Array.from(document.getElementsByClassName("swoop1")).forEach((oElement) => {
			oElement.classList.add("ds9swoop");
		});
		Array.from(document.getElementsByClassName("bordercolor1")).forEach((oElement) => {
			oElement.classList.add("ds9bordercolor");
		});
		Array.from(document.getElementsByClassName("bordercolor2")).forEach((oElement) => {
			oElement.classList.add("ds9bordercolor");
		});
		Array.from(document.getElementsByClassName("bordercolor3")).forEach((oElement) => {
			oElement.classList.add("ds9bordercolor");
		});
		Array.from(document.getElementsByClassName("bordercolor4")).forEach((oElement) => {
			oElement.classList.add("ds9bordercolor");
		});
		Array.from(document.getElementsByClassName("maintitlediv")).forEach((oElement) => {
			oElement.classList.add("ds9maintitle");
		});
		Array.from(document.getElementsByClassName("datalabel")).forEach((oElement) => {
			oElement.classList.add("ds9label");
		});			

		//document.getElementsByTagName("body").item(0).style.color = "#DEDEDE";
		document.getElementsByTagName("body").item(0).classList.add("ds9basetext");			
		//need to reference current button to set its active color
		//do NOT need to set inactive colors as they should inherit from main swoop.
		//only red theme needs bkgcolors set as they will otherwise disappear on main swoop pulse
		//document.getElementById("btnred").classList.add("ds9inactive");
		//document.getElementById("btntng").classList.add("redinactive");
		document.getElementById("btnds9").classList.add("ds9active");
		//document.getElementById("btnvoy").classList.add("redinactive");
		this.currentTheme = "ds9";
	},
	
	setVOYTheme: function() {
		Array.from(document.getElementsByClassName("swoop1")).forEach((oElement) => {
			oElement.classList.add("voyswoop");
		});
		Array.from(document.getElementsByClassName("bordercolor1")).forEach((oElement) => {
			oElement.classList.add("voybordercolor");
		});
		Array.from(document.getElementsByClassName("bordercolor2")).forEach((oElement) => {
			oElement.classList.add("voybordercolor");
		});
		Array.from(document.getElementsByClassName("bordercolor3")).forEach((oElement) => {
			oElement.classList.add("voybordercolor3");
		});
		Array.from(document.getElementsByClassName("bordercolor4")).forEach((oElement) => {
			oElement.classList.add("voybordercolor4");
		});
		Array.from(document.getElementsByClassName("maintitlediv")).forEach((oElement) => {
			oElement.classList.add("voymaintitle");
		});
		Array.from(document.getElementsByClassName("datalabel")).forEach((oElement) => {
			oElement.classList.add("voylabel");
		});			

		//document.getElementsByTagName("body").item(0).style.color = "#DEDEDE";
		document.getElementsByTagName("body").item(0).classList.add("voybasetext");			
		//need to reference current button to set its active color
		//do NOT need to set inactive colors as they should inherit from main swoop.
		//only red theme needs bkgcolors set as they will otherwise disappear on main swoop pulse
		document.getElementById("btnvoy").classList.add("voyactive");
		this.currentTheme = "voy";
	},
	
	setTNGTheme: function() {
		//this is the base/default theme, so only need to set tng button as active after clearing active theme(s)
		document.getElementById("btntng").classList.add("tngactive");
	},

    doAction: function(payload) {
        let action = this.config.actions.filter(k => k.key === payload.keyName);
        if (action) {
            action.forEach(a => {
                if (a.state && a.state !== payload.keyState) { return; }
                if (a.instance && a.instance !== payload.sender) { return; }
                if (a.mode && a.mode !== payload.currentMode) { return; }

                if ("changeMode" in a) {
                    this.currentKeyPressMode = a.changeMode;
                    this.sendNotification("KEYPRESS_MODE_CHANGED", a.changeMode);
                } else {
                    this.sendNotification(a.notification, a.payload);
                }
            });
        }
    }
});
