function valide_un_select(nom_select){

	valeur = nom_select.value;

	if (valeur != ''){
		document.multi_form.btn_submit.disabled=false;
	}else{
		document.multi_form.btn_submit.disabled=true;
	}

}
function valide_un_radio(change_action){
	if (change_action != ''){
		document.multi_form.action=change_action;
	}
	document.multi_form.btn_submit.disabled=false;
	
}
function valide_slider(){
	
	if (document.multi_form.slidervalue.value == 50){
		var r = confirm("Confirmez-vous la valeur du slider ?");
		if (r == true) {
			return true;
		 }else{
			return false;
		 }
	}else{
		return true;
	}
	
}