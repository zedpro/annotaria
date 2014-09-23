/* -------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------- */
/* ------------------------------------------------------ */
function hide_annotation_modal () {
	// Nasconde la finestra modale relativa alle annotazioni
	$('#annotaDoc').modal('toggle');
	// Rimuoviamo eventuale evidenza su parti di testo
	var sel = window.getSelection ().removeAllRanges();
}

/* ------------------------------------------------------ */
function get_annotation_form_values (section) {
	// Restituisce il contenuto del form relativo all'annotazione scelta
	var $inputs = $(section+' :input');
    var values = {};
    $inputs.each (function() { values [this.name] = $(this).val(); });
    return (values); 
}

/* ------------------------------------------------------ */
function ma_radio_button (radio_id,button_id) {
	radio_id = ((_g_general_index == -1) ? '' : _m99) + radio_id;
	
	// Disabilitiamo tutti i pulsanti ...
	$('#'+radio_id+' > button').removeClass ("disabled");
	$('#'+radio_id+' > button').removeAttr ("style");
	
	// ... e premiamo quello selezionato
	if (button_id != null) {
		$(button_id).attr ("style","font-weight: bolder; color: black;");
		$(button_id).addClass ("disabled");
	}
}

/* ------------------------------------------------------ */
function ma_exit_with_or_withoutyou () {
	hide_annotation_modal ();
}

/* ------------------------------------------------------ */
function controlla_non_nullo (v,e,allerta) {
	if (v.trim () == "") {
		if (allerta)	alert ('< '+e+' >  non può essere nullo. Inserire un valore.');
		return false;
	}
	
	return true;
}

/* ------------------------------------------------------ */
function traduci_valore (v) {
	switch (v.toUpperCase()) {
		case _apocalypse [0].toUpperCase() : return "Ottimo";
		case _apocalypse [1].toUpperCase() : return "Valido";
		case _apocalypse [2].toUpperCase() : return "Chiaro";
		case _apocalypse [3].toUpperCase() : return "Mediocre";
		case _apocalypse [4].toUpperCase() : return "Pessimo";
		// Nel caso non si riesca ad interpretare la valutazione, 
		// allora si restituisce esattamente ciò che è stato scritto
		default : return v; 		
	}	
}

/* ------------------------------------------------------ */

/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------- */
/* DOCUMENTI ---------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------- */

/* ------------------------------------------------------------------------------- ma_hasAuthor - */
/* ------------------------------------------------------ */
function ma_hasAuthor () {

	var tp = _elementi_documento [0];
	var mody = (_g_general_index == -1) ? false : true;	
	// Prendiamo i dati inseriti ...
	var val = (mody) ? get_annotation_form_values ('#adm_table_mody_body') : get_annotation_form_values ('#adl_'+tp);
	// ... e controlliamo che id e nome siano valorizzati
	var procedi = 0;
	var a = {tipo:0, cat:'documento', val:'', id:'', nome:'', email:''};
	$.each (val, 
		function (k,v) {
			v = $.trim (v);
			if (k == 'id_'+tp) {
				if (controlla_non_nullo (v,'ID',false)) 	{	a.id = v; }
			}
			else if (k == 'nome_'+tp) {
				if (controlla_non_nullo (v,'Nome',true)) 	{	a.nome = v; a.val = v; procedi++; }
				else { return false; }
			}
			else if (k == 'email_'+tp) {
				if (controlla_non_nullo (v,'Email',false)) 	{	a.email = v; }
			}
		}
	);
	
	if (procedi == 1) {
		if (mody) {
			_g_annOta [_g_general_index].val = a.val;
			_g_annOta [_g_general_index].id = a.id;
			_g_annOta [_g_general_index].nome = a.nome;
			_g_annOta [_g_general_index].email = a.email;
			annotaDoc_modifica_annotazioni_reset ();	
		}
		else {
			// Nascondiamo la finestra modale ...
			hide_annotation_modal ();		
			// ... e memorizziamo il record
			_g_annOta.push (a);
		}
	}
}

/* ------------------------------------------------------ */
function ma_hasAuthor_compila_campi (elemento,sfix) {
	$('#'+sfix+'dropdown_hasAuthor').dropdown ('toggle');
		
	$('#'+sfix+'id_hasAuthor').val (elemento [0]["id"]);	
	$('#'+sfix+'nome_hasAuthor').val (elemento [1]["nome"]);
	$('#'+sfix+'email_hasAuthor').val (elemento [2]["email"]);
}

/* ------------------------------------------------------ */
function ma_hasAuthor_load_drop () {
	
	// Carica dal 3store la lista delle persone
	$.ajax ({
		url: _py_annotazioni,
		type: "post",
		datatype : "application/json",
		data: { 'RICHIESTA' : 'hasAuthor_load'},		
		success: function (response) {
			try {
				var sfix = (_g_general_index == -1) ? '' : _m99; 
				
				if (response ["results"]["bindings"]["length"] == 0) {
					// Se non ci sono elementi in lista avvisiamo l'utente
					$('#'+sfix+'dropdown_hasAuthor').empty ();
					$('#'+sfix+'dropdown_hasAuthor').append ('<li role="presentation"><a role="menuitem" tabindex="-1" href="#">Nessun elemento presente</a></li>');
				}
				else {
					ris = [];
				
					$.each (response ["results"]["bindings"],
						function (k,v) {
							sub = []
							sub.push ({"id":v ["id"].value});
							sub.push ({"nome":v ["nome"].value});
							try {									// email è un parametro opzionale
								sub.push ({"email":v ["email"].value});
							} 
							catch (err) {
								sub.push ({"email":""});
							}
							ris.push (sub);
						}
					);
									
					// Abbiamo ottenuto la lista delle persone.
					// Ora popoliamo la drop
					$('#'+sfix+'dropdown_hasAuthor').empty ();
					
					$.each (ris,
						function (k,v){
							$('#'+sfix+'dropdown_hasAuthor').append ('<li role="presentation"><a id="'+sfix+'dropdown_hasAuthor_element" role="menuitem" tabindex="-1" indice="'+k+'" href="#">'+v [1]["nome"]+'</a></li>');
						}
					);
					
					$('a#'+sfix+'dropdown_hasAuthor_element').click (function() { ma_hasAuthor_compila_campi (ris [$(this).attr ('indice')],sfix); return false; });
				}
			}
			catch (err) {
				alert ('ma_hasAuthor_load_drop - errore parse JSON');
			}
		},
		error: function (xhr, ajaxOptions, thrownError) {
		    alert (xhr.status);
		    alert (thrownError);
		}
	});
}

/* ------------------------------------------------------------------------------- ma_hasPublisher - */
/* ------------------------------------------------------ */
function ma_hasPublisher () {
	
	var tp = _elementi_documento [1];
	var mody = (_g_general_index == -1) ? false : true;	
	// Prendiamo i dati inseriti ...
	var val = (mody) ? get_annotation_form_values ('#adm_table_mody_body') : get_annotation_form_values ('#adl_'+tp);
	// ... e controlliamo che id, nome e homep siano valorizzati
	var procedi = 0;
	var a = {tipo:1, cat:'documento', val:'', id:'', nome:'', homep:''};
	$.each (val, 
		function (k,v) {
			v = $.trim (v);
			if (k == 'id_'+tp) {
				if (controlla_non_nullo (v,'ID',true)) 		{	a.id = v; procedi++; }
				else { return false; }
			}
			else if (k == 'nome_'+tp) {
				if (controlla_non_nullo (v,'Nome',true)) 	{	a.nome = v; a.val = v; procedi++; }
				else { return false; }
			}
			else if (k == 'homep_'+tp) {
				if (controlla_non_nullo (v,'Home Page',true)) 	{	a.homep = v; procedi++; }
			}
		}
	);
	
	if (procedi == 3) {
		if (mody) {
			_g_annOta [_g_general_index].val = a.val;
			_g_annOta [_g_general_index].id = a.id;
			_g_annOta [_g_general_index].nome = a.nome;
			_g_annOta [_g_general_index].homep = a.homep;
			annotaDoc_modifica_annotazioni_reset ();	
		}
		else {
			// Nascondiamo la finestra modale ...
			hide_annotation_modal ();		
			// ... e memorizziamo il record
			_g_annOta.push (a);
		}
	}
}

/* ------------------------------------------------------ */         
function ma_hasPublisher_compila_campi (elemento,sfix) {
	$('#'+sfix+'dropdown_hasPublisher').dropdown ('toggle');
		
	$('#'+sfix+'id_hasPublisher').val (elemento [0]["id"]);	
	$('#'+sfix+'nome_hasPublisher').val (elemento [1]["nome"]);
	$('#'+sfix+'email_hasPublisher').val (elemento [2]["homep"]);
}

/* ------------------------------------------------------ */
function ma_hasPublisher_load_drop () {
	
	// Carica dal 3store la lista delle persone
	$.ajax ({
		url: _py_annotazioni,
		type: "post",
		datatype : "application/json",
		data: { 'RICHIESTA' : 'hasPublisher_load'},		
		success: function (response) {
			try {
				var sfix = (_g_general_index == -1) ? '' : _m99; 
				
				if (response ["results"]["bindings"]["length"] == 0) {
					// Se non ci sono elementi in lista avvisiamo l'utente
					$('#'+sfix+'dropdown_hasPublisher').empty ();
					$('#'+sfix+'dropdown_hasPublisher').append ('<li role="presentation"><a role="menuitem" tabindex="-1" href="#">Nessun elemento presente</a></li>');
				}
				else {
					ris = [];
				
					$.each (response ["results"]["bindings"],
						function (k,v) {
							sub = []
							sub.push ({"id":v ["id"].value});
							sub.push ({"nome":v ["nome"].value});
							try {									// email è un parametro opzionale
								sub.push ({"homep":v ["homep"].value});
							} 
							catch (err) {
								sub.push ({"homep":""});
							}
							ris.push (sub);
						}
					);
									
					// Abbiamo ottenuto la lista delle persone.
					// Ora popoliamo la drop
					$('#'+sfix+'dropdown_hasPublisher').empty ();
					
					$.each (ris,
						function (k,v){
							$('#'+sfix+'dropdown_hasPublisher').append ('<li role="presentation"><a id="'+sfix+'dropdown_hasPublisher_element" role="menuitem" tabindex="-1" indice="'+k+'" href="#">'+v [1]["nome"]+'</a></li>');
						}
					);
					
					$('a#'+sfix+'dropdown_hasPublisher_element').click (function() { ma_hasPublisher_compila_campi (ris [$(this).attr ('indice')],sfix); return false; });
				}
			}
			catch (err) {
				alert ('ma_hasPublisher_load_drop - errore parse JSON');
			}
		},
		error: function (xhr, ajaxOptions, thrownError) {
		    alert (xhr.status);
		    alert (thrownError);
		}
	});
}

/* ------------------------------------------------------------------------------- ma_hasPubYear - */
/* ------------------------------------------------------ */
function ma_hasPubYear () {
	
	var tp = _elementi_documento [2];
	var mody = (_g_general_index == -1) ? false : true;
	var sfix = mody ? _m99 : '';	
	// Prendiamo i dati inseriti ...
	var a = {tipo:2, cat:'documento', val:'', anno:$.trim ($('#'+sfix+'anno_'+tp).val()) };
	// Controlliamo che la data sia corretta
	// Impostiamo un limite inferiore e superiore come da specifiche 
	if (a.anno=="") {
		alert ("Selezionare un anno");
	}
	else if (parseInt (a.anno) > 2014) {
		alert ("L'anno deve essere <= di 2014");
	}
	else if (parseInt (a.anno) < 1900 ) {
		alert ("L'anno deve essere >= di 1900");
	}
	else {
		a.val = a.anno;
		if (mody) {
			_g_annOta [_g_general_index].val = a.val;
			_g_annOta [_g_general_index].anno = a.anno;
			annotaDoc_modifica_annotazioni_reset ();	
		}
		else {
			// Nascondiamo la finestra modale ...
			hide_annotation_modal ();		
			// ... e memorizziamo il record
			_g_annOta.push (a);
		}
	}
}

/* ------------------------------------------------------ */
function ma_show_calendar_hasPubYear () {
	
	var sfix = (_g_general_index == -1) ? '#' : '#'+_m99;
	
	// Disabilitiamo il tasto enter altrimenti da problemi con datepicker
	$(sfix+"anno_hasPubYear").keypress ( function(e) { if (e.which == 13) { return false; }	});
	
	// Impostiamo il formato per la data (solo anno) e leghiamo l'evento alla textbox (implicito)
	$(sfix+'anno_hasPubYear').datepicker ( {
		format: " yyyy",
    	viewMode: "years", 
    	minViewMode: "years"
	});

    // Se la data cambia allora dobbiamo nascondere il calendario            
	$(sfix+'anno_hasPubYear').datepicker().on('changeDate', function(ev) { 
		$(sfix+'anno_hasPubYear').datepicker ('hide');		 
	});
                
	// Visualizziamo il calendario                
	$(sfix+'anno_hasPubYear').datepicker ('show');
}

/* ------------------------------------------------------------------------------- ma_hasTitle - */
/* ------------------------------------------------------ */
function ma_hasTitle () {
	
	var tp = _elementi_documento [3];
	var mody = (_g_general_index == -1) ? false : true;
	var sfix = mody ? _m99 : '';
	// Prendiamo i dati inseriti ...
	var a = {tipo:3, cat:'documento', val:'', testo:$.trim ($('#'+sfix+'text_'+tp).val()) };
	
	if (controlla_non_nullo (a.testo,'Titolo',true)) {
		a.val = a.testo;
		if (mody) {									// Modifica
			_g_annOta [_g_general_index].val = a.val;
			_g_annOta [_g_general_index].testo = a.testo;
			annotaDoc_modifica_annotazioni_reset ();			
		}
		else {										// Inserimento	
			// Nascondiamo la finestra modale ...
			hide_annotation_modal ();		
			// ... e memorizziamo il record
			_g_annOta.push (a);
		}
	}
}

/* ------------------------------------------------------------------------------- ma_hasShortTitle - */
/* ------------------------------------------------------ */
function ma_hasShortTitle () {

	var tp = _elementi_documento [4];
	var mody = (_g_general_index == -1) ? false : true;
	var sfix = mody ? _m99 : '';
	// Prendiamo i dati inseriti ...
	var a = {tipo:4, cat:'documento', val:'', testo:$.trim ($('#'+sfix+'text_'+tp).val()) };
	
	if (controlla_non_nullo (a.testo,'Titolo',true)) {
		a.val = a.testo;
		if (mody) {									// Modifica
			_g_annOta [_g_general_index].val = a.val;
			_g_annOta [_g_general_index].testo = a.testo;
			annotaDoc_modifica_annotazioni_reset ();			
		}
		else {										// Inserimento	
			// Nascondiamo la finestra modale ...
			hide_annotation_modal ();		
			// ... e memorizziamo il record
			_g_annOta.push (a);
		}
	}
}

/* ------------------------------------------------------------------------------- ma_hasAbstract - */
/* ------------------------------------------------------ */
function ma_hasAbstract () {
		
	var tp = _elementi_documento [5];
	var mody = (_g_general_index == -1) ? false : true;
	var sfix = mody ? _m99 : '';
	// Prendiamo i dati inseriti ...
	var a = {tipo:5, cat:'documento', val:'', testo:$.trim ($('#'+sfix+'text_'+tp).val()) };
	
	if (controlla_non_nullo (a.testo,'Abstract',true)) {
		a.val = a.testo;
		if (mody) {									// Modifica
			_g_annOta [_g_general_index].val = a.val;
			_g_annOta [_g_general_index].testo = a.testo;
			annotaDoc_modifica_annotazioni_reset ();			
		}
		else {										// Inserimento	
			// Nascondiamo la finestra modale ...
			hide_annotation_modal ();		
			// ... e memorizziamo il record
			_g_annOta.push (a);
		}
	}
}

/* ------------------------------------------------------------------------------- ma_hasComment_doc - */
/* ------------------------------------------------------ */
function ma_hasComment_doc () {

	var tp = _elementi_documento [6];
	var mody = (_g_general_index == -1) ? false : true;
	var sfix = mody ? _m99 : '';
	// Prendiamo i dati inseriti ...
	var a = {tipo:6, cat:'documento', val:'', testo:$.trim ($('#'+sfix+'text_'+tp).val()) };
	
	if (controlla_non_nullo (a.testo,'Commento',true)) {
		a.val = a.testo;
		if (mody) {									// Modifica
			_g_annOta [_g_general_index].val = a.val;
			_g_annOta [_g_general_index].testo = a.testo;
			annotaDoc_modifica_annotazioni_reset ();			
		}
		else {										// Inserimento	
			// Nascondiamo la finestra modale ...
			hide_annotation_modal ();		
			// ... e memorizziamo il record
			_g_annOta.push (a);
		}
	}
}

/* -------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------- */
/* FRAMMENTI ---------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------- */

/* ------------------------------------------------------------------------------- ma_denotesPerson - */
/* ------------------------------------------------------ */
function ma_denotesPerson () {
	
	var indy = 0;	
	var tp = _elementi_frammenti [indy];	
	var mody = (_g_general_index == -1) ? false : true;
	var fid = (mody) ? _g_annOta [_g_general_index].id_fram : ++_g_fram_id;
	// Prendiamo i dati inseriti ...
	var val = (mody) ? get_annotation_form_values ('#adm_table_mody_body') : get_annotation_form_values ('#adl_'+tp);
	// ... e controlliamo che id e nome siano valorizzati
	var procedi = 0;
	var a = {tipo:indy, cat:'frammento', id_fram:fid, val:'', fra:'', nodo:'', start:0, end:0, id:'', nome:'', email:''};
	$.each (val, 
		function (k,v) {
			v = $.trim (v);
			if (k == 'id_'+tp) {
				if (controlla_non_nullo (v,'ID',false)) 	{	a.id = v; }
			}
			else if (k == 'nome_'+tp) {
				if (controlla_non_nullo (v,'Nome',true)) 	{	a.nome = v; a.val = v; procedi++; }
				else { return false; }
			}
			else if (k == 'email_'+tp) {
				if (controlla_non_nullo (v,'Email',false)) 	{	a.email = v; }
			}
		}
	);
	
	if (procedi == 1) {
		if (mody) {
			_g_annOta [_g_general_index].val = a.val;
			_g_annOta [_g_general_index].id = a.id;
			_g_annOta [_g_general_index].nome = a.nome;
			_g_annOta [_g_general_index].email = a.email;
			annotaDoc_modifica_annotazioni_reset ();	
		}
		else {
			// Nascondiamo la finestra modale ...
			hide_annotation_modal ();
			// ... e memorizziamo il record
			a.fra = _g_iGlobal.text;
			a.nodo = _g_iGlobal.ance.id;
			a.start = _g_iGlobal.start;
			a.end = _g_iGlobal.end;
			_g_annOta.push (a);
			// Infine evidenziamo il frammento ...
			dom_refresh ();
		}
	}
}

/* ------------------------------------------------------ */
function ma_denotesPerson_compila_campi (elemento,sfix) {
	$('#'+sfix+'dropdown_denotesPerson').dropdown ('toggle');
		
	$('#'+sfix+'id_denotesPerson').val (elemento [0]["id"]);	
	$('#'+sfix+'nome_denotesPerson').val (elemento [1]["nome"]);
	$('#'+sfix+'email_denotesPerson').val (elemento [2]["email"]);
}

/* ------------------------------------------------------ */
function ma_denotesPerson_load_drop () {
	
	// Carica dal 3store la lista delle persone
	$.ajax ({
		url: _py_annotazioni,
		type: "post",
		datatype : "application/json",
		data: { 'RICHIESTA' : 'denotesPerson_load'},		
		success: function (response) {
			try {
				var sfix = (_g_general_index == -1) ? '' : _m99;
				
				if (response ["results"]["bindings"]["length"] == 0) {
					// Se non ci sono elementi in lista avvisiamo l'utente
					$('#'+sfix+'dropdown_denotesPerson').empty ();
					$('#'+sfix+'dropdown_denotesPerson').append ('<li role="presentation"><a role="menuitem" tabindex="-1" href="#">Nessun elemento presente</a></li>');
				}
				else {
					ris = [];
				
					$.each (response ["results"]["bindings"],
						function (k,v) {
							sub = []
							sub.push ({"id":v ["id"].value});
							sub.push ({"nome":v ["nome"].value});
							try {									// email è un parametro opzionale
								sub.push ({"email":v ["email"].value});
							} 
							catch (err) {
								sub.push ({"email":""});
							}
							ris.push (sub);
						}
					);
									
					// Abbiamo ottenuto la lista delle persone.
					// Ora popoliamo la drop
					$('#'+sfix+'dropdown_denotesPerson').empty ();
					
					$.each (ris,
						function (k,v){
							$('#'+sfix+'dropdown_denotesPerson').append ('<li role="presentation"><a id="'+sfix+'dropdown_denotesPerson_element" role="menuitem" tabindex="-1" indice="'+k+'" href="#">'+v [1]["nome"]+'</a></li>');
						}
					);
					
					$('a#'+sfix+'dropdown_denotesPerson_element').click (function() { ma_denotesPerson_compila_campi (ris [$(this).attr ('indice')],sfix); return false; });
				}
			}
			catch (err) {
				alert ('ma_denotesPerson_load_drop - errore parse JSON');
			}
		},
		error: function (xhr, ajaxOptions, thrownError) {
		    alert (xhr.status);
		    alert (thrownError);
		}
	});
}

/* ------------------------------------------------------------------------------- ma_denotesPlace - */
/* ------------------------------------------------------ */
function ma_denotesPlace () {

	var indy = 1;	
	var tp = _elementi_frammenti [indy];
	var mody = (_g_general_index == -1) ? false : true;	
	var fid = (mody) ? _g_annOta [_g_general_index].id_fram : ++_g_fram_id;
	// Prendiamo i dati inseriti ...
	var val = (mody) ? get_annotation_form_values ('#adm_table_mody_body') : get_annotation_form_values ('#adl_'+tp);
	// ... e controlliamo che id e nome siano valorizzati
	var procedi = 0;
	var a = {tipo:indy, cat:'frammento', id_fram:fid, val:'', fra:'', nodo:'', start:0, end:0, id:'', nome:''};
	$.each (val, 
		function (k,v) {
			if (k == 'id_'+tp) {
				if (controlla_non_nullo (v,'ID',true)) 		{	a.id = v; procedi++; }
				else { return false; }
			}
			else if (k == 'nome_'+tp) {
				if (controlla_non_nullo (v,'Luogo',true)) 	{	a.nome = v; a.val = v; procedi++; }
				else { return false; }
			}
		}
	);
	
	if (procedi == 2) {
		if (mody) {
			_g_annOta [_g_general_index].val = a.val;
			_g_annOta [_g_general_index].id = a.id;
			_g_annOta [_g_general_index].nome = a.nome;
			annotaDoc_modifica_annotazioni_reset ();	
		}
		else {
			// Nascondiamo la finestra modale ...
			hide_annotation_modal ();
			// ... e memorizziamo il record
			a.fra = _g_iGlobal.text;
			a.nodo = _g_iGlobal.ance.id;
			a.start = _g_iGlobal.start;
			a.end = _g_iGlobal.end;
			_g_annOta.push (a);
			// Infine evidenziamo il frammento ...
			dom_refresh ();
		}
	}

}

/* ------------------------------------------------------ */
function ma_denotesPlace_compila_campi (elemento,sfix) {
	$('#'+sfix+'dropdown_denotesPlace').dropdown ('toggle');
		
	$('#'+sfix+'id_denotesPlace').val (elemento [0]["id"]);	
	$('#'+sfix+'nome_denotesPlace').val (elemento [1]["nome"]);
}

/* ------------------------------------------------------ */
function ma_denotesPlace_load_drop () {
	
	// Carica dal 3store la lista delle persone
	$.ajax ({
		url: _py_annotazioni,
		type: "post",
		datatype : "application/json",
		data: { 'RICHIESTA' : 'denotesPlace_load'},		
		success: function (response) {
			try {
				var sfix = (_g_general_index == -1) ? '' : _m99; 
				
				if (response ["results"]["bindings"]["length"] == 0) {
					$('#'+sfix+'dropdown_denotesPlace').empty ();
					$('#'+sfix+'dropdown_denotesPlace').append ('<li role="presentation"><a role="menuitem" tabindex="-1" href="#">Nessun elemento presente</a></li>');
				}
				else {
				
					ris = [];
				
					$.each (response ["results"]["bindings"],
						function (k,v) {
							sub = []
							sub.push ({"id":v ["id"].value});
							sub.push ({"nome":v ["nome"].value});
							
							ris.push (sub);
						}
					);
									
					// Abbiamo ottenuto la lista dei luoghi.
					// Ora popoliamo la drop
					$('#'+sfix+'dropdown_denotesPlace').empty ();
					
					$.each (ris,
						function (k,v){
							$('#'+sfix+'dropdown_denotesPlace').append ('<li role="presentation"><a id="'+sfix+'dropdown_denotesPlace_element" role="menuitem" tabindex="-1" indice="'+k+'" href="#">'+v [1]["nome"]+'</a></li>');
						}
					);
					
					$('a#'+sfix+'dropdown_denotesPlace_element').click (function() { ma_denotesPlace_compila_campi (ris [$(this).attr ('indice')],sfix); return false; });
				}
			}
			catch (err) {
				alert ('ma_denotesPlace_load_drop - errore parse JSON');
			}
		},
		error: function (xhr, ajaxOptions, thrownError) {
		    alert (xhr.status);
		    alert (thrownError);
		}
	});
}

/* ------------------------------------------------------------------------------- ma_denotesDisease - */
/* ------------------------------------------------------ */
function ma_denotesDisease () {
	
	var indy = 2;	
	var tp = _elementi_frammenti [indy];	
	var mody = (_g_general_index == -1) ? false : true;
	var fid = (mody) ? _g_annOta [_g_general_index].id_fram : ++_g_fram_id;
	// Prendiamo i dati inseriti ...
	var val = (mody) ? get_annotation_form_values ('#adm_table_mody_body') : get_annotation_form_values ('#adl_'+tp);
	// ... e controlliamo che id e nome siano valorizzati
	var procedi = 0;
	var a = {tipo:indy, cat:'frammento', id_fram:fid, val:'', fra:'', nodo:'', start:0, end:0, id:'', nome:''};
	$.each (val, 
		function (k,v) {
			if (k == 'id_'+tp) {
				if (ma_denotesDisease_controlla_prefisso (v)) 		{	a.id = v; procedi++; }
				else { return false; }
			}
			else if (k == 'nome_'+tp) {
				if (controlla_non_nullo (v,'Malattia',true)) 	{	a.nome = v; a.val = v; procedi++; }
				else { return false; }
			}
		}
	);
	
	if (procedi == 2) {
		if (mody) {
			_g_annOta [_g_general_index].val = a.val;
			_g_annOta [_g_general_index].id = a.id;
			_g_annOta [_g_general_index].nome = a.nome;
			annotaDoc_modifica_annotazioni_reset ();	
		}
		else {
			// Nascondiamo la finestra modale ...
			hide_annotation_modal ();
			// ... e memorizziamo il record
			a.fra = _g_iGlobal.text;
			a.nodo = _g_iGlobal.ance.id;
			a.start = _g_iGlobal.start;
			a.end = _g_iGlobal.end;
			_g_annOta.push (a);
			// Infine evidenziamo il frammento ...
			dom_refresh ();
		}
	}
	
}

/* ------------------------------------------------------ */
function ma_denotesDisease_controlla_prefisso (v) {
	var ris = true;
	
	if (controlla_non_nullo (v,'ID',true)) {
		// Controlliamo che il prefisso iniziale sia quello di default (_argo_prefix)
		v = $.trim (v);	
		var len = _mala_prefix.length;
		var s = v.substring (0,len);
		if (s.localeCompare (_mala_prefix) != 0) { 
			alert ("Il prefisso deve essere "+_mala_prefix);
			ris = false; 
		}
	}
	else { ris = false; }
		
	return ris;
}

/* ------------------------------------------------------ */
function ma_denotesDisease_setPrefix () {
	var s = $.trim ($('#id_denotesDisease').val ());
	// Inseriamo il prefisso solo se non c'è già un prefisso inserito
	if (s.substring (0,7) != 'http://') {
		$('#id_denotesDisease').val (_mala_prefix + s);
	}
}

/* ------------------------------------------------------ */
function ma_denotesDisease_compila_campi (elemento,sfix) {
	$('#'+sfix+'dropdown_denotesDisease').dropdown ('toggle');
		
	$('#'+sfix+'id_denotesDisease').val (elemento [0]["id"]);	
	$('#'+sfix+'nome_denotesDisease').val (elemento [1]["nome"]);
}

/* ------------------------------------------------------ */
function ma_denotesDisease_load_drop () {
	
	// Carica dal 3store la lista delle persone
	$.ajax ({
		url: _py_annotazioni,
		type: "post",
		datatype : "application/json",
		data: { 'RICHIESTA' : 'denotesDisease_load'},		
		success: function (response) {
			try {
				var sfix = (_g_general_index == -1) ? '' : _m99;
				
				if (response ["results"]["bindings"]["length"] == 0) {
					$('#'+sfix+'dropdown_denotesDisease').empty ();
					$('#'+sfix+'dropdown_denotesDisease').append ('<li role="presentation"><a role="menuitem" tabindex="-1" href="#">Nessun elemento presente</a></li>');
				}
				else {
				
					ris = [];
				
					$.each (response ["results"]["bindings"],
						function (k,v) {
							sub = []
							sub.push ({"id":v ["id"].value});
							sub.push ({"nome":v ["nome"].value});
							
							ris.push (sub);
						}
					);
									
					// Abbiamo ottenuto la lista dei luoghi.
					// Ora popoliamo la drop
					$('#'+sfix+'dropdown_denotesDisease').empty ();
					
					$.each (ris,
						function (k,v){
							$('#'+sfix+'dropdown_denotesDisease').append ('<li role="presentation"><a id="'+sfix+'dropdown_denotesDisease_element" role="menuitem" tabindex="-1" indice="'+k+'" href="#">'+v [1]["nome"]+'</a></li>');
						}
					);
					
					$('a#'+sfix+'dropdown_denotesDisease_element').click (function() { ma_denotesDisease_compila_campi (ris [$(this).attr ('indice')],sfix); return false; });
				}
			}
			catch (err) {
				alert ('ma_denotesDisease_load_drop - errore parse JSON');
			}
		},
		error: function (xhr, ajaxOptions, thrownError) {
		    alert (xhr.status);
		    alert (thrownError);
		}
	});
}

/* ------------------------------------------------------------------------------- ma_hasSubject - */
/* ------------------------------------------------------ */
function ma_hasSubject () {
	
	var indy = 3;	
	var tp = _elementi_frammenti [indy];
	var mody = (_g_general_index == -1) ? false : true;	
	var fid = (mody) ? _g_annOta [_g_general_index].id_fram : ++_g_fram_id;	
	// Prendiamo i dati inseriti ...
	var val = (mody) ? get_annotation_form_values ('#adm_table_mody_body') : get_annotation_form_values ('#adl_'+tp);
	// ... e controlliamo che id e nome siano valorizzati
	var procedi = 0;
	var a = {tipo:indy, cat:'frammento', id_fram:fid, val:'', fra:'', nodo:'', start:0, end:0, id:'', nome:''};
	$.each (val, 
		function (k,v) {
			if (k == 'id_'+tp) {
				if (ma_hasSubject_controlla_prefisso (v)) 		{	a.id = v; procedi++; }
				else { return false; }
			}
			else if (k == 'nome_'+tp) {
				if (controlla_non_nullo (v,'Argomento',true)) 	{	a.nome = v; a.val = v; procedi++; }
				else { return false; }
			}
		}
	);
	
	if (procedi == 2) {
		if (mody) {
			_g_annOta [_g_general_index].val = a.val;
			_g_annOta [_g_general_index].id = a.id;
			_g_annOta [_g_general_index].nome = a.nome;
			annotaDoc_modifica_annotazioni_reset ();	
		}
		else {
			// Nascondiamo la finestra modale ...
			hide_annotation_modal ();
			// ... e memorizziamo il record
			a.fra = _g_iGlobal.text;
			a.nodo = _g_iGlobal.ance.id;
			a.start = _g_iGlobal.start;
			a.end = _g_iGlobal.end;
			_g_annOta.push (a);
			// Infine evidenziamo il frammento ...
			dom_refresh ();
		}
	}
	
}

/* ------------------------------------------------------ */
function ma_hasSubject_controlla_prefisso (v) {
	var ris = true;
	
	if (controlla_non_nullo (v,'ID',true)) {
		// Controlliamo che il prefisso iniziale sia quello di default (_argo_prefix)
		v = $.trim (v);	
		var len = _argo_prefix.length;
		var s = v.substring (0,len);
		if (s.localeCompare (_argo_prefix) != 0) { 
			alert ("Il prefisso deve essere "+_argo_prefix);
			ris = false; 
		}
	}
	else { ris = false; }
		
	return ris;
}

/* ------------------------------------------------------ */
function ma_hasSubject_setPrefix () {
	var s = $.trim ($('#id_hasSubject').val ());
	// Inseriamo il prefisso solo se non c'è già un prefisso inserito
	if (s.substring (0,7) != 'http://') {
		$('#id_hasSubject').val (_argo_prefix + s);
	}
}

/* ------------------------------------------------------ */
function ma_hasSubject_compila_campi (elemento,sfix) {
	$('#'+sfix+'dropdown_hasSubject').dropdown ('toggle');
		
	$('#'+sfix+'id_hasSubject').val (elemento [0]["id"]);	
	$('#'+sfix+'nome_hasSubject').val (elemento [1]["nome"]);
}

/* ------------------------------------------------------ */
function ma_hasSubject_load_drop () {
	
	// Carica dal 3store la lista delle persone
	$.ajax ({
		url: _py_annotazioni,
		type: "post",
		datatype : "application/json",
		data: { 'RICHIESTA' : 'hasSubject_load'},		
		success: function (response) {
			try {
				var sfix = (_g_general_index == -1) ? '' : _m99;
				
				if (response ["results"]["bindings"]["length"] == 0) {
					$('#'+sfix+'dropdown_hasSubject').empty ();
					$('#'+sfix+'dropdown_hasSubject').append ('<li role="presentation"><a role="menuitem" tabindex="-1" href="#">Nessun elemento presente</a></li>');
				}
				else {
				
					ris = [];
				
					$.each (response ["results"]["bindings"],
						function (k,v) {
							sub = []
							sub.push ({"id":v ["id"].value});
							sub.push ({"nome":v ["nome"].value});
							
							ris.push (sub);
						}
					);
									
					// Abbiamo ottenuto la lista dei luoghi.
					// Ora popoliamo la drop
					$('#'+sfix+'dropdown_hasSubject').empty ();
					
					$.each (ris,
						function (k,v){
							$('#'+sfix+'dropdown_hasSubject').append ('<li role="presentation"><a id="'+sfix+'dropdown_hasSubject_element" role="menuitem" tabindex="-1" indice="'+k+'" href="#">'+v [1]["nome"]+'</a></li>');
						}
					);
					
					$('a#'+sfix+'dropdown_hasSubject_element').click (function() { ma_hasSubject_compila_campi (ris [$(this).attr ('indice')],sfix); return false; });
				}
			}
			catch (err) {
				alert ('ma_hasSubject_load_drop - errore parse JSON');
			}
		},
		error: function (xhr, ajaxOptions, thrownError) {
		    alert (xhr.status);
		    alert (thrownError);
		}
	});
}

/* ------------------------------------------------------------------------------- ma_relatesTo - */
/* ------------------------------------------------------ */
function ma_relatesTo () {
	
	var indy = 4;	
	var tp = _elementi_frammenti [indy];	
	var mody = (_g_general_index == -1) ? false : true;		
	var fid = (mody) ? _g_annOta [_g_general_index].id_fram : ++_g_fram_id;
	// Prendiamo i dati inseriti ...
	var val = (mody) ? get_annotation_form_values ('#adm_table_mody_body') : get_annotation_form_values ('#adl_'+tp);
	// ... e controlliamo che id e nome siano valorizzati
	var procedi = 0;
	var a = {tipo:indy, cat:'frammento', id_fram:fid, val:'', fra:'', nodo:'', start:0, end:0, id:'', nome:''};
	$.each (val, 
		function (k,v) {
			if (k == 'id_'+tp) {
				if (controlla_non_nullo (v,'ID',true)) 		{	a.id = v; procedi++; }
				else { return false; }
			}
			else if (k == 'nome_'+tp) {
				if (controlla_non_nullo (v,'Etichetta',true)) 	{	a.nome = v; a.val = v; procedi++; }
				else { return false; }
			}
		}
	);
	
	if (procedi == 2) {
		if (mody) {
			_g_annOta [_g_general_index].val = a.val;
			_g_annOta [_g_general_index].id = a.id;
			_g_annOta [_g_general_index].nome = a.nome;
			annotaDoc_modifica_annotazioni_reset ();	
		}
		else {
			// Nascondiamo la finestra modale ...
			hide_annotation_modal ();
			// ... e memorizziamo il record
			a.fra = _g_iGlobal.text;
			a.nodo = _g_iGlobal.ance.id;
			a.start = _g_iGlobal.start;
			a.end = _g_iGlobal.end;
			_g_annOta.push (a);
			// Infine evidenziamo il frammento ...
			dom_refresh ();
		}
	}
	
}

/* ------------------------------------------------------ */
function ma_relatesTo_compila_campi (elemento,sfix) {
	
	var id;
	var nome;
	
	if (elemento.length == 4) {
		// Abbiamo un elemento da dbpedia
		id = elemento [1]["link"];
		nome = elemento [2]["titolo"];		
	}
	else {
		$('#'+sfix+'dropdown_relatesTo').dropdown ('toggle');
		id = elemento [0]["id"];
		nome = elemento [1]["nome"];
	}
			
	$('#'+sfix+'id_relatesTo').val (id);	
	$('#'+sfix+'nome_relatesTo').val (nome);
}

/* ------------------------------------------------------ */
function clear_dbp_collapse (sfix) {
	// Chiudiamo e vuotiamo il pannello di dbpedia
	$('#'+sfix+'collapse_relatesTo_button').attr ('class','panel-collapse collapse');
	$('#'+sfix+'dbResult_relatesTo').empty ();
}

/* ------------------------------------------------------ */
function ma_relatesTo_load_drop () {
	
	var sfix = (_g_general_index == -1) ? '' : _m99;
	clear_dbp_collapse (sfix);
	
	// Carica dal 3store la lista delle relazioni
	$.ajax ({
		url: _py_annotazioni,
		type: "post",
		datatype : "application/json",
		data: { 'RICHIESTA' : 'relatesTo_load'},		
		success: function (response) {
			try {
				if (response ["results"]["bindings"]["length"] == 0) {
					$('#'+sfix+'dropdown_relatesTo').empty ();
					$('#'+sfix+'dropdown_relatesTo').append ('<li role="presentation"><a role="menuitem" tabindex="-1" href="#">Nessun elemento presente</a></li>');
				}
				else {
				
					ris = [];
				
					$.each (response ["results"]["bindings"],
						function (k,v) {
							sub = []
							sub.push ({"id":v ["id"].value});
							sub.push ({"nome":v ["nome"].value});
							
							ris.push (sub);
						}
					);
									
					// Abbiamo ottenuto la lista dei luoghi.
					// Ora popoliamo la drop
					$('#'+sfix+'dropdown_relatesTo').empty ();
					
					$.each (ris,
						function (k,v){
							$('#'+sfix+'dropdown_relatesTo').append ('<li role="presentation"><a id="'+sfix+'dropdown_relatesTo_element" role="menuitem" tabindex="-1" indice="'+k+'" href="#">'+v [1]["nome"]+'</a></li>');
						}
					);
					
					$('a#'+sfix+'dropdown_relatesTo_element').click (function() { ma_relatesTo_compila_campi (ris [$(this).attr ('indice')],sfix); return false; });
				}
			}
			catch (err) {
				alert ('ma_relatesTo_load_drop - errore parse JSON');
			}
		},
		error: function (xhr, ajaxOptions, thrownError) {
		    alert (xhr.status);
		    alert (thrownError);
		}
	});
}

/* ------------------------------------------------------ */
function ma_dbResult_relatesTo_button () {
	// Ricerca un termine su DBPedia
	var maxlen = 250;					// Numero massimo di caratteri per l'alteprima
	var maxres = 20;					// Numero massimo di risultati
	var sfix = (_g_general_index == -1) ? '' : _m99;
	
	t = $('#'+sfix+'dbFind_relatesTo_input')[0].value;
	$('#'+sfix+'dbResult_relatesTo').empty ();
	
	if (t.length == 0) {
		// Warning string di ricerca vuota
		$('#'+sfix+'dbResult_relatesTo').append ('<div class="alert alert-warning" role="alert"><h4>Inserire una stringa di ricerca</h4></div>');
	}
	else {
		$('#'+sfix+'dbResult_relatesTo').append ('<h4>Attesa dati ...</h4><img class="wait_image" src="images/wait_circle.gif" />');
		
		$.ajax ({
			url: _py_annotazioni,
			type: "post",
			datatype : "application/json",
			data: { 'RICHIESTA' : 'db_relatesTo_load', 'SRC_STR' : t },		
			success: function (response) {
				try {
					if (response ["results"]["bindings"]["length"] == 0) {
						$('#'+sfix+'dbResult_relatesTo').empty ();
						$('#'+sfix+'dbResult_relatesTo').append ('<div class="alert alert-warning" role="alert"><h4>Nessun elemento corrisponde alla stringa di ricerca inserita</h4></div>');
					}
					else {
						ris = [];
					
						$.each (response ["results"]["bindings"],
							function (k,v) {
								if (k<maxres) {
									sub = []
									
									// Tronchiamo l'anteprima
									var desk = v ["descrizione"].value;
									if (desk.length > maxlen) {
										desk = desk.substring (0,(maxlen/2)) + ' [...] ' + desk.substring (desk.length-(maxlen/2));
									}
									
									sub.push ({"descrizione":desk});
									sub.push ({"link":v ["link"].value});
									sub.push ({"titolo":v ["titolo"].value});
									sub.push ({"wiki":v ["wiki"].value});
									
									ris.push (sub);
								}
							}
						);
				
						// Abbiamo la lista con i risultati.
						// Ora popoliamo la list group
						$('#'+sfix+'dbResult_relatesTo').empty ();
						
						$.each (ris,
							function (k,v){
								$('#'+sfix+'dbResult_relatesTo').append ('<a id="'+sfix+'dbResult_relatesTo_element" href="#" tabindex="-1" class="list-group-item" indice="'+k+'"><h4 class="list-group-item-heading">'+v[2]["titolo"]+'</h4><p class="list-group-item-text">'+v[0]["descrizione"]+'</p><a id="'+sfix+'dbResult_relatesTo_wiki_element" href="#" indice="'+k+'">'+v[3]["wiki"]+'</a></a>');
							}
						);
						
						$('a#'+sfix+'dbResult_relatesTo_element').unbind ('click');
						$('a#'+sfix+'dbResult_relatesTo_element').click (function() { ma_relatesTo_compila_campi (ris [$(this).attr ('indice')],sfix); return false; });
						$('a#'+sfix+'dbResult_relatesTo_wiki_element').unbind ('click');
						$('a#'+sfix+'dbResult_relatesTo_wiki_element').click (function() { window.open (ris [$(this).attr ('indice')][3]["wiki"]); return false; });						
					}
				}
				catch (err) {
					alert ('ma_dbResult_relatesTo - errore parse JSON');
				}
			},
			error: function (xhr, ajaxOptions, thrownError) {
			    alert (xhr.status);
			    alert (thrownError);
			}
		});
	}
}

/* ------------------------------------------------------------------------------- ma_hasClarityScore - */
/* ------------------------------------------------------ */
function ma_hasClarityScore () {
	
	var indy = 5;
	var tp = _elementi_frammenti [indy];
	var sfix = (_g_general_index == -1) ? '' : _m99;
	var fid = (_g_general_index > -1) ? _g_annOta [_g_general_index].id_fram : ++_g_fram_id;
	// Prendiamo i dati inseriti ...
	var a = {tipo:indy, cat:'frammento', id_fram:fid, val:'', fra:'', nodo:'', start:0, end:0, valore:'' };
	var selezionato = false;
	var $radio = $('#'+sfix+'adl_'+tp+'Score_radio :button');
    $radio.each ( function () { 
    		if ($(this).hasClass ('disabled')) {
    			a.valore = $(this).attr ('valore');
    			selezionato = true;
    		}
    	}
    );
	
	if (selezionato) {
		if (sfix == _m99) {
			_g_annOta [_g_general_index].val = traduci_valore (a.valore);
			_g_annOta [_g_general_index].valore = a.valore;
			annotaDoc_modifica_annotazioni_reset ();	
		}
		else {
			// Nascondiamo la finestra modale ...
			hide_annotation_modal ();	
			// ... e memorizziamo il record
			a.val = traduci_valore (a.valore);
			a.fra = _g_iGlobal.text;
			a.nodo = _g_iGlobal.ance.id;
			a.start = _g_iGlobal.start;
			a.end = _g_iGlobal.end;
			_g_annOta.push (a);
			// Infine evidenziamo il frammento ...
			dom_refresh ();
		}
	}
	else {
		alert ("Selezionare un elemento");	
	}
	
}

/* ------------------------------------------------------------------------------- ma_hasOriginalityScore - */
/* ------------------------------------------------------ */
function ma_hasOriginalityScore () {
	
	var indy = 6;
	var tp = _elementi_frammenti [indy];
	var sfix = (_g_general_index == -1) ? '' : _m99;
	var fid = (_g_general_index > -1) ? _g_annOta [_g_general_index].id_fram : ++_g_fram_id;
	// Prendiamo i dati inseriti ...
	var a = {tipo:indy, cat:'frammento', id_fram:fid, val:'', fra:'', nodo:'', start:0, end:0, valore:'' };
	var selezionato = false;
	var $radio = $('#'+sfix+'adl_'+tp+'Score_radio :button');
    $radio.each ( function () { 
    		if ($(this).hasClass ('disabled')) {
    			a.valore = $(this).attr ('valore');
    			selezionato = true;
    		}
    	}
    );
	
	if (selezionato) {
		if (sfix == _m99) {
			_g_annOta [_g_general_index].val = traduci_valore (a.valore);
			_g_annOta [_g_general_index].valore = a.valore;
			annotaDoc_modifica_annotazioni_reset ();	
		}
		else {
			// Nascondiamo la finestra modale ...
			hide_annotation_modal ();	
			// ... e memorizziamo il record
			a.val = traduci_valore (a.valore);
			a.fra = _g_iGlobal.text;
			a.nodo = _g_iGlobal.ance.id;
			a.start = _g_iGlobal.start;
			a.end = _g_iGlobal.end;
			_g_annOta.push (a);
			// Infine evidenziamo il frammento ...
			dom_refresh ();
		}
	}
	else {
		alert ("Selezionare un elemento");	
	}
}

/* ------------------------------------------------------------------------------- ma_hasFormattingScore - */
/* ------------------------------------------------------ */
function ma_hasFormattingScore () {
	
	var indy = 7;
	var tp = _elementi_frammenti [indy];
	var sfix = (_g_general_index == -1) ? '' : _m99;
	var fid = (_g_general_index > -1) ? _g_annOta [_g_general_index].id_fram : ++_g_fram_id;
	// Prendiamo i dati inseriti ...
	var a = {tipo:indy, cat:'frammento', id_fram:fid, val:'', fra:'', nodo:'', start:0, end:0, valore:'' };
	var selezionato = false;
	var $radio = $('#'+sfix+'adl_'+tp+'Score_radio :button');
    $radio.each ( function () { 
    		if ($(this).hasClass ('disabled')) {
    			a.valore = $(this).attr ('valore');
    			selezionato = true;
    		}
    	}
    );
	
	if (selezionato) {
		if (sfix == _m99) {
			_g_annOta [_g_general_index].val = traduci_valore (a.valore);
			_g_annOta [_g_general_index].valore = a.valore;
			annotaDoc_modifica_annotazioni_reset ();	
		}
		else {
			// Nascondiamo la finestra modale ...
			hide_annotation_modal ();	
			// ... e memorizziamo il record
			a.val = traduci_valore (a.valore);
			a.fra = _g_iGlobal.text;
			a.nodo = _g_iGlobal.ance.id;
			a.start = _g_iGlobal.start;
			a.end = _g_iGlobal.end;
			_g_annOta.push (a);
			// Infine evidenziamo il frammento ...
			dom_refresh ();
		}
	}
	else {
		alert ("Selezionare un elemento");	
	}
	
}

/* ------------------------------------------------------------------------------- ma_cites - */
/* ------------------------------------------------------ */
function ma_cites () {

	var indy = 8;	
	var tp = _elementi_frammenti [indy];	
	var mody = (_g_general_index == -1) ? false : true;
	var fid = (mody) ? _g_annOta [_g_general_index].id_fram : ++_g_fram_id;
	// Prendiamo i dati inseriti ...
	var val = (mody) ? get_annotation_form_values ('#adm_table_mody_body') : get_annotation_form_values ('#adl_'+tp);
	// ... e controlliamo che url e titolo siano valorizzati
	var procedi = 0;
	var a = {tipo:indy, cat:'frammento', id_fram:fid, val:'', fra:'', nodo:'', start:0, end:0, url:'', titolo:''};
	$.each (val, 
		function (k,v) {
			if (k == 'url_'+tp) {
				if (controlla_non_nullo (v,'URL',true)) 	{	a.url = v; procedi++; }
				else { return false; }
			}
			else if (k == 'titolo_'+tp) {
				if (controlla_non_nullo (v,'Titolo',true)) 	{	a.titolo = v; a.val = v; procedi++; }
				else { return false; }
			}
		}
	);
	
	if (procedi == 2) {
		if (mody) {
			_g_annOta [_g_general_index].val = a.val;
			_g_annOta [_g_general_index].url = a.url;
			_g_annOta [_g_general_index].titolo = a.titolo;
			annotaDoc_modifica_annotazioni_reset ();	
		}
		else {
			// Nascondiamo la finestra modale ...
			hide_annotation_modal ();
			// ... e memorizziamo il record
			a.fra = _g_iGlobal.text;
			a.nodo = _g_iGlobal.ance.id;
			a.start = _g_iGlobal.start;
			a.end = _g_iGlobal.end;
			_g_annOta.push (a);
			// Infine evidenziamo il frammento ...
			dom_refresh ();
		}
	}	
}

/* ------------------------------------------------------ */
function ma_cites_add_http () {
	// Evento lost focus dell'inputbox url
	// Controlliamo che sia presente un suffisso *://
	var sfix = (_g_general_index == -1) ? '' : _m99;
	var s = $('#'+sfix+'url_cites').val ();
	
	s = $.trim(s);
	if (s != '') {
		if (s.indexOf ("://") < 0) {
			s = "http://"+s;
		}
	}
	
	$('#'+sfix+'url_cites').val (s);
}

/* ------------------------------------------------------ */
function ma_cites_get_titolo (href) {
	
	var sfix = (_g_general_index == -1) ? '' : _m99;
	var url = href;
	
	// Recuperiamo il titolo del documento
	$wait = $('#'+sfix+'dropdown_cites_wait_me'); 
	
	$wait.empty ();
	$wait.append ('<img class="wait_image" src="images/wait_circle.gif" />');
	
	if (href == '') {
		// Recuperiamo l'indirizzo del documento
		url = $('#'+sfix+'url_cites').val ();
	}
	
	$.ajax ({
		url: _php_server+'?action=get_cites_title&doc_url='+url,
		type: 'GET',
        dataType: 'html',
        success: function (titolo) {
        	$('#'+sfix+'titolo_cites').val (titolo);
        	$wait.empty ();
        	
        	if (titolo == '') {
        		// Il titolo non è stato trovato
				alert ('Titolo non trovato. Controllare l\'indirizzo');
				$('#'+sfix+'titolo_cites').val ('');
        	}
        },
        error: function (request, status, error) {
        	$wait.empty ();
        	alert ('Titolo non trovato. Controllare l\'indirizzo');
        	$('#'+sfix+'titolo_cites').val ('');
        }
    });
}

/* ------------------------------------------------------ */
function ma_cites_get_internal (href,sfix) {
	$('#'+sfix+'dropdown_cites').dropdown ('toggle');
		
	href = _doc_url+'/'+href;
	$('#'+sfix+'url_cites').val (href);
	ma_cites_get_titolo (href);
}

/* ------------------------------------------------------ */
function ma_cites_load_drop () {
	
	var sfix = (_g_general_index == -1) ? '' : _m99;
	
	/* Prendiamo la lista dei documenti */ 
	$.ajax ({
		url: _php_server+'?action=file_list_cites_drop&doc_url='+_doc_url+'&mody='+sfix,
		type: 'GET',
        dataType: 'html',
        success: function (html_source) {
        	try {
				$('#'+sfix+'dropdown_cites').empty ();
	        	$('#'+sfix+'dropdown_cites').append (html_source);        	
	        	/* Aggiungiamo la funzione che gestisce il click e recupera il nome del file selezionato */
	        	$('a#'+sfix+'cites_drop_doc_name').click (function() { ma_cites_get_internal ($(this).attr('href'),sfix); return false; });
        	}
			catch (err) {
				alert ('ma_cites_load_drop - errore parse JSON');
			}
        },
        error: function (request, status, error) {
        	var message = request.status + ": " + request.statusText;
            alert (message);
        }
    });
}

/* ------------------------------------------------------------------------------- ma_hasComment - */
/* ------------------------------------------------------ */
function ma_hasComment () {
	
	var indy = 9;
	var tp = _elementi_frammenti [indy];
	var mody = (_g_general_index == -1) ? false : true;
	var fid = (_g_general_index > -1) ? _g_annOta [_g_general_index].id_fram : ++_g_fram_id;
	var sfix = mody ? _m99 : '';
	// Prendiamo i dati inseriti ...
	var a = {tipo:indy, cat:'frammento', id_fram:fid, val:'', fra:'', nodo:'', start:0, end:0, testo:$.trim ($('#'+sfix+'text_'+tp).val()) };
	
	if (controlla_non_nullo (a.testo,'Commento',true)) {
		if (mody) {									// Modifica
			_g_annOta [_g_general_index].val = a.testo;
			_g_annOta [_g_general_index].testo = a.testo;
			annotaDoc_modifica_annotazioni_reset ();			
		}
		else {
			// Nascondiamo la finestra modale ...
			hide_annotation_modal ();	
			// ... e memorizziamo il record
			a.val = a.testo;
			a.fra = _g_iGlobal.text;
			a.nodo = _g_iGlobal.ance.id;
			a.start = _g_iGlobal.start;
			a.end = _g_iGlobal.end;
			_g_annOta.push (a);
			// Infine evidenziamo il frammento ...
			dom_refresh ();
		}
	}
}


/* -------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------- */
/* Salvataggio Annotazioni -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------- */

/* ------------------------------------------------------ */
function data_tempo () {
    
    function pad(num) {
    	norm = Math.abs (Math.floor (num));
    	return (norm < 10 ? '0' : '') + norm;
	}
    
    var local = new Date();
    var tzo = -local.getTimezoneOffset();
    var sign = tzo >= 0 ? '+' : '-';
    
    return local.getFullYear() 
        + '-' + pad (local.getMonth()+1)
        + '-' + pad (local.getDate())
        + 'T' + pad (local.getHours())
        + ':' + pad (local.getMinutes()) 
        + ':' + pad (local.getSeconds()) 
        + sign + pad (tzo / 60) 
        + ':' + pad (tzo % 60);
}

/* ------------------------------------------------------ */
function sa_exape (s) {
	
	s = s.replace (/\(/g,'\\(');
	s = s.replace (/\)/g,'\\)');
	s = s.replace (/\#/g,'\\#');
	return (s);
}

/* ------------------------------------------------------ */
function salva_annotazioni_norman_person (nome) {
	// Sostituiamo gli spazi con linee
	nome = nome.replace (/ +(?= )/g,'');
	nome = nome.replace (/ /g,'-');
	return (nome);
}

/* ------------------------------------------------------ */
function salva_annotazioni_intesta (etichetta,tipo) {
	var s = 
		'[ a               oa:Annotation ;'+_crlf+
		'  rdfs:label      "'+etichetta+'" ;'+_crlf+
		'  ao:type         "'+tipo+'" ;'+_crlf+
		'  oa:annotatedAt  "'+data_tempo ()+'" ;'+_crlf+
		'  oa:annotatedBy  aop:'+sa_exape (salva_annotazioni_norman_person (_g_annotatore.autore))+' ;';
		
	return (s);
}

/* ------------------------------------------------------ */
function salva_annotazioni_annotatore_rdf () {
	var s = 'aop:'+sa_exape (salva_annotazioni_norman_person (_g_annotatore.autore))+_crlf+
		    '       a              foaf:Person ;'+_crlf+
		    '       foaf:name      "'+_g_annotatore.autore+'" ';
		
	s += (_g_annotatore.email != '') ? 	';'+_crlf+'       schema:email   "'+_g_annotatore.email+'" .' : '.' ; 
	
	return s;
}

/* ------------------------------------------------------ */
function salva_annotazioni_doc_name (with_ext,v) {
	
	var s = (with_ext) ? _g_annotatore.doc_name : _g_annotatore.doc_name.replace ('\.html','');
	var sa = (v != null) ? s + '\#'+v.nodo+'-'+v.start+'-'+v.end : s;

	return (sa);
}

/* ------------------------------------------------------ */
function sa_Persona_get (q,v) {
	//Se ID è vuoto allora restituiamo il nome
	var s = (v.id == '') ? 'aop:'+sa_exape (salva_annotazioni_norman_person (v.nome)) : '<'+sa_exape (v.id)+'>'; 
	
	if (q == 'obj') {
		return (s);
	}
	else if (q == 'onto') {
		s += _crlf+'a              foaf:Person ; '+_crlf+
		           'foaf:name      "'+v.nome+'" ';
		s += (v.email != '') ? 	';'+_crlf+'schema:email   "'+v.email+'" .' : '.' ;
		
		return (s);
	}
}

/* ------------------------------------------------------ */
function salva_annotazioni_framTarget (v) {
	
	var s =
		'  oa:hasTarget    [ a              oa:SpecificResource ;'+_crlf+
		'                    oa:hasSelector [ a          oa:FragmentSelector ;'+_crlf+
		'                                     rdf:value  "'+v.nodo+'" ;'+_crlf+
		'                                     oa:end     "'+v.end+'"^^xsd:nonNegativeInteger ;'+_crlf+
		'                                     oa:start   "'+v.start+'"^^xsd:nonNegativeInteger'+_crlf+
		'                                   ] ;'+_crlf+
		'                    oa:hasSource   ao:'+sa_exape (salva_annotazioni_doc_name (true,null))+_crlf+
		'                  ]';


	return (s);
}

/* ------------------------------------------------------ */
function salva_annotazioni_get_rdf (v) {
	var annota = '';
	
	// Restituisce il codice da scrivere sul triple store
	if (v.cat == "documento") {		
		// Annotazioni su documento
		switch (v.tipo) {
			case 0 : {
				annota = salva_annotazioni_intesta ('Autore','hasAuthor')+_crlf+
				    '  oa:hasBody      [ a              rdf:Statement ;'+_crlf+
				    '                    rdf:object     '+sa_Persona_get ('obj',v)+' ;'+_crlf+
				    '                    rdf:predicate  dcterms:creator ;'+_crlf+
				    '                    rdf:subject    ao:'+sa_exape (salva_annotazioni_doc_name (true,null))+' ;'+_crlf+
				    '                    rdfs:label     "'+v.nome+'"'+_crlf+
				    '                  ] ;'+_crlf+
				    '  oa:hasTarget    ao:'+sa_exape (salva_annotazioni_doc_name (true,null))+_crlf+
				    '] .'+_crlf+
				    salva_annotazioni_annotatore_rdf ()+_crlf+
				    sa_Persona_get ('onto',v);
				break;
			}	
			case 1 : {
				annota = salva_annotazioni_intesta ('Editore','hasPublisher')+_crlf+
					'  oa:hasBody      [ a              rdf:Statement ;'+_crlf+
					'                    rdf:object     <'+sa_exape (v.id)+'> ;'+_crlf+
					'                    rdf:predicate  dcterms:publisher ;'+_crlf+
					'                    rdf:subject    ao:'+sa_exape (salva_annotazioni_doc_name (true,null))+' ;'+_crlf+
					'                    rdfs:label     "'+v.nome+'"'+_crlf+
					'                  ] ;'+_crlf+
				    '  oa:hasTarget    ao:'+sa_exape (salva_annotazioni_doc_name (true,null))+_crlf+
				    '] .'+_crlf+
				    salva_annotazioni_annotatore_rdf ()+_crlf+
				    '  <'+sa_exape (v.id)+'>'+_crlf+
				    '  a              foaf:Organization ;'+_crlf+
				    '  foaf:name      "'+v.nome+'" ;'+_crlf+
                    '  foaf:homepage  <'+sa_exape (v.homep)+'> .';
				break;
			}
			case 2 : {
				annota = salva_annotazioni_intesta ('PublicationYear','hasPublicationYear')+_crlf+
					'  oa:hasBody      [ a              rdf:Statement ;'+_crlf+
					'                    rdf:object     "'+v.anno+'"^^xsd:gYear ;'+_crlf+
					'                    rdf:predicate  fabio:hasPublicationYear ;'+_crlf+
					'                    rdf:subject    ao:'+sa_exape (salva_annotazioni_doc_name (true,null))+' ;'+_crlf+
					'                    rdfs:label     "'+v.anno+'"'+_crlf+
					'                  ] ;'+_crlf+
					'  oa:hasTarget    ao:'+sa_exape (salva_annotazioni_doc_name (true,null))+_crlf+
					'] .'+_crlf+
					salva_annotazioni_annotatore_rdf ();
				break;
			}
			case 3 : {
				annota = salva_annotazioni_intesta ('Titolo','hasTitle')+_crlf+
					'  oa:hasBody      [ a              rdf:Statement ;'+_crlf+
					'                    rdf:object     "'+v.testo+'"^^xsd:string ;'+_crlf+
					'                    rdf:predicate  dcterms:title ;'+_crlf+
					'                    rdf:subject    ao:'+sa_exape (salva_annotazioni_doc_name (true,null))+' ;'+_crlf+
					'                    rdfs:label     "'+v.testo+'"'+_crlf+
					'                  ] ;'+_crlf+
					'  oa:hasTarget    ao:'+sa_exape (salva_annotazioni_doc_name (true,null))+_crlf+
					'] .'+_crlf+
					salva_annotazioni_annotatore_rdf ();
				break;
			}
			case 4 : {
				annota = salva_annotazioni_intesta ('Titolo breve','hasShortTitle')+_crlf+
					'  oa:hasBody      [ a              rdf:Statement ;'+_crlf+
					'                    rdf:object     "'+v.testo+'"^^xsd:string ;'+_crlf+
					'                    rdf:predicate  fabio:hasShortTitle ;'+_crlf+
					'                    rdf:subject    ao:'+sa_exape (salva_annotazioni_doc_name (true,null))+' ;'+_crlf+
					'                    rdfs:label     "'+v.testo+'"'+_crlf+
					'                  ] ;'+_crlf+
					'  oa:hasTarget    ao:'+sa_exape (salva_annotazioni_doc_name (true,null))+_crlf+
					'] .'+_crlf+
					salva_annotazioni_annotatore_rdf ();
				break;
			}
			case 5 : {
				annota = salva_annotazioni_intesta ('Riassunto','hasAbstract')+_crlf+
					'  oa:hasBody      [ a              rdf:Statement ;'+_crlf+
					'                    rdf:object     "'+v.testo+'"^^xsd:string ;'+_crlf+
					'                    rdf:predicate  dcterms:abstract ;'+_crlf+
					'                    rdf:subject    ao:'+sa_exape (salva_annotazioni_doc_name (true,null))+' ;'+_crlf+
					'                    rdfs:label     "'+v.testo+'"'+_crlf+
					'                  ] ;'+_crlf+
					'  oa:hasTarget    ao:'+sa_exape (salva_annotazioni_doc_name (true,null))+_crlf+
					'] .'+_crlf+
					salva_annotazioni_annotatore_rdf ();
				break;
			}
			case 6 : {
				annota = salva_annotazioni_intesta ('Commento personale','hasComment')+_crlf+
					'  oa:hasBody      [ a              rdf:Statement ;'+_crlf+
					'                    rdf:object     "'+v.testo+'"^^xsd:string ;'+_crlf+
					'                    rdf:predicate  schema:comment ;'+_crlf+
					'                    rdf:subject    ao:'+sa_exape (salva_annotazioni_doc_name (true,null))+' ;'+_crlf+
					'                    rdfs:label     "'+v.testo+'"'+_crlf+
					'                  ] ;'+_crlf+
					'  oa:hasTarget    ao:'+sa_exape (salva_annotazioni_doc_name (true,null))+_crlf+
					'] .'+_crlf+
					salva_annotazioni_annotatore_rdf ();
				break;
			}
		}
	}
	else {
		// Annotazioni su frammento
		switch (v.tipo) {
			case 0 : {
				annota = salva_annotazioni_intesta ('Persona','denotesPerson')+_crlf+
					'  oa:hasBody      [ a              rdf:Statement ;'+_crlf+
					'                    rdf:object     '+sa_Persona_get ('obj',v)+' ;'+_crlf+
					'                    rdf:predicate  sem:denotes ;'+_crlf+
					'                    rdf:subject    ao:'+sa_exape (salva_annotazioni_doc_name (false,v))+' ;'+_crlf+
					'                    rdfs:label     "'+v.nome+'"'+_crlf+
				    '                  ] ;'+_crlf+
				    salva_annotazioni_framTarget (v)+_crlf+
				    '] .'+_crlf+
					salva_annotazioni_annotatore_rdf ()+_crlf+
					sa_Persona_get ('onto',v);
				break;
			}
			case 1 : {
				annota = salva_annotazioni_intesta ('Luogo','denotesPlace')+_crlf+
					'  oa:hasBody      [ a              rdf:Statement ;'+_crlf+
					'                    rdf:object     <'+sa_exape (v.id)+'> ;'+_crlf+
					'                    rdf:predicate  sem:denotes ;'+_crlf+
					'                    rdf:subject    ao:'+sa_exape (salva_annotazioni_doc_name (false,v))+' ;'+_crlf+
					'                    rdfs:label     "'+v.nome+'"'+_crlf+
					'                  ] ;'+_crlf+
					salva_annotazioni_framTarget (v)+_crlf+ 
				    '] .'+_crlf+
				    salva_annotazioni_annotatore_rdf ()+_crlf+ 
				    '<'+sa_exape (v.id)+'>'+_crlf+
				    '       a dbpedia:Place ;'+_crlf+
				    '       rdfs:label "'+v.nome+'" .';
				break;
			}
			case 2 : {
				annota = salva_annotazioni_intesta ('Malattia','denotesDisease')+_crlf+
					'  oa:hasBody      [ a              rdf:Statement ;'+_crlf+
					'                    rdf:object     <'+sa_exape (v.id)+'> ;'+_crlf+
					'                    rdf:predicate  sem:denotes ;'+_crlf+
					'                    rdf:subject    ao:'+sa_exape (salva_annotazioni_doc_name (false,v))+' ;'+_crlf+
					'                    rdfs:label     "'+v.nome+'"'+_crlf+
					'                  ] ;'+_crlf+
					salva_annotazioni_framTarget (v)+_crlf+
				    '] .'+_crlf+
				    salva_annotazioni_annotatore_rdf ()+_crlf+
				    '<'+sa_exape (v.id)+'>'+_crlf+
				    '       a skos:Concept ;'+_crlf+
				    '       rdfs:label "'+v.nome+'" .';
				break;
			}	
			case 3 : {
				annota = salva_annotazioni_intesta ('Argomento principale','hasSubject')+_crlf+
					'  oa:hasBody      [ a              rdf:Statement ;'+_crlf+
					'                    rdf:object     <'+sa_exape (v.id)+'> ;'+_crlf+
					'                    rdf:predicate  fabio:hasSubjectTerm ;'+_crlf+
					'                    rdf:subject    ao:'+sa_exape (salva_annotazioni_doc_name (false,v))+' ;'+_crlf+
					'                    rdfs:label     "'+v.nome+'"'+_crlf+
					'                  ] ;'+_crlf+
					salva_annotazioni_framTarget (v)+_crlf+
				    '] .'+_crlf+
				    salva_annotazioni_annotatore_rdf ()+_crlf+
				    '<'+sa_exape (v.id)+'>'+_crlf+
				    '       a skos:Concept ;'+_crlf+
				    '       rdfs:label "'+v.nome+'" .';
				break;
			}
			case 4 : {
				annota = salva_annotazioni_intesta ('Risorsa DBPedia','relatesTo')+_crlf+
					'  oa:hasBody      [ a              rdf:Statement ;'+_crlf+
					'                    rdf:object     <'+sa_exape (v.id)+'> ;'+_crlf+
					'                    rdf:predicate  skos:related ;'+_crlf+
					'                    rdf:subject    ao:'+sa_exape (salva_annotazioni_doc_name (false,v))+' ;'+_crlf+
					'                    rdfs:label     "'+v.nome+'"'+_crlf+
					'                  ] ;'+_crlf+
					salva_annotazioni_framTarget (v)+_crlf+
				    '] .'+_crlf+
				    salva_annotazioni_annotatore_rdf ();
				break;
			}
			case 5 : {
				annota = salva_annotazioni_intesta ('Chiarezza','hasClarityScore')+_crlf+
					'  oa:hasBody      [ a              rdf:Statement ;'+_crlf+
					'                    rdf:object     "'+v.valore+'" ;'+_crlf+
					'                    rdf:predicate  ao:hasClarityScore ;'+_crlf+
					'                    rdf:subject    ao:'+sa_exape (salva_annotazioni_doc_name (false,v))+' ;'+_crlf+
					'                    rdfs:label     "'+v.valore+'"'+_crlf+
					'                  ] ;'+_crlf+
					salva_annotazioni_framTarget (v)+_crlf+
				    '] .'+_crlf+
				    salva_annotazioni_annotatore_rdf ();
				break;
			}
			case 6 : {
				annota = salva_annotazioni_intesta ('Originalità','hasOriginalityScore')+_crlf+
					'  oa:hasBody      [ a              rdf:Statement ;'+_crlf+
					'                    rdf:object     "'+v.valore+'" ;'+_crlf+
					'                    rdf:predicate  ao:hasOriginalityScore ;'+_crlf+
					'                    rdf:subject    ao:'+sa_exape (salva_annotazioni_doc_name (false,v))+' ;'+_crlf+
					'                    rdfs:label     "'+v.valore+'"'+_crlf+
					'                  ] ;'+_crlf+
					salva_annotazioni_framTarget (v)+_crlf+
				    '] .'+_crlf+
				    salva_annotazioni_annotatore_rdf ();
				break;
			}
			case 7 : {
				annota = salva_annotazioni_intesta ('Presentazione','hasFormattingScore')+_crlf+
					'  oa:hasBody      [ a              rdf:Statement ;'+_crlf+
					'                    rdf:object     "'+v.valore+'" ;'+_crlf+
					'                    rdf:predicate  ao:hasFormattingScore ;'+_crlf+
					'                    rdf:subject    ao:'+sa_exape (salva_annotazioni_doc_name (false,v))+' ;'+_crlf+
					'                    rdfs:label     "'+v.valore+'"'+_crlf+
					'                  ] ;'+_crlf+
					salva_annotazioni_framTarget (v)+_crlf+
				    '] .'+_crlf+
				    salva_annotazioni_annotatore_rdf ();
				break;
			}
			case 8 : {
				annota = salva_annotazioni_intesta ('Citazione','cites')+_crlf+
					'  oa:hasBody      [ a              rdf:Statement ;'+_crlf+
					'                    rdf:object     "'+v.url+'" ;'+_crlf+
					'                    rdf:predicate  cito:cites ;'+_crlf+
					'                    rdf:subject    ao:'+sa_exape (salva_annotazioni_doc_name (false,v))+' ;'+_crlf+
					'                    rdfs:label     "'+v.titolo+'"'+_crlf+
					'                  ] ;'+_crlf+
					salva_annotazioni_framTarget (v)+_crlf+
				    '] .'+_crlf+
				    salva_annotazioni_annotatore_rdf ();
				break;
			}
			case 9 : {
				annota = salva_annotazioni_intesta ('Commento personale','hasComment')+_crlf+
					'  oa:hasBody      [ a              rdf:Statement ;'+_crlf+
					'                    rdf:object     "'+v.testo+'" ;'+_crlf+
					'                    rdf:predicate  schema:comment ;'+_crlf+
					'                    rdf:subject    ao:'+sa_exape (salva_annotazioni_doc_name (false,v))+' ;'+_crlf+
					'                    rdfs:label     "'+v.testo+'"'+_crlf+
					'                  ] ;'+_crlf+
					salva_annotazioni_framTarget (v)+_crlf+
				    '] .'+_crlf+
				    salva_annotazioni_annotatore_rdf ();	
				break;
			}
		}
	}
	
	return (annota);
}

/* ------------------------------------------------------ */
function salva_annotazioni () {
	// Salva sul triple store le annotazioni pendenti
	
	var nele = 0;	
	var nwrite = 0;

	// Contiamo quanti elementi effettivamente dobbiamo scrivere sul 3store ...
	$.each (_g_annOta,
		function (k,v) {
			if ($('#a_annotaDoc_modifica_table_edit_'+k).hasClass ('fa-pencil'))	nele++;
		}
	);	
		
	// ... e poi li salviamo
	$.each (_g_annOta,
		function (k,v) {
			// Rendiamo inerti le icone
			$('#a_annotaDoc_modifica_table_edit_'+k).unbind ("click");
			$('#a_annotaDoc_modifica_table_trash_'+k).unbind ("click");
			// Salviamo solo le annotazioni che non sono state cancellate
			if ($('#a_annotaDoc_modifica_table_edit_'+k).hasClass ('fa-pencil')) {
				var rdf = salva_annotazioni_get_rdf (v);

				$.ajax ({
					url: _py_store,
					type: "post",
					datatype : "application/json",
					data: { 'RICHIESTA':'scrivi', 'SRC_STR':rdf },		
					success: function (response) {

						$('#a_annotaDoc_modifica_table_edit_'+k).attr ("class","fa fa-cloud-upload");
						$('#a_annotaDoc_modifica_table_trash_'+k).attr ("class","fa fa-check");
						$('#a_annotaDoc_modifica_table_trash_'+k).css ("color","lightgreen");
						
						nwrite++;
						// Quando arriviamo all'ultimo elemento eseguiamo le operazione conclusive
						if (nwrite == nele) {
							// Ricarichiamo le annotazioni ...
							show_remote_document_struct_reset ();
							load_annotazioni_documento (_g_annotatore.doc_name);
							load_annotazioni_frammenti (_g_annotatore.doc_name);
							// ... e rigeneriamo il dom
							dom_refresh ();
							// Ripristiniamo la configurazione di partenza ...
							$('#annotaDoc_modifica_salva_chiudi').html (_g_html_save.annotaDoc_modifica_salva_chiudi);
							// ... e visualizziamo il messaggio conclusivo
							$('#annotaDoc_modifica_salva').replaceWith ('<h3>Annotazioni salvate</h3>');
						}
					},
					error: function (xhr, ajaxOptions, thrownError) {
					    alert ('<salva_annotazioni> '+xhr.status+' -- '+thrownError);
					}
				});				
			}
		}
	);
	
}

/* -------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------- */
/* Modifica annotazioni ----------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------- */

/* ------------------------------------------------------ */
function annotaDoc_modifica_annotazioni_reset () {
	// Portiamo il pannello in situazione nota
	
	// Ripristiniamo il pulsanti salva ed esci
	$('#annotaDoc_modifica_salva_chiudi').html (_g_html_save.annotaDoc_modifica_salva_chiudi);
	
	// Eliminiamo il contenuto del pannello di modifica
	$('#adm_table_mody_body').html ('&nbsp;');
	
	// Se l'elemento 'in' è presente nella classe, allora la collapse è già aperta ed è meglio non riaprirla (potrebbe chiudersi!)
	if (!$('#adm_collapse_table').hasClass ('in')) {
		$('#adm_collapse_table').collapse ('show');
	}

	// Chiudiamo la collapse della modifica
	if ($('#adm_collapse_table_mody').hasClass ('in')) {
		$('#adm_collapse_table_mody').collapse ('hide');
	}
	
	_g_adm.col1 = 1; 
	_g_adm.col2 = 0;
	_g_adm.inModifica = false;
	
	// Aggiorniamo il contenuto della tabella per visualizzare eventuali modifiche
	// Solo il valore può essere modificato
	$.each (_g_annOta,
		function (k,v) {
			$('#'+_m99+'___'+k).text (v.val);
		}
	);
}

/* ------------------------------------------------------ */
function annotaDoc_modifica_salva () {

	// Controlliamo se siamo in fase di conferma
	var goon = ($('#annotaDoc_modifica_salva').hasClass ('btn-danger')) ? true : false;
	// Visualizziamo il simbolo di attesa
	$('#annotaDoc_modifica_salva').replaceWith ('<img class="wait_image" src="images/wait_circle.gif" />');
	
	if (goon) {
		salva_annotazioni ();
	}
	else {
		// Attendiamo 2 secondi prima di visualizzare il pulsante di conferma
		setTimeout(
	  		function() {
	  			// Ripristiniamo la configurazione di partenza ...
			    $('#annotaDoc_modifica_salva_chiudi').html (_g_html_save.annotaDoc_modifica_salva_chiudi);
			  	// ... e modifichiamo il pulsante di salvataggio
				$('#annotaDoc_modifica_salva').toggleClass ('btn-danger');
				$('#annotaDoc_modifica_salva').text ('Conferma');
	  		}, 2000
	  	);
  	}
}

/* ------------------------------------------------------ */
function annotaDoc_modifica_chiudi () {
	
	var frammento_cancellato = false;
	
	// Eliminiamo eventuali annotazioni cancellate
	for (var k = (_g_annOta.length-1); k >= 0; --k) {		// Cominciamo a cancellare dalla fine in modo da mantenere allineati gli indici dell'array					
		if ($('#a_annotaDoc_modifica_table_edit_'+k).hasClass ('fa-times')) {
			if (_g_annOta [k].cat == 'frammento') {
				// Ai fini della rigenerazione del dom ci interessa sapere solo se è stato cancellato un frammento
				frammento_cancellato = true;
			}
			// Cancelliamo l'elemento dall'array
			_g_annOta.splice (k,1);
		}
	}

	if (frammento_cancellato) {
		dom_refresh ();
	}
	
	$('#annotaDoc_modifica').modal ('hide');
}

/* ------------------------------------------------------ */
function annotaDoc_modifica_cancella (indice,andu) {
	
	$('#a_annotaDoc_modifica_table_edit_'+indice).unbind ("click");
	$('#a_annotaDoc_modifica_table_trash_'+indice).unbind ("click");
	
	if (andu) {
		// Ripristiniamo la situazione
		$('#a_annotaDoc_modifica_table_edit_'+indice).attr ("class","fa fa-pencil");
		$('#a_annotaDoc_modifica_table_trash_'+indice).attr ("class","fa fa-trash-o");
		
		$('#a_annotaDoc_modifica_table_edit_'+indice).click (function() { annotaDoc_modifica_modifica (indice); return false; });
		$('#a_annotaDoc_modifica_table_trash_'+indice).click (function() { annotaDoc_modifica_cancella (indice,false); return false; });	
	}
	else {	
		// Cambiamo le icone in modo da evidenziare la cancellazione
		// La cancellazione effettiva avverrà alla chiusura della finestra
		$('#a_annotaDoc_modifica_table_edit_'+indice).attr ("class","fa fa-times");
		$('#a_annotaDoc_modifica_table_trash_'+indice).attr ("class","fa fa-undo");
		
		$('#a_annotaDoc_modifica_table_trash_'+indice).click (function() { annotaDoc_modifica_cancella (indice,true); return false; });
	}
}

/* ------------------------------------------------------ */
function annotaDoc_modifica_getids_puthtml (sub,trg) {
	var t = $('#adl_'+sub);
	var ht = t.html (); // Prende il contenuto e l'intestazione

	// Cambiamo gli identificativi degli oggetti	
	ht = ht.replace (new RegExp ('id="','g'),'id="'+_m99);
	ht = ht.replace (new RegExp ("\\$\\('a#",'g'),"$('a#"+_m99);
	ht = ht.replace (new RegExp ("\\$\\('#",'g'),"$('#"+_m99);
	// Le due che seguono servono fondamentalmente per la collapse di dbpedia
	ht = ht.replace (new RegExp ('data\\-parent="#','g'),'data-parent="#'+_m99);
	ht = ht.replace (new RegExp ('href="#[^"]','g'),'href="#'+_m99+'c');
	
	trg.html (ht);
}

/* ------------------------------------------------------ */
function annotaDoc_modifica_press_button (radioGroup) {
				
	// Preme il bottone relativo alla voce scelta
	var $bPress = null;
	var $buts = $('#'+_m99+radioGroup+' :button');
	var giuda = _g_annOta [_g_general_index].valore;	// Prendiamo il valore del pulsante
	var i = 0;
	
	// Individuiamo il pulsante da premere ...
	$buts.each (
		function () {
			if (_apocalypse [i] == giuda) {
				$bPress = $(this);
				return false;
			}	
			i++;	
		}
	)
	// ... e lo premiamo
	ma_radio_button (radioGroup,$bPress);
}

/* ------------------------------------------------------ */
function annotaDoc_modifica_getids (indice,trg) {
	
	// Inizializza il modulo di modifica.
	// Inserisce il codice html corretto con il gli id cambiati e compila i campi	
	var a = _g_annOta [indice];
	
	if (a.cat == "documento") {
		// Documento
		switch (a.tipo) {
			case 0 : {
				annotaDoc_modifica_getids_puthtml ('hasAuthor',trg); 
				$('#'+_m99+'id_hasAuthor').attr ('value',a.id);
				$('#'+_m99+'nome_hasAuthor').attr ('value',a.nome);
				$('#'+_m99+'email_hasAuthor').attr ('value',a.email);
				break;
			}
			case 1 : {
				annotaDoc_modifica_getids_puthtml ('hasPublisher',trg); 
				$('#'+_m99+'id_hasPublisher').attr ('value',a.id);
				$('#'+_m99+'nome_hasPublisher').attr ('value',a.nome);
				$('#'+_m99+'homep_hasPublisher').attr ('value',a.homep);
				break;
			}  
			case 2 : {
				annotaDoc_modifica_getids_puthtml ('hasPubYear',trg);
				$('#'+_m99+'anno_hasPubYear').attr ('value',a.anno); 		
				break;
			}
			case 3 : {
				annotaDoc_modifica_getids_puthtml ('hasTitle',trg);
				$('#'+_m99+'text_hasTitle').val (a.testo); 
				break;
			}
			case 4 : { 
				annotaDoc_modifica_getids_puthtml ('hasShortTitle',trg);
				$('#'+_m99+'text_hasShortTitle').attr ('value',a.testo);
				break;
			}
			case 5 : { 
				annotaDoc_modifica_getids_puthtml ('hasAbstract',trg);
				$('#'+_m99+'text_hasAbstract').val (a.testo);		
				break;
			}
			case 6 : {
				annotaDoc_modifica_getids_puthtml ('hasComment_doc',trg);
				$('#'+_m99+'text_hasComment_doc').val (a.testo);	
				break;
			}
		}
	}
	else {
		// Frammento
		switch (a.tipo) {
			case 0 : {
				annotaDoc_modifica_getids_puthtml ('denotesPerson',trg); 
				$('#'+_m99+'id_denotesPerson').attr ('value',a.id);
				$('#'+_m99+'nome_denotesPerson').attr ('value',a.nome);
				$('#'+_m99+'email_denotesPerson').attr ('value',a.email);
				break;
			}
			case 1 : {
				annotaDoc_modifica_getids_puthtml ('denotesPlace',trg); 
				$('#'+_m99+'id_denotesPlace').attr ('value',a.id);
				$('#'+_m99+'nome_denotesPlace').attr ('value',a.nome); 			
				break;
			}
			case 2 : { 
				annotaDoc_modifica_getids_puthtml ('denotesDisease',trg); 
				$('#'+_m99+'id_denotesDisease').attr ('value',a.id);
				$('#'+_m99+'nome_denotesDisease').attr ('value',a.nome); 		
				break;
			}
			case 3 : { 
				annotaDoc_modifica_getids_puthtml ('hasSubject',trg); 
				$('#'+_m99+'id_hasSubject').attr ('value',a.id);
				$('#'+_m99+'nome_hasSubject').attr ('value',a.nome); 		
				break;
			}
			case 4 : {
			    annotaDoc_modifica_getids_puthtml ('relatesTo',trg); 
				$('#'+_m99+'id_relatesTo').attr ('value',a.id);
				$('#'+_m99+'nome_relatesTo').attr ('value',a.nome); 		
				break;
			}
			case 5 : {
				annotaDoc_modifica_getids_puthtml ('hasClarityScore',trg); 
				annotaDoc_modifica_press_button ('adl_hasClarityScore_radio');
				break;
			}
			case 6 : {
				annotaDoc_modifica_getids_puthtml ('hasOriginalityScore',trg); 
				annotaDoc_modifica_press_button ('adl_hasOriginalityScore_radio'); 	
				break;
			}
			case 7 : {
				annotaDoc_modifica_getids_puthtml ('hasFormattingScore',trg); 
				annotaDoc_modifica_press_button ('adl_hasFormattingScore_radio'); 	
				break;
			}
			case 8 : {
				annotaDoc_modifica_getids_puthtml ('cites',trg); 
				$('#'+_m99+'url_cites').attr ('value',a.url);
				$('#'+_m99+'titolo_cites').attr ('value',a.titolo); 			
				break;
			}
			case 9 : {
				annotaDoc_modifica_getids_puthtml ('hasComment',trg);
				$('#'+_m99+'text_hasComment').text (a.testo);	
				break;
			}
		}
	}
}

/* ------------------------------------------------------ */
function annotaDoc_modifica_modifica (indice) {
	
	var p = $('#adm_table_mody_body');
	
	_g_general_index = indice;	
	
	// Recupera il frammento html relativo alla proprietà da modificare
	annotaDoc_modifica_getids (indice,p);
	
	p.append ('<a id="annotaDoc_modifica_master_annulla" class="btn btn-success" href="#" role="button">&nbsp;&nbsp;Annulla&nbsp;&nbsp;</a>');
	$('#annotaDoc_modifica_master_annulla').unbind ('click');
	$('#annotaDoc_modifica_master_annulla').click (function() { annotaDoc_modifica_annotazioni_reset (); return false; });
		
	// Impostiamo l'indice per l'identificazione della linea della tabella selezionata
	
								
	// Abilitiamo l'apertura della collapse di modifica ...
	$('#adm_collapse_table_mody').collapse ('show');
	
	// ... e disabilitiamo l'apertura della collapse della tabella
	$('#adm_collapse_table').collapse ('hide');
	
	_g_adm.inModifica = true;
}

/* ------------------------------------------------------ */
function annotaDoc_modifica_collapse_openclose (colla) {
	// Gestisce l'apertura e chiusura delle collapse
	if (colla == 1) {
		if (!_g_adm.inModifica) {
			$('#adm_collapse_table').collapse ('toggle');
		}
	}
	else if (colla == 2) {
		// Non facciamo nulla. Non diamo la possibilità di chiudere in modo da evidenziare il fatto che l'operazione deve essere completata
	}
	else {
		alert ('annotaDoc_modifica_collapse_openclose (colla) -- Indice non corretto');	
	}
} 

/* ------------------------------------------------------ */
function annotaDoc_modifica_annotazioni () {
		
	// Controlliamo se abbiamo caricato un documento
	if ($.trim (($('#document_box').text ())).substr (0,9) != "AnnOtaria") {
		// Controlliamo se siamo in modalità di editazione
		if ($('#barra_superiore').css ("background-color") == _color_writer) {
	
			if (_g_annOta.length == 0) {
				// Non ci sono annotazioni pendenti da gestire
				$('#warn_nessuna_annotazione_pendente').modal();	
			}
			else {
				annotaDoc_modifica_annotazioni_reset ();
				// Popoliamo la tabella
				var t = $('#annotaDoc_modifica_table_body');
				var a = {classe:'', valore:'', frammento:'', stile:''};
				var zebra = 0;
				t.empty ();
		
				$.each (_g_annOta,
					function (k,v) {
						if (v.cat == 'documento') {
							a.classe = _elementi_documento_desk [v.tipo];
							a.valore = v.val;
							a.frammento = '&nbsp;-&nbsp;';
						}
						else {
							a.classe = _elementi_frammenti_desk [v.tipo];
							a.valore = v.val;
							a.frammento = v.fra;
						}
						zebra++;
						if (zebra % 2) 	{ a.stile = 'background-color: #FBEEDB; border-bottom: dotted 1px;'; }
						else			{ a.stile = 'background-color: #F6F3F0; border-bottom: dotted 1px;'; }
						
						t.append ('	<tr>');
						t.append ('		<td class="text-ellipsis" style="'+a.stile+'">'+a.classe+'</td>');
						t.append ('		<td id="'+_m99+'___'+k+'" class="text-ellipsis" style="'+a.stile+' padding-left: 1em; ">'+a.valore+'</td>');
						t.append ('		<td class="text-ellipsis" style="'+a.stile+' padding-left: 1em; ">'+a.frammento+'</td>');
						t.append ('		<td style="'+a.stile+' padding-left: 1em; "><a href="#" id="a_annotaDoc_modifica_table_edit_'+k+'" class="fa fa-pencil" indice="'+k+'">&nbsp;&nbsp;&nbsp;</a><a href="#" id="a_annotaDoc_modifica_table_trash_'+k+'" class="fa fa-trash-o" indice="'+k+'">&nbsp;</a></td>');
						t.append ('	</tr>');
						
						$('#a_annotaDoc_modifica_table_edit_'+k).click (function () { annotaDoc_modifica_modifica ($(this).attr ("indice")); return false; });
						$('#a_annotaDoc_modifica_table_trash_'+k).click (function () { annotaDoc_modifica_cancella ($(this).attr ("indice"),false); return false; });
					}
				);
				
				// Aggiungiamo una riga vuota per consentire la corretta visualizzazione in caso di comparsa della barra di scorrimento orizzontale
				t.append ('	<tr>');
				t.append ('		<td>&nbsp;</td>');
				t.append ('		<td>&nbsp;</td>');
				t.append ('		<td>&nbsp;</td>');
				t.append ('		<td>&nbsp;</td>');
				t.append ('	</tr>');
						
				$('#annotaDoc_modifica').modal();
			}
		}
		else {
			$('#edit_fail').modal();
		}
	}
	else {
		$('#warn_select_doc').modal();
	}
}

/* ------------------------------------------------------ */


