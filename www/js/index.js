/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

//test si chrome
var isMobile = true;
if (window.chrome)
	isMobile = false;

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
      /*  var el = document.getElementById("chargement"); 
        el.addEventListener('clic', this.getlssfile, false);*/
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
onDeviceReady: function() {
    app.receivedEvent('deviceready');
    hide_div('blocinit');

    if(isMobile)
    {
    	//gestion GPS
	    var onSuccessGPS = function(position) {
	       /* alert('Latitude: '        + position.coords.latitude          + '\n' +
	              'Longitude: '         + position.coords.longitude         + '\n' +
	              'Altitude: '          + position.coords.altitude          + '\n' +
	              'Accuracy: '          + position.coords.accuracy          + '\n' +
	              'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
	              'Heading: '           + position.coords.heading           + '\n' +
	              'Speed: '             + position.coords.speed             + '\n' +
	              'Timestamp: '         + position.timestamp                + '\n');*/
	    };
	    var onErrorGPS = function(error) {
	        alert('code: '    + error.code    + '\n' +
	              'message: ' + error.message + '\n');
	    };
	    navigator.geolocation.getCurrentPosition(onSuccessGPS, onErrorGPS);
    }
    
/*    var now                  = new Date().getTime(),
    _60_seconds_from_now = new Date(now + 60*1000);
    
    if(isMobile)
    {
	    window.plugin.notification.local.add({
	                                         id:      1,
	                                         title:   'Application de Suivi',
	                                         message: 'Merci de répondre au questionnaire de l application de suivi.',
	                                         repeat:  'weekly',
	                                         date:    _60_seconds_from_now
	                                         });
    }*/
    

    // https://github.com/brodysoft/Cordova-SQLitePlugin
    if(isMobile)
    	app.db = window.sqlitePlugin.openDatabase("Database", "1.0", "Demo", -1);
    else
    	app.db = openDatabase("Database", "1.0", "Demo", -1);
    
    app.db.transaction(function(tx) {                   
                        var timestamp = Math.round(new Date().getTime() / 1000);
                        //test affichage questionnaire sur timestamp
                        //tx.executeSql('DROP TABLE IF EXISTS "horaires"');
                        tx.executeSql('CREATE TABLE IF NOT EXISTS "horaires" ("id" INTEGER PRIMARY KEY AUTOINCREMENT , "uidquestionnaire" VARCHAR, "tsdebut" INTEGER, "dureevalidite" INTEGER, "notification" INTEGER, "fait" INTEGER);');                      
                        tx.executeSql('SELECT *,(tsdebut +dureevalidite) as fin FROM "horaires" WHERE tsdebut < '+timestamp+' AND fin  > '+timestamp+';', [], function(tx, res) {
                        	var dataset = res.rows.length;
                            if(dataset>0)
                            {
                            	for(var i=0;i<dataset;i++)
                                {
                            		if(!isMobile)
                            			alert(res.rows.item(i).uidquestionnaire+" ligne "+res.rows.item(i).id+" en cours \ndeb :"+res.rows.item(i).tsdebut+" \nfin : "+res.rows.item(i).fin+"\ntimestamp "+timestamp);
                            		$('body.home .question').html("Vous avez un questionnaire à remplir");
                            		$('body.home .questionnaire').show();
                            		questionnaire_encours = res.rows.item(i).uidquestionnaire;
                            		session_encours = res.rows.item(i).id;
                            		$('body.home #opensurvey #idsurvey').attr('value',questionnaire_encours);                         			
                                }
                            }
                            else
                            	if(!isMobile)
                            		alert("aucun questionnaire en cours\ntimestamp "+timestamp);
                        });                     
                        
                        //creation table réponses et ligne test
                        //tx.executeSql('DROP TABLE IF EXISTS "reponses"');
                        tx.executeSql('CREATE TABLE IF NOT EXISTS "reponses" ("id" INTEGER PRIMARY KEY AUTOINCREMENT , "idhoraire" INTEGER DEFAULT (0), "sid" VARCHAR, "gid" VARCHAR, "qid" VARCHAR, "code" VARCHAR, "tsreponse" INTEGER, "envoi" BOOLEAN not null default 0);');

                      
    	});   		
},
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },
    
    getlssfile: function() {
        //navigator.geolocation.getCurrentPosition(onSuccess, onError);
    console.log('x');
        var xhReq = new XMLHttpRequest();
      
       // var urldata = "http://openrad.agoralogie.fr/post.php?mesure=123"+123.innerHTML+"&lat="+lastlat+"&long="+lastlong;
        var urldata = "http://mcp.ocd-dbs-france.org/lss/lss_934317";
        
        xhReq.open("GET", urldata, false);
        xhReq.send(null);
        var serverResponse = xhReq.responseText; 
        console.log(serverResponse);
    }
};

function getSurveyConfig()
{
	var config = {};
	var strSurveyConfig = surveys_languagesettings[0].surveyls_description;
	//alert(surveys_languagesettings[0].surveyls_description);
	var line = strSurveyConfig.split("#");
	for (var linekey in line)
	{
		line2 = line[linekey].split(":");
		if (line2[0]!= "")
		{
			line20=line2[0];
			line21=line2[1];
			config[line20] = line21;
		}
	}
	return config;
}

function saveSession(firstTime) {
	firstTime = typeof firstTime !== 'undefined' ? firstTime : 0;
	app.db.transaction(function(tx) {
		var timestamp = Math.round(new Date().getTime() / 1000);
		//alert(new Date().getDay());
		var sid = surveys[0].sid;
		alert(surveys[0].sid);
		var duration = surveys_config.duration;
		var scheduling = surveys_config.scheduling;
		//si pas d'enregistrement ou reste seulement un, j'en remet
		tx.executeSql('select count("id") as cnt from "horaires" WHERE tsdebut > '+timestamp+' and uidquestionnaire = '+sid+';', [], function(tx, res) {
			if (scheduling=="W") // questionnaire hebdo
			{  		
	        	if (res.rows.item(0).cnt <= 1)
	        	{        	
	        		var nbLineBefore = res.rows.item(0).cnt;
	        		var jour = new Date();
	        		var nb = 4; 
	        		var max = parseInt(surveys_config.maxOccurences,10); 
	        		var i = 0;
	        		var numOfDay = surveys_config.day; 
	        		var startHour = surveys_config.startHour; 
	        		var test = 0;
	        		if (parseInt(surveys_config.test,10)) 
	        		{
	        			var test=1;
	        			duration = 60*3; //dure 3 min
                    	var ecarttest = (60*5); //toutes les 5 min
	        		}
	        		if ((firstTime) && (test!=0))
	        		{	//première ligne pour test dans 5 min si pas mode test
        				var timestampSession = Math.round(jour.getTime() / 1000)+300; //dans 5min
	        			tx.executeSql('INSERT INTO "horaires" (uidquestionnaire, tsdebut, dureevalidite,notification, fait) VALUES("'+sid+'",'+timestampSession+','+duration+',0,0);');
	        		}
	        		while (i < nb) {
	        			if (test)
	        			{//fonctionnement test
	        				dateSession = new Date((jour.getTime()+(ecarttest*i*1000)) );
	        				var timestampSession = Math.round(dateSession.getTime() / 1000);
	        				tx.executeSql('INSERT INTO "horaires" (uidquestionnaire, tsdebut, dureevalidite,notification, fait) VALUES("'+sid+'",'+timestampSession+','+duration+',0,0);');               		    
	        			}
	        			else
	        			{//fonctionnement normal
	        				//test si max atteint ou non activé
	        				tx.executeSql('select count("id") as cnt from "horaires" WHERE uidquestionnaire = '+sid+';', [], function(tx, res) {
	        					if ((max == 0) || (res.rows.item(0).cnt < max))
	        		        	{        		
				        			var dayko = true;
				        			while (dayko)
				        			{
				        				jour = new Date(jour.getTime() + (24*60*60*1000));
				        				if (jour.getDay() == numOfDay)
				        					dayko=false;
				        			}
				        			dateSession = new Date(jour.getFullYear(),jour.getMonth(),jour.getDate(),startHour);
				        			var timestampSession = Math.round(dateSession.getTime() / 1000);
				        			if (nbLineBefore)
				        			{
				        				nbLineBefore = 0;
				        				nb++;
				        			}
				        			else
				        				tx.executeSql('INSERT INTO "horaires" (uidquestionnaire, tsdebut, dureevalidite,notification, fait) VALUES("'+sid+'",'+timestampSession+','+duration+',0,0);');
	        		        	}
	        				});
	        			}
	        			i++;
	        		}
	        	}
			}// fin (scheduling=="W") 
			if (scheduling=="D") // questionnaire quotidien
			{  	
				var now                  = new Date().getTime(),
			    _60_seconds_from_now = new Date(now + 60*1000);
			    
			    if(isMobile)
			    {
				    window.plugin.notification.local.add({
				                                         id:      1,
				                                         title:   'Application de Suivi',
				                                         message: 'test : Merci de répondre au questionnaire de l application de suivi.',
				                                        /* repeat:  'weekly',*/
				                                         date:    _60_seconds_from_now
				                                         });
			    }
				    
				if (res.rows.item(0).cnt <= 1)
	        	{
					var nbLineBefore = res.rows.item(0).cnt;
	        		var jour = new Date();
	        		var nb = 14; 
	        		var max = parseInt(surveys_config.maxOccurences,10); 
	        		var i = 0;
	        		var numOfDayOff = surveys_config.dayOff; 
	        		var startHour = surveys_config.startHour; 
	        		//var randomTime = surveys_config.randomTime; 
	        		//TODO : gestion multiple startHour, randomTime
	        		var randomTime = 10800;
	        		var test = 0;
	        		var randomTab={};
	        		for (j=1;j<=nb;j++)
	        			randomTab[j]=j;
	        		if (parseInt(surveys_config.test,10)) 
	        		{
	        			var test=1;
	        			duration = 60*3; //dure 3 min
                    	var ecarttest = (60*5); //toutes les 5 min
	        			/*duration = 30; //dure 3 min
                    	var ecarttest = 60; //toutes les 5 min*/
	        		}
	        		if ((firstTime) && (test!=0))
	        		{	//première ligne pour test dans 5 min si pas mode test
        				var timestampSession = Math.round(jour.getTime() / 1000)+300; //dans 5min
	        			tx.executeSql('INSERT INTO "horaires" (uidquestionnaire, tsdebut, dureevalidite,notification, fait) VALUES("'+sid+'",'+timestampSession+','+duration+',0,0);');
	        		}
	        		while (i < nb) {
	        			if (test)
	        			{//fonctionnement test
	        				dateSession = new Date((jour.getTime()+(ecarttest*i*1000)) );
	        				var timestampSession = Math.round(dateSession.getTime() / 1000);
	        				//tx.executeSql('INSERT INTO "horaires" (uidquestionnaire, tsdebut, dureevalidite,notification, fait) VALUES("'+sid+'",'+timestampSession+','+duration+',0,0);');   
	        				tx.executeSql('INSERT INTO "horaires" (uidquestionnaire, tsdebut, dureevalidite,notification, fait) VALUES("'+sid+'",'+timestampSession+','+duration+',0,0);',[], function(tx, results){
	        			            	if ((isMobile) && (i!=0))
	        	        			    {   
	        			            		
	        			            		_timestampSessionNotif = new Date(timestampSession*1000);
	        			            		lastID = parseInt(results.insertId,10);
	        			            		//lastID = String(results.insertId);
	        			            		//alert(lastID);
	        	        				    window.plugin.notification.local.add({
	        	        				                                         id:      lastID,
	        	        				                                         title:   'Application de Suivi',
	        	        				                                         message: 'test '+lastID+': Merci de répondre au questionnaire de l application de suivi.',
	        	        				                                         date:    _timestampSessionNotif
	        	        				                                         });
	        	        			    }
	        			            });
	        				
	        			}
	        			else
	        			{//fonctionnement normal
	        				//test si max atteint ou non activé
	        				alert('normal  daily');
	        				tx.executeSql('select count("id") as cnt from "horaires" WHERE uidquestionnaire = '+sid+';', [], function(tx, res) {
	        					if ((max == 0) || (res.rows.item(0).cnt < max))
	        		        	{        		
				        			var dayko = true;
				        			while (dayko)
				        			{
				        				jour = new Date(jour.getTime() + (24*60*60*1000));
				        				if (jour.getDay() != numOfDayOff)
				        					dayko=false;
				        			}
				        			partOfDay = pickRandomProperty(randomTab);
				        			if (partOfDay%2 == 0)
				        				dateSession = new Date(jour.getFullYear(),jour.getMonth(),jour.getDate(),10);
				        			else
				        				dateSession = new Date(jour.getFullYear(),jour.getMonth(),jour.getDate(),18);
				        			delete randomTab[partOfDay];
				        			console.log(randomTab);
				        			var timestampSession = Math.round(dateSession.getTime() / 1000) + Math.floor((Math.random() * randomTime));
				        			if (nbLineBefore)
				        			{
				        				nbLineBefore = 0;
				        				nb++;
				        			}
				        			else
				        				tx.executeSql('INSERT INTO "horaires" (uidquestionnaire, tsdebut, dureevalidite,notification, fait) VALUES("'+sid+'",'+timestampSession+','+duration+',0,0);');
	        		        	}
	        				});
	        			}
	        			i++;
	        		}// fin while
	        	} // fin (res.rows.item(0).cnt <= 1)
			}// fin (scheduling=="D") 
        });
		
	});
	if (firstTime)
		alert("Questionnaire enregistré");
}

function RazSession()
{
	app.db.transaction(function(tx) {
		tx.executeSql('DELETE FROM "horaires";');
	});
}

function RazReponse()
{
	app.db.transaction(function(tx) {
		tx.executeSql('DELETE FROM "reponses";');
	});
}

function pickRandomProperty(obj) {
    var result;
    var count = 0;
    for (var prop in obj)
        if (Math.random() < 1/++count)
           result = prop;
    return result;
}