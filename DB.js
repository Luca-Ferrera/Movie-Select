var filmografia;
var generi={};
var actors={};
// variabile per le ricerche
var testo_ricerca="";
// la pagina può avere valori : "Tutti", "Attori", "Generi"  che rappresentano il layout che si sta visualizzando;
window.pagina="Tutti";


//Funzione eseguita al caricamento della pagina che recupera i dati dei film dal server (nel nostro caso da file di testo) tramite AJAX
function carica(){
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = gestisciResponse;
  xhttp.open("GET","filmlist.txt",true);
  xhttp.send();
}

//Handler per la risposta dal server con i dati inerenti i film
function gestisciResponse(evento){
  if(evento.target.readyState == 4 && evento.target.status==200){
    filmografia=JSON.parse(evento.target.responseText);
  }
/*  else{
    console.log("Si è verificato un errore nel reperire i dati inerenti ai film dal server");
  }
*/
  creaGeneri();
  creaAttori();
//  defaultFilmboard();
}

//Popolo l'oggetto generi, contenitore di tanti array "Nomegenere" in ciascuno dei quali sono salvati i film(oggetti film) di tale genere
function creaGeneri(){
    var i,j;
    for (i=0; i<filmografia.length; i++){
        var gens = filmografia[i].genere;
        for (j=0; j<gens.length; j++){
          if (!(gens[j] in generi))
            generi[gens[j]]=[];
          generi[gens[j]].push(filmografia[i]);
        }
    }
    window.generi=generi;
    console.log(generi);
    console.log("end");
}



//Popolo l'oggetto attori, contenitore di tanti array "Nomeattore" in ciascuno dei quali sono salvati i film(oggetti film) in cui recita
function creaAttori(){
    var i,j;
    for (i=0; i<filmografia.length; i++){
        var atts = filmografia[i].attori;
        for (j=0; j<atts.length; j++){
          if(!(atts[j] in actors))
            actors[atts[j]]=[];
          actors[atts[j]].push(filmografia[i]);
        }
  }
    window.actors=actors;
    console.log(window.actors);
    console.log("end");
}



/*genera la pagina di default di filmboard.html"*/
/*
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
      e.append('<a href="..\\Filmpage\\filmpage.html"><img src='+window.attori[film].img+'></a>');
      //e.append(window.attori[film][el].immagine);
    }
  }
}
*/
$(document).ready(function(){


  //handler dell'evento click su attori, mostra i film di ciascun attore
$('#attore').click(function(){
    testo_ricerca="";
    selezAttori();
  });

function selezAttori(){
  window.pagina="Attori";
  $("#contenitore").empty();
  $("#contenitore").append("<div id='barinfo'>Ricerca un attore nella searchbar a lato</div><hr class='halfhr'></hr>");
  // ordino gli attori per ordine alfabetico
  var temp=[],i=0;
  for(attore in window.actors){
    temp[i]=attore;
    i++;
  }
  temp.sort();
  // creo dinamicamente gli elementi del DOM per mostrare gli attori e relativi film
  for(i=0;i<temp.length;i++){
    attore = temp[i];
    // introduco la variabile attorerepl poichè ogni attore ha uno spazio all'interno del nome-cognome, il che non lo riprende
    // un identificatore valido. Per risolvere sostituisco lo spazio con il trattino-basso
    var attorerepl = attore.replace(/ /g,"_");
    if (attore.replace(/ /g,"").toLowerCase().indexOf(testo_ricerca.toLowerCase())!=-1 || testo_ricerca == ""){
      $("#contenitore").append('<div class="group_name" id="'+ attorerepl +'-group"></div>');
      $("#"+attorerepl+"-group").append('<h2 class="group_name" id="'+ attorerepl +'-title">'+ attore+ '</h2>');
      $("#"+attorerepl+"-title").after('<div class="film_icon" id="'+ attorerepl +'-icon"></div>');
      $("#"+attorerepl+"-icon").append('<ul id="'+ attorerepl +'-ul"></ul>');
      var el;
      for(el in window.actors[attore]){
        $("#"+attorerepl+"-ul").append('<li id="'+ el + attorerepl +'-li-item"></li>');
        var titolo= window.actors[attore][el].titolo.replace(/ /g,"_");
        $("#"+el+attorerepl+"-li-item").append('<img class="filmimg" name='+titolo+' src='+window.actors[attore][el].img+'>');
      }
    }
  }
  mostraFilm();
}


// creo dinamicamente la descrizione del film che verrà mostrata al lato destro del layout
function mostraFilm(){$(".filmimg").click(function (){
        console.log(this);
        var film;
        var film_titolo=$(this).attr("name");
        for (i in filmografia){
          if (filmografia[i].titolo.replace(/ /g,"_")==film_titolo)
            film=filmografia[i];
        }

        $("#filmdescr").empty();
        $("#filmdescr").append('<img src='+film.img+'>');
        $("#filmdescr").append('<h2 class="group_name" id="descr_title">'+film.titolo+'<h2>');
        $("#filmdescr").append('<div id="descr_anno">'+film.anno+'</div>');
        $("#filmdescr").append('<div id="descr_attori>">');
        for (i in film.attori)
          $("#filmdescr").append('-'+film.attori[i]);
        $("#filmdescr").append('</div>');
        $("#filmdescr").append('<div id="descr_genere">');
        for (j in film.genere)
          $("#filmdescr").append('-'+film.genere[j]);
        $("#filmdescr").append('</div>');
        $("#filmdescr").append('<div id="descr_descr">'+film.descrizione+'</div>');
        $("#filmdescr").css("border-color","red");
        /*$("#filmdescr").css("position","fixed");*/
      });
    }

  //handler dell'evento click su generi, mostra i film di ciascun genere
$('#genere').click(function(){
  testo_ricerca="";
  selezGeneri();
});

function selezGeneri(){
  window.pagina="Generi";
  $("#contenitore").empty();
  $("#contenitore").append("<div id='barinfo'>Ricerca un genere nella searchbar a lato</div><hr class='halfhr'></hr>");
  // ordino i generi per ordine alfabetico
  var temp=[],i=0;
  for(genere in window.generi){
    temp[i]=genere;
    i++;
  }
  temp.sort();
  // creo dinamicamente gli elementi del DOM per mostrare i generi e relativi film
  for(i=0; i<temp.length;i++){
    genere= temp[i];
    if (genere.toLowerCase().indexOf(testo_ricerca.toLowerCase())!=-1 || testo_ricerca == ""){
      $("#contenitore").append('<div class="group_name" id="'+ genere +'-group"></div>');
      $("#"+genere+"-group").append('<h2 class="group_name" id="'+ genere +'-title">'+ genere + '</h2>');
      $("#"+genere+"-title").after('<div class="film_icon" id="'+ genere +'-icon"></div>');
      $("#"+genere+"-icon").append('<ul id="'+ genere +'-ul"></ul>');
      var el;
      for(el in window.generi[genere]){
        $("#"+genere+"-ul").append('<li id="'+ el + genere +'-li-item"></li>');
        var titolo= window.generi[genere][el].titolo.replace(/ /g,"_");
        $("#"+el+genere+"-li-item").append('<img class="filmimg" name='+titolo+' src='+window.generi[genere][el].img+'>');
      }
    }
  }
  mostraFilm();
}


  $("#searchbutton").click(function(){
    testo_ricerca = $("#sbarinput").val();
    $("#sbarinput").val("");
    // rimpiazzo il testo fornito in input con uno che soddisfi l'espressione regolare, ossia tolgo tutti i caratteri non validi
    testo_ricerca=testo_ricerca.replace(/[^a-zA-Z]/g,"");
    console.log(window.pagina);
    if(window.pagina=="Attori")
      selezAttori();
    if(window.pagina=="Generi")
      selezGeneri();
    if(window.pagina=="Tutti"){}
  });

});
