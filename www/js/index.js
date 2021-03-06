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

//debug global
debug=0;

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
	/*    var onSuccessGPS = function(position) {
	       /* alert('Latitude: '        + position.coords.latitude          + '\n' +
	              'Longitude: '         + position.coords.longitude         + '\n' +
	              'Altitude: '          + position.coords.altitude          + '\n' +
	              'Accuracy: '          + position.coords.accuracy          + '\n' +
	              'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
	              'Heading: '           + position.coords.heading           + '\n' +
	              'Speed: '             + position.coords.speed             + '\n' +
	              'Timestamp: '         + position.timestamp                + '\n');
	    };
	    var onErrorGPS = function(error) {
	        alert('code: '    + error.code    + '\n' +
	              'message: ' + error.message + '\n');
	    };
	    navigator.geolocation.getCurrentPosition(onSuccessGPS, onErrorGPS);
        */
    }
    /*
    var now                  = new Date().getTime(),
    _60_seconds_from_now = new Date(now + 60*1000);
    
    if(isMobile)
    {
	    window.plugin.notification.local.add({
	                                         id:      99999,
	                                         title:   'Application de Suivi',
	                                         message: 'test android Merci de répondre au questionnaire de l application de suivi.',
	                                         date:    _60_seconds_from_now
	                                         });
    }
    */

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
                        tx.executeSql('SELECT *,(tsdebut +dureevalidite) as fin FROM "horaires" WHERE tsdebut < '+timestamp+' AND fin  > '+timestamp+' AND fait=0;', [], function(tx, res) {
                        	var dataset = res.rows.length;
                            if(dataset>0)
                            {
                            	var i=0;
                            	/*for(var i=0;i<dataset;i++)
                                {*/
                            		//if(!isMobile)
                            		if (debug)
                            			alert(res.rows.item(i).uidquestionnaire+" ligne "+res.rows.item(i).id+" en cours \ndeb :"+res.rows.item(i).tsdebut+" \nfin : "+res.rows.item(i).fin+"\ntimestamp "+timestamp);
                            		$('body').removeClass('none');
                            		$('body.home .question').html("Vous avez un questionnaire à remplir");
                            		$('body.home .questionnaire').show();
                            		questionnaire_encours = res.rows.item(i).uidquestionnaire;
                            		session_encours = res.rows.item(i).id;
                            		$('body.home #opensurvey #idsurvey').attr('value',questionnaire_encours);                         			
                               /* }*/
                            }
                            else
                            {
                            	$('body').addClass('none');
                            	//if(!isMobile)
                            	if (debug)
                            		alert("aucun questionnaire en cours\ntimestamp "+timestamp);
                            }
                        });                     
                        
                        //creation table réponses et ligne test
                        //tx.executeSql('DROP TABLE IF EXISTS "reponses"');
                        tx.executeSql('CREATE TABLE IF NOT EXISTS "reponses" ("id" INTEGER PRIMARY KEY AUTOINCREMENT , "idhoraire" INTEGER DEFAULT (0), "sid" VARCHAR, "gid" VARCHAR, "qid" VARCHAR, "code" VARCHAR, "tsreponse" INTEGER, "envoi" BOOLEAN not null default 0);');

                      
    	});
    setTimeout(function() {if(isHomeActive){app.reload();}}, 10000);
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
    },
    
    reload: function(){
	console.log('app.reload');
	$('body').addClass('home');
	app.db.transaction(function(tx) {                   
                        var timestamp = Math.round(new Date().getTime() / 1000);
                        console.log(timestamp);
			//Session en cours?
                        tx.executeSql('SELECT *,(tsdebut +dureevalidite) as fin FROM "horaires" WHERE tsdebut < '+timestamp+' AND fin  > '+timestamp+' AND fait=0;', [], function(tx, res) {
                        	var dataset = res.rows.length;
                            if(dataset>0)
                            {
                            	var i=0;
                            	/*for(var i=0;i<dataset;i++)
                                {*/
                            		//if(!isMobile)
                            		if (debug)
                            			alert(res.rows.item(i).uidquestionnaire+" ligne "+res.rows.item(i).id+" en cours \ndeb :"+res.rows.item(i).tsdebut+" \nfin : "+res.rows.item(i).fin+"\ntimestamp "+timestamp);
                            		$('body').removeClass('none');
                            		$('body.home .question').html("Vous avez un questionnaire à remplir");
                            		$('body.home .questionnaire').show();
                            		questionnaire_encours = res.rows.item(i).uidquestionnaire;
                            		session_encours = res.rows.item(i).id;
                            		$('body.home #opensurvey #idsurvey').attr('value',questionnaire_encours);                         			
                               /* }*/
                            }
                            else
			    {
                            	//if(!isMobile)
                            	$('body').addClass('none');
                            	if (debug)
                            	    alert("aucun questionnaire en cours\ntimestamp "+timestamp);
                            	$('body.home .question').html("Vous n'avez pas de questionnaire à remplir");
                            	$('body.home .questionnaire').hide();
			    }
                        });
			
			//Envoi réponses si existent
			sendReponses();
			setTimeout(function() {if(isHomeActive){app.reload();}}, 10000);
    	});   	
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

function getQuestionConfig(question)
{
	var config = {};
	var strSurveyConfig = question.help;
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


function saveSessionOld(firstTime) {
	firstTime = typeof firstTime !== 'undefined' ? firstTime : 0;
	app.db.transaction(function(tx) {
		var timestamp = Math.round(new Date().getTime() / 1000);
		var sid = surveys[0].sid;
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
	        			/*duration = 300; //dure 5 min
                    	ecarttest = 21600; //toutes les 6*60 min*/
	        			/*duration = 300; //dure 5 min
                    	ecarttest = 600; //toutes les 10 min*/
                    	duration = 120; //dure 2 min
                    	ecarttest = 360; //toutes les 6 min
	        		}
	        		if ((firstTime) && (test!=1))
	        		{	//première ligne pour test dans 5 min si pas mode test
        				timestampSession = Math.round(jour.getTime() / 1000)+300; //dans 5min
        				tx.executeSql('INSERT INTO "horaires" (uidquestionnaire, tsdebut, dureevalidite,notification, fait) VALUES("'+sid+'",'+timestampSession+','+duration+',0,0);',[],function(tx, res) {
        					lastId = res.insertId;
        					tx.executeSql('SELECT * FROM "horaires" WHERE id = '+lastId+';',[],function(tx, resnotif) {
        						timestampNow = Math.round(new Date().getTime() / 1000);
	        						if (timestampNow < resnotif.rows.item(0).tsdebut)
	        						{
	        							console.log(resnotif.rows.item(0).id+'+'+resnotif.rows.item(0).tsdebut+'>'+timestampNow);
		        						_timestampSessionNotif = new Date(resnotif.rows.item(0).tsdebut*1000);
	        							//var monId = String(resnotif.rows.item(0).id);
	        							var monId = parseInt(resnotif.rows.item(0).id,10);
	        							if (isMobile)
			        					 window.plugin.notification.local.add({
		                                       id:      monId,
		                                       title:   'Application de Suivi',
		                                       message: 'Merci de répondre au questionnaire de l application de suivi.',
		                                       date:    _timestampSessionNotif
		                                       });
			        				}
        					});	 //Fin select        			
        				});  //Fin insert 
	        			/*tx.executeSql('INSERT INTO "horaires" (uidquestionnaire, tsdebut, dureevalidite,notification, fait) VALUES("'+sid+'",'+timestampSession+','+duration+',0,0);');
	        			if (isMobile)
        			    {   			
		            		_timestampSessionNotif = new Date(timestampSession*1000);
        				    window.plugin.notification.local.add({
        				    									 id:      '10'+i,
        				                                         title:   'Application de Suivi',
        				                                         message: 'Merci de répondre au questionnaire de l application de suivi.',
        				                                         date:    _timestampSessionNotif
        				                                         });
        			    }*/
	        		}
	        		while (i < nb) {
	        			if (test)
	        			{//fonctionnement test
	        				dateSession = new Date((jour.getTime()+(ecarttest*i*1000)) );
	        				timestampSession = Math.round(dateSession.getTime() / 1000);
	        				tx.executeSql('INSERT INTO "horaires" (uidquestionnaire, tsdebut, dureevalidite,notification, fait) VALUES("'+sid+'",'+timestampSession+','+duration+',0,0);',[],function(tx, res) {
	        					lastId = res.insertId;
	        					tx.executeSql('SELECT * FROM "horaires" WHERE id = '+lastId+';',[],function(tx, resnotif) {
	        						timestampNow = Math.round(new Date().getTime() / 1000);
		        						if (timestampNow < resnotif.rows.item(0).tsdebut)
		        						{
		        							console.log(resnotif.rows.item(0).id+'+'+resnotif.rows.item(0).tsdebut+'>'+timestampNow);
			        						_timestampSessionNotif = new Date(resnotif.rows.item(0).tsdebut*1000);
		        							//var monId = String(resnotif.rows.item(0).id);
		        							var monId = parseInt(resnotif.rows.item(0).id,10);
		        							if (isMobile)
				        					 window.plugin.notification.local.add({
			                                       id:      monId,
			                                       title:   'Application de Suivi',
			                                       message: 'test '+resnotif.rows.item(0).id+': Merci de répondre au questionnaire de l application de suivi.',
			                                       date:    _timestampSessionNotif
			                                       });
				        				}
	        					});	 //Fin select        			
	        				});  //Fin insert 
	        				/*tx.executeSql('INSERT INTO "horaires" (uidquestionnaire, tsdebut, dureevalidite,notification, fait) VALUES("'+sid+'",'+timestampSession+','+duration+',0,0);');      
	        				if ((isMobile) && (i!=0))
	        			    {   
			            		_timestampSessionNotif = new Date(timestampSession*1000);
	        				    window.plugin.notification.local.add({
	        				                                         id:      '10'+i,
	        				                                         title:   'Application de Suivi',
	        				                                         message: 'test '+i+': Merci de répondre au questionnaire de l application de suivi.',
	        				                                         date:    _timestampSessionNotif
	        				                                         });
	        			    }*/
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
				        			timestampSession = Math.round(dateSession.getTime() / 1000);
				        			if (nbLineBefore)
				        			{
				        				nbLineBefore = 0;
				        				nb++;
				        			}
				        			else
				        			{
				        				tx.executeSql('INSERT INTO "horaires" (uidquestionnaire, tsdebut, dureevalidite,notification, fait) VALUES("'+sid+'",'+timestampSession+','+duration+',0,0);',[],function(tx, res) {
				        					lastId = res.insertId;
				        					tx.executeSql('SELECT * FROM "horaires" WHERE id = '+lastId+';',[],function(tx, resnotif) {
				        						timestampNow = Math.round(new Date().getTime() / 1000);
					        						if (timestampNow < resnotif.rows.item(0).tsdebut)
					        						{
					        							console.log(resnotif.rows.item(0).id+'+'+resnotif.rows.item(0).tsdebut+'>'+timestampNow);
						        						_timestampSessionNotif = new Date(resnotif.rows.item(0).tsdebut*1000);
					        							//var monId = String(resnotif.rows.item(0).id);
					        							var monId = parseInt(resnotif.rows.item(0).id,10);
					        							if (isMobile)
							        					 window.plugin.notification.local.add({
						                                       id:      monId,
						                                       title:   'Application de Suivi',
						                                       message: 'Merci de répondre au questionnaire de l application de suivi.',
						                                       date:    _timestampSessionNotif
						                                       });
							        				}
				        					});	 //Fin select        			
				        				});  //Fin insert 
				        				/*tx.executeSql('INSERT INTO "horaires" (uidquestionnaire, tsdebut, dureevalidite,notification, fait) VALUES("'+sid+'",'+timestampSession+','+duration+',0,0);');
				        				if (isMobile)
				        			    {   	
						            		_timestampSessionNotif = new Date(timestampSession*1000);
				        				    window.plugin.notification.local.add({
				        				                                         id:      '10'+i,
				        				                                         title:   'Application de Suivi',
				        				                                         message: 'Merci de répondre au questionnaire de l application de suivi.',
				        				                                         date:    _timestampSessionNotif
				        				                                         });
				        			    }*/
				        			}
				        				
	        		        	}
	        				});
	        			}
	        			i++;
	        		}
	        	}
			}// fin (scheduling=="W") 
			if (scheduling=="D") // questionnaire quotidien
			{  				    
				if (res.rows.item(0).cnt <= 1)
	        	{
					var nbLineBefore = res.rows.item(0).cnt;
	        		var jour = new Date();
	        		//var nb = 14; 
	        		var nb = 24; 
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
	        			/*duration = 300; //dure 5 min
                    	ecarttest = 3600; //toutes les 60 min*/
	        			/*duration = 180; //dure 3 min
                    	ecarttest = 300; //toutes les 5 min*/
	        			/*duration = 30; //dure 30 s
                    	var ecarttest = 60; //toutes les min*/
                    	duration = 60; //dure 1 min
                    	ecarttest = 180; //toutes les 3 min
	        		}
	        		if ((firstTime) && (test!=1))
	        		{	//première ligne pour test dans 5 min si pas mode test
        				timestampSession = Math.round(jour.getTime() / 1000)+300; //dans 5min
        				tx.executeSql('INSERT INTO "horaires" (uidquestionnaire, tsdebut, dureevalidite,notification, fait) VALUES("'+sid+'",'+timestampSession+','+duration+',0,0);',[],function(tx, res) {
        					lastId = res.insertId;
        					tx.executeSql('SELECT * FROM "horaires" WHERE id = '+lastId+';',[],function(tx, resnotif) {
        						timestampNow = Math.round(new Date().getTime() / 1000);
	        						if (timestampNow < resnotif.rows.item(0).tsdebut)
	        						{
	        							console.log(resnotif.rows.item(0).id+'+'+resnotif.rows.item(0).tsdebut+'>'+timestampNow);
		        						_timestampSessionNotif = new Date(resnotif.rows.item(0).tsdebut*1000);
	        							//var monId = String(resnotif.rows.item(0).id);
	        							var monId = parseInt(resnotif.rows.item(0).id,10);
	        							if (isMobile)
			        					 window.plugin.notification.local.add({
		                                       id:      monId,
		                                       title:   'Application de Suivi',
		                                       message: 'Merci de répondre au questionnaire de l application de suivi.',
		                                       date:    _timestampSessionNotif
		                                       });
			        				}
        					});	 //Fin select        			
        				});  //Fin insert 
	        			/*tx.executeSql('INSERT INTO "horaires" (uidquestionnaire, tsdebut, dureevalidite,notification, fait) VALUES("'+sid+'",'+timestampSession+','+duration+',0,0);');
	        			if (isMobile)
        			    {   	
		            		_timestampSessionNotif = new Date(timestampSession*1000);
        				    window.plugin.notification.local.add({
        				                                         ///id:      lastID,
        				                                         title:   'Application de Suivi',
        				                                         message: 'Merci de répondre au questionnaire de l application de suivi.',
        				                                         date:    _timestampSessionNotif
        				                                         });
        			    }*/
	        		}
	        		while (i < nb) {
	        			if (test)
	        			{
	        			if (i < 4)
	        			{//fonctionnement test
	        				dateSession = new Date((jour.getTime()+(ecarttest*i*1000)) );
	        				timestampSession = Math.round(dateSession.getTime() / 1000);
	        				tx.executeSql('INSERT INTO "horaires" (uidquestionnaire, tsdebut, dureevalidite,notification, fait) VALUES("'+sid+'",'+timestampSession+','+duration+',0,0);',[],function(tx, res) {
	        					lastId = res.insertId;
	        					tx.executeSql('SELECT * FROM "horaires" WHERE id = '+lastId+';',[],function(tx, resnotif) {
	        						timestampNow = Math.round(new Date().getTime() / 1000);
		        						if (timestampNow < resnotif.rows.item(0).tsdebut)
		        						{
		        							console.log(resnotif.rows.item(0).id+'+'+resnotif.rows.item(0).tsdebut+'>'+timestampNow);
			        						_timestampSessionNotif = new Date(resnotif.rows.item(0).tsdebut*1000);
		        							//var monId = String(resnotif.rows.item(0).id);
			        						var monId = parseInt(resnotif.rows.item(0).id,10);
		        							if (isMobile)
				        					 window.plugin.notification.local.add({
			                                       id:      monId,
			                                       title:   'Application de Suivi',
			                                       message: 'test '+resnotif.rows.item(0).id+': Merci de répondre au questionnaire de l application de suivi.',
			                                       date:    _timestampSessionNotif
			                                       });
				        				}
	        					});	 //Fin select        			
	        				});  //Fin insert 
	        				
	        				/*
	        				 tx.executeSql('INSERT INTO "horaires" (uidquestionnaire, tsdebut, dureevalidite,notification, fait) VALUES("'+sid+'",'+timestampSession+','+duration+',0,0);');   
	        				 if ((isMobile) && (i!=0))
	        			    {   
			            		_timestampSessionNotif = new Date(timestampSession*1000);
	        				    window.plugin.notification.local.add({
	        				                                         ///id:      lastID,
	        				                                         title:   'Application de Suivi',
	        				                                         message: 'test '+i+': Merci de répondre au questionnaire de l application de suivi.',
	        				                                         date:    _timestampSessionNotif
	        				                                         });
	        			    }*/
	        				
	        			}}
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
				        			timestampSession = Math.round(dateSession.getTime() / 1000) + Math.floor((Math.random() * randomTime));
				        			if (nbLineBefore)
				        			{
				        				nbLineBefore = 0;
				        				nb++;
				        			}
				        			else
			        				{
				        				tx.executeSql('INSERT INTO "horaires" (uidquestionnaire, tsdebut, dureevalidite,notification, fait) VALUES("'+sid+'",'+timestampSession+','+duration+',0,0);',[],function(tx, res) {
				        					lastId = res.insertId;
				        					tx.executeSql('SELECT * FROM "horaires" WHERE id = '+lastId+';',[],function(tx, resnotif) {
				        						timestampNow = Math.round(new Date().getTime() / 1000);
					        						if (timestampNow < resnotif.rows.item(0).tsdebut)
					        						{
					        							console.log(resnotif.rows.item(0).id+'+'+resnotif.rows.item(0).tsdebut+'>'+timestampNow);
						        						_timestampSessionNotif = new Date(resnotif.rows.item(0).tsdebut*1000);
					        							//var monId = String(resnotif.rows.item(0).id);
					        							var monId = parseInt(resnotif.rows.item(0).id,10);
					        							if (isMobile)
							        					 window.plugin.notification.local.add({
						                                       id:      monId,
						                                       title:   'Application de Suivi',
						                                       message: 'Merci de répondre au questionnaire de l application de suivi.',
						                                       date:    _timestampSessionNotif
						                                       });
							        				}
				        					});	 //Fin select        			
				        				});  //Fin insert 
				        				/*tx.executeSql('INSERT INTO "horaires" (uidquestionnaire, tsdebut, dureevalidite,notification, fait) VALUES("'+sid+'",'+timestampSession+','+duration+',0,0);');
				        				if (isMobile)
				        			    {   
						            		_timestampSessionNotif = new Date(timestampSession*1000);
				        				    window.plugin.notification.local.add({
				        				                                         ///id:      lastID,
				        				                                         title:   'Application de Suivi',
				        				                                         message: 'Merci de répondre au questionnaire de l application de suivi.',
				        				                                         date:    _timestampSessionNotif
				        				                                         });
				        			    }*/
			        				}
				        				
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
	{
		if (isMobile)
		{
		navigator.notification.alert(
	            'Questionnaire enregistré',  // message
	            alertDismissed,         // callback
	            'Multicollect',            // title
	            'Ok'                  // buttonName
	        );
		}
		else
			{alert("Questionnaire enregistré");}
	}
}

function RazSession()
{
	app.db.transaction(function(tx) {
		tx.executeSql('DELETE FROM "horaires";');
	});
	if (isMobile)
		window.plugin.notification.local.cancelAll(function () {
		    // All notifications have been canceled
			console.log('all cancel');
		});
}

function onConfirm(sid,buttonIndex){if (buttonIndex=="2")RazOneSession(sid,true);}

function RazOneSession(sid,r)
{
	if( typeof(r) == 'undefined' )
	{
		if (isMobile)
		{
		 navigator.notification.confirm(
				 	"Confirmez-vous la suppression de "+sid+"?", // message
				 	function(buttonIndex){
			            onConfirm(sid, buttonIndex);
			        },            // callback to invoke with index of button pressed
		            'Multicollect',           // title
		            'Non,Oui'         // buttonLabels
		        );
		}
		else
		{var r = confirm("Confirmez-vous la suppression de "+sid+"?");}
	}
	if (r == true) {
		app.db.transaction(function(tx) {
			timestampNow = Math.round(new Date().getTime() / 1000);
			tx.executeSql('SELECT * FROM "horaires" WHERE uidquestionnaire="'+sid+'" AND tsdebut > '+timestampNow+';',[],function(tx, resnotif) {
				var dataset = resnotif.rows.length;
	            if(dataset>0)
	            {     
	            	for(var i=0;i<dataset;i++)
	                {
	            		//tx.executeSql('DELETE FROM "horaires" WHERE id="'+resnotif.rows.item(i).id+'";');
	            		if (isMobile)
	            			window.plugin.notification.local.cancel(resnotif.rows.item(i).id, function () {
	            			    // The notification has been canceled
	            				console.log('one cancel');
	            			});
	            		if (isMobile)
	            			window.plugin.notification.local.cancel(resnotif.rows.item(i).id+"00", function () {
	            			    // The notification has been canceled
	            				console.log('one cancel');
	            			});
	                }	
	            }
	            tx.executeSql('DELETE FROM "horaires" WHERE uidquestionnaire="'+sid+'";');
	            go_home();
	            app.reload();
	            
			});//fin select
		});//fin transaction
	}
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

function sendReponses()
{debug=0;
	var aReponses ={};
	app.db.transaction(function(tx) {
		tx.executeSql('SELECT * FROM "horaires" WHERE fait = 1;', [], function(tx, resHoraires) {
			var dataset = resHoraires.rows.length;
			console.log(resHoraires);
            if(dataset>0)
            {     	
            	if (debug)
            		alert("session à  envoi");
            	for(var i=0;i<dataset;i++)
                {
            		//aReponses["sid"] = resHoraires.rows.item(i).uidquestionnaire;
                	//aReponses["timestamp"] = resHoraires.rows.item(i).tsdebut;
                	//saveResHorairesID = resHoraires.rows.item(i).id;
                	
            		tx.executeSql('SELECT * FROM "reponses" WHERE envoi = 0  AND idhoraire = '+resHoraires.rows.item(i).id+';', [], function(tx, res2) {
            			var dataset2 = res2.rows.length;
                        if(dataset2>0)
                        {
                        	saveResHorairesID = res2.rows.item(0).idhoraire;
                        	aReponses["sid"] = res2.rows.item(0).sid;
                        	aReponses["timestamp"] = res2.rows.item(0).tsreponse;
                        	if (debug)
                        		alert("reponse à  envoi");
                        	for(var j=0;j<dataset2;j++)
                            {
                        		/*if (debug) 
                        			alert(res2.rows.item(j).sid);*/
                                var jsonkey = res2.rows.item(j).sid +"X"+res2.rows.item(j).gid+"X"+res2.rows.item(j).qid;
                        		aReponses[jsonkey]=res2.rows.item(j).code;
                            }
                        	if (debug)
                        		alert("essai envoi"+JSON.stringify(aReponses));
                        	xhr_object = new XMLHttpRequest(); 
                        	xhr_object.open("GET", "http://mcp.ocd-dbs-france.org/mobile/mobilerpc.php?answer="+JSON.stringify(aReponses), false); 
                        	xhr_object.send(null); 
                        	console.log("send rep");
                        	console.log(xhr_object);
                        	console.log(JSON.stringify(aReponses));
                        	if(xhr_object.readyState == 4) 
                        	{
                        		/*if(!isMobile) 
                        			alert("Requête effectuée !"); */
                        		if(xhr_object.response == "1") 
                        			{
                        			tx.executeSql('UPDATE "reponses" SET envoi = 1 WHERE idhoraire = '+saveResHorairesID+';');
                        			console.log('UPDATE "reponses" SET envoi = 1 WHERE idhoraire = '+saveResHorairesID+';');
                        			if (debug)
                        				alert('UPDATE "reponses" SET envoi = 1 WHERE idhoraire = '+saveResHorairesID+';');
                        			}
                        	}
                        	
                        }
            			
            		});
            		
                }
            }
		});
	});
}

function showLastSessionInfos()
{
	app.db.transaction(function(tx) 
	{
		timestampNow = Math.round(new Date().getTime() / 1000);
		//tx.executeSql('SELECT *,(tsdebut +dureevalidite) as fin FROM "horaires" WHERE fin > '+timestampNow+' ORDER BY tsdebut DESC LIMIT 0,1;', [], function(tx, res) {
		tx.executeSql('SELECT *,(tsdebut +dureevalidite) as fin FROM "horaires" WHERE fin < '+timestampNow+' ORDER BY tsdebut DESC LIMIT 0,1;', [], function(tx, res) {
			var dataset = res.rows.length;
	        if(dataset>0)
	        {     	
	        	LastSessionDateDeb = new Date(res.rows.item(0).tsdebut*1000);
	        	LastSessionDateFin = new Date(res.rows.item(0).fin*1000);
	        	if (res.rows.item(0).fait == 1)
	        		$(".last").html("Infos dernière session<br/>Début :"+LastSessionDateDeb.toLocaleString()+"<br/>Fin :"+LastSessionDateFin.toLocaleString()+"<br/>Statut : complétée");
	        	else
	        		$(".last").html("Infos dernière session<br/>Début :"+LastSessionDateDeb.toLocaleString()+"<br/>Fin :"+LastSessionDateFin.toLocaleString()+"<br/>Statut : non complétée");
	        }
	        else
	        	$(".last").html("");
        });//fin select
	});//fin transaction
}


function createNotifForLastId(lastId)
{
	app.db.transaction(function(tx) {
		tx.executeSql('SELECT * FROM "horaires" WHERE id = '+lastId+';',[],function(tx, resnotif) {
			timestampNow = Math.round(new Date().getTime() / 1000);
			if (timestampNow < resnotif.rows.item(0).tsdebut)
			{
				console.log(resnotif.rows.item(0).id+'+'+resnotif.rows.item(0).tsdebut+'>'+timestampNow);
				_timestampSessionNotif = new Date(resnotif.rows.item(0).tsdebut*1000);
				var monId = parseInt(resnotif.rows.item(0).id,10);
				if (isMobile)
				 window.plugin.notification.local.add({
	                   id:      monId,
	                   title:   'Application de Suivi',
	                   message: 'Merci de répondre au questionnaire de l application de suivi.',
	                   date:    _timestampSessionNotif
	                   });
				
				//envoi sms 
				if (isMobile)
					var deviceID = md5(device.uuid);
				else
					var deviceID = "monDeviceUid";
				xhr_object = new XMLHttpRequest(); 
            	xhr_object.open("GET", "http://mcp.ocd-dbs-france.org/mobile/notifsms.php?qid="+resnotif.rows.item(0).uidquestionnaire+"&duid="+deviceID+"&time="+resnotif.rows.item(0).tsdebut, false); 
            	xhr_object.send(null); 
            	/*console.log("send rep");
            	console.log(xhr_object);*/
				
				//10min plus tard
				_timestampSessionNotif2 = new Date((resnotif.rows.item(0).tsdebut*1000+600*1000));
				var monId2 = parseInt(resnotif.rows.item(0).id+"00",10);
				if (isMobile)
				 window.plugin.notification.local.add({
	                   id:      monId2,
	                   title:   'Application de Suivi',
	                   message: 'Merci de répondre au questionnaire de l application de suivi.',
	                   date:    _timestampSessionNotif2
	                   });
			}
		});	 //Fin select        
	});// Fin transaction
}

function createNotifTestForLastId(lastId)
{
	app.db.transaction(function(tx) {
		tx.executeSql('SELECT * FROM "horaires" WHERE id = '+lastId+';',[],function(tx, resnotif) {
			timestampNow = Math.round(new Date().getTime() / 1000);
			if (timestampNow < resnotif.rows.item(0).tsdebut)
			{
				console.log(resnotif.rows.item(0).id+'+'+resnotif.rows.item(0).tsdebut+'>'+timestampNow);
				_timestampSessionNotif = new Date(resnotif.rows.item(0).tsdebut*1000);
				var monId = parseInt(resnotif.rows.item(0).id,10);
				if (isMobile)
				 window.plugin.notification.local.add({
	                   id:      monId,
	                   title:   'Application de Suivi',
	                   message: 'test '+resnotif.rows.item(0).id+': Merci de répondre au questionnaire de l application de suivi.',     
	                   date:    _timestampSessionNotif
	                   });
				
				//envoi sms 
				if (isMobile)
					var deviceID = md5(device.uuid);
				else
					var deviceID = "monDeviceUid";
				xhr_object = new XMLHttpRequest(); 
            	xhr_object.open("GET", "http://mcp.ocd-dbs-france.org/mobile/notifsms.php?test=1&qid="+resnotif.rows.item(0).uidquestionnaire+"&duid="+deviceID+"&time="+resnotif.rows.item(0).tsdebut, false); 
            	xhr_object.send(null); 
            	/*console.log("send rep");
            	console.log(xhr_object);*/
			
				//1min plus tard
				_timestampSessionNotif2 = new Date((resnotif.rows.item(0).tsdebut*1000+60*1000));
				var monId2 = parseInt(resnotif.rows.item(0).id+"00",10);
				if (isMobile)
				 window.plugin.notification.local.add({
	                   id:      monId2,
	                   title:   'Application de Suivi',
	                   message: 'test '+resnotif.rows.item(0).id+' bis: Merci de répondre au questionnaire de l application de suivi.', 
	                   date:    _timestampSessionNotif2
	                   });
			}
		});	 //Fin select        
	});// Fin transaction
}

///new version
function saveSession(firstTime) {
	firstTime = typeof firstTime !== 'undefined' ? firstTime : 0;
	app.db.transaction(function(tx) {
		var timestamp = Math.round(new Date().getTime() / 1000);
		var sid = surveys[0].sid;
		var duration = surveys_config.duration;
		var scheduling = surveys_config.scheduling;
		var max = parseInt(surveys_config.maxOccurences,10);
		var test = 0;
		var jour = new Date();
		if (parseInt(surveys_config.test,10)) 
			var test=1;
		//si max non atteint
		tx.executeSql('select count("id") as cnt from "horaires" WHERE uidquestionnaire = '+sid+';', [], function(tx, res) {
			if (res.rows.item(0).cnt < max)
			{			
				var reste = max - res.rows.item(0).cnt;
				//si pas d'enregistrement ou reste seulement un, j'en remet
				tx.executeSql('select count("id") as cnt from "horaires" WHERE tsdebut > '+timestamp+' and uidquestionnaire = '+sid+';', [], function(tx, res) {
					if (res.rows.item(0).cnt <= 1)//TODO : mettre en var nombre min)
					{
						var nbActiveLineBefore = res.rows.item(0).cnt;
						//cas d'initialisation d'un questionnnaire en mode normal
		        		if ((firstTime) && (test!=1))
		        		{	//première ligne pour test dans 5 min si pas mode test
	        				timestampSession = Math.round(jour.getTime() / 1000)+300; //dans 5min
	        				tx.executeSql('INSERT INTO "horaires" (uidquestionnaire, tsdebut, dureevalidite,notification, fait) VALUES("'+sid+'",'+timestampSession+','+duration+',0,0);',[],function(tx, res) {
	        					createNotifForLastId(res.insertId);     			
	        				});  //Fin insert 
		        		}//fin if ((firstTime) && (test!=1))
		        		
						if (scheduling=="W") // questionnaire hebdo
						{
							var nb = 4;
							var i = 0;
							var numOfDay = surveys_config.day; 
			        		var startHour = surveys_config.startHour;
			        		
							if (test==1)//mode test
							{
		                    	duration = 120; //dure 2 min
		                    	ecarttest = 360; //toutes les 6 min
							}
							
							if (reste < nb) // si il en reste moins pour atteindre max occurences
								nb = reste;
											
							while (i < nb) 
							{
			        			if (test)
			        			{//fonctionnement test
			        				dateSession = new Date((jour.getTime()+(ecarttest*i*1000)) );
			        				timestampSession = Math.round(dateSession.getTime() / 1000);
			        				tx.executeSql('INSERT INTO "horaires" (uidquestionnaire, tsdebut, dureevalidite,notification, fait) VALUES("'+sid+'",'+timestampSession+','+duration+',0,0);',[],function(tx, res) {
			        					createNotifTestForLastId(res.insertId);   			
			        				});  //Fin insert 
			        			}//fin if (test)
			        			else
			        			{//fonctionnement normal    		
						        			var dayko = true;
						        			while (dayko)
						        			{
						        				jour = new Date(jour.getTime() + (24*60*60*1000));
						        				if (jour.getDay() == numOfDay)
						        					dayko=false;
						        			}
						        			dateSession = new Date(jour.getFullYear(),jour.getMonth(),jour.getDate(),startHour);
						        			timestampSession = Math.round(dateSession.getTime() / 1000);
						        			if (nbActiveLineBefore)
						        			{
						        				nbActiveLineBefore--;
						        			}
						        			else
						        			{
						        				tx.executeSql('INSERT INTO "horaires" (uidquestionnaire, tsdebut, dureevalidite,notification, fait) VALUES("'+sid+'",'+timestampSession+','+duration+',0,0);',[],function(tx, res) {
						        					createNotifForLastId(res.insertId);        			
						        				});  //Fin insert 
						        			}
						        				;
			        			}// fin else fonctionnement normal   
			        			i++;
			        		}// fin while (i < nb) 
						}//fin if (scheduling=="W")
						
						if (scheduling=="D") // questionnaire quotidien
						{  
			        		var nb = 24; 
			        		var i = 0;
			        		var numOfDayOff = surveys_config.dayOff; 
			        		var startHour = surveys_config.startHour; 
			        		//var randomTime = surveys_config.randomTime; 
			        		//TODO : gestion multiple startHour, randomTime
			        		var randomTime = 10800;
			        		var randomTab={};
			        		for (j=1;j<=nb;j++)
			        			randomTab[j]=j;
							
							if( test==1) //mode test
			        		{
		                    	duration = 60; //dure 1 min
		                    	ecarttest = 180; //toutes les 3 min
			        		}
							
							if (reste < nb) // si il en reste moins pour atteindre max occurences
								nb = reste;
											
							while (i < nb) 
							{
			        			if (test)
			        			{//fonctionnement test
			        				if (i < 4) // on limite pour test
			        				{
				        				dateSession = new Date((jour.getTime()+(ecarttest*i*1000)) );
				        				timestampSession = Math.round(dateSession.getTime() / 1000);
				        				tx.executeSql('INSERT INTO "horaires" (uidquestionnaire, tsdebut, dureevalidite,notification, fait) VALUES("'+sid+'",'+timestampSession+','+duration+',0,0);',[],function(tx, res) {
				        					createNotifTestForLastId(res.insertId);
				        					lastId = res.insertId;      			
				        				});  //Fin insert 
			        				} //fin if (i < 4)
			        			}//fin if (test)
			        			else
			        			{//fonctionnement normal		
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
				        			timestampSession = Math.round(dateSession.getTime() / 1000) + Math.floor((Math.random() * randomTime));
				        			if (nbActiveLineBefore)
				        			{
				        				nbActiveLineBefore--;
				        			}
				        			else
			        				{
				        				tx.executeSql('INSERT INTO "horaires" (uidquestionnaire, tsdebut, dureevalidite,notification, fait) VALUES("'+sid+'",'+timestampSession+','+duration+',0,0);',[],function(tx, res) {
				        					createNotifForLastId(res.insertId);       			
				        				});  //Fin insert 
			        				}
				        				
	        		        	} //fin fonctionnement normal
			        			i++;
							}// fin while
			        										
						}//fin if (scheduling=="D")
						if (firstTime)
							if (isMobile)
							{
							navigator.notification.alert(
						            'Questionnaire enregistré',  // message
						            alertDismissed,         // callback
						            'Multicollect',            // title
						            'Ok'                  // buttonName
						        );
							}
							else
								{alert("Questionnaire enregistré");}			
					}//fin if (res.rows.item(0).cnt <= 1) nb reste ligne
				}); //fin select count("id") as cnt from "horaires" WHERE tsdebut > '+timestamp+' and uidquestionnaire = '+sid+';'
			}// fin if (res.rows.item(0).cnt < max)
		});// fin 'select count("id") as cnt from "horaires" WHERE uidquestionnaire = '+sid+';'	
	});//fin transaction
}

function saveUser(){
	if ($('#userform #userid').val() != "")
	{	
		try 
		{
			if (isMobile)
				var deviceID = md5(device.uuid);
			else
				var deviceID = "monDeviceUid";
			xhr_object = new XMLHttpRequest(); 
	    	xhr_object.open("GET", "http://mcp.ocd-dbs-france.org/mobile/save_user.php?duid="+deviceID+"&id="+encodeURI($('#userform #userid').val()), false); 
	    	xhr_object.send(); 
	    	console.log("send user");
	    	console.log(xhr_object);
	    	console.log($('#userform #userid').val());
	    	if(xhr_object.readyState == 4) 
	    	{
	    		if(xhr_object.response == "1") 
	    		{
	    			if (isMobile)
	    			{
	    			navigator.notification.alert(
	    		            'Votre identifiant a été enregistré.',  // message
	    		            alertDismissed,         // callback
	    		            'Multicollect',            // title
	    		            'Ok'                  // buttonName
	    		        );
	    			}
	    			else
	    				{alert("Votre identifiant a été enregistré.");}
	    		}
	    		else
	    		{
	    			if (isMobile)
						{
						navigator.notification.alert(
					            'Veuillez réessayer ultérieurement.',  // message
					            alertDismissed,         // callback
					            'Multicollect',            // title
					            'Ok'                  // buttonName
					        );
						}
						else
							{alert("Veuillez réessayer ultérieurement.");}
	    		}
	    	}
	    	else
	    	{
	    		if (isMobile)
				{
				navigator.notification.alert(
			            'Veuillez réessayer ultérieurement.',  // message
			            alertDismissed,         // callback
			            'Multicollect',            // title
			            'Ok'                  // buttonName
			        );
				}
				else
					{alert("Veuillez réessayer ultérieurement.");}
	    	}
				
        } catch(e) {
        	if (isMobile)
			{
			navigator.notification.alert(
		            'Veuillez réessayer ultérieurement.',  // message
		            alertDismissed,         // callback
		            'Multicollect',            // title
		            'Ok'                  // buttonName
		        );
			}
			else
				{alert("Veuillez réessayer ultérieurement.");}
        }
	}

}
function alertDismissed() {
    // do something
}