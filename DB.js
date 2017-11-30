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
function start(){
  var r = window.indexedDB.open("filmografia", 5);
  r.onsuccess = function(e){
    var db = r.result;  
    creaGeneri(db); 
    creaAttori(db);
    //console.log(window.generi);
    //defaultFilmboard();    
  }
  r.onerror = function(e){
    console.log("errore apertura DB");
    console.log(e); 
  }
}
/*genera la pagina di default di filmboard.html"*/
function defaultFilmboard(){
  console.log("default");
  console.log(window.generi);
  $("#contenitore").empty();
  for(film in window.attori){
    var a = $("#contenitore").append('<div class="group_name" id="first-group"></div>');
    var b = a.append('<h2 class="group_name" id="first-title">'+ film + '</h2>');
    var c = b.after('<div class="film_icon"></div>');
    var d = c.append('<ul></ul>');
    d.css("list-style-type", "none");
    for(var el in window.attori[film]){
      var e = d.append('<li></li>');
      e.css("float", "left");
      e.css("padding","16px");
      e.css("padding-left","2px");
      e.css("padding-right","2px");
      e.append('<a href="..\\Filmpage\\filmpage.html"><img src=".\\Icons\\avatar.jpg"></a>');
      //e.append(window.attori[film][el].immagine);        
    }
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

$(document).ready(function(){
  $('#attore').click(function(){
    $("#contenitore").empty();
    for(film in window.attori){
      var a = $("#contenitore").append('<div class="group_name" id="first-group"></div>');
      var b = a.append('<h2 class="group_name" id="first-title">'+ film + '</h2>');
      var c = b.after('<div class="film_icon"></div>');
      var d = c.append('<ul></ul>');
      d.css("list-style-type", "none");
      for(var el in window.attori[film]){
        var e = d.append('<li></li>');
        e.css("float", "left");
        e.css("padding","16px");
        e.css("padding-left","2px");
        e.css("padding-right","2px");
        e.append('<a href="..\\Filmpage\\filmpage.html"><img src=".\\Icons\\avatar.jpg"></a>');
        //e.append(window.attori[film][el].immagine);        
      }
    }
  });
  $('#genere').click(function(){
    $("#contenitore").empty();
    for(film in window.generi){
      var a = $("#contenitore").append('<div class="group_name" id="first-group"></div>');
      var b = a.append('<h2 class="group_name" id="first-title">'+ film + '</h2>');
      var c = b.after('<div class="film_icon"></div>');
      var d = c.append('<ul></ul>');
      d.css("list-style-type", "none");
      for(var el in window.generi[film]){
        var e = d.append('<li></li>');
        e.css("float", "left");
        e.css("padding","16px");
        e.css("padding-left","2px");
        e.css("padding-right","2px");
        e.append('<a href="..\\Filmpage\\filmpage.html"><img src=".\\Icons\\avatar.jpg"></a>');
        //e.append(window.generi[film][el].immagine);        
      }
    }
  });
});