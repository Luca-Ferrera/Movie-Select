var request, db, indiceAttore, indiceGenere, indiceTitolo;
//window.generi contiene un array con tutti i generi;


function createDB(){
  request = window.indexedDB.open("filmografia",2);
  request.onsuccess = function(event) { 
    db = event.target.result;
  }  

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
function createCategorie(){
  var generi = [];
    var r = window.indexedDB.open("filmografia", 4);
    r.onsuccess = function(e){
      var db = r.result;  
      creaGeneri(db); //devo assegnarlo alla variabile generi
      console.log("Lista generi:");
      console.log(generi);   
    }
    r.onerror = function(e){
      console.log("errore apertura DB");
    }
}

function creaGeneri(db){
  var generi = [];
  var t = db.transaction("film","readonly");
  var os = t.objectStore("film");
  var osReq = os.getAll();
  osReq.onsuccess = function G(e){
    //console.log("film: ");
    //console.log(osReq.result);
    var film = osReq.result;
    film.forEach(el => {
      if(el.filter(e => e ==el.genere).length == 0)
        generi.push(el.genere);
    });
    console.log(generi);
    window.generi = generi;
    usaGeneri();
  }
}

function selectGroup(item){
  request = window.indexedDB.open("filmografia", 2);
  request.onsuccess = function(e){
    db = e.target.result;
    if(item.id === "genere"){
      console.log("genere");
    }
    else if(item.id== "attore"){

  }
  request.onerror = function(e){
    console.log("Errore apertura DB");
    }
  }
  
}