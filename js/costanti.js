
// Costanti

var _doc_url = "http://annotaria.web.cs.unibo.it/documents";

var _phpRoot = "php"
var _pyRoot = "cgi-bin";
var	_php_server = _phpRoot+"/server.php";
var _py_annotazioni = _pyRoot+"/annotazioni.py";
var _py_store = _pyRoot+"/store.py";

var _color_reader = "rgb(210, 250, 210)";
var _color_writer = "rgb(255, 228, 225)";
var _color_multiLayer = 'multiLayer';

var _elementi_documento = new Array ('hasAuthor','hasPublisher','hasPubYear','hasTitle','hasShortTitle','hasAbstract','hasComment_doc');
var _elementi_documento_desk = new Array ('Autore','Editore','Anno di Pubblicazione','Titolo','Titolo Breve','Abstract','Commento Personale');
var _elementi_frammenti = new Array ('denotesPerson','denotesPlace','denotesDisease','hasSubject','relatesTo','hasClarity','hasOriginality','hasFormatting','cites','hasComment');
var _elementi_frammenti_desk = new Array ('Persona','Luogo','Malattia','Argomento','DBPedia','Chiarezza','Originalità','Formato','Citazione','Commento');
var _elementi_bkg_color = new Array ('#E4DEE6','#D2E4F0','#F6E1E0','#FBEEDB','#F6F3F0','#F2F4F6','#D0F0D0','#F2E7EE','#DCEDEC','#E4EEE0');
var _elementi_frm_color = new Array ('#443647','#1D415B','#C73935','#E69215','#C8B49C','#AEBAC6','#6F4668','#AC5F93','#38706D','#557C45'); 
var _apocalypse = new Array ('excellent','good','fair','poor','very poor'); 

var _id_prefix = "fragment_jump_id_";					// Prefisso degli id dei frammenti	
var _argo_prefix = "http://thes.bncf.firenze.sbn.it/";	// Prefisso per gli argomenti
var _mala_prefix = "http://www.icd10data.com/";			// Prefisso per le malattie

var _m99 = "mody99_";		// Prefisso da aggiungere agli id degli oggetti coinvolti nella modifica

var _crlf = "\n"
 
// #############################################################################################

// Variabili globali

var _g_selRange;

var _g_DomArray = [];		// Array temporano contente l'immagine del dom relativa ai nodi selezionati
var _g_iGlobal = {			// Relativamente alla selezione ...
	start : 0, 				// Indice di inizio e fine a partire dall'antenato comune
	end : 0,				
	o_start : 0,			// Indice di inizio e fine a partire dal proprio nodo
	o_end : 0,
	ln_start : null,		// Nodo locale di inizio e fine
	ln_end : null,
	temp : 0,				// Variabile di appoggio per la computazione intermedia
	ance : '',				// Common Ancestor
	text : ''				// testo del frammento selezionato
};

var _g_blink_function = null;

var _g_next_fragment = [];	// Array contenente tipo ed id dei frammenti (serve per la ricerca automatica dei frammenti)

var _g_f_cat_global = [];	// Array contenente le annotazioni del 3store 
var _g_fram_id = 0;			// Identificativo unico per i frammenti

var _g_annOta = [];			// Array delle annotazioni pendenti
var _g_general_index = -1;	// Indice di scambio per le annotazioni pendenti (-1 inserimento ## >-1 modifica)

var _g_adm = {				// Stato delle collapse del pannello di modifica (0-close, 1-open) 
	col1 : 1,
	col2 : 0,
	inModifica : false
}

var _g_html_save = {		// Array contenente frammenti HTML 
	sin_dom : '',							// dom di partenza
	annotaDoc_modifica_salva_chiudi : ''
}

var _g_annotatore = {		// Generalità dell'annotatore
	autore : 'Default',
	email : 'email@default.it',
	doc_name : ''
}

var _g_filtri = {			// Filtri (autore e data) 
	uri_autore : 'x',
	data : 'x'
}










