
#include <Bounce.h>
//#include <Keyboard.h>



//single keypress is print screen button
//held for 2-5 seconds => full refresh of page or restart
//held for 5+ seconds => shutdown machine
//KEY_PAUSE				toggle display power on/off
//KEY_SCROLL_LOCK		close magic mirror and shutdown system -> 
//scrlk in keyboard python script
//						send keyboard alt+F4, then 
//						os.system("sudo shutdown -P now")
//KEY_PRINTSCREEN		refresh magicmirror (control + F5)
//prnt scrn, prtscn, print screen
//in python interface

#define KEYMAP_MAIN		KEY_PAUSE
#define KEYMAP_SECOND	KEY_SCROLL_LOCK	
#define KEYMAP_THIRD	KEY_INSERT
#define CTRL_KEY		MODIFIERKEY_CTRL
#define ALT_KEY			MODIFIERKEY_ALT
#define F4_KEY			KEY_F4
#define F5_KEY			KEY_F5
#define N_KEY			KEY_N
#define D_KEY			KEY_D
#define V_KEY			KEY_V
#define R_KEY			KEY_R

#define PIN_BUTTON0		23
#define PIN_BUTTON1		22
#define PIN_BUTTON2		21
#define PIN_BUTTON3		24
#define PIN_BUTTON4		25
#define PIN_BUTTON_SD	0

//#define F5_KEY			KEY_A
//#define KEYMAP_MAIN		KEY_M
//#define KEYMAP_THIRD	KEY_D

// Create Bounce objects for each button.  The Bounce object
// automatically deals with contact chatter or "bounce", and
// it makes detecting changes very simple.
//Main button uses pin 23
Bounce button0 = Bounce(PIN_BUTTON0, 30);

Bounce button1 = Bounce(PIN_BUTTON1, 30);  // 10 = 10 ms debounce time as 2nd parameter. 1st parameter is digital pin #
Bounce button2 = Bounce(PIN_BUTTON2, 30);
Bounce button3 = Bounce(PIN_BUTTON3, 30);
Bounce button4 = Bounce(PIN_BUTTON4, 30);
Bounce buttonSD = Bounce(PIN_BUTTON_SD, 30);


unsigned long mnButtonStart	= 0;
unsigned long mnButtonEnd = 0;

void setup() {
  // Configure the pins for input mode with pullup resistors.
  // The pushbuttons connect from each pin to ground.  When
  // the button is pressed, the pin reads LOW because the button
  // shorts it to ground.  When released, the pin reads HIGH
  // because the pullup resistor connects to +5 volts inside
  // the chip.  LOW for "on", and HIGH for "off" may seem
  // backwards, but using the on-chip pullup resistors is very
  // convenient.  The scheme is called "active low", and it's
  // very commonly used in electronics... so much that the chip
  // has built-in pullup resistors!
  
  pinMode(PIN_BUTTON0, INPUT_PULLUP);
  
  pinMode(PIN_BUTTON1, INPUT_PULLUP);
  pinMode(PIN_BUTTON2, INPUT_PULLUP);
  pinMode(PIN_BUTTON3, INPUT_PULLUP);
  pinMode(PIN_BUTTON4, INPUT_PULLUP);
  pinMode(PIN_BUTTON_SD, INPUT_PULLUP);
  
  mnButtonStart = millis();
}

void loop() {
	// Update all the buttons.  There should not be any long
	// delays in loop(), so this runs repetitively at a rate
	// faster than the buttons could be pressed and released.
	button0.update();
	
	button1.update();
	button2.update();
	button3.update();
	button4.update();
	
	buttonSD.update();

	// Check each button for "falling" edge.
	// Type a message on the Keyboard when each button presses
	// Update the Joystick buttons only upon changes.
	// falling = high (not pressed - voltage from pullup resistor)
	//           to low (pressed - button connects pin to ground)
	if (button0.fallingEdge()) {
		//Keyboard.press(KEYMAP_MAIN);
		mnButtonStart = millis();
	}
	if (button1.fallingEdge()) {
		Keyboard.press(N_KEY);
	}
	if (button2.fallingEdge()) {
		Keyboard.press(D_KEY);
	}
	if (button3.fallingEdge()) {
		Keyboard.press(V_KEY);
	}
	if (button4.fallingEdge()) {
		Keyboard.press(R_KEY);
	}
	
	if (buttonSD.risingEdge()) {
		Keyboard.press(KEYMAP_SECOND);
	}

	//4 theme triggers and 1 shutdown button
	/* N	D	V	R  */

	//all 4 buttons for theme changes - these are mapped to single letter keys in magic mirror
	if (button1.risingEdge()) {
		Keyboard.release(N_KEY);
	}
	if (button2.risingEdge()) {
		Keyboard.release(D_KEY);
	}
	if (button3.risingEdge()) {
		Keyboard.release(V_KEY);
	}
	if (button4.risingEdge()) {
		Keyboard.release(R_KEY);
	}

	if (buttonSD.risingEdge()) {
		Keyboard.release(KEYMAP_SECOND);

		//send alt-f4 to close magic mirror first
		Keyboard.set_modifier(ALT_KEY);
		Keyboard.set_key1(F4_KEY);
		Keyboard.send_now();
		//delay ensures all systems will accept keystroke - mac osx is largest throttler
		delay(300);

		Keyboard.set_modifier(0);
		Keyboard.set_key1(0);
		Keyboard.send_now();
		delay(300);
	}

	// Check each button for "rising" edge
	// Type a message on the Keyboard when each button releases.
	// For many types of projects, you only care when the button
	// is pressed and the release isn't needed.
	// rising = low (pressed - button connects pin to ground)
	//          to high (not pressed - voltage from pullup resistor)
	if (button0.risingEdge()) {		
		mnButtonEnd = millis();
		
		//button was held down more than 2 seconds but less than 5
		if ((mnButtonEnd - mnButtonStart) > 2000) {			
			if ((mnButtonEnd - mnButtonStart) < 5000) {
				//button was held down between 2 and 5 seconds - send board refresh combo
				// press and hold CTRL
				Keyboard.set_modifier(CTRL_KEY);
				Keyboard.set_key1(F5_KEY);
				Keyboard.send_now();
				//delay ensures all systems will accept keystroke - mac osx is largest throttler
				delay(300);
				
				// release all the keys at the same instant
				Keyboard.set_modifier(0);
				Keyboard.set_key1(0);
				Keyboard.send_now();
			} else {
				//send alt-f4 to close magic mirror first
				Keyboard.set_modifier(ALT_KEY);
				Keyboard.set_key1(F4_KEY);
				Keyboard.send_now();
				//delay ensures all systems will accept keystroke - mac osx is largest throttler
				delay(300);
				Keyboard.set_modifier(0);
				Keyboard.set_key1(0);
				Keyboard.send_now();
				delay(300);
			
				//button was held down for more than 5 seconds - send shutdown trigger key
				Keyboard.press(KEYMAP_THIRD);
				//delay ensures all systems will accept keystroke - mac osx is largest throttler
				delay(300);
				Keyboard.release(KEYMAP_THIRD);
			}			
		} else {
			Keyboard.press(KEYMAP_MAIN);
			delay(300);
			Keyboard.release(KEYMAP_MAIN);
		}
		
	}
  
}	//end loop
