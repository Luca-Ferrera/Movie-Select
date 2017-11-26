var request, db, indiceAttore, indiceGenere, indiceTitolo;


function createDB(){
  request = indexedDB.open("filmografia",1);

  request.onupgradeneeded = function(event) {
    // The database did not previously exist, so create object stores and indexes.
      db = event.target.result;
      if(db.objectStoreNames.contains("film")) {
        db.deleteObjectStore("film");
      }
      var os = db.createObjectStore('film', {keyPath:"titolo"});
      var tx = event.target.transaction;
      var store = tx.objectStore("film");
      indiceTitolo = store.createIndex("by_titolo", "titolo", {unique: true});
      indiceAttore = store.createIndex("by_attori", "attori");
      indiceGenere = store.createIndex("by_genere","genere");
    
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
  request.onsuccess = function(event) {
    db = request.result;
  };
  request.onerror = function(event){
    console.log("Si è verificato un errore nell'apertura del DB");
  }
}

function selectGroup(event){
  var tx = db.transaction("film");
  var os = tx.objectStore("film");
  var generi = [];
  os.forEach(element => {
    generi.push(element.genere);
  });
  if(event.id === "genere"){
  }
  else if(event.id === "attore"){

  }
}