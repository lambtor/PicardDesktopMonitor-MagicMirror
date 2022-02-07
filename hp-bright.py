#!/usr/bin/python
print("hyperpixel brightness script triggered-------")
import pigpio
gpio = pigpio.pi()
#0 - 255 is value, this should be half
gpio.set_PWM_dutycycle(19, 96)
pi@raspberrypi:~ $
