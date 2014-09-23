#!/usr/bin/env python
# _*_ coding: utf-8 _*_

execfile ('global.py')

# -----------------------------------------------------------------------------
def get_query (q,src_str):
              
    data = ""
    
    if (q == "generalita_autore"):
        data += px_FOAF + crlf
        data += px_SCHEMA + crlf
        data += '''
            SELECT DISTINCT ?nome ?email
            WHERE {
                <'''+src_str+'''>
                a         foaf:Person ;
                foaf:name ?nome ;
                OPTIONAL { <'''+src_str+'''> schema:email ?email }
            }
        '''
        
    # --------------------------------------------------------------------------
    # --------------------------------------------------------------------------
    # --------------------------------------------------------------------------
    # --- DOCUMENTI ------------------------------------------------------------
    # --------------------------------------------------------------------------
    # --------------------------------------------------------------------------
    # --------------------------------------------------------------------------

                    # - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - hasAuthor    
    elif (q == "hasAuthor_load"):
        data += px_FOAF + crlf
        data += px_OA + crlf
        data += px_RDF + crlf
        data += px_SCHEMA + crlf
        data += '''
            SELECT DISTINCT ?id ?nome ?email
            WHERE {
                ?id a foaf:Person ; 
                foaf:name ?nome .
                OPTIONAL { ?id schema:email ?email }
            }
            ORDER BY ?nome
        '''
        
                    # - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - hasAuthor Meta
    elif (q == "hasAuthor_meta_load"):
        data += px_AO + crlf
        data += px_OA + crlf
        data += px_RDFS + crlf
        data += ''' 
            SELECT DISTINCT ?nome ?ora ?autore
            WHERE {
                [ ?p "hasAuthor" ; 
                  oa:annotatedAt ?ora ; 
                  oa:annotatedBy ?autore ;
                  oa:hasBody [ rdfs:label ?nome ] ;
                  oa:hasTarget ao:'''+src_str+' ;'+'''
                ].
            }
            ORDER BY ?ora
        '''

                    # - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - hasPublisher
    elif (q == "hasPublisher_load"):
        data += px_FOAF + crlf
        data += px_OA + crlf
        data += px_RDF + crlf
        data += px_RDFS + crlf
        data += '''
            SELECT DISTINCT ?id ?nome ?homep {
                {
                    SELECT DISTINCT ?id ?nome ?homep
                    WHERE {
                        ?id a foaf:Organization ; 
                        foaf:name ?nome .
                        OPTIONAL { ?id foaf:homepage ?homep }
                    }
                }
                UNION {
                    SELECT DISTINCT ?id ?nome
                    WHERE {
                        [ ?p0 ?o0 ; ?p1 ?o1 ; oa:hasBody [ rdf:object ?id  ;  rdfs:label ?nome ] ].
                        FILTER ((?o0 = "hasPublisher" || ?o1 = "hasPublisher"))
                    }
                }
            }
            ORDER BY ?nome
        '''
        
                # - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - hasPublisher Meta
    elif (q == "hasPublisher_meta_load"):
        data += px_AO + crlf
        data += px_OA + crlf
        data += px_RDFS + crlf
        data += ''' 
            SELECT DISTINCT ?nome ?ora 
            WHERE {
                [ ?p "hasPublisher" ; oa:annotatedAt ?ora ; 
                  oa:hasTarget ao:'''
        data += src_str+' ;'    # Nome del documento
        data += '''
                  oa:hasBody [ rdfs:label ?nome ]
                ].
            }
            ORDER BY ?ora
        '''        
        
                # - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - hasPubYear Meta
    elif (q == "hasPubYear_meta_load"):
        data += px_AO + crlf
        data += px_OA + crlf
        data += px_RDF + crlf
        data += ''' 
            SELECT DISTINCT ?anno ?ora 
            WHERE {
                [ ?p "hasPublicationYear" ; oa:annotatedAt ?ora ; 
                  oa:hasTarget ao:'''
        data += src_str+' ;'    # Nome del documento
        data += '''
                  oa:hasBody [ rdf:object ?anno ]
                ].
            }
            ORDER BY ?ora
        ''' 
          
                # - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - hasTitle Meta
    elif (q == "hasTitle_meta_load"):
        data += px_AO + crlf
        data += px_OA + crlf
        data += px_RDF + crlf
        data += ''' 
            SELECT DISTINCT ?titolo ?ora 
            WHERE {
                [ ?p "hasTitle" ; oa:annotatedAt ?ora ; 
                  oa:hasTarget ao:'''
        data += src_str+' ;'    # Nome del documento
        data += '''
                  oa:hasBody [ rdf:object ?titolo ]
                ].
            }
            ORDER BY ?ora
        '''      
        
                # - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - hasShortTitle Meta
    elif (q == "hasShortTitle_meta_load"):
        data += px_AO + crlf
        data += px_OA + crlf
        data += px_RDF + crlf
        data += ''' 
            SELECT DISTINCT ?titolo ?ora 
            WHERE {
                [ ?p "hasShortTitle" ; oa:annotatedAt ?ora ; 
                  oa:hasTarget ao:'''
        data += src_str+' ;'    # Nome del documento
        data += '''
                  oa:hasBody [ rdf:object ?titolo ]
                ].
            }
            ORDER BY ?ora
        '''
        
                # - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - hasAbstract Meta
    elif (q == "hasAbstract_meta_load"):
        data += px_AO + crlf
        data += px_OA + crlf
        data += px_RDF + crlf
        data += ''' 
            SELECT DISTINCT ?testo ?ora 
            WHERE {
                [ ?p "hasAbstract" ; oa:annotatedAt ?ora ; 
                  oa:hasTarget ao:'''
        data += src_str+' ;'    # Nome del documento
        data += '''
                  oa:hasBody [ rdf:object ?testo ]
                ].
            }
            ORDER BY ?ora
        '''          

                # - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - hasComment Meta
                # Il filtro serve per eliminare i commenti riferiti ai frammenti
    elif (q == "hasComment_doc_meta_load"):
        data += px_AO + crlf
        data += px_OA + crlf
        data += px_RDF + crlf
        data += ''' 
            SELECT DISTINCT ?testo ?ora 
            WHERE {
                [ ?p "hasComment" ; oa:annotatedAt ?ora ; 
                  oa:hasTarget ao:'''+src_str+' ;'+'''
                  oa:hasBody [ rdf:object ?testo ]
                ].
            }
            ORDER BY ?ora
        '''    
    
    # --------------------------------------------------------------------------
    # --------------------------------------------------------------------------
    # --------------------------------------------------------------------------
    # --------------------------------------------------------------------------
    # --------------------------------------------------------------------------
    # --------------------------------------------------------------------------    
    # --------------------------------------------------------------------------
    # --------------------------------------------------------------------------
    # --------------------------------------------------------------------------
    # --- FRAMMENTI ------------------------------------------------------------
    # --------------------------------------------------------------------------
    # --------------------------------------------------------------------------
    # --------------------------------------------------------------------------
    # --------------------------------------------------------------------------
    # --------------------------------------------------------------------------
    # --------------------------------------------------------------------------    
    # --------------------------------------------------------------------------
    # --------------------------------------------------------------------------
    # --------------------------------------------------------------------------
        
                # - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - denotesPerson 
    elif (q == "denotesPerson_load"):
        data += px_FOAF + crlf
        data += px_OA + crlf
        data += px_RDF + crlf
        data += px_SCHEMA + crlf
        data += '''
            SELECT DISTINCT ?id ?nome ?email
            WHERE {
                ?id a foaf:Person ; 
                foaf:name ?nome .
                OPTIONAL { ?id schema:email ?email }
            }
            ORDER BY ?nome
        '''

                # - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - denotesPerson_meta         
    elif (q == "denotesPerson_meta_load"):
        data += px_AO + crlf
        data += px_OA + crlf
        data += px_RDF + crlf
        data += px_RDFS + crlf
        data += '''        
            SELECT DISTINCT ?id ?ora ?autore ?label ?frame ?start ?end 
            WHERE {
                [   ?p "denotesPerson" ; 
                    oa:annotatedAt ?ora ; 
                    oa:annotatedBy ?autore ;
                    oa:hasBody [ rdf:object ?id ;
                                 rdfs:label ?label 
                               ] ;
                    oa:hasTarget [  a               oa:SpecificResource ;
                                    oa:hasSelector  [   a          oa:FragmentSelector ;
                                                        rdf:value  ?frame ;
                                                        oa:end     ?end ;
                                                        oa:start   ?start
                                                    ] ;
                                    oa:hasSource    ao:'''+src_str+' ;'+'''
                                ]
                ].
            }
            ORDER BY ?ora
        '''
            
                    # - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - denotesPlace
    elif (q == "denotesPlace_load"):
        data += px_DBPEDIA + crlf
        data += px_OA + crlf
        data += px_RDF + crlf
        data += px_RDFS + crlf
        data += '''
            SELECT DISTINCT ?id ?nome {
                {
                    SELECT DISTINCT ?id ?nome
                    WHERE {
                        ?id a dbpedia:Place ;
                        rdfs:label ?nome .
                    }
                }
                UNION {
                    SELECT DISTINCT ?id ?nome
                        WHERE {
                            [ ?p "denotesPlace" ; oa:hasBody [ rdf:object ?id  ;  rdfs:label ?nome ]] .
                    }
                }
            }
            ORDER BY ?nome
        '''
         
                # - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - denotesPlace_meta         
    elif (q == "denotesPlace_meta_load"):
        data += px_AO + crlf
        data += px_OA + crlf
        data += px_RDF + crlf
        data += px_RDFS + crlf
        data += '''        
            SELECT DISTINCT ?id ?ora ?autore ?label ?frame ?start ?end
            WHERE {
                [   ?p "denotesPlace" ; 
                    oa:annotatedAt ?ora ; 
                    oa:annotatedBy ?autore ;
                    oa:hasBody [ rdf:object ?id ;
                                 rdfs:label ?label 
                               ] ;
                    oa:hasTarget [  a               oa:SpecificResource ;
                                    oa:hasSelector  [   a          oa:FragmentSelector ;
                                                        rdf:value  ?frame ;
                                                        oa:end     ?end ;
                                                        oa:start   ?start
                                                    ] ;
                                    oa:hasSource    ao:'''+src_str+' ;'+'''    
                                ]
                ].
            }
            ORDER BY ?ora
        '''
                            
                    # - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - denotesDisease
    elif (q == "denotesDisease_load"):
        data += px_OA + crlf
        data += px_SKOS + crlf
        data += px_RDF + crlf
        data += px_RDFS + crlf
        data += '''
            SELECT DISTINCT ?id ?nome {
                {
                    SELECT DISTINCT ?id ?nome
                    WHERE {
                        ?id a skos:Concept ;
                        rdfs:label ?nome .
                        FILTER (CONTAINS (UCASE (str(?id)),"WWW.ICD10DATA.COM"))
                    }
                }
                UNION {
                    SELECT ?id ?nome
                    WHERE {
                        [ ?p              "denotesDisease" ;
                          oa:hasBody      [ rdf:object     ?id ;
                                            rdfs:label     ?nome
                                          ] ;
                        ] .
                    }
                }
            }
            ORDER BY ?nome       
        '''

        
                # - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - denotesDisease_meta         
    elif (q == "denotesDisease_meta_load"):
        data += px_AO + crlf
        data += px_OA + crlf
        data += px_RDF + crlf
        data += px_RDFS + crlf
        data += '''        
            SELECT DISTINCT ?id ?ora ?autore ?label ?frame ?start ?end
            WHERE {
                [   ?p "denotesDisease" ; 
                    oa:annotatedAt ?ora ; 
                    oa:annotatedBy ?autore ;
                    oa:hasBody [ rdf:object ?id ;
                                 rdfs:label ?label 
                               ] ;
                    oa:hasTarget [  a               oa:SpecificResource ;
                                    oa:hasSelector  [   a          oa:FragmentSelector ;
                                                        rdf:value  ?frame ;
                                                        oa:end     ?end ;
                                                        oa:start   ?start
                                                    ] ;
                                    oa:hasSource    ao:'''+src_str+' ;'+'''    
                                ]
                ].
            }
            ORDER BY ?ora
        '''        
        
                    # - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - hasSubject        
    elif (q == "hasSubject_load"):
        data += px_OA + crlf
        data += px_SKOS + crlf
        data += px_RDF + crlf
        data += px_RDFS + crlf
        data += '''
            SELECT DISTINCT ?id ?nome {
                {
                    SELECT DISTINCT ?id ?nome
                    WHERE {
                        ?id a skos:Concept; 
                        rdfs:label ?nome .
                        FILTER (CONTAINS (UCASE (str(?id)),"THES.BNCF.FIRENZE.SBN.IT"))
                    }
                }
                UNION {
                    SELECT ?id ?nome
                    WHERE {
                        [ ?p              "hasSubject" ;
                          oa:hasBody      [ rdf:object     ?id ;
                                            rdfs:label     ?nome
                                          ] ;
                        ] .
                    }
                }
            }
            ORDER BY ?nome       
        '''
        
                # - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - hasSubject_meta         
    elif (q == "hasSubject_meta_load"):
        data += px_AO + crlf
        data += px_OA + crlf
        data += px_RDF + crlf
        data += px_RDFS + crlf
        data += '''        
            SELECT DISTINCT ?id ?ora ?autore ?label ?frame ?start ?end 
            WHERE {
                [   ?p "hasSubject" ; 
                    oa:annotatedAt ?ora ; 
                    oa:annotatedBy ?autore ;
                    oa:hasBody [ rdf:object ?id ;
                                 rdfs:label ?label 
                               ] ;
                    oa:hasTarget [  a               oa:SpecificResource ;
                                    oa:hasSelector  [   a          oa:FragmentSelector ;
                                                        rdf:value  ?frame ;
                                                        oa:end     ?end ;
                                                        oa:start   ?start
                                                    ] ;
                                    oa:hasSource    ao:'''+src_str+' ;'+'''    
                                ]
                ].
            }
            ORDER BY ?ora
        '''  
    
    # - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - relatesTo        
    elif (q == "relatesTo_load"):
        data += px_OA + crlf
        data += px_RDF + crlf
        data += px_RDFS + crlf
        data += '''
            SELECT DISTINCT ?id ?nome
            WHERE {
                [ ?p "relatesTo" ; oa:hasBody [ rdf:object ?id  ;  rdfs:label ?nome ]] .
            }
            ORDER BY ?nome
        '''
    # - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - db_relatesTo -- DBPedia query        
    elif (q == "db_relatesTo_load"):
        data += '''
            SELECT DISTINCT ?link ?titolo ?descrizione ?wiki
            WHERE {
                ?link rdfs:label ?titolo ;
                <http://dbpedia.org/ontology/abstract> ?descrizione ;
                foaf:isPrimaryTopicOf ?wiki .
                ?titolo bif:contains '''
        data += '\'\"'+src_str+'\"\' . }'
        
                # - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - relatesTo_meta         
    elif (q == "relatesTo_meta_load"):
        data += px_AO + crlf
        data += px_OA + crlf
        data += px_RDF + crlf
        data += px_RDFS + crlf
        data += '''        
            SELECT DISTINCT ?id ?ora ?autore ?label ?frame ?start ?end ?val1 
            WHERE {
                [   ?p "relatesTo" ; 
                    oa:annotatedAt ?ora ; 
                    oa:annotatedBy ?autore ;
                    oa:hasBody [ rdf:object ?id ;
                                 rdfs:label ?label 
                               ] ;
                    oa:hasTarget [  a               oa:SpecificResource ;
                                    oa:hasSelector  [   a          oa:FragmentSelector ;
                                                        rdf:value  ?frame ;
                                                        oa:end     ?end ;
                                                        oa:start   ?start
                                                    ] ;
                                    oa:hasSource    ao:'''+src_str+' ;'+'''    
                                ]
                ].
            }
            ORDER BY ?ora
        '''        
        
                # - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - hasClarity_meta         
    elif (q == "hasClarity_meta_load"):
        data += px_AO + crlf
        data += px_OA + crlf
        data += px_RDF + crlf
        data += px_RDFS + crlf
        data += '''        
            SELECT DISTINCT ?id ?ora ?autore ?label ?frame ?start ?end 
            WHERE {
                [   ?p "hasClarityScore" ; 
                    oa:annotatedAt ?ora ; 
                    oa:annotatedBy ?autore ;
                    oa:hasBody [ rdf:object ?id ;
                                 rdfs:label ?label 
                               ] ;
                    oa:hasTarget [  a               oa:SpecificResource ;
                                    oa:hasSelector  [   a          oa:FragmentSelector ;
                                                        rdf:value  ?frame ;
                                                        oa:end     ?end ;
                                                        oa:start   ?start
                                                    ] ;
                                    oa:hasSource    ao:'''+src_str+' ;'+'''    
                                ]
                ].
            }
            ORDER BY ?ora
        '''        
        
                # - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - hasOriginality_meta         
    elif (q == "hasOriginality_meta_load"):
        data += px_AO + crlf
        data += px_OA + crlf
        data += px_RDF + crlf
        data += px_RDFS + crlf
        data += '''        
            SELECT DISTINCT ?id ?ora ?autore ?label ?frame ?start ?end 
            WHERE {
                [   ?p "hasOriginalityScore" ; 
                    oa:annotatedAt ?ora ; 
                    oa:annotatedBy ?autore ;
                    oa:hasBody [ rdf:object ?id ;
                                 rdfs:label ?label 
                               ] ;
                    oa:hasTarget [  a               oa:SpecificResource ;
                                    oa:hasSelector  [   a          oa:FragmentSelector ;
                                                        rdf:value  ?frame ;
                                                        oa:end     ?end ;
                                                        oa:start   ?start
                                                    ] ;
                                    oa:hasSource    ao:'''+src_str+' ;'+'''    
                                ]
                ].
            }
            ORDER BY ?ora
        '''        
        
                 # - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - hasFormatting_meta         
    elif (q == "hasFormatting_meta_load"):
        data += px_AO + crlf
        data += px_OA + crlf
        data += px_RDF + crlf
        data += px_RDFS + crlf
        data += '''        
            SELECT DISTINCT ?id ?ora ?autore ?label ?frame ?start ?end 
            WHERE {
                [   ?p "hasFormattingScore" ; 
                    oa:annotatedAt ?ora ; 
                    oa:annotatedBy ?autore ;
                    oa:hasBody [ rdf:object ?id ;
                                 rdfs:label ?label 
                               ] ;
                    oa:hasTarget [  a               oa:SpecificResource ;
                                    oa:hasSelector  [   a          oa:FragmentSelector ;
                                                        rdf:value  ?frame ;
                                                        oa:end     ?end ;
                                                        oa:start   ?start
                                                    ] ;
                                    oa:hasSource    ao:'''+src_str+' ;'+'''    
                                ]
                ].
            }
            ORDER BY ?ora
        '''        
        
                 # - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - cites_meta         
    elif (q == "cites_meta_load"):
        data += px_AO + crlf
        data += px_OA + crlf
        data += px_RDF + crlf
        data += px_RDFS + crlf
        data += '''        
            SELECT DISTINCT ?id ?ora ?autore ?label ?frame ?start ?end 
            WHERE {
                [   ?p "cites" ; 
                    oa:annotatedAt ?ora ; 
                    oa:annotatedBy ?autore ;
                    oa:hasBody [ rdf:object ?id ;
                                 rdfs:label ?label 
                               ] ;
                    oa:hasTarget [  a               oa:SpecificResource ;
                                    oa:hasSelector  [   a          oa:FragmentSelector ;
                                                        rdf:value  ?frame ;
                                                        oa:end     ?end ;
                                                        oa:start   ?start
                                                    ] ;
                                    oa:hasSource    ao:'''+src_str+' ;'+'''    
                                ]
                ].
            }
            ORDER BY ?ora
        '''
        
        
                 # - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - hasComment_meta         
    elif (q == "hasComment_meta_load"):
        data += px_AO + crlf
        data += px_OA + crlf
        data += px_RDF + crlf
        data += px_RDFS + crlf
        data += '''        
            SELECT DISTINCT ?id ?ora ?autore ?label ?frame ?start ?end 
            WHERE {
                [   ?p "hasComment" ; 
                    oa:annotatedAt ?ora ; 
                    oa:annotatedBy ?autore ;
                    oa:hasBody [ rdf:object ?id ;
                                 rdfs:label ?label 
                               ] ;
                    oa:hasTarget [  a               oa:SpecificResource ;
                                    oa:hasSelector  [   a          oa:FragmentSelector ;
                                                        rdf:value  ?frame ;
                                                        oa:end     ?end ;
                                                        oa:start   ?start
                                                    ] ;
                                    oa:hasSource    ao:'''+src_str+' ;'+'''    
                                ]
                ].
            }
            ORDER BY ?ora
        '''       
        
   
                
    return data

# -----------------------------------------------------------------------------
# -----------------------------------------------------------------------------
# --- MAIN --------------------------------------------------------------------

print "Content-type: application/json"
print

# prendiamo i parametri passati in post
fs = cgi.FieldStorage()
q = norman (fs.getfirst ("RICHIESTA"))
src_str = getParam (fs,"SRC_STR")
    
if (q == "checkUp") :
   print json.dumps (sys.version, separators=(',',':'))
else :
    # ... prendiamo la query giusta ...
    q_rdf = get_query (q,src_str)
    
    # ... selezioniamo il 3store ... 
    __store_store_store = __3store_unibo + "query" 
    if (q == "db_relatesTo_load"):
        __store_store_store = __3store_dbpedia_en
        
    # ... e lo interroghiamo 
    sq = SPARQLWrapper (__store_store_store,returnFormat="json")
    sq.setQuery (q_rdf)
    ris = sq.query ().convert ()
    
    print json.dumps (ris, separators=(',',':'))








