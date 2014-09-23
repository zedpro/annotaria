
/* ------------------------------------------------------ */
function load_document_list () {

	/* Prendiamo la lista dei documenti */ 
	$.ajax ({
		url: _php_server+'?action=file_list&doc_url='+_doc_url,
		type: 'GET',
        dataType: 'html',
        success: function (html_source) {
        	$('#lista_documenti').empty ();
        	$('#lista_documenti').append (html_source);        	
        	/* Aggiungiamo la funzione che gestisce il click e recupera il nome del file selezionato */
        	$('a#file_doc_name').click (function() { show_remote_document ($(this).attr('href')); load_annotazioni_documento ($(this).attr('href')); return false; });
        },
        error: function (request, status, error) {
        	var message = request.status + ": " + request.statusText;
            alert (message);
        }
    });
	
}

/* ------------------------------------------------------ */
function show_remote_document_struct_reset () {
	// Vuotiamo le strutture dati ...
	_g_next_fragment = []; 
	_g_annOta = [];
	_g_f_cat_global = [];
	_g_fram_id = 0;
	// ... e resettiamo i filtri
	_g_filtri.uri_autore = 'x';	$('#label_filtri_autore').text ('Nessuno');
	_g_filtri.data = 'x'; $('#label_filtri_data').text ('Nessuno');
	$('#solo_data_filtri_data').prop ('checked',true);
}

/* ------------------------------------------------------ */
function show_remote_document (doc_name) {
	
	// visualizza il documento presente sul server remoto

	// Resettiamo le strutture
	show_remote_document_struct_reset ();
	
	// Chiudiamo il menu a tendina ...	
	$('#doc_button').click ();	
	// ... riportiamo il nome del documento ...
	$('#a_html_doc_main').html ("&nbsp;"+doc_name);
	
	$('#document_box').empty ();
	$('#document_box').append ('<h3 href="#">Sto caricando il documento ...</h3><img class="wait_image" src="images/wait_circle.gif" />');

	// ... e richiediamo al server il documento scelto
	$.ajax ({
		url: _php_server+'?action=show_doc&doc_url='+_doc_url+'&doc_name='+doc_name,
		type: 'GET',
        dataType: 'html',
        success: function (html_source) {
        	$('#document_box').empty ();
			$('#document_box').append (html_source);
			
			_g_html_save.sin_dom = html_source;
			
			$("#document_box" ).bind ("mouseup",gestisci_selezione);

			// Le annotazioni sui frammenti si possono inserire solo a documento completamente caricato
			load_annotazioni_frammenti (doc_name);
			
			// Memorizziamo il nome del documento
			_g_annotatore.doc_name = doc_name; 
        },
        error: function (request, status, error) {
        	var message = request.status + ": " + request.statusText;
            alert (message);
        }
    });
	
}

/* ------------------------------------------------------ */
function unblink (tag) {
	$(tag).removeClass ('divtoBlink');
	$(tag).removeClass ("backgroundYellow");
	clearInterval (_g_blink_function);
}

/* ------------------------------------------------------ */
function blink (tag) {
	$(tag).addClass ('divtoBlink');
	_g_blink_function = setInterval (
		function () {
    		$(tag).toggleClass ("backgroundYellow");
     	},
     	1000
	);
}

/* ------------------------------------------------------ */
function credenziali_annotatore (nome, email) {
	// Passiamo senza fare controlli	
	_g_annotatore.autore = ($.trim (nome) == '') ? _g_annotatore.autore : $.trim (nome);
	_g_annotatore.email = ($.trim (email) == '') ? _g_annotatore.email : $.trim (email);
}

/* ------------------------------------------------------ */
function change_reader_writer_mode () {
	
	// Cambia da modalità lettore (default) a modalità scrittore e viceversa
	
	// Deduciamo la modalità dal colore della barra
	var color_mode = $('#barra_superiore').css ("background-color");
	
	if (color_mode == _color_reader) {
		// Modalità annotatore
		$('#modal_annota_login').modal ();
		color_mode = _color_writer;
	}
	else {
		// Modalità lettore
		color_mode = _color_reader;
	}
	
	$('#barra_superiore').css ("background-color",color_mode);
	
}

/* ------------------------------------------------------ */
function get_tipo_frammento_from_id (id_fram) {
	
	var tipo = '';
	
	// Cerchiamo l'elemento nelle annotazioni salvate
	$.each (_g_f_cat_global,
		function (k,v) {
			if (v.id_fram == id_fram) {
				tipo = v.tipo;
				return false;
			}			
		}
	);
	
	// Se non lo abbiamo trovato allora lo cerchiamo anche tra le annotazioni pendenti
	if (tipo == '') {
		$.each (_g_annOta,
			function (k,v) {
				if (v.id_fram == id_fram) {
					tipo = _elementi_frammenti [v.tipo];
					return false;
				}			
			}
		);
	}
	
	return (tipo);
}

/* -------------------------------------------------------------------------------------------------- */
function set_local_offset_start_end () {
	
	// Ricava l'offset di inizio e fine rispetto al nodo di riferimento

	var l = 0;
	
	_g_DomArray.forEach (
		function (n) {
			if (n.nodeType == 3) {
			 
				if ((l<=_g_iGlobal.start) && ((l + n.length) >= _g_iGlobal.start)) {
					// Siamo sul nodo di inizio
					_g_iGlobal.ln_start = n;
					_g_iGlobal.o_start = _g_iGlobal.start - l; 
				}
				
				if ((l<=_g_iGlobal.end) && ((l + n.length) >= _g_iGlobal.end)) {
					// Siamo sul nodo di fine
					_g_iGlobal.ln_end = n;
					_g_iGlobal.o_end = _g_iGlobal.end - l;
				}
				
				l += n.length;
			}
		}
	);
}

/* -------------------------------------------------------------------------------------------------- */
function calcola_offset_rispetto_root () {
	
	// _g_iGlobal.ln_start, .ln_end, .o_start, .o_end   devono essere valorizzati
	
	var l = 0;
	var nstart = _g_iGlobal.ln_start;		// Nodo iniziale e finale
	var nend = _g_iGlobal.ln_end;
	
	// Generiamo il dom di tutto il documento (allo stato attuale) 
	_g_iGlobal.ance = document.getElementById ('document_box');
	_g_DomArray = [];
	DOMComb (_g_iGlobal.ance);
	
	// Cerchiamo start ed end assoluti
	_g_DomArray.forEach (
		function (n) {
			if (n.nodeType == 3) {
				if (n == nstart) {
					_g_iGlobal.start = l + _g_iGlobal.o_start;
				}			
				if (n == nend) {
					_g_iGlobal.end = l + _g_iGlobal.o_end;
					return false;
				}
				l += n.length;
			}
		}
	);
}

/* ------------------------------------------------------ */
function magic_frame (start,end,layer) {
	// deve restituire .tipo .id_fram .absStart .absEnd
	
	var ida = layer.ida;
	var tipo = (ida.length > 1) ? _color_multiLayer : get_tipo_frammento_from_id (ida [0]);  
	var id_fram = ida [0].toString ();

	// Vediamo se ci sono id_fram multipli da aggiungere
	if (ida.length > 1) {
		for (var i=1; i<ida.length; i++) {
			id_fram += ','+ida [i].toString ();
		}
	}
	
	return ({tipo:tipo, id_fram:id_fram, absStart:start, absEnd:end});
}

/* ------------------------------------------------------ */
function dom_refresh_abile (v,pende) {
	// Controlla se il frammento può essere visualizzato in base ai filtri impostati
	var passa = true;
	if (!pende) {
		if (!$('#checkbox_frammenti_'+v.tipo).prop ("checked")) 	passa = false;
		else if ((_g_filtri.uri_autore.localeCompare ('x') != 0) && (v.autore.value.localeCompare (_g_filtri.uri_autore) != 0))	passa = false;
		else if ((_g_filtri.data.localeCompare ('x') != 0) && (_g_filtri.data.localeCompare (v.ora.value.substr (0,_g_filtri.data.length)) != 0))	passa = false;
	}
	else {
		// Nelle annotazioni pendenti autori e data vengono considerati o tutto o niente
		if (v.cat != 'frammento')	passa = false;
		else if (!$('#checkbox_frammenti_'+_elementi_frammenti [v.tipo]).prop ("checked"))  passa = false;
		else if (_g_filtri.uri_autore.localeCompare ('x') != 0)	passa = false;
		else if (_g_filtri.data.localeCompare ('x') != 0)	passa = false;
	}
	
	return (passa);
}

/* ------------------------------------------------------ */
function dom_refresh_magic_merge () {
	
	var arr = [];
	
	// Prendiamo tutte le annotazioni (memorizzate e pendenti) e le mettiamo in un unico array
	// Consideriamo solo le annotazioni che soddisfano i criteri impostati dai filtri (tipo, autore, data)
	$.each (_g_f_cat_global,
		function (k,v) {
			if (dom_refresh_abile (v,false)) {
				var a = {tipo:v.tipo, id_fram:v.id_fram, ance:v ['frame'].value, start:parseInt (v ['start'].value), end:parseInt (v ['end'].value), absStart:0, absEnd:0 };
				arr.push (a);
			}
		}
	);
	$.each (_g_annOta,
		function (k,v) {
			if (dom_refresh_abile (v,true)) {
				var a = {tipo:_elementi_frammenti [v.tipo], id_fram:v.id_fram, ance:v.nodo, start:v.start, end:v.end, absStart:0, absEnd:0 };
				arr.push (a);
			}
		}
	);

	// Per ogni elemento ricaviamo start ed end assoluti
	$.each (arr,
		function (k,v) {
			_g_iGlobal.start = v.start;
			_g_iGlobal.end = v.end;
			_g_iGlobal.ance = document.getElementById (v.ance);
			_g_DomArray = [];
			if (_g_iGlobal.ance == null) {	
				console.warn ('<dom_refresh_magic_merge> - '+v.ance+' - riferimento non trovato');
			}
			else {
				DOMComb (_g_iGlobal.ance);
				
				set_local_offset_start_end ();			
				calcola_offset_rispetto_root ();		
				
				v.absStart = _g_iGlobal.start;
				v.absEnd = _g_iGlobal.end;
			}
		}
	);

	// Creiamo l'array contenente la rappresentazione delle parti di testo sottolineate
	var layer = [];
	var strato = false;
	var i;
	$.each (arr,
		function (k,v) {
			// L'array deve essere lungo almeno come il frammento attuale
			if (layer.length < v.absEnd) {
				for (i = layer.length; i < v.absEnd; i++) {
					layer.push ({ida:[]});	
				}
			}

			// Ora aggiungiamo l'identificativo unico del frammento attuale
			// in OGNI posizione compresa nel range
			for (i = v.absStart; i < v.absEnd; i++) {
				layer [i].ida.push (v.id_fram); 
				if (layer [i].ida.length > 1) 	strato = true;		// Abbiamo una stratificazione 
			}
		}
	);
	
	// Se abbiamo una stratificazione allora dobbiamo creare un nuovo array contenente i range giusti
	if (strato) {
		var tmp = [];
		var start = (layer [0].ida.length > 0) ? 0 : -1;
		
		for (i=0; i<layer.length; i++) {
			// Controlliamo se abbiamo raggiunto la fine
			if (i == (layer.length - 1)) {
				if (start != -1) {
					tmp.push (magic_frame (start,i+1,layer [start]));
				}
			}
			else {
				// Controlliamo se la cella attuale contiene gli stessi id della successiva (potrebbe anche essere vuota)
				if ( layer [i].ida.join ('') != layer [i+1].ida.join ('') ) {  
					if (start == -1) {
						start = i+1;
					}
					else {
						tmp.push (magic_frame (start,i+1,layer [start]));
						// Se ci sono degli elementi contigui start prosegue
						start = (layer [i+1].ida.length > 0) ? i+1 : -1;
					}
				}
			}
		}
		
		return (tmp); 
	}

	return (arr);
}

/* ------------------------------------------------------ */
function dom_refresh () {
	// Ridisegna la pagina
	
  	$("body").css ("cursor", "wait");

	// Aggiungiamo un ritardo di un secondo per consentire la visualizzazione del puntatore "wait"
	setTimeout(
		function() {	
			// Ripristina il dom di partenza
			$('#document_box').html (_g_html_save.sin_dom);
			
			frammenti = dom_refresh_magic_merge ();
			
			// Evidenziamo i frammenti presenti nell'array
			$.each (frammenti,
				function (k,v) {
					// Disegniamo solo se la visualizzazione è abilitata
					var tipo = v.tipo; 
					if (($("#checkbox_frammenti_"+tipo).prop ('checked')) || (tipo == _color_multiLayer)) {
						
						_g_iGlobal.start = v.absStart;
						_g_iGlobal.end = v.absEnd;
						_g_iGlobal.ance = document.getElementById ('document_box');
						_g_DomArray = [];
						DOMComb (_g_iGlobal.ance);

						HighlightSelection (v.id_fram,tipo);
					}
				}
			);
			
			$("body").css("cursor", "default");
	
  		}, 1000
  	);
}

/* ------------------------------------------------------ */
function HighlightTextNode (fid,tipo,node) {
	
	var selRange = document.createRange();
	var iStart = -1; 
	var iEnd = -1;
	var go = false;
	var l = node.length;
	var i;
	var trovato;
	
	if (node.textContent.length > 0) {
				
		selRange.selectNode (node);
		
		// Calcoliamo il range relativo al nodo corrente (se non è un nodo di inizio o fine viene selezionato tutto)
		if (_g_iGlobal.temp < _g_iGlobal.start) {
			if ((_g_iGlobal.temp + l) >= _g_iGlobal.start) {
				// Siamo sul nodo di inizio
				iStart =  _g_iGlobal.start - _g_iGlobal.temp; 
				iEnd = l;
				go = true;
			}
		}
		else {
			iStart = 0;
			iEnd = l;
			go = true;
		}
		
		
		if (_g_iGlobal.temp < _g_iGlobal.end) {
			if ((_g_iGlobal.temp + l) >= _g_iGlobal.end) {
				// Siamo sul nodo di fine
				iEnd = _g_iGlobal.end - _g_iGlobal.temp; 
			}
		}
		else {
			go = false;
		}
		
		_g_iGlobal.temp += l;

		if (go && (node.textContent.trim != "")) {
			selRange.setStart (node,iStart);
			selRange.setEnd (node,iEnd);
			    
		    var newElement = document.createElement ('span');		// newElement è di tipo Node. Creaiamo un nodo span ...    
			newElement.className = "color_"+tipo;					// e gli assegnamo la classe relativa al tipo passato in input
			newElement.setAttribute ("onclick","javascript: visualizza_info_frammento ($(this).attr ('id_fram')); return false;");
			newElement.setAttribute ("id_fram",fid);
			
		    // Siccome un frammento può essere composto da tanti sottoframmenti (aventi fid comune) allora inseriamo l'identificativo una sola volta
		    trovato = false;
		    for (i=0; i<_g_next_fragment.length; i++) {
		    	if (_g_next_fragment [i].id == _id_prefix+fid) {
		    		trovato = true;
		    		break;
		    	}
		    }
		    if (!trovato) {
		    	newElement.setAttribute ("id",_id_prefix+fid);
		    	_g_next_fragment.push ({tipo:tipo, id:_id_prefix+fid, attuale:0});
		    }		    
		    
		    var documentFragment = selRange.extractContents();		// Toglie il testo selezionato e lo mette in documentFragment
		
		    newElement.appendChild (documentFragment);				// Aggiunge il testo al nodo
		        	        
		    selRange.insertNode (newElement);
		}
	}
}

/* ------------------------------------------------------ */
function HighlightSelection (fid,tipo) {
	
	// _g_iGlobal.start, .end, .ance, _g_DomArray devono essere valorizzati

	// Ora abbiamo un array che contiene tutti i nodi
	// Relativamente ai nodi di tipo testo dobbiamo evidenziare solo i nodi coinvolti nel range selezionato

	_g_iGlobal.temp = 0;

	_g_DomArray.forEach (
		function (n) {
			if (n.nodeType == 3) {
	    		HighlightTextNode (fid,tipo,n);
	    	}
		}
	);	
}

/* ------------------------------------------------------ */
function DOMComb (oParent) {
  
  	// Funzione ricorsiva che realizza una visita in profondità su tutti i nodi a partire da oParent
  	
  	_g_DomArray.push (oParent);	// Memorizziamo il nodo nell'array
  
	if (oParent.hasChildNodes()) {
		for (var oNode = oParent.firstChild; oNode; oNode = oNode.nextSibling) {
			DOMComb(oNode);
		}
	}
}

/* ------------------------------------------------------ */
function no_my_frame (nodoid) {
	if (!nodoid)	return true;
	if (nodoid.substr (0,_id_prefix.length-1) == _id_prefix)	return true;
	return false;		
}

/* ------------------------------------------------------ */
function go_to_parent (nodo) {
	// Restituisce il primo parent del nodo avente un id valido (e diverso dagli id dei frammenti)
	while (!nodo.id || no_my_frame (nodo.id)) 
		nodo = nodo.parentNode;
	return (nodo);
}

/* ------------------------------------------------------ */
function gestisci_selezione () {

	// Verifichiamo se abbiamo selezionato qualcosa
	if (window.getSelection) {	
    
    	// Inizializziamo il range che verrà (eventualmente) utilizzato per evidenziare l'annotazione
        var selObj = window.getSelection();						// Prendiamo il testo selezionato
        _g_selRange = selObj.getRangeAt(0);						// Creiamo un oggetto range sul testo selezionato

		_g_iGlobal.text = selObj.toString ();					// Salviamo il testo selezionato. Serve solo per la tabella di modifica
		
		unblink ("#edit_icon");
		// Controlliamo se siamo in modalità di editazione
		if ($('#barra_superiore').css ("background-color") == _color_writer) {
			if (!_g_selRange.collapsed) {
		        blink ("#edit_icon");
			}	        
    	}
    } 
	else {
		alert ("window.getSelection non supportata dal broswer");
	}
}

/* ------------------------------------------------------ */
function absolute_range () {

	var s = 0;
	var e = 0;
	var l = 0;
	
	// Creiamo il dom rispetto l'ancestor comune
	_g_DomArray = [];
	DOMComb (_g_iGlobal.ance);
	
	// Calcoliamo inizio e fine
	_g_DomArray.forEach (
		function (n) {
			if (n == _g_selRange.startContainer) {
				s = l + _g_selRange.startOffset;	
			} 
			if (n == _g_selRange.endContainer) {
				e = l + _g_selRange.endOffset;
				return false;
			}	
			if (n.nodeType == 3) {
				l += n.length;
			}
		}
	);
	
	_g_iGlobal.start = s;
	_g_iGlobal.end = e;
}

/* ------------------------------------------------------ */
function edit_annotazione_reset_values () {
	
	// Resettiamo il contenuto della finestra modale
	$("#myTabDrop_doc").attr('class','dropdown');
	$("#myTabContent > div").attr('class','tab-pane fade');		// Rende inattivi tutti i figli di myTabContent
	$("#myTabContent > form").attr('class','tab-pane fade'); 
	$("#adl_home").attr('class','tab-pane fade in active');		// Attiva il default
	$("#myTabDrop_annotaDocumento_ul > li").attr('class','');	
	$("#myTabDrop_annotaFrammento_ul > li").attr('class','');
	
	// Documenti
	$('#id_hasAuthor').val ('');
	$('#nome_hasAuthor').val ('');
	$('#email_hasAuthor').val ('');
	$('#id_hasPublisher').val ('');
	$('#nome_hasPublisher').val ('');
	$('#homep_hasPublisher').val ('');
	$('#anno_hasPubYear').val ('');
	$('#text_hasTitle').text ('');
	$('#text_hasShortTitle').val ('');
	$('#text_hasAbstract').text ('');
	$('#text_hasComment_doc').text ('');
	
	// Frammenti
	$('#id_denotesPerson').val ('');
	$('#nome_denotesPerson').val ('');
	$('#email_denotesPerson').val ('');
	$('#id_denotesPlace').val ('');
	$('#nome_denotesPlace').val ('');
	$('#id_denotesDisease').val ('');
	$('#nome_denotesDisease').val ('');
	$('#id_hasSubject').val ('');
	$('#nome_hasSubject').val ('');
	$('#dbFind_relatesTo_input').val ('');
	$('#id_relatesTo').val ('');
	$('#nome_relatesTo').val ('');
	$('#nome_relatesTo').val ('');
	ma_radio_button ('adl_hasClarityScore_radio');
	ma_radio_button ('adl_hasOriginalityScore_radio');
	ma_radio_button ('adl_hasFormattingScore_radio');
	$('#url_cites').val ('');
	$('#titolo_cites').val ('');
	$('#text_hasComment').text ('');
}			

/* ------------------------------------------------------ */
function edit_annotazione () {
	
	unblink ("#edit_icon");
		
	// Controlliamo se abbiamo caricato un documento
	if ($.trim (($('#document_box').text ())).substr (0,9) != "AnnOtaria") {
		// Controlliamo se siamo in modalità di editazione
		if ($('#barra_superiore').css ("background-color") == _color_writer) {

			// Resettiamo i valori degli elementi di ogni form
			edit_annotazione_reset_values ();
			
			// Se abbiamo selezionato qualcosa allora dobbiamo abilitare la tab dei frammenti e cercare il nodo di partenza
			var selObj = window.getSelection();				
			if (!selObj.isCollapsed) {
			   	$("#myTabDrop_fra").attr ('class','dropdown');
			   	
			   	// Memorizziamo il nodo comune ... 
				_g_iGlobal.ance = go_to_parent (_g_selRange.commonAncestorContainer);
				
				absolute_range ();	
			}
			else {
				$("#myTabDrop_fra").attr('class','dropdown hidden');
			}
			
			_g_general_index = -1;
			$('#credenziali_nome_modal_annotazioni').text ('Autore : '+_g_annotatore.autore);
			$('#credenziali_email_modal_annotazioni').text ('Email : '+_g_annotatore.email);
			// Visualizziamo il pannello modale
			$('#annotaDoc').modal();
			
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
function next_annotazione (tipo) {
	// Si posiziona sulla prossima annotazione del tipo indicato (se esiste)
	var indice = -1;
	var indiceuno = -1;
	var running = false;
	var nele = 0;
	var i;
	
	for (i=0; i<_g_next_fragment.length; i++) {
		if (_g_next_fragment [i].tipo == tipo) {
			nele++;
			if (_g_next_fragment [i].attuale == 0) {
				if ((indice == -1) || (running)) {
					indice = i;
					running = false;
				}
			}
			else {
				if (_g_next_fragment [i].attuale == 1) {
					indiceuno = i;
					running = true;
				}
			}
		}
	}
	
	if (indice > -1) {
		if (indiceuno>-1) _g_next_fragment [indiceuno].attuale = 0;
		if (nele > 1) _g_next_fragment [indice].attuale = 1;
		
		var last = $("#document_box").scrollTop ();
		// Impostiamo lo zero della barra di scorrimento sul top della finestra
		$("#document_box").scrollTop ($("#document_box").position().top);
		// Calcoliamo lo spiazzamento sul frammento selezionato
		var fragPos = $("#"+_g_next_fragment [indice].id).position().top;
		if (fragPos > 0)	 $("#document_box").scrollTop (fragPos-20);
		else $("#document_box").scrollTop (last);
	}
}

/* ------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------ */
/* Develop */
/* ------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------ */

/* ------------------------------------------------------ */
function AnnOtaria_checkUp_py_version () {
	$("#checkUp_py_version").html ('<img class="wait_image" src="images/wait_circle.gif" />');
	
	$.ajax ({
		url: _py_annotazioni,
		type: "post",
		datatype : "application/json",
		data: { 'RICHIESTA' : 'checkUp'},		
		success: function (response) {
			try {
				$("#checkUp_py_version").empty ();
        		$("#checkUp_py_version").text ('Python : '+response);
			}
			catch (err) {
				$("#checkUp_py_version").empty ();
				$("#checkUp_py_version").text ('Python : ERRORE interrogazione');
			}
		},
		error: function (xhr, ajaxOptions, thrownError) {
		    $("#checkUp_py_version").empty ();
			$("#checkUp_py_version").text ('Python : ERRORE server');
		}
	});
}

/* ------------------------------------------------------ */
function AnnOtaria_checkUp_php_version () {
	$("#checkUp_php_version").html ('<img class="wait_image" src="images/wait_circle.gif" />');
	
	$.ajax ({
		url: _php_server+'?action=checkUp',
		type: 'GET',
        dataType: 'html',
        success: function (info) {
        	$("#checkUp_php_version").empty ();
        	$("#checkUp_php_version").text (info);
        },
        error: function (request, status, error) {
        	$("#checkUp_php_version").empty ();
        	$("#checkUp_php_version").text ('PHP : ERRORE');
        }
    });
}

/* ------------------------------------------------------ */
function AnnOtaria_checkUp () {
	// Versione jQuery
	$("#checkUp_jQuery_version").text ("jQuery : "+$.fn.jquery);
	AnnOtaria_checkUp_php_version ();
	$("#checkUp_php_rootDir").text ('PHP root directory : '+_phpRoot+'/');
	AnnOtaria_checkUp_py_version ();
	$("#checkUp_py_rootDir").text ('Python root directory : '+_pyRoot+'/');
}

/* ------------------------------------------------------ */
function hurry_up () {
	// Compila i dati di versione
	AnnOtaria_checkUp ();
	// Carica la lista dei documenti
    load_document_list ();
    // Formatta le etichette del pannello dei Meta Documento
    allinea_collapse ();
    // Chiude il pannello dei meta documento
    $('#collapse_meta_doc').collapse ('hide');
      
    // Salviamo frammenti html del dom di partenza 
    _g_html_save.annotaDoc_modifica_salva_chiudi = $('#annotaDoc_modifica_salva_chiudi').html ();
}

/* ------------------------------------------------------ */
function main_passwd_check (passwd) {

	if ($.md5 (passwd) == '4747bba9a6d193b9a904df00901cefd3') {
		hurry_up ();
	}
	else {
		$('#modal_main_passwd').modal ();
	}
}

/* ------------------------------------------------------ */
/* --- MAIN --------------------------------------------- */
/* ------------------------------------------------------ */

$(document).ready (
	function () {
		hurry_up ();
		//$('#modal_main_passwd').modal ();
	}
);






	




