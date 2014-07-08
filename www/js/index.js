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

//test si different de  mobile
//http://detectmobilebrowsers.com/ javascript pour mise à jour...
var isMobile = true;
(function(a){if (!(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))))
		//alert('nomob'); 
		isMobile = false;
	/*else 
		alert('mob');*/})
(navigator.userAgent||navigator.vendor||window.opera)

/*if(isMobile)
	alert('mob');
else
	alert('nomob');*/
//fin test si different de  mobile

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
         var el = document.getElementById("chargement"); 
        el.addEventListener('clic', this.getlssfile, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
onDeviceReady: function() {
    app.receivedEvent('deviceready');
    hide_div('blocinit');
    
    
    
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
    
    var now                  = new Date().getTime(),
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
    }
    // https://github.com/brodysoft/Cordova-SQLitePlugin
    if(isMobile)
    	//this.db = window.sqlitePlugin.openDatabase("Database", "1.0", "Demo", -1);
    	db = window.sqlitePlugin.openDatabase("Database", "1.0", "Demo", -1);
    else
    	//this.db = openDatabase("Database", "1.0", "Demo", -1);
    	db = openDatabase("Database", "1.0", "Demo", -1);
    
    //this.db.transaction(function(tx) {
    db.transaction(function(tx) {
                        tx.executeSql('DROP TABLE IF EXISTS test_table');
                        tx.executeSql('CREATE TABLE IF NOT EXISTS test_table (id integer primary key, data text, data_num integer)');
                        
                        tx.executeSql('CREATE TABLE IF NOT EXISTS  "question" ("qid" INTEGER DEFAULT (0) ,"parent_qid" INTEGER DEFAULT (0) ,"gid" INTEGER DEFAULT (0) ,"sid" INTEGER DEFAULT (0) ,"kind" VARCHAR,"title" VARCHAR, "answers" TEXT, "order" INTEGER DEFAULT 0);');
                        tx.executeSql("INSERT INTO 'question' VALUES(10,0,4,934317,'L','where','Où êtes vous',0);");
                        
                        
                        tx.executeSql("INSERT INTO test_table (data, data_num) VALUES (?,?)", ["test", 100], function(tx, res) {
                                 //   alert("insertId: " + res.insertId + " -- probably 1");
                                 //   alert("rowsAffected: " + res.rowsAffected + " -- should be 1");
                                      
                                      tx.executeSql("select count(qid) as cnt from question;", [], function(tx, res) {
                                                    alert("res.rows.length: " + res.rows.length + " -- should be 1");
                                                    alert("res.rows.item(0).cnt: " + res.rows.item(0).cnt + " -- should be 1");
                                                    });
                                      
                                      }, function(e) {
                                      alert("ERROR: " + e.message);
                                      });
                        
                        var timestamp = Math.round(new Date().getTime() / 1000);
                        
                        //test affichage questionnaire sur timestamp
                        //tx.executeSql('CREATE TABLE IF NOT EXISTS "horaires" ("id" INTEGER PRIMARY KEY  NOT NULL  UNIQUE , "uidquestionnaire" VARCHAR, "tsdebut" INTEGER, "dureevalidite" INTEGER, "fait" INTEGER);');
                        //tx.executeSql('DROP TABLE IF EXISTS "horaires"');
                        //alert('CREATE TABLE IF NOT EXISTS "horaires" ("id" INTEGER PRIMARY KEY AUTOINCREMENT , "uidquestionnaire" VARCHAR, "tsdebut" INTEGER, "dureevalidite" INTEGER, "fait" INTEGER);');
                        tx.executeSql('CREATE TABLE IF NOT EXISTS "horaires" ("id" INTEGER PRIMARY KEY AUTOINCREMENT , "uidquestionnaire" VARCHAR, "tsdebut" INTEGER, "dureevalidite" INTEGER, "fait" INTEGER);');
                        
                        //si pas d'enregistrement, j'en remet
                        tx.executeSql('select count("id") as cnt from "horaires" WHERE tsdebut > '+timestamp+';', [], function(tx, res) {
                        	//2mn =120
                        	//15min = 900
                        	var periodetest = 120;
                        	var ecarttest = 120*3;
                        	var nbtest = 4;
                        	var i = 0;
                        	//alert('nbligne '+res.rows.item(0).cnt);
                        	if (res.rows.item(0).cnt == 0)
                        	{
                        		while (i < nbtest) {
                        			//alert('insert INSERT INTO "horaires" (uidquestionnaire, tsdebut, dureevalidite, fait) VALUES("monuidtest",'+(timestamp+(ecarttest*i))+','+periodetest+',0);');
                        			tx.executeSql('INSERT INTO "horaires" (uidquestionnaire, tsdebut, dureevalidite, fait) VALUES("monuidtest",'+(timestamp+(ecarttest*i))+','+periodetest+',0);');
                        		    i++;
                        		}
                        	}
                        });
                        
                        //alert('SELECT *,(tsdebut +dureevalidite) as fin FROM "horaires" WHERE tsdebut < '+timestamp+' AND fin > '+timestamp+';');
                        tx.executeSql('SELECT *,(tsdebut +dureevalidite) as fin FROM "horaires" WHERE tsdebut < '+timestamp+' AND fin  > '+timestamp+';', [], function(tx, res) {
                        	var dataset = res.rows.length;
                            if(dataset>0)
                            {
                            	for(var i=0;i<dataset;i++)
                                {
                            		alert(res.rows.item(i).uidquestionnaire+" ligne "+res.rows.item(i).id+" en cours \ndeb :"+res.rows.item(i).tsdebut+" \nfin : "+res.rows.item(i).fin+"\ntimestamp "+timestamp);
                                }
                            }
                            else
                            	alert("aucun questionnaire en cours\ntimestamp "+timestamp);
                        });
                        
                        //fin test affichage questionnaire sur timestamp
                        
                        //creation table réponses et ligne test
                        //tx.executeSql('DROP TABLE IF EXISTS "reponses"');
                        tx.executeSql('CREATE TABLE IF NOT EXISTS "reponses" ("id" INTEGER PRIMARY KEY AUTOINCREMENT , "idhoraire" INTEGER DEFAULT (0), "sid" VARCHAR, "gid" VARCHAR, "qid" VARCHAR, "code" VARCHAR, "tsreponse" INTEGER, "envoi" BOOLEAN not null default 0);');
                        //lignes de test à modifier selon besoins
                        /*tx.executeSql('INSERT INTO "reponses" (idhoraire,sid,gid,qid, code, tsreponse, envoi) VALUES(21,11,20,10,2, '+(timestamp-360)+',0);');*/
                        //fin creation table réponses et ligne test
                      
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
