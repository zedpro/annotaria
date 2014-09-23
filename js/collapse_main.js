
/*
################################################################################
################################################################################
## DOCUMENTO
################################################################################
################################################################################
*/

function toolT_li (testo) {
	return ('<li style="cursor:help;" data-toggle="tooltip" data-placement="top" title="'+testo+'">'+testo+'</li>');
}

/* -------------------------------------------------------------------------------------------------- */
function toolT_a (testo) {
	return ('<a style="cursor:help; color: white;" data-toggle="tooltip" data-placement="top" title="'+testo+'">'+testo+'</a>');
}

/* -------------------------------------------------------------------------------------------------- */
function load_annotazioni_hasAuthor (documento) {
	
	$('#basket_collapse_hasAuthor').empty ();
	$('#a1_meta_hasAuthor').html ('attesa dati ...');
		
	// Carica dal 3store la lista degli autori relativi al documento selezionato
	$.ajax ({
		url: _py_annotazioni,
		type: "post",
		datatype : "application/json",
		data: { 'RICHIESTA' : 'hasAuthor_meta_load', 'SRC_STR' : documento },		
		success: function (response) {
			try {
				if (response ["results"]["bindings"]["length"] == 0) {
					// Non ci sono elementi, quindi non si deve aprire
					$('#a1_meta_hasAuthor').html ('-');
					$('#a_meta_hasAuthor').attr ("data-toggle","none");
				}
				else {
					ris = [];
				
					$.each (response ["results"]["bindings"],
						function (k,v) {
							ris.push ({"nome":v ["nome"].value});
						}
					);
									
					// Abbiamo ottenuto la lista degli autori.
					// Ora popoliamo la collapse
					$.each (ris,
						function (k,v){
							if (k == 0) {
								// Il primo elemento lo mettiamo sulla bar
								$('#a1_meta_hasAuthor').html (toolT_a (v ["nome"]));
							} 
							else {
								// Gli altri elementi li mettiamo dentro la collapse
								$('#basket_collapse_hasAuthor').append (toolT_li (v ["nome"]));
							}
						}
					);
					
					// Se abbiamo più di un elemento dobbiamo consentire l'apertura della collapse
					if (response ["results"]["bindings"]["length"] > 1) {
						$('#a_meta_hasAuthor').attr ("data-toggle","collapse");
					}
				}
			}
			catch (err) {
				alert ('load_annotazioni_hasAuthor - errore parse JSON');
			}
		},
		error: function (xhr, ajaxOptions, thrownError) {
		    alert (xhr.status);
		    alert (thrownError);
		}
	});
}

/* -------------------------------------------------------------------------------------------------- */
function load_annotazioni_hasPublisher (documento) {
	
	$('#basket_collapse_hasPublisher').empty ();
	$('#a1_meta_hasPublisher').html ('attesa dati ...');
		
	// Carica dal 3store la lista degli editori relativi al documento selezionato
	$.ajax ({
		url: _py_annotazioni,
		type: "post",
		datatype : "application/json",
		data: { 'RICHIESTA' : 'hasPublisher_meta_load', 'SRC_STR' : documento },		
		success: function (response) {
			try {
				if (response ["results"]["bindings"]["length"] == 0) {
					// Non ci sono elementi, quindi non si deve aprire
					$('#a1_meta_hasPublisher').html ('-');
					$('#a_meta_hasPublisher').attr ("data-toggle","none");
				}
				else {
					ris = [];
				
					$.each (response ["results"]["bindings"],
						function (k,v) {
							ris.push ({"nome":v ["nome"].value});
						}
					);
									
					// Abbiamo ottenuto la lista degli editori.
					// Ora popoliamo la collapse
					$.each (ris,
						function (k,v){
							if (k == 0) {
								// Il primo elemento lo mettiamo sulla bar
								$('#a1_meta_hasPublisher').html (toolT_a (v ["nome"]));
							} 
							else {
								// Gli altri elementi li mettiamo dentro la collapse
								$('#basket_collapse_hasPublisher').append (toolT_li (v ["nome"]));
							}
						}
					);
					
					// Se abbiamo più di un elemento dobbiamo consentire l'apertura della collapse
					if (response ["results"]["bindings"]["length"] > 1) {
						$('#a_meta_hasPublisher').attr ("data-toggle","collapse");
					}
				}
			}
			catch (err) {
				alert ('load_annotazioni_hasPublisher - errore parse JSON');
			}
		},
		error: function (xhr, ajaxOptions, thrownError) {
		    alert (xhr.status);
		    alert (thrownError);
		}
	});
}

/* -------------------------------------------------------------------------------------------------- */
function load_annotazioni_hasPubYear (documento) {
	
	$('#basket_collapse_hasPubYear').empty ();
	$('#a1_meta_hasPubYear').html ('attesa dati ...');
		
	// Carica dal 3store la lista degli anni di pubblicazione relativi al documento selezionato
	$.ajax ({
		url: _py_annotazioni,
		type: "post",
		datatype : "application/json",
		data: { 'RICHIESTA' : 'hasPubYear_meta_load', 'SRC_STR' : documento },		
		success: function (response) {
			try {
				if (response ["results"]["bindings"]["length"] == 0) {
					// Non ci sono elementi, quindi non si deve aprire
					$('#a1_meta_hasPubYear').html ('-');
					$('#a_meta_hasPubYear').attr ("data-toggle","none");
				}
				else {
					ris = [];
				
					$.each (response ["results"]["bindings"],
						function (k,v) {
							ris.push ({"anno":v ["anno"].value});
						}
					);
									
					// Abbiamo ottenuto la lista degli anni.
					// Ora popoliamo la collapse
					$.each (ris,
						function (k,v){
							if (k == 0) {
								// Il primo elemento lo mettiamo sulla bar
								$('#a1_meta_hasPubYear').html (toolT_a (v ["anno"]));
							} 
							else {
								// Gli altri elementi li mettiamo dentro la collapse
								$('#basket_collapse_hasPubYear').append (toolT_li (v ["anno"]));
							}
						}
					);
					
					// Se abbiamo più di un elemento dobbiamo consentire l'apertura della collapse
					if (response ["results"]["bindings"]["length"] > 1) {
						$('#a_meta_hasPubYear').attr ("data-toggle","collapse");
					}
				}
			}
			catch (err) {
				alert ('load_annotazioni_hasPubYear - errore parse JSON');
			}
		},
		error: function (xhr, ajaxOptions, thrownError) {
		    alert (xhr.status);
		    alert (thrownError);
		}
	});
}

/* -------------------------------------------------------------------------------------------------- */
function load_annotazioni_hasTitle (documento) {
	
	$('#basket_collapse_hasTitle').empty ();
	$('#a1_meta_hasTitle').html ('attesa dati ...');
		
	// Carica dal 3store la lista dei titoli relativi al documento selezionato
	$.ajax ({
		url: _py_annotazioni,
		type: "post",
		datatype : "application/json",
		data: { 'RICHIESTA' : 'hasTitle_meta_load', 'SRC_STR' : documento },		
		success: function (response) {
			try {
				if (response ["results"]["bindings"]["length"] == 0) {
					// Non ci sono elementi, quindi non si deve aprire
					$('#a1_meta_hasTitle').html ('-');
					$('#a_meta_hasTitle').attr ("data-toggle","none");
				}
				else {
					ris = [];
				
					$.each (response ["results"]["bindings"],
						function (k,v) {
							ris.push ({"titolo":v ["titolo"].value});
						}
					);
									
					// Abbiamo ottenuto la lista dei titoli.
					// Ora popoliamo la collapse
					$.each (ris,
						function (k,v){
							if (k == 0) {
								// Il primo elemento lo mettiamo sulla bar
								$('#a1_meta_hasTitle').html (toolT_a (v ["titolo"]));
							} 
							else {
								// Gli altri elementi li mettiamo dentro la collapse
								$('#basket_collapse_hasTitle').append (toolT_li (v ["titolo"]));
							}
						}
					);
					
					// Se abbiamo più di un elemento dobbiamo consentire l'apertura della collapse
					if (response ["results"]["bindings"]["length"] > 1) {
						$('#a_meta_hasTitle').attr ("data-toggle","collapse");
					}
				}
			}
			catch (err) {
				alert ('load_annotazioni_hasTitle - errore parse JSON');
			}
		},
		error: function (xhr, ajaxOptions, thrownError) {
		    alert (xhr.status);
		    alert (thrownError);
		}
	});
}

/* -------------------------------------------------------------------------------------------------- */
function load_annotazioni_hasShortTitle (documento) {
	
	$('#basket_collapse_hasShortTitle').empty ();
	$('#a1_meta_hasShortTitle').html ('attesa dati ...');
		
	// Carica dal 3store la lista dei titoli brevi relativi al documento selezionato
	$.ajax ({
		url: _py_annotazioni,
		type: "post",
		datatype : "application/json",
		data: { 'RICHIESTA' : 'hasShortTitle_meta_load', 'SRC_STR' : documento },		
		success: function (response) {
			try {
				if (response ["results"]["bindings"]["length"] == 0) {
					// Non ci sono elementi, quindi non si deve aprire
					$('#a1_meta_hasShortTitle').html ('-');
					$('#a_meta_hasShortTitle').attr ("data-toggle","none");
				}
				else {
					ris = [];
				
					$.each (response ["results"]["bindings"],
						function (k,v) {
							ris.push ({"titolo":v ["titolo"].value});
						}
					);
									
					// Abbiamo ottenuto la lista dei titoli.
					// Ora popoliamo la collapse
					$.each (ris,
						function (k,v){
							if (k == 0) {
								// Il primo elemento lo mettiamo sulla bar
								$('#a1_meta_hasShortTitle').html (toolT_a (v ["titolo"]));
							} 
							else {
								// Gli altri elementi li mettiamo dentro la collapse
								$('#basket_collapse_hasShortTitle').append (toolT_li (v ["titolo"]));
							}
						}
					);
					
					// Se abbiamo più di un elemento dobbiamo consentire l'apertura della collapse
					if (response ["results"]["bindings"]["length"] > 1) {
						$('#a_meta_hasShortTitle').attr ("data-toggle","collapse");
					}
				}
			}
			catch (err) {
				alert ('load_annotazioni_hasShortTitle - errore parse JSON');
			}
		},
		error: function (xhr, ajaxOptions, thrownError) {
		    alert (xhr.status);
		    alert (thrownError);
		}
	});
}

/* -------------------------------------------------------------------------------------------------- */
function load_annotazioni_hasAbstract (documento) {
	
	$('#basket_collapse_hasAbstract').empty ();
	$('#a1_meta_hasAbstract').html ('attesa dati ...');
		
	// Carica dal 3store la lista degli abstract relativi al documento selezionato
	$.ajax ({
		url: _py_annotazioni,
		type: "post",
		datatype : "application/json",
		data: { 'RICHIESTA' : 'hasAbstract_meta_load', 'SRC_STR' : documento },		
		success: function (response) {
			try {
				if (response ["results"]["bindings"]["length"] == 0) {
					// Non ci sono elementi, quindi non si deve aprire
					$('#a1_meta_hasAbstract').html ('-');
					$('#a_meta_hasAbstract').attr ("data-toggle","none");
				}
				else {
					ris = [];
				
					$.each (response ["results"]["bindings"],
						function (k,v) {
							ris.push ({"testo":v ["testo"].value});
						}
					);
									
					// Abbiamo ottenuto la lista degli abstract.
					// Ora popoliamo la collapse
					$.each (ris,
						function (k,v){
							if (k == 0) {
								// Il primo elemento lo mettiamo sulla bar
								$('#a1_meta_hasAbstract').html (toolT_a (v ["testo"]));
							} 
							else {
								// Gli altri elementi li mettiamo dentro la collapse
								$('#basket_collapse_hasAbstract').append (toolT_li (v ["testo"]));
							}
						}
					);
					
					// Se abbiamo più di un elemento dobbiamo consentire l'apertura della collapse
					if (response ["results"]["bindings"]["length"] > 1) {
						$('#a_meta_hasAbstract').attr ("data-toggle","collapse");
					}
				}
			}
			catch (err) {
				alert ('load_annotazioni_hasAbstract - errore parse JSON');
			}
		},
		error: function (xhr, ajaxOptions, thrownError) {
		    alert (xhr.status);
		    alert (thrownError);
		}
	});
}

/* -------------------------------------------------------------------------------------------------- */
function load_annotazioni_hasComment_doc (documento) {
	
	$('#basket_collapse_hasComment_doc').empty ();
	$('#a1_meta_hasComment_doc').html ('attesa dati ...');
		
	// Carica dal 3store la lista dei commenti relativi al documento selezionato
	$.ajax ({
		url: _py_annotazioni,
		type: "post",
		datatype : "application/json",
		data: { 'RICHIESTA' : 'hasComment_doc_meta_load', 'SRC_STR' : documento },		
		success: function (response) {
			try {
				if (response ["results"]["bindings"]["length"] == 0) {
					// Non ci sono elementi, quindi non si deve aprire
					$('#a1_meta_hasComment_doc').html ('-');
					$('#a_meta_hasComment_doc').attr ("data-toggle","none");
				}
				else {
					ris = [];
				
					$.each (response ["results"]["bindings"],
						function (k,v) {
							ris.push ({"testo":v ["testo"].value});
						}
					);
									
					// Abbiamo ottenuto la lista dei commenti.
					// Ora popoliamo la collapse
					$.each (ris,
						function (k,v){
							if (k == 0) {
								// Il primo elemento lo mettiamo sulla bar
								$('#a1_meta_hasComment_doc').html (toolT_a (v ["testo"]));
							} 
							else {
								// Gli altri elementi li mettiamo dentro la collapse
								$('#basket_collapse_hasComment_doc').append (toolT_li (v ["testo"]));
							}
						}
					);
					
					// Se abbiamo più di un elemento dobbiamo consentire l'apertura della collapse
					if (response ["results"]["bindings"]["length"] > 1) {
						$('#a_meta_hasComment_doc').attr ("data-toggle","collapse");
					}
				}
			}
			catch (err) {
				alert ('load_annotazioni_hasComment_doc - errore parse JSON');
			}
		},
		error: function (xhr, ajaxOptions, thrownError) {
		    alert (xhr.status);
		    alert (thrownError);
		}
	});
}

/* -------------------------------------------------------------------------------------------------- */
function meta_doc_main_expand_element (element) {
	if ($('#a_meta_'+element).attr ('data-toggle') != 'none') {
		$("#collapse_"+element).collapse('show');
	}
}

/* -------------------------------------------------------------------------------------------------- */
function meta_doc_main_expand_all () {
	
	$.each (_elementi_documento,
		function (k,v) {
			meta_doc_main_expand_element (v);
		}
	);
}

/* -------------------------------------------------------------------------------------------------- */
function meta_doc_main_collapse_element (element) {
	if ($(element).hasClass ('in')) {
		$(element).collapse('hide');
	}
}

/* -------------------------------------------------------------------------------------------------- */
function meta_doc_main_collapse_all () {
	
	$.each (_elementi_documento,
		function (k,v) {
			meta_doc_main_collapse_element ("#collapse_"+v);
		}
	);
}

/* -------------------------------------------------------------------------------------------------- */
function allinea_collapse_elemento (id) {
	while ($(id).width() <= 80) {
		$(id).append ("&nbsp;");
	}
}

/* -------------------------------------------------------------------------------------------------- */
function allinea_collapse () {
	// Aggiunge spazi alle etichette il modo da allineare i valori (tab)

	$.each (_elementi_documento,
		function (k,v) {
			allinea_collapse_elemento ("#a_meta_"+v);
		}
	);
}

/*
################################################################################
################################################################################
################################################################################
################################################################################
################################################################################
################################################################################
################################################################################
################################################################################
################################################################################
################################################################################
################################################################################
################################################################################
## FRAMMENTI
################################################################################
################################################################################
################################################################################
################################################################################
################################################################################
################################################################################
################################################################################
################################################################################
################################################################################
################################################################################
################################################################################
################################################################################
*/


/*
--------------------------------------------------------------------------------
--------------------------------------------------------------------------------
--------------------------------------------------------------------------------
-- FILTRI 
--------------------------------------------------------------------------------
--------------------------------------------------------------------------------
--------------------------------------------------------------------------------
*/

/* -------------------------------------------------------------------------------------------------- */
function get_index_from_type (tipo) {
	// Dato il tipo di frammento restituisce l'indice 

	var indice;

	$.each (_elementi_frammenti,
		function (k,v) {
			if (v == tipo)	{
				indice = k; 
				return false;		// BREAK; 
			}
		}
	);
	
	return indice;
}

/* -------------------------------------------------------------------------------------------------- */
function check_frammenti (e,cat,status,rinfresca) {
	
	if (_g_annotatore.doc_name != '') {		// Entriamo solo se è stato selezionato un documento
		var tipo;
		var chk;
	
		if (e == null) { tipo = cat; chk = status; }
		else { tipo = e.attr ('categoria'); chk = e.prop ("checked"); }
		
		// Evento che viene chiamato tutte le volte che si clicca su una checkbox dei frammenti
		if (chk) {
			// Check selezionata
			$('.color_'+tipo).css ({"background-color":_elementi_bkg_color [get_index_from_type (tipo)]});
			$('.color_'+tipo).css ({"border-top-style":"solid"});
			$('.color_'+tipo).css ({"border-bottom-style":"solid"});
		} 
		else {
			// Check de-selezionata
			$('.color_'+tipo).css ({"background-color":"white"});
			$('.color_'+tipo).css ({"border-top-style":"none"});
			$('.color_'+tipo).css ({"border-bottom-style":"none"});
		}
		
		if (rinfresca) dom_refresh ();
	}
}

/* -------------------------------------------------------------------------------------------------- */
function frammenti_doc_main_check_all () {
	// Mette il check a tutte le checkbox dei frammenti
	
	$.each (_elementi_frammenti,
		function (k,v) {
			$("#checkbox_frammenti_"+v).prop ('checked',true);			
			$("#checkbox_frammenti_"+v).attr ('checked',"checked");		// Chrome
			
			check_frammenti (null,v,true,false);
		}
	);
	
	if (_g_annotatore.doc_name != '') {		// Rigeneriamo solo se è stato selezionato un documento
		dom_refresh ();
	}
	
}

/* -------------------------------------------------------------------------------------------------- */
function frammenti_doc_main_uncheck_all () {
	// Toglie il check a tutte le checkbox dei frammenti
	
	$.each (_elementi_frammenti,
		function (k,v) {
			$("#checkbox_frammenti_"+v).prop ('checked',false);
			$("#checkbox_frammenti_"+v).removeAttr ('checked');			// Chrome
			
			check_frammenti (null,v,false,false);
		}
	);
		
	if (_g_annotatore.doc_name != '') {		// Rigeneriamo solo se è stato selezionato un documento
		dom_refresh ();
	}
}

/* -------------------------------------------------------------------------------------------------- */
function filtri_autore_azione (e) {
	
	var nome = e.attr ('thisnome');
	var uri = e.attr ('thisuri');
	
	// Chiudiamo la drop ...
	$('#dropdown_filtri_autore').dropdown ('toggle');
	// ... scriviamo il nome nella textbox ...
	$('#label_filtri_autore').text (nome);
	_g_filtri.uri_autore = uri;
	// ... e rigeneriamo il dom
	dom_refresh () 
}

/* -------------------------------------------------------------------------------------------------- */
function filtri_autore_load_drop () {
	
	var $c = $('#dropdown_filtri_autore');

	if (_g_annotatore.doc_name != '') {
		// Gli autori devono essere considerati una volta sola
		var auturi = [];
		var ris = [];
		var nuri = 0;
		var nris = 0;
		
		$c.empty ();
		$c.append ('<li><a href="#">Sto caricando la lista ...</a></li>');
		$c.append ('<img class="wait_image" src="images/wait_circle.gif" />');
		
		if (_g_f_cat_global.length > 0) {
			$.each (_g_f_cat_global,
				function (k,v) {
					if ($.inArray (v ['autore'].value, auturi) == -1) {
						auturi.push (v ['autore'].value);
						nuri++;
					}
				}
			);
			
			$.each (auturi,
				function (key,uri) {
					$.ajax ({
						url: _py_annotazioni,
						type: "post",
						datatype : "application/json",
						data: { 'RICHIESTA':'generalita_autore', 'SRC_STR':sa_exape (uri) },		
						success: function (response) {
							try {
								if (response ["results"]["bindings"]["length"] == 0) {
									// Se non ci sono elementi in lista mandiamo un messaggio su console e continuiamo
									console.warn ("Funzione: filtri_autore_load_drop -- Autore "+uri+" non trovata corrispondenza nel 3store");
								}
								else {
									$.each (response ["results"]["bindings"],
										function (k,v) {
											ris.push ({nome:v ['nome'].value, uri:uri});
										}
									);
								}
								
								// Se abbiamo raggiunto la fine dell'array, allora memorizziamo i risultati nella drop
								if (++nris == nuri) {
									$c.empty ();
									$c.append ('<li role="presentation"><a id="dropdown_filtri_autore_element" role="menuitem" tabindex="-1" href="#" thisnome="Nessuno" thisuri="x">Nessuno</a></li>');
									$c.append ('<li role="presentation" class="divider"></li>');
									$.each (ris,
										function (k,v) {
											$c.append ('<li role="presentation"><a id="dropdown_filtri_autore_element" role="menuitem" tabindex="-1" href="#" thisnome="'+v ['nome']+'" thisuri="'+v ['uri']+'">'+v ['nome']+'</a></li>');
										}								
									);
									
									$('a#dropdown_filtri_autore_element').click (function() { filtri_autore_azione ($(this)); return false; });  
								}
							}
							catch (err) {
								alert ('<filtri_autore_load_drop> - errore parse JSON - '+uri);
							}
						},
						error: function (xhr, ajaxOptions, thrownError) {
						    alert (xhr.status+' -- '+thrownError);
						}
					});
				}
			);
		}
		else {
			$c.empty ();
			$c.append ('<li role="presentation"><a id="dropdown_filtri_autore_element" role="menuitem" tabindex="-1">Nessun elemento presente</a></li>');
		}
	}
	else {
		$c.empty ();
		$c.append ('<li role="presentation"><a id="dropdown_filtri_autore_element" role="menuitem" tabindex="-1">Nessun documento caricato</a></li>');
	}
}

/* -------------------------------------------------------------------------------------------------- */
function filtri_data_azione (e) {
	
	var data = e.attr ('thisdata');
	var reale = e.attr ('thisreal');
	
	// Chiudiamo la drop ...
	$('#dropdown_filtri_data').dropdown ('toggle');
	// ... scriviamo la data nella textbox ...
	$('#label_filtri_data').text (data);
	_g_filtri.data = reale;
	// ... e rigeneriamo il dom
	dom_refresh () 
}

/* -------------------------------------------------------------------------------------------------- */
function filtri_data_load_drop () {
	
	var $c = $('#dropdown_filtri_data');
	var $o = $('#solo_data_filtri_data');
	
	if (_g_annotatore.doc_name != '') {
		// Le date devono essere considerate una volta sola
		var tempore = [];
		
		$c.empty ();
		$c.append ('<li><a href="#">Sto caricando la lista ...</a></li>');
		$c.append ('<img class="wait_image" src="images/wait_circle.gif" />');
		
		// Prendiamo la data ed eventualmente l'ora
		$.each (_g_f_cat_global,
			function (k,v) {
				var ora = v ['ora'].value.substr (0,10);
				var trovato = false;
				if (!$o.prop ('checked')) {	ora += ' - '+v ['ora'].value.substr (11,8);	}	// Aggiungiamo l'ora
				for (var i=0; i<tempore.length; i++) {
					if (ora.localeCompare (tempore [i].ora) == 0) {
						trovato = true;
						break;
					}
				}
				if (!trovato) {
					tempore.push ({ora:ora, reale:(($o.prop ('checked')) ? v ['ora'].value.substr (0,10) : v ['ora'].value)});
				}
			}
		);
		if (tempore.length > 1) {
			tempore.sort ( 
				function (a, b) {
					return (a.ora < b.ora) ? -1 : 1;
				}
			);
		}
		
		$c.empty ();
		$c.append ('<li role="presentation"><a id="dropdown_filtri_data_element" role="menuitem" tabindex="-1" href="#" thisdata="Nessuno" thisreal="x">Nessuno</a></li>');
		$c.append ('<li role="presentation" class="divider"></li>');
		$.each (tempore,
			function (k,v) {
				// Giriamo la data ...
				var tmp = '';
				var r = [8,9,-1,5,6,-1,0,1,2,3];
				for (var i=0;i<10;i++) {
					tmp += (r[i] == -1) ? '/' : v.ora [r[i]];
				}
				v.ora = v.ora.replace (v.ora.substr (0,10),tmp);
				// ... e aggiungiamo l'elemento nella drop
				$c.append ('<li role="presentation"><a id="dropdown_filtri_data_element" role="menuitem" tabindex="-1" href="#" thisdata="'+v.ora+'" thisreal="'+v.reale+'">'+v.ora+'</a></li>');
			}
		);
		$('a#dropdown_filtri_data_element').click (function() { filtri_data_azione ($(this)); return false; });
	}
	else {
		$c.empty ();
		$c.append ('<li role="presentation"><a id="dropdown_filtri_data_element" role="menuitem" tabindex="-1">Nessun documento caricato</a></li>');
	}
}

/*
--------------------------------------------------------------------------------
--------------------------------------------------------------------------------
--------------------------------------------------------------------------------
-- FRAMMENTI 
--------------------------------------------------------------------------------
--------------------------------------------------------------------------------
--------------------------------------------------------------------------------
*/

/* -------------------------------------------------------------------------------------------------- */
function load_annotazioni_frammento_element (tipo,documento) {
	   
	var numero_annotazioni = 0;	
		
	$("#check_frammenti_"+tipo).html ('<img class="wait_image" src="images/wait_circle.gif" />');
		
	// Richiediamo gli elementi al 3store
	$.ajax ({
		url: _py_annotazioni,
		type: "post",
		datatype : "application/json",
		data: { 'RICHIESTA' : tipo+'_meta_load', 'SRC_STR' : documento },		
		success: function (response) {
			try {
				if (response ["results"]["bindings"]["length"] == 0) {
					// Non ci sono elementi
					$("#check_frammenti_"+tipo).html ('0');
				}
				else {
					$.each (response ["results"]["bindings"],
						function (k,v) {
							// Aggiungiamo l'identificativo unico e il tipo
							_g_fram_id ++;
							v ["id_fram"] = _g_fram_id;
							v ["tipo"] = tipo;
							_g_f_cat_global.push (v);
							
							numero_annotazioni = k+1;
						}
					);
					
					$("#check_frammenti_"+tipo).html (numero_annotazioni);
				}
				
				// Se letto tutte le annotazioni, rinfreschiamo il dom in modo da visualizzare i colori
				if (tipo == 'hasComment') {
					$("body").css("cursor", "default");
		
					dom_refresh ();
				}
			}
			catch (err) {
				alert ('load_annotazioni_'+tipo+'_meta - errore parse JSON');
			}
		},
		error: function (xhr, ajaxOptions, thrownError) {
		    alert (tipo+" -- "+xhr.status);
		    alert (thrownError);
		}
	});
}

/* -------------------------------------------------------------------------------------------------- */
function load_annotazioni_documento (documento) {
	
	// Resettiamo il contenuto della collapse ...
	$.each (_elementi_documento,
		function (k,v) {
			$('#a1_meta_'+v).html ('&nbsp;');
			$('#basket_collapse_'+v).html ('&nbsp;');
		}
	);
	
	// ... e carichiamo le annotazioni relative al documento
	load_annotazioni_hasAuthor (documento);
	load_annotazioni_hasPublisher (documento);
	load_annotazioni_hasPubYear (documento);
	load_annotazioni_hasTitle (documento);
	load_annotazioni_hasShortTitle (documento);
	load_annotazioni_hasAbstract (documento);
	load_annotazioni_hasComment_doc (documento);
}

/* -------------------------------------------------------------------------------------------------- */
function load_annotazioni_frammenti (documento) {

	$("body").css ("cursor", "progress");
	
	_g_f_cat_global = [];

	// Azzeriamo il totali ...
	$.each (_elementi_frammenti,
		function (k,v) {
			$('#check_frammenti_'+v).text ('0');
		}
	);

	// ... e carichiamo le annotazioni relative ai frammenti
	$.each (_elementi_frammenti,
		function (k,tipo) {
			load_annotazioni_frammento_element (tipo,documento);
		}
	);
}















