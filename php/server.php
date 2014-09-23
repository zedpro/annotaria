<?php


// --------------------------------------------------------------------------------
function file_list ($tipo) {
   
    if (isset ($_GET ["doc_url"])) {
    
        // Cambiamo identificativo a seconda se rispondiamo alla drop principale o a quella del modulo cites
        $idi = 'file_doc_name';
        if ($tipo == 1) $idi = $_GET ["mody"].'cites_drop_doc_name';
        
        // Prende la lista dei file dal server di annotaria
        $url = $_GET ["doc_url"]; 
        // Scarica la pagina html ...
        $html = file_get_contents ($url);
        // ... e poi parsa per estrarre solo la lista dei file 
        $count = preg_match_all ('/<td><a href="([^"]+)">[^<]*<\/a><\/td>/i', $html, $files);
    
        for ($i = 0; $i < $count; ++$i) {
            // Teniamo solo i file che hanno estensione .html
            if (substr($files[1][$i], -5) == '.html') {
                echo ('<li><a id="'.$idi.'" href="'.$files[1][$i].'">'.$files[1][$i].'</a></li>');
            }
        }
    }
    else {
        echo ('(server.php) Errore critico. Campo doc_url non settato');
    }
}

// --------------------------------------------------------------------------------
function show_doc () {
    
    if (isset ($_GET ["doc_url"])) {

        $url = $_GET ["doc_url"];
        $doc = $_GET ["doc_name"];
        
        // Recuperiamo il body del documento
        $d = new DOMDocument;
        $mock = new DOMDocument;
        $d->loadHTML(file_get_contents($url.'/'.$doc));
        $body = $d->getElementsByTagName('body')->item(0);
        foreach ($body->childNodes as $child){
            $mock->appendChild($mock->importNode($child, true));
        }
        $html = $mock->saveHTML();
        $html = str_replace ('src="images','src="'.$url.'/images',$html);

        echo ($html);
    }     
}

// --------------------------------------------------------------------------------
function get_title () {
        
    $title = '';
    
    if (isset ($_GET ["doc_url"])) {

        $url = $_GET ["doc_url"];
        
        $d = new DOMDocument;
        $d->loadHTML(file_get_contents ($url));
        // Prendiamo l'header del documento
        $head = $d->getElementsByTagName('head')->item(0);
        // Isoliamo il titolo ...
        $titlenode = $head->getElementsByTagName ('title'); 
        $title = $titlenode->item(0)->nodeValue;
        // ... e togliamo gli eventuali ritorni a capo
        $title = str_replace("\n", "", $title);
        $title = str_replace("\r", "", $title);
    }   
        
    echo ($title);  
}

// --------------------------------------------------------------------------------
function checkUp () {
    echo 'PHP : '.phpversion();
}

// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------

    if (isset ($_GET ["action"])) {
        if ($_GET ["action"] == 'checkUp') checkUp ();
        elseif ($_GET ["action"] == 'file_list') file_list (0);
        elseif ($_GET ["action"] == 'file_list_cites_drop') file_list (1);
        elseif ($_GET ["action"] == 'show_doc') show_doc ();
        elseif ($_GET ["action"] == 'get_cites_title') get_title ();
    }
    else {
        echo ('(server.php) Errore critico. Campo action non settato');
    }


?>
