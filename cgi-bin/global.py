#!/usr/bin/env python
# _*_ coding: utf-8 _*_

import sys
sys.path.append ('/var/www/ltw1403/cgi-bin/lib')
#sys.path.append ('/home/web/ltw1403/html/cgi-bin/lib')        ricordarsi diritti +rwx su tutti i python

import os
from os import environ
import rdflib
import json
from SPARQLWrapper import SPARQLWrapper
import cgi

import string

__3store_unibo = "http://giovanna.cs.unibo.it:8181/data/"
#__3store_unibo = "http://192.168.10.52:3030/data/"
__3store_dbpedia_it = "http://it.dbpedia.org/sparql" 
__3store_dbpedia_en = "http://dbpedia.org/sparql"
   
crlf = "\n"
px_AO =         "prefix ao:        <http://vitali.web.cs.unibo.it/AnnOtaria/>"
px_AOP =        "prefix aop:       <http://vitali.web.cs.unibo.it/AnnOtaria/person/>"
px_AU =         "prefix au:        <http://description.org/schema/>"
px_BIF =        "prefix bif:       <http://www.openlinksw.com/schema/sparql/extensions#>"
px_CITO =       "prefix cito:      <http://purl.org/spar/cito/>"
px_DBPEDIA =    "prefix dbpedia:   <http://dbpedia.org/resource/>"
px_DCTERMS =    "prefix dcterms:   <http://purl.org/dc/terms/>"
px_FABIO =      "prefix fabio:     <http://purl.org/spar/fabio/>"
px_FOAF =       "prefix foaf:      <http://xmlns.com/foaf/0.1/>"
px_FRBR =       "prefix frbr:      <http://purl.org/vocab/frbr/core#>"
px_OA =         "prefix oa:        <http://www.w3.org/ns/oa#>"
px_RDF =        "prefix rdf:       <http://www.w3.org/1999/02/22-rdf-syntax-ns#>"
px_RDFS =       "prefix rdfs:      <http://www.w3.org/2000/01/rdf-schema#>"
px_SCHEMA =     "prefix schema:    <http://schema.org/>"
px_SEM =        "prefix sem:       <http://www.ontologydesignpatterns.org/cp/owl/semiotics.owl#>"  
px_SKOS =       "prefix skos:      <http://www.w3.org/2004/02/skos/core#>"
px_XML =        "prefix xml:       <http://www.w3.org/XML/1998/namespace>"
px_XSD =        "prefix xsd:       <http://www.w3.org/2001/XMLSchema#>"

# -----------------------------------------------------------------------------
def norman (s):
    # escape dei caratteri speciali
    special = ["(",")"]
    
    if (s != None) :
        s = s.strip ()
        for c in special :
            s = string.replace (s,c,"\\"+c)
        
    return s

# -----------------------------------------------------------------------------
def getParam (fs,s):
    try: 
        return norman (fs.getfirst (s))
    except:
        return ''
    
# -----------------------------------------------------------------------------
    
    
    
    
    
    
    