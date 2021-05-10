#!/usr/bin/python
import time
import pigpio
import keyboard
import os
#from subprocess import call

mGPIO = pigpio.pi()
mnPauseDown = 0
mnShutdownThreshold = 3000000
mbIsDownNow = False

#print(keyboard.normalize_name("print screen"))

def oKeyHoldPress(e):
	#print("holdPress invoked")
	global mnPauseDown
	global mbIsDownNow
	if (mbIsDownNow == False and (mnPauseDown + 100000 < time.time())):
		mbIsDownNow = True
		mnPauseDown = time.time()
	#print(mnPauseDown)

def oKeyShutdown(e):
	#call(["aplay", "/home/pi/MagicMirror/modules/MMM-Sounds/sounds/tngScreenOff.wav"])
	os.system("sudo aplay /home/pi/MagicMirror/modules/MMM-Sounds/sounds/tngScreenOff.wav")
	os.system("sudo shutdown -h now")

#def oKey_Release(e):
def oKey_Release(e):
	#print("keypress invoked")
	mnBrightnessLevel = 96
	mnHyperpixelPowerPin = 19
	nCurrentBrightness = 0
	#if oPressedKey == moPauseKey:
	#pixel power pin is 19
	nCurrentBrightness = mGPIO.get_PWM_dutycycle(mnHyperpixelPowerPin)
	if nCurrentBrightness == 0:
		#call(["aplay", "/home/pi/MagicMirror/modules/MMM-Sounds/sounds/tngScreenOn.wav"])
		mGPIO.set_PWM_dutycycle(mnHyperpixelPowerPin, mnBrightnessLevel)
		os.system("sudo aplay /home/pi/MagicMirror/modules/MMM-Sounds/sounds/tngKey.wav &")
	else:
		#call(["aplay", "/home/pi/MagicMirror/modules/MMM-Sounds/sounds/tngScreenOff.wav"])
		mGPIO.set_PWM_dutycycle(mnHyperpixelPowerPin, 0)
		os.system("sudo aplay /home/pi/MagicMirror/modules/MMM-Sounds/sounds/tngKey.wav &")


#keyboard.add_hotkey('pause', oKey_Release)
keyboard.on_release_key('pause', oKey_Release)
#print screen print_screen, print all dont work
#keyboard.add_hotkey('insert', oKeyShutdown)
keyboard.on_release_key('insert', oKeyShutdown)

keyboard.wait()
