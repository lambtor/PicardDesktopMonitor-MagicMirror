/* Magic Mirror Config Sample
 *
 * By Michael Teeuw http://michaelteeuw.nl
 * MIT Licensed.
 *
 * For more information how you can configurate this file
 * See https://github.com/MichMich/MagicMirror#configuration
 *
 */

var config = {
	address: "localhost", // Address to listen on, can be:
	                      // - "localhost", "127.0.0.1", "::1" to listen on loopback interface
	                      // - another specific IPv4/6 to listen on a specific interface
	                      // - "", "0.0.0.0", "::" to listen on any interface
	                      // Default, when address config is left out, is "localhost"
	port: 8080,
	ipWhitelist: ["127.0.0.1", "::ffff:127.0.0.1", "::1"], // Set [] to allow all IP addresses
	                                                       // or add a specific IPv4 of 192.168.1.5 :
	                                                       // ["127.0.0.1", "::ffff:127.0.0.1", "::1", "::ffff:192.168.1.5"],
	                                                       // or IPv4 range of 192.168.3.0 --> 192.168.3.15 use CIDR format :
	                                                       // ["127.0.0.1", "::ffff:127.0.0.1", "::1", "::ffff:192.168.3.0/28"],

	language: "en",	
	timeFormat: 24,
	units: "metric",
	// serverOnly:  true/false/"local" ,
			     // local for armv6l processors, default 
			     //   starts serveronly and then starts chrome browser
			     // false, default for all  NON-armv6l devices
			     // true, force serveronly mode, because you want to.. no UI on this device
	
	modules: [
		{
			module: "alert",
		},
		{
			module: "updatenotification",
			position: "top_bar"
		},
		{
			module: "clock",
			position: "middle_center",
			dateFormat: "YYYY.MM.DD",
			showPeriod: false,
			timeFormat: 24,
			showStarDate: 1
		},
		/*{
			module: "calendar",
			header: "US Holidays",
			position: "top_left",
			config: {
				calendars: [
					{
						symbol: "calendar-check",
						url: "webcal://www.calendarlabs.com/ical-calendar/ics/76/US_Holidays.ics"					}
				]
			}
		},*/		
		{
			module: "weatherforecast",
			position: "top_bar",
			header: "Weather Forecast",
			config: {
				location: "CITYNAME",
				locationID: "#######",  //ID from http://bulk.openweathermap.org/sample/city.list.json.gz; unzip the gz file and find your city
				appid: "APIKEY",
				appendLocationNameToHeader: false,
				degreeLabel: true,
				units: "metric",
				scale: true,
				fade: false
			}
		},
		{
			module: "currentweather",
			position: "top_bar",
			config: {
				location: "CITYNAME",
				locationID: "#######",  //ID from http://bulk.openweathermap.org/sample/city.list.json.gz; unzip the gz file and find your city
				appid: "APIKEY",
				degreeLabel: true,
				units: "metric"
			}
		},
		{
			module: 'MMM-CTA',
			position: 'bottom_right',
			config: {
				updateTime: 300000, // 5 minute, the API does not update much more often so going below this is unnecessary
				ctaApiKey: '',
				busStopName: '',  // String value, Name your bus stop
				stopId: 00000, // Bus station ID: Chicago and Milwaukee example; go to http://www.transitchicago.com/riding_cta/systemguide/default.aspx to find your stop ID
				maxResult: 0,  // The maximum number of incoming buses you want to display for bus stops
				ctaApiKeyTrain: 'APIKEY',
				trainStopName: 'STOPNAME',  //String value, name your train stop
				trainStationID: 000000, //Train station ID:  Chicago Blue line example; http://www.transitchicago.com/developers/ttdocs/default.aspx#_Toc296199909
				maxResultTrain: 3, // Max number of incoming trains to display
				moduleInstance: 1, // To run multiple instances of this module
				//trainIconColor: '#C57C69'
				trainIconColor: 'auto'
			}		
	    },
		{
			module: 'MMM-CTA',
			position: 'bottom_right',
			config: {
				//1000 = 1 second
				updateTime: 300000, // 5 minutes, the API does not update much more often so going below this is unnecessary
				ctaApiKey: '',
				busStopName: '',  // String value, Name your bus stop
				stopId: 30126, // Bus station ID: Chicago and Milwaukee example; go to http://www.transitchicago.com/riding_cta/systemguide/default.aspx to find your stop ID
				maxResult: 0,  // The maximum number of incoming buses you want to display for bus stops
				ctaApiKeyTrain: 'APIKEY',
				trainStopName: 'STOPNAME2',  //String value, name your train stop
				trainStationID: 000000, //Train station ID:  Chicago Blue line example; http://www.transitchicago.com/developers/ttdocs/default.aspx#_Toc296199909
				maxResultTrain: 3, // Max number of incoming trains to display
				moduleInstance: 2, // To run multiple instances of this module
				trainIconColor: 'auto'
			}
		},
		{
			module: "newsfeed",
			position: "bottom_bar",
			config: {
				feeds: [
					{
						title: "WORLD",
						url: "http://feeds.bbci.co.uk/news/world/rss.xml"
					},
					{
						title: "TECHNOLOGY",
						url: "http://feeds.bbci.co.uk/news/technology/rss.xml"
					},
					{
						title: "SCIENCE",
						url: "http://feeds.bbci.co.uk/news/science_and_environment/rss.xml"
					}
				],
				showSourceTitle: true,
				showPublishDate: true,
				broadcastNewsFeeds: true,
				broadcastNewsUpdates: true,
				reloadInterval: 14 * 60 * 1000,
				//frequency of feed entry cycling
				updateInterval: 10 * 60 * 1000,
				//ignore anything older than 12 hrs
				ignoreOlderThan: 12 * 60 * 60 * 1000,
				ignoreOldItems: true,
				showDescription: true,
				truncDescription: false,
				sortOrder: 1,
				feedLabel: "HEADLINE"
			}
		},
		{
			module: "newsfeed",
			position: "bottom_bar",
			config: {
				feeds: [
					{	title: "WHITESOX",
						url: "https://www.mlb.com/whitesox/feeds/news/rss.xml"
					},
					{	title: "MLB",
						/*url: "https://www.mlb.com/feeds/news/rss.xml"*/
					    url: "https://www.espn.com/espn/rss/mlb/news"
					},
					{	title: "NFL", 
						url: "https://www.espn.com/espn/rss/nfl/news"
					}
				],
				showSourceTitle: true,
				showPublishDate: true,
				broadcastNewsFeeds: true,
				broadcastNewsUpdates: true,
				reloadInterval: 14 * 60 * 1000,
				updateInterval: 10 * 60 * 1000,
				ignoreOldItems: true,
				ignoreOlderThan: 12 * 60 * 60 * 1000,
				showDescription: true,
				truncDescription: false,
				sortOrder: 2,
				feedLabel: "SPORT"
			}
		},
		//CTA RSS feed for route disruptions/alerts is NOT well maintained data
		,{	module: "MMM-HTTPRequestDisplay",
			class: "newsfeed",
			position: "bottom_bar",
			config: {
				httpRequestURL: "http://lapi.transitchicago.com/api/1.0/routes.aspx?type=rail",
				updateInterval: (10 * 60 * 1000)	//10 minutes
			}
		},  {
			//help prevent LCD screen burnIn
			module: "MMM-BurnIn",
			//position: "bottom_bar",
			config: {
				updateInterval: 3,
				invertDuration: 17
			}
		},	
		{
		module: "MMM-KeyBindings",
			config: {
				evdev: { enabled: false },
				enableKeyboard: true
			}
		}, /*
 		{
			module: "MMM-Remote-Control",
			config: {
				customCommand: {},
				showModuleApiMenu: false,
				apiKey: ""
			}	
		}, */{
			module: "MMM-Sounds",
			config: {
				startupSound: "buzz.wav" ,
				quietTimeStart: "10:00",
				quietTimeEnd: "08:00"
			}
		}
	]

};

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") {module.exports = config;}

