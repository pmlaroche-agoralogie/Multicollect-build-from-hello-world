function getTemplate(selector,qkey)
{
	var template = "";
	question = questions[qkey];
	switch (question.type) 
	{ 
	case "N": 
		slider = 1;
		bulles = form_slider_bulle_g +form_slider_bulle_d;
		template = form_slider.replace('##bulles##',bulles)
							.replace('##question##',question.question)
							.replace('##next##',"'"+selector+"'," +(qkey + 1));
	break; 
	case "S": 
		template = "string";
	break; 
	default: 
		var radio_reponses = "";
		for (var akey in answers)
		{
			
			if (answers[akey].qid == question.qid)
				radio_reponses += form_radio_item.replace("##reponse##",answers[akey].answer)
												.replace("##code##",answers[akey].code)
												.replace("##label##",answers[akey].code);
		}
		template = form_radio.replace('##radio_items##',radio_reponses)
							.replace('##question##',question.question)
							.replace('##next##',"'"+selector+"'," +(qkey + 1));
	break; 
	}
	
	template = template.replace('##qid##',question.qid)
						.replace('##sid##',question.sid)
						.replace('##gid##',question.gid)
						.replace('##idhoraire##',session_encours);
	
	$('body').removeClass();
	$(selector).html(template);
	return false;
}

function saveFormData(type)
{
	var myreturn = true;
	form_qid = $("#multi_form #qid").attr("value");
	form_sid = $("#multi_form #sid").attr("value");
	form_gid = $("#multi_form #gid").attr("value");
	form_idhoraire = $("#multi_form #idhoraire").attr("value");
	switch (type)
	{
		case "radio": 
			form_reponse = $("#multi_form input[type='radio']:checked").attr("id");
		break; 
		case "slider": 
			form_reponse = $("#slidervalue").attr("value");
		break; 
		default: 
			alert("pas de type");
		 	myreturn = false;
		break; 
	}
	 app.db.transaction(function(tx) {
		var timestamp = Math.round(new Date().getTime() / 1000); 
		tx.executeSql('INSERT INTO "reponses" (idhoraire,sid,gid,qid, code, tsreponse, envoi) VALUES('+form_idhoraire+',"'+form_sid+'","'+form_gid+'","'+form_qid+'","'+form_reponse+'", '+(timestamp-360)+',0);');
	});
	return  myreturn;
}

var form_radio = 
'<div class="question">##question##</div>' +   
'    <form method="post" action="" id="multi_form" name="multi_form" onSubmit="if(saveFormData(\'radio\')){getTemplate(##next##);}return false;">'  + 
//'    <form method="post" action="" id="multi_form" name="multi_form" onSubmit="return getTemplate(##next##);">'  + 
'       <div id="radio_style">'  + 
'			##radio_items##' +
'		</div>'  + 
'      <div class="suite">'  + 
'        <input type="hidden" value="##gid##" id="gid" name="gid">'  +
'        <input type="hidden" value="##sid##" id="sid" name="sid">'  +
'        <input type="hidden" value="##qid##" id="qid" name="qid">'  +
'        <input type="hidden" value="##idhoraire##" id="idhoraire" name="idhoraire">'  +
'        <input type="submit" value="Suite &gt;&gt;" disabled="disabled" id="btn_submit" name="btn_submit">'  + 
'      </div>'  + 
'    </form>';

var form_radio_item = '<p><input type="radio" name="reponse" id="##code##" onClick="valide_un_radio();"/><label for="##label##">##reponse##</label></p>'  ;

var form_slider_script = '<script>$( "#slider-range" ).slider({' + 
'	 min: 0,' + 
'	 max: 100,' + 
'	 values: [ 50 ],' + 
'	change: function(event, ui)' +  
'	{' + 
'		$("input#slidervalue").val(ui.value);' + 
'	}' + 
'});' + 
' $("input#slidervalue").val(50);' + 
' ' + 
' $( "#slider-range" ).draggable();</script>' ;

var form_slider =  
'<div class="question">##question##</div>' +   
'<form method="post" action="" id="multi_form" name="multi_form" onSubmit="if(valide_slider()&&saveFormData(\'slider\')){getTemplate(##next##);}return false;">' +   
//'<form method="post" action="" id="multi_form" name="multi_form" onSubmit="return getTemplate(##next##)">' +   
'  ##bulles##' +   
'  <div class="clear"></div>' +   
'  <input type="hidden" id="slidervalue" name="slidervalue"/>' +   
'  <div id="slider-range"></div>' +   
'  <div class="suite">' +   
'        <input type="hidden" value="##gid##" id="gid" name="gid">'  +
'        <input type="hidden" value="##sid##" id="sid" name="sid">'  +
'        <input type="hidden" value="##qid##" id="qid" name="qid">'  +
'        <input type="hidden" value="##idhoraire##" id="idhoraire" name="idhoraire">'  +
'    <input type="submit" value="Suite &gt;&gt;">' +   
'  </div>' +   
'</form>' + form_slider_script;

var form_slider_bulle_g = '<div class="left"><img src="img/humeur_2.png" alt="mal" /><br />Extrêmement<br />triste</div>';
var form_slider_bulle_d = '<div class="right"><img src="img/humeur_4.png" alt="bien" /><br />Extrêmement<br />gaie</div>';

