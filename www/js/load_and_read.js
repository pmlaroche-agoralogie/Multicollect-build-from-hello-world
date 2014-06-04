function show_settings()
{
    hide_div('home');
    show_div('settings');
}

function begin_acquisition()
{
    hide_div('home');
    show_div('acquisition');
}


function go_home()
{
    //add an alert
    hide_div('acquisition');
    hide_div('settings');
    show_div('home');
}


function testNewStudy (form) {
    var studyNumber = form.inputbox.value;
    alert ("The study number is: " + studyNumber);
}


//From http://stackoverflow.com/questions/649614/xml-parsing-of-a-variable-string-in-javascript
function LoadXMLString(xmlString)
{

   var xDoc;
    // The GetBrowserType function returns a 2-letter code representing
    // ...the type of browser.
    
        var dp = new DOMParser();
        xDoc = dp.parseFromString(xmlString, "text/xml");
       
    return xDoc;
  
}


// From http://www.html5rocks.com/en/tutorials/cors/
// Create the XHR object.
function createCORSRequest(method, url) {
  var xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) {
    // XHR for Chrome/Firefox/Opera/Safari.
    xhr.open(method, url, true);
  } else if (typeof XDomainRequest != "undefined") {
    // XDomainRequest for IE.
    xhr = new XDomainRequest();
    xhr.open(method, url);
  } else {
    // CORS not supported.
    xhr = null;
  }
  return xhr;
}

// Helper method to parse the title tag from the response.
function getTitle(text) {
  return text.match('<title>(.*)?</title>')[1];
}

// Make the actual CORS request.
function makeCorsRequest(url) {
  // All HTML5 Rocks properties support CORS.
  //var url = 'http://mcp.ocd-dbs-france.org/lss/lss_934317';

  var xhr = createCORSRequest('GET', url);
  if (!xhr) {
    console.log('CORS not supported');
    return;
  }

  // Response handlers.
  xhr.onload = function() {
    var text = xhr.responseText;
    var title = getTitle(text);
    console.log('Response from CORS request to ' + url + ': ' + title);
    
    var xmlDoc = LoadXMLString(text);
    console.log(xmlDoc.documentElement.nodeName);
    
    var x=xmlDoc.getElementsByTagName("question");
    //var x=g.getElementsByTagName("rows");

    for (i=0;i<x.length;i++)
      {
       if (x[i].nodeType==1)
        {
            // liste les textes des questions
        console.log('nn'+x[i].nodeName);
        console.log('nv'+x[i].childNodes[0].nodeValue);
        }
      }
     question1.innerHTML = x[0].childNodes[0].nodeValue;
      
      var x=xmlDoc.getElementsByTagName("answer");
      //var x=g.getElementsByTagName("rows");
      var reponse = '';
      for (i=0;i<5;i++)
      {
          if (x[i].nodeType==1)
          {
              
              reponse += "<br>" +x[i].childNodes[0].nodeValue ;
          }
      }
      answer1.innerHTML = reponse;

      
        
  };

  xhr.onerror = function() {
    console.log('Woops, there was an error making the request.');
  };

  xhr.send();
}

function hide_div(divID) {
   var item = document.getElementById(divID);
   if (item) {
      document.getElementById(divID).style.display = 'none';
  }
}

function show_div(divID) {
    var item = document.getElementById(divID);
    if (item) {
        document.getElementById(divID).style.display = 'block';
    }
}