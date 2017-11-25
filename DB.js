var request = indexedDB.open("filmografia");

request.onupgradeneeded = function() {
  // The database did not previously exist, so create object stores and indexes.
    var db = request.result;
    var tx = db.transaction("film", "readwrite");
    var store = tx.objectStore("film",{keyPath: "titolo"});
    var indiceTitolo = store.createIndex("by_titolo", "titolo", {unique: true});
    var indiceRegista = store.createIndex("by_regista", "regista");
    var indiceAttore = store.createIndex("by_attore", "attore");
    var indiceGenere = store.createIndex("by_genere","genere");
   
  //The following example populates the database using a transaction.
    
    store.put({titolo: "PrimoFilm",
                genere: "azione",
                regista: "Fred",
                attori: ["mario", "giuseppe"],
                description: "Film bellissimo"}); 

    store.put({titolo: "SecondoFilm",
                genere: "avventura",
                regista: "Fred",
                attori: ["mario", "giuseppe"],
                description: "Film bellissimo"});

    store.put({titolo: "TerzoFilm",
                genere: "Horror",
                regista: "Fred",
                attori: ["mario", "giuseppe"],
                description: "Film bellissimo"});            

    tx.oncomplete = function() {
    // All requests have succeeded and the transaction has committed.
};


};

request.onsuccess = function() {
  db = request.result;
};

