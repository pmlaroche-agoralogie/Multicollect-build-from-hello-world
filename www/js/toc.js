function valide_select(nom_select,action_vrai,action_faux){

	valeur = document.multi_form[nom_select].value;

	if (valeur != ''){
		document.multi_form.action = action_vrai;
	}else{
		document.multi_form.action = action_faux;
	}


}
function valide_slider(action_vrai,action_faux){
	
	if (document.multi_form.slidervalue.value == 50){
		var r = confirm("Confirmez-vous la valeur du slider ?");
		if (r == true) {
			document.multi_form.action = action_vrai;
		 }else{
			 document.multi_form.action = action_faux;
		 }
	}else{
		document.multi_form.action = action_vrai;
	}
	
}