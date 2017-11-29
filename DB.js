var request, db, indiceAttore, indiceGenere, indiceTitolo;
//window.generi contiene un dizionario key = genere, value = array film;
//window.attori contiene un dizionario key = attore, value = array film;


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

/* si avvia quando si carica filmboard.html*/
function createCategorie(){
  var generi = [];
    var r = window.indexedDB.open("filmografia", 5);
    r.onsuccess = function(e){
      var db = r.result;  
      creaGeneri(db); 
      creaAttori(db);
    }
    r.onerror = function(e){
      console.log("errore apertura DB");
      console.log(e);
      
    }
}

function creaGeneri(db){
  var generi = {};
  var t = db.transaction("film","readonly");
  var os = t.objectStore("film");
  var osReq = os.getAll();
  osReq.onsuccess = function(e){
    var film = osReq.result;
    film.forEach(el => {
      if(! (el.genere in generi)) generi[el.genere] = [];
      generi[el.genere].push(el);  //bisogna vedere se ho più film dello stesso genere
    });
    window.generi = generi;
    console.log(window.generi);
    //usaGeneri();
  }
}
function creaAttori(db){
  var attori = {};
  var t = db.transaction("film","readonly");
  var os = t.objectStore("film");
  var osReq = os.getAll();
  osReq.onsuccess = function G(e){
    var film = osReq.result;
    film.forEach(el => {
      el.attori.forEach(a => {
        if (!(a in attori)) attori[a] = [];
        attori[a].push(el)
        //if(!attori.includes(a))
        //attori.push(a);
      });      
    });
    window.attori = attori;
    console.log(window.attori);
    //usaAttori();
  }
}

function selectGroup(item){
  console.log("scelta selezione");
  request = window.indexedDB.open("filmografia",5);
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