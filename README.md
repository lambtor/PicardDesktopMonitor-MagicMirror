# PicardMonitor

This project is my attempt to build an LCARS kiosk using a copy of the <a href='https://github.com/MichMich/MagicMirror'>MagicMirror project</a>.<br><br>

At its simplest, this is a highly customized fork of their project.  There are several hardware buttons mapped to keyboard buttons to trigger multiple actions:
<ul>
	<li>Screen blanking (set power pin to off while keeping pi on) via Pause key</li>
	<li>Theme changes (tng / ds9 / voy / red alert) via T/N, D, V, R buttons respectively.</li>
	<li>Full page refresh (control+F5)</li>
	<li>Close magic mirror browser window and tell pi to shutdown (via Insert key)</li>
</ul> All key actions are defined and executed with teensyLC, but shutdown and sounds are handled by mapping related keyboard buttons in hp-keypress.py, which is configured as a service on the pi.  hp-keypress.py relies on <a href="https://github.com/boppreh/keyboard">https://github.com/boppreh/keyboard</a> library.

This version is intended to run on a raspberry pi zero with a hyperpixel screen.  To get magicMirror running on a Pi Zero, I used this guide: https://www.linuxscrew.com/raspberry-pi-magic-mirror
<br>Many of the modules have been heavily modified, and the assembly of hardware is completely custom / original. Anyone attempting to build one of these should have some comfort level with soldering or assembling pi hardware.  I highly recommend that anyone building one of these should have a high comfort level with javascript programming & html / css manipulation.<br><br>

General issues to be aware of even after software setup is complete:<br>
<ul>
	<li>Mouse Button click sounds may not play from MMM-Sounds. This is usually due to an issue with a library not loading properly on page start, and can often be fixed with a control-F5 (hold main teensy button down for ~3 seconds to force full page refresh).</li>
	<li>Sounds may not play at all.  This can be an issue with pulse audio, and you may need to modify a config file to use the correct device as default.  See https://shallowsky.com/linux/pulseaudio-command-line.html for pulse audio management via command line.</li>
	<li>Not all areas of screen will be full of data on initial load, if you have not set up the config.js file for Magic Mirror.  You will need to set a location for date and weather, and you will need an API developer key for openweather. See https://docs.magicmirror.builders/modules/weatherforecast.html#configuration-options. News RSS feeds will need to be defined.</li>
	<li>Transit information was heavily modified by me for my own use, and will likely not apply to your location.  You will need to install an existing MagicMirror module for the transit data you want to see.  Scrolling transit data uses a modified MMM-HTTPRequestDisplay module, but you will need to modify a transit detail module on your own.  My train detail module has 2 separate definitions for train lines, both set to position "bottom-right". Train detail section was built with the following HTML structure:
	<ul>
		<li>outer div</li>
		<li>table of results (4 columns and 3 rows), with leftmost column showing name of stop. The top leftmost cell has a rowspan equal to number of train detail rows (max of 3).  Each of the train detail records has 1 column each for time to arrival, direction of train (end stop), and train type (line name).</li>
		<li>You'll need to modify your train/bus detail module to mimic the structure I'm using if you want it to have the style you want. See Modules/trainAndBusDetail for a non-functional js file showing the structure I am using.</li>
	</ul>
	</li>
</ul>
