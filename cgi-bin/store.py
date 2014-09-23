#!/usr/bin/env python
# _*_ coding: utf-8 _*_

execfile ('global.py')

# -----------------------------------------------------------------------------
def allPrefix ():
    p = px_AO  + crlf + \
        px_AOP + crlf + \
        px_AU + crlf + \
        px_BIF + crlf + \
        px_CITO + crlf + \
        px_DBPEDIA + crlf + \
        px_DCTERMS + crlf + \
        px_FABIO + crlf + \
        px_FOAF + crlf + \
        px_FRBR + crlf + \
        px_OA + crlf + \
        px_RDF + crlf + \
        px_RDFS + crlf + \
        px_SCHEMA + crlf + \
        px_SEM + crlf + \
        px_SKOS + crlf + \
        px_XML + crlf + \
        px_XSD + crlf
        
    return p

# -----------------------------------------------------------------------------
def logga (s):
    lc = "\r\n"
    fd = os.open ("/var/www/ltw1403/py_log.txt", os.O_RDWR|os.O_APPEND|os.O_CREAT)
    
    os.write (fd, s + lc)
    
    os.close

# -----------------------------------------------------------------------------
# -----------------------------------------------------------------------------
# --- MAIN --------------------------------------------------------------------

print "Content-type: application/json"
print

# prendiamo i parametri passati in post
fs = cgi.FieldStorage ()
q = fs.getfirst ("RICHIESTA")
src_str = fs.getfirst ("SRC_STR")

# costruiamo la query ...
src_str = allPrefix () + "INSERT DATA {" + crlf + src_str + crlf + "}"

# ... selezioniamo il 3store ... 
__store_store_store = __3store_unibo + "update" 
    
# ... e lo interroghiamo 
sq = SPARQLWrapper (__store_store_store,returnFormat="json")
sq.setQuery (src_str)
sq.method = 'POST'
ris = sq.query ().convert ()

print json.dumps (ris, separators=(',',':'))






