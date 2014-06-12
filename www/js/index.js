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
    
    var now                  = new Date().getTime(),
    _60_seconds_from_now = new Date(now + 60*1000);
    
    window.plugin.notification.local.add({
                                         id:      1,
                                         title:   'Application de Suivi',
                                         message: 'Merci de répondre au questionnaire de l application de suivi.',
                                         repeat:  'weekly',
                                         date:    _60_seconds_from_now
                                         });
    
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
    
    // https://github.com/brodysoft/Cordova-SQLitePlugin
    this.db = window.sqlitePlugin.openDatabase("Database", "1.0", "Demo", -1);
    
    this.db.transaction(function(tx) {
                        tx.executeSql('DROP TABLE IF EXISTS test_table');
                        tx.executeSql('CREATE TABLE IF NOT EXISTS test_table (id integer primary key, data text, data_num integer)');
                        
                        tx.executeSql('CREATE TABLE IF NOT EXISTS  "question" ("qid" INTEGER DEFAULT (0) ,"parent_qid" INTEGER DEFAULT (0) ,"gid" INTEGER DEFAULT (0) ,"sid" INTEGER DEFAULT (0) ,"kind" VARCHAR,"title" VARCHAR, "answers" TEXT, "order" INTEGER DEFAULT 0);');
                        tx.executeSql("INSERT INTO 'question' VALUES(10,0,4,934317,'L','where','O� etes vous',0);");
                        
                        
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
