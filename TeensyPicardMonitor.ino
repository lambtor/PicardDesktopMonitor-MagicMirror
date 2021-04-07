
#include <Bounce.h>
//#include <Keyboard.h>

// Create Bounce objects for each button.  The Bounce object
// automatically deals with contact chatter or "bounce", and
// it makes detecting changes very simple.
//Main button uses pin 23
Bounce button0 = Bounce(23, 10);
Bounce button1 = Bounce(1, 10);  // 10 = 10 ms debounce time

//single keypress is print screen button
//held for 2-5 seconds => full refresh of page or restart
//held for 5+ seconds => shutdown machine
//KEY_PAUSE				toggle display power on/off
//KEY_SCROLL_LOCK		close magic mirror and shutdown system -> 
//						send keyboard alt+F4, then 
//						os.system("sudo shutdown -P now")
//KEY_PRINTSCREEN		refresh magicmirror (control + F5)

#define KEYMAP_MAIN		KEY_PAUSE
#define KEYMAP_SECOND	KEY_SCROLL_LOCK
#define KEYMAP_THIRD	KEY_PRINTSCREEN
#define CTRL_KEY		MODIFIERKEY_CTRL
#define F5_KEY			KEY_F5
//#define F5_KEY			KEY_A
//#define KEYMAP_MAIN		KEY_M
//#define KEYMAP_THIRD	KEY_D

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
  
  pinMode(23, INPUT_PULLUP);
  //pinMode(1, INPUT_PULLUP);
  mnButtonStart = millis();
}

void loop() {
  // Update all the buttons.  There should not be any long
  // delays in loop(), so this runs repetitively at a rate
  // faster than the buttons could be pressed and released.
  button0.update();
  //button1.update();

  // Check each button for "falling" edge.
  // Type a message on the Keyboard when each button presses
  // Update the Joystick buttons only upon changes.
  // falling = high (not pressed - voltage from pullup resistor)
  //           to low (pressed - button connects pin to ground)
  if (button0.fallingEdge()) {
    Keyboard.press(KEYMAP_MAIN);
	mnButtonStart = millis();
  }
  //if (button1.fallingEdge()) {
	//Keyboard.press(KEY_0);
  //}
  
  
  // Check each button for "rising" edge
  // Type a message on the Keyboard when each button releases.
  // For many types of projects, you only care when the button
  // is pressed and the release isn't needed.
  // rising = low (pressed - button connects pin to ground)
  //          to high (not pressed - voltage from pullup resistor)
	if (button0.risingEdge()) {
		Keyboard.release(KEYMAP_MAIN);
		mnButtonEnd = millis();
		//button was held down more than 2 seconds but less than 5
		if ((mnButtonEnd - mnButtonStart) > 2000 ) {			
			if ((mnButtonEnd - mnButtonStart) < 5000 ) {
				//button was held down between 2 and 5 seconds - send board refresh combo
				// press and hold CTRL
				Keyboard.set_modifier(CTRL_KEY);
				Keyboard.set_key1(F5_KEY);
				Keyboard.send_now();
				
				// release all the keys at the same instant
				Keyboard.set_modifier(0);
				Keyboard.set_key1(0);
				Keyboard.send_now();
			} else {
				//button was held down for more than 5 seconds - send shutdown trigger key
				Keyboard.press(KEYMAP_THIRD);
				delay(300);
				Keyboard.release(KEYMAP_THIRD);
			}			
		}
		
	}
	//if (button1.risingEdge()) {
		//Keyboard.release(KEY_0);
	//}
  
}	//end loop
