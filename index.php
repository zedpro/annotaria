<!DOCTYPE html>
<html lang="it">
	<head>
	    <meta charset="utf-8">
	    <meta http-equiv="X-UA-Compatible" content="IE=edge">
	    <meta name="viewport" content="width=device-width, initial-scale=1">
	    <meta name="description" content="Progetto tecnologie Web 2014">
	    <meta name="author" content="Carlo Rimondi">
	    <link rel="shortcut icon" href="ico/favicon.ico">
	    <title>AnnOtaria</title>
	
	    <!-- Core CSS -->
	    <link href="http://annotaria.web.cs.unibo.it/documents/jats-preview.css" rel="stylesheet">
	    <link href="css/bootstrap.css" rel="stylesheet">
	    <link href="css/datepicker.css" rel="stylesheet">
	
	    <!-- Custom styles for this template -->
	    <link href="css/annotaria.css" rel="stylesheet">
	    <link href="css/fa.css" rel="stylesheet">
	</head>

	<!-- ######################################################################################## -->

  	<body> 

		<script src="js/jquery-2.1.1.js"></script>
		<script src="js/bootstrap.js"></script>
		<script src="js/bootstrap-datepicker.js"></script>
		<script src="js/jquery.md5.js"></script>
		
		<script src="js/costanti.js"></script>
		<script src="js/annotaria.js"></script>
		<script src="js/annotaria.js"></script>
		<script src="js/info_frammenti.js"></script>
		
		<!-- dialog modali ########################################################################## -->

        <?PHP 
            include ("modal_generale.html");
            include ("modal_annotazioni.html"); 
            
            $_elementi_frammenti = array ("denotesPerson","denotesPlace","denotesDisease","hasSubject","relatesTo","hasClarity","hasOriginality","hasFormatting","cites","hasComment");
            $_etichette_frammenti = array ("Persona","Luogo","Malattia","Argomento","DBPedia","Chiarezza","Originalità","Presentazione","Citazione","Commento");
        ?>
        
        <script src="js/modal_annotazioni.js"></script>

		<!-- ######################################################################################## -->
		<!-- ######################################################################################## -->

    	<div class="container">

    		<!-- Static navbar -->
	      	<div id="barra_superiore" class="navbar navbar-default barra_super" role="navigation">
				<div class="container-fluid">
					<div class="navbar-header">
						<button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
							<span class="sr-only">Toggle navigation</span>
							<span class="icon-bar"></span>
							<span class="icon-bar"></span>
							<span class="icon-bar"></span>
						</button>
						<a id="chi_siamo" class="navbar-brand" href="#">AnnOtaria</a>
					</div>
					<div class="navbar-collapse collapse">
						<ul class="nav navbar-nav">
							<li><a href="#" id="change_icon" class="fa fa-retweet">&nbsp;</a></li>
							<li><a href="#" id="edit_icon" class="fa fa-edit">&nbsp;</a></li>
							<li><a href="#" id="save_icon" class="fa fa-save">&nbsp;</a></li>
							<li><a href="#" id="help_icon" class="fa fa-question-circle">&nbsp;</a></li>
							<li class="dropdown">
								<a id="doc_button" href="#" class="dropdown-toggle" data-toggle="dropdown">Documenti<b class="caret"></b></a>
								<ul class="dropdown-menu" id="lista_documenti">
									<li><a href="#">Sto caricando la lista ...</a></li>
									<img class="wait_image" src="images/wait_circle.gif" />
								</ul>
							</li>
							
							<script type="text/javascript">
							    $('a#chi_siamo').click (function() { $('#chi_siamo_info').modal(); return false; });
								$('a#change_icon').click (function() { change_reader_writer_mode (); return false; });
								$('a#edit_icon').click (function() { edit_annotazione (); return false; });
								$('a#save_icon').click (function() { annotaDoc_modifica_annotazioni (); return false; });
								$('a#help_icon').click (function() { $('#help_panel').modal(); return false; });
							</script>
							
						</ul>
					</div><!--/.nav-collapse -->
				</div><!--/.container-fluid -->
			</div>



			<!-- Annotazioni -->
			<div class="panel-group" id="meta_doc_main">
				<div class="panel panel-info">
					<div class="panel-heading" style="height: 1.5em;">
                        <h4 class="panel-title" style="margin-top: -0.6em; ">
							<a id="a_meta_doc_main" class="fa fa-sort" data-toggle="collapse" data-parent="#meta_doc_main" href="#collapse_meta_doc">
								&nbsp;Meta Documento
							</a>
							<a id="a_meta_doc_main_expand_all" class="fa fa-plus-square" style="float: right;" href="#">
							    &nbsp;
                            </a>
                            <a id="a_meta_doc_main_collapse_all" class="fa fa-minus-square" style="float: right;" href="#">
                                &nbsp;
                            </a>
						</h4>
					</div>
				    <div id="collapse_meta_doc" class="panel-collapse collapse in">
						<div class="panel-body">
							
							<?PHP include ("collapse_main.html"); ?>
                            <script src="js/collapse_main.js"></script>
							
						</div>
				    </div>
				</div>
			</div>
			
			<script type="text/javascript">
                $('a#a_meta_doc_main_expand_all').click (function() { meta_doc_main_expand_all (); return false; });
                $('a#a_meta_doc_main_collapse_all').click (function() { meta_doc_main_collapse_all (); return false; });
            </script>
	
	
	
			<!-- Area documento -->
            <div class="panel-group" id="html_doc_main">
                <div class="panel panel-warning">
                    <div class="panel-heading">
                        <h4 class="panel-title">
                            <a id="a_html_doc_main" class="fa fa-sort" data-toggle="collapse" data-parent="#html_doc_main" href="#collapse_html_doc">
                                &nbsp;Documento
                            </a>
                        </h4>
                    </div>
                    <div id="collapse_html_doc" class="panel-collapse collapse in">
                        <div class="panel-body">

                            <!-- Collapse frammenti -->
                            <div class="panel-group" id="frammenti_doc_main">
                                <div class="panel panel-warning">
                                    <div class="panel-heading" style="height: 1.5em;">
                                        <h4 class="panel-title" style="margin-top: -0.6em; ">
                                            <a id="a_frammenti_doc_main" class="fa fa-sort" data-toggle="collapse" data-parent="#frammenti_doc_main" href="#collapse_frammenti_doc">
                                                &nbsp;Filtri
                                            </a>
                                        </h4>
                                    </div>
                                    
                                    <div id="collapse_frammenti_doc" class="panel-collapse collapse"> 
                                        <div class="panel-body">
                                            <div class="panel panel-default">
                                                
                                                <!-- 3 COLLAPSE INTERNE (filtri) -->   
                                                
                                                <div class="panel-group" id="filtri_accordion">
                                                    
                                                    <div class="panel panel-default">
                                                        <div class="panel-heading" style="height: 1.2em;">
                                                            <h4 class="panel-title" style="margin-top: -0.6em; ">
                                                                <a data-toggle="collapse" data-parent="#filtri_accordion" href="#filtri_collapse_tipo">
                                                                    Tipo
                                                                </a>
                                                                <a id="a_frammenti_doc_main_check_all" class="fa fa-check-square-o" style="float: right;" href="#">
                                                                    &nbsp;
                                                                </a>
                                                                <a id="a_frammenti_doc_main_uncheck_all" class="fa fa-square-o" style="float: right;" href="#">
                                                                    &nbsp;
                                                                </a>
                                                            </h4>
                                                        </div>
                                                        <div id="filtri_collapse_tipo" class="panel-collapse collapse in"> 
                                                            <div class="panel-body" id="frammenti_document_box" style="align: center; ">
                                                                <?php
                                                                    for ($i=0; $i<10; $i++) {
                                                                        $colore = "color_".$_elementi_frammenti [$i];
                                                                        $tipo = $_elementi_frammenti [$i];
                                                                        $etica = $_etichette_frammenti [$i];
                                                                        
                                                                        echo ('
                                                                            <div class="img-circle '.$colore.'" style="float: left; margin: 0em 0em 0em 1em; width: 1em; height: 1em; cursor: default; ">&nbsp;</div>
                                                                            <div class="input-group" style="width: 15em; background-color: white; padding: 0px 0px 0px 0px; margin: 0px 0px 0px 0px; border: 0px 0px 0px 0px; border-bottom: 1px solid lightblue;" >
                                                                                <span class="input-group-addon check_frammenti_left" style="padding: 2px 10px 0px 10px; border: 0px 0px 0px 0px; margin: 0em 0px 0px 0px;">
                                                                                    <input id="checkbox_frammenti_'.$tipo.'" type="checkbox" categoria="'.$tipo.'" checked="true" style="height: 1em; border: 0px 0px 0px 0px; margin: 0px 0px 0px 0px; padding: 0em 0px 0em 0px;">
                                                                                </span>
                                                                                <h5 class="check_frammenti_titolo" style="height: 0.5em; padding: 0em 0px 0em 0px; border: 0px 0px 0px 0px; margin: 0em 0px 0px 0px;">'.$etica.'</h5>
                                                                                <a id="check_frammenti_'.$tipo.'" class="input-group-addon check_frammenti_right" style="height: 0em; padding: 0em 0px 0em 0px; border: 0px 0px 0px 0px; margin: 0em 0px 0px 0px;" href="#">0</a>
                                                                            </div>
                                                                        
                                                                            <script type="text/javascript">
                                                                                $("#checkbox_frammenti_'.$tipo.'").on ("change", function() { check_frammenti ($(this),null,null,true); return false; });
                                                                                $("a#check_frammenti_'.$tipo.'").click (function() { next_annotazione ("'.$tipo.'"); return false; });
                                                                            </script>
                                                                        ');
                                                                    }
                                                                ?>
                                                            </div>
                                                        </div>
                                                    </div>
                                                  
                                                    <div class="panel panel-default">
                                                        <div class="panel-heading" style="height: 1.2em;">
                                                            <h4 class="panel-title" style="margin-top: -0.6em; ">
                                                                <a data-toggle="collapse" data-parent="#filtri_accordion" href="#filtri_collapse_autore">
                                                                    Autore
                                                                </a>
                                                            </h4>
                                                        </div>
                                                        <div id="filtri_collapse_autore" class="panel-collapse collapse">
                                                            <div class="panel-body" style="height: 15em; ">
                                                                
                                                                <div id="dropdown_filtri_autore_parent" class="dropdown">
                                                                    <button class="btn btn-default dropdown-toggle" type="button" id="dropdown_filtri_autore_button" data-toggle="dropdown">
                                                                        Seleziona un Autore
                                                                        <span class="caret"></span>
                                                                    </button>
                                                                    <ul id="dropdown_filtri_autore" class="dropdown-menu" role="menu" aria-labelledby="dropdown_filtri_autore_button" style="height: 11em; overflow: auto;">
                                                                       &nbsp;
                                                                    </ul>
                                                                </div>
                                                                
                                                                <div class="panel panel-default" style="margin: 1em 0em 0em 0em; width: 20em; ">
                                                                    <div class="panel-heading" style="background-color: OldLace; ">Filtro attuale</div>
                                                                    <div class="panel-body">
                                                                        <h4 id="label_filtri_autore" style="color: RoyalBlue; padding-left: 0.2em; ">Nessuno</h4>
                                                                    </div>
                                                                </div>

                                                            </div>
                                                        </div>
                                                    </div>
                                                    <script type="text/javascript">
                                                        $('#dropdown_filtri_autore_parent').on ('shown.bs.dropdown', function () { filtri_autore_load_drop (); return false; });
                                                    </script>
                                                  
                                                    <div class="panel panel-default">
                                                        <div class="panel-heading" style="height: 1.2em;">
                                                            <h4 class="panel-title" style="margin-top: -0.6em; ">
                                                                <a data-toggle="collapse" data-parent="#filtri_accordion" href="#filtri_collapse_data">
                                                                    Data
                                                                </a>
                                                            </h4>
                                                        </div>
                                                        <div id="filtri_collapse_data" class="panel-collapse collapse">
                                                            <div class="panel-body" style="height: 15em; ">
                                                                
                                                                <div id="dropdown_filtri_data_parent" class="dropdown">
                                                                    <button class="btn btn-default dropdown-toggle" type="button" id="dropdown_data_autore_button" data-toggle="dropdown" style="float: left; ">
                                                                        Seleziona una Data
                                                                        <span class="caret"></span>
                                                                    </button>
                                                                    <ul id="dropdown_filtri_data" class="dropdown-menu" role="menu" aria-labelledby="dropdown_filtri_data_button" style="height: 11em; overflow: auto; ">
                                                                       &nbsp;
                                                                    </ul>
                                                                    
                                                                    <span class="checkbox" style="padding: 0.5em 0em 0em 13em; float: none; ">
                                                                        <label>
                                                                            <input id="solo_data_filtri_data" type="checkbox" checked="true">&nbsp;Solo data
                                                                        </label>
                                                                    </span>
                                                                </div>
                                                                
                                                                <div class="panel panel-default" style="margin: 1em 0em 0em 0em; width: 20em; ">
                                                                    <div class="panel-heading" style="background-color: Wheat; ">Filtro attuale</div>
                                                                    <div class="panel-body">
                                                                        <h4 id="label_filtri_data" style="color: RoyalBlue; padding-left: 0.2em; ">Nessuno</h4>
                                                                    </div>
                                                                </div>
                                                                
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <script type="text/javascript">
                                                        $('#dropdown_filtri_data_parent').on ('shown.bs.dropdown', function () { filtri_data_load_drop (); return false; });
                                                    </script>
                                                  
                                                </div>          
                                                
                                                <!-- END 3 COLLAPSE INTERNE -->
                                                
                                            </div>    
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="panel panel-default">
                                <div class="panel-body pan_doc_box" id="document_box">
                                    <h2>AnnOtaria</h2>
                                    <hr>
                                    <h4><a id="a_start" href="#">Seleziona un documento per cominciare</a></h4>
                                    <hr>
                                    <h4 class="fa fa-retweet">&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;&nbsp;Modalità lettore - annotatore</h4>
                                    <h4 class="fa fa-edit">&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;&nbsp;Inserisce nuove annotazioni</h4>
                                    <h4 class="fa fa-save">&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;&nbsp;Modifica e salva annotazioni</h4>
                                    <h4 class="fa fa-question-circle">&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;&nbsp;Help</h4>
                                </div>
                            </div>    
                            
                        </div>
                    </div>
                </div>
            </div>
			
			<script type="text/javascript">
                $('a#a_start').click (function() { $('#doc_button').dropdown ('toggle'); return false; });
                $('a#a_frammenti_doc_main_check_all').click (function() { frammenti_doc_main_check_all (); return false; });
                $('a#a_frammenti_doc_main_uncheck_all').click (function() { frammenti_doc_main_uncheck_all (); return false; });
            </script>
			
    	</div> <!-- /container -->
    	
	</body>
	
	<!-- ######################################################################################## -->
	
</html>




