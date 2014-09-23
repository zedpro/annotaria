
/* ------------------------------------------------------ */
function visualizza_info_frammento_collapse_base (tipo_index,id_fram) {
	
	var titolo = _elementi_frammenti_desk [tipo_index];
	var colore = _elementi_bkg_color [tipo_index];
	var ids = id_fram.toString ();
	
	return ( 
		'<div class="panel-group" id="visual_info_fram_'+ids+'" >'+
		    '<div class="panel panel-info" style="background-color: '+colore+';">'+
		        '<div class="panel-heading" style="height: 1.5em; background-color: '+colore+';">'+
		            '<h4 class="panel-title" style="margin-top: -0.6em; background-color: '+colore+';">'+
		                '<a id="a_visual_info_fram_'+ids+'_collapse" class="fa fa-sort" data-toggle="collapse" data-parent="#visual_info_fram_'+ids+'_table" href="#visual_info_fram_'+ids+'_collapse">'+        
		                    '&nbsp;&nbsp;&nbsp;'+titolo+
		                '</a>'+
		            '</h4>'+
		        '</div>'+
		        '<div id="visual_info_fram_'+ids+'_collapse" class="panel-collapse collapse in">'+
		            '<div id="visual_info_fram_'+ids+'_collapse_body" class="panel-body">'+
		                '<!-- Collapse BODY -->'+
		                '&nbsp;'+
		                '<!-- Collapse BODY -->'+
		            '</div>'+
		        '</div>'+
		    '</div>'+
		'</div>'
	);
}

/* ------------------------------------------------------ */
function vif_getData (d) {
	//Restituisce la data nel formato gg-mm-aaaa
	return (d.substr (8,2)+'-'+d.substr (5,2)+'-'+d.substr (0,4));
}

/* ------------------------------------------------------ */
function vif_getTime (d) {
	//Restituisce l'orario nel formato hh:mm:ss
	return (d.substr (11,8));
}

/* ------------------------------------------------------ */
function vif_add_row (a,b) {
	
	return (
		'<tr>'+
		  '<td>'+a+'</td>'+
		  '<td>'+b+'</td>'+ 
		'</tr>'	
	);
}

/* ------------------------------------------------------ */
function visualizza_info_frammento_compila_tab_salvati (rec,$colla,tipo) {
	
	$colla.empty ();
	$colla.append ('<h4 style="color: coral; ">Attesa caricamento dati ...</h4>');

	$.ajax ({
		url: _py_annotazioni,
		type: "post",
		datatype : "application/json",
		data: { 'RICHIESTA':'generalita_autore', 'SRC_STR':sa_exape (rec ['autore'].value) },		
		success: function (response) {
			try {
				$colla.empty ();
				$colla.append ('<table>');
				if (response ["results"]["bindings"]["length"] == 0) {
					// Se non abbiamo trovato corrispondeza allora stampiamo le informazioni in nostro possesso 
					if ((tipo>=5) && (tipo<=7)) {		// Tipi Xscore 
						 $colla.append (vif_add_row ('Valore',traduci_valore (rec ['label'].value)));
					}
					else {
						$colla.append (vif_add_row ('Valore',rec ['label'].value));
					}
					$colla.append (vif_add_row ('Autore',rec ['autore'].value));
					$colla.append (vif_add_row ('Data',vif_getData (rec ['ora'].value)));
					$colla.append (vif_add_row ('Ora',vif_getTime (rec ['ora'].value)));
					$colla.append (vif_add_row ('Riferimento',rec ['id'].value));				
				}
				else {
					$.each (response ["results"]["bindings"],
						function (k,v) {	
							if (k > 0) {
								$colla.append ('<hr style="border: 2px dotted DeepSkyBlue; padding: 0px; margin: 0.3em; ">');
							}
							if ((tipo>=5) && (tipo<=7)) {		// Tipi Xscore 
								 $colla.append (vif_add_row ('Valore',traduci_valore (rec ['label'].value)));
							}
							else {
								$colla.append (vif_add_row ('Valore',rec ['label'].value));
							}
							
							$colla.append (vif_add_row ('Autore',v ['nome'].value));
							try {									// email è un parametro opzionale
								$colla.append (vif_add_row ('Email',v ['email'].value));
							} 
							catch (err) {
							}
							$colla.append (vif_add_row ('Data',vif_getData (rec ['ora'].value)));
							$colla.append (vif_add_row ('Ora',vif_getTime (rec ['ora'].value)));
							
							$colla.append (vif_add_row ('Riferimento',rec ['id'].value));
						}
					);
				}
					
				$colla.append ('</table>');
				$colla.addClass ('tab_annota');
				$colla.addClass ('text-ellipsis');
			}
			catch (err) {
				alert ('<ma_hasAuthor_load_drop> - errore parse JSON');
			}
		},
		error: function (xhr, ajaxOptions, thrownError) {
		    alert (rec ['autore'].value+' -- '+xhr.status+' -- '+thrownError);
		}
	});
}

/* ------------------------------------------------------ */
function visualizza_info_frammento_add_annota (id_fram) {
	
	var trovato = false;	
	var $corpo = $('#info_point_annotazioni_body');
	
	// Aggiunge l'annotazione al pannello
	// Cerchiamo l'elemento nelle annotazioni salvate
	$.each (_g_f_cat_global,
		function (k,v) {
			if (v.id_fram == id_fram) {
				$corpo.append (visualizza_info_frammento_collapse_base (get_index_from_type (v.tipo),id_fram));
				var $colla = $('#visual_info_fram_'+id_fram.toString()+'_collapse_body');
				visualizza_info_frammento_compila_tab_salvati (v,$colla,get_index_from_type (v.tipo));
				trovato = true;
				return false;
			}			
		}
	);
	
	// Se non lo abbiamo trovato allora lo cerchiamo anche tra le annotazioni pendenti
	if (!trovato) {	
		$.each (_g_annOta,
			function (k,v) {
				if (v.id_fram == id_fram) {
					$corpo.append (visualizza_info_frammento_collapse_base (v.tipo,id_fram));
					var $colla = $('#visual_info_fram_'+id_fram.toString()+'_collapse_body');
					$colla.empty ();
					$colla.append ('<h4 style="color: OrangeRed; ">Annotazione non salvata</h4>');
					$colla.append ('<hr>');
					$colla.append ('<table>');
					$colla.append (vif_add_row ('Valore',v.val));
					$colla.append (vif_add_row ('Frammento',v.fra));
					$colla.append (vif_add_row ('Nodo',v.nodo));
					$colla.append (vif_add_row ('Start',v.start));
					$colla.append (vif_add_row ('End',v.end));
					$colla.append ('</table>');
					$colla.addClass ('tab_annota');
					$colla.addClass ('text-ellipsis');
					return false;
				}			
			}
		);
	}
}

/* ------------------------------------------------------ */
function visualizza_info_frammento (id_list) {
	
	var ida = [];
	var i;
	var strapp = '';
	
	// Separiamo gli id (n,nn,n...)
	id_list = id_list.trim ();
	for (i=0; i<id_list.length; i++) {
		if ((id_list [i] == ',') || (i == (id_list.length-1))){
			if (i == (id_list.length-1))	strapp += id_list [i];
			ida.push (parseInt (strapp.trim ()));
			strapp = '';
		}
		else {
			strapp += id_list [i];
		}
	}
		
	// Aggiungiamo le annotazioni al pannello modale
	$('#info_point_annotazioni_body').empty ();	
	$.each (ida,
		function (k,v) {
			visualizza_info_frammento_add_annota (v);
		}
	);	
		
	$('#info_point_annotazioni').modal ();
}

/* ------------------------------------------------------ */
