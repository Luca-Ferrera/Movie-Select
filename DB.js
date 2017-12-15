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
  console.log(evento);
  if(evento.target.readyState == 4 && evento.target.status==200){
    filmografia=JSON.parse(evento.target.responseText);
    // ordino i film per titolo
    filmografia.sort(sort_film);
    console.log(filmografia);
  }
/*  else{
    console.log("Si è verificato un errore nel reperire i dati inerenti ai film dal server");
  }
*/
  creaGeneri();
  creaAttori();
  selezFilm();
}

function selezFilm(){
    var titolo,titolo_img;
    console.log("join selez film");
    window.pagina="Tutti";
    $("#sbarinput").attr("placeholder", "Ricerca per titolo");
    $("#contenitore").empty();
    /*$("#contenitore").append("<div id='barinfo'>Ricerca un film per titolo nella searchbar a lato</div>"<hr class='halfhr'></hr>");*/
    $("#contenitore").append('<div class="group_name" id="tutti-group"></div>');
    $("#tutti-group").after('<div class="film_icon" id="tutti-icon"></div>');
    $("#tutti-icon").append('<ul id="tutti-ul"></ul>');
    for (film in filmografia){
      // salvo nella variabile titolo, il titolo nel formato che può avere un match con l'espressione regolare
      // utilizzata per permettere la ricerca dalla searchbar, mentre titolo_img verrà utilizzato come attributo name, per identificare il film
      // nella funzione mostraFilm, e quindi generare la descrizione del film dinamicamente (al click sull'immagine)
      titolo = filmografia[film].titolo.replace(/[^a-zA-Z0-9]/g,"");
      titolo_img = filmografia[film].titolo.replace(/ /g,"_");
      if (titolo.toLowerCase().indexOf(testo_ricerca.toLowerCase())!=-1 || testo_ricerca==""){
        console.log("Passa il controllo 1");
        $("#tutti-ul").append('<li id="'+titolo+'-li-item"></li>');
        $("#"+titolo+"-li-item").append('<img class="filmimg" name='+titolo_img+' src='+filmografia[film].img+'>');
        console.log("debug");
      }
    }
    mostraFilm();
}

function sort_film(film1,film2){
  if (film1.titolo>film2.titolo) return 1;
  if (film1.titolo<film2.titolo) return -1;
  return 0;
}

function mostraFilm(){$(".filmimg").click(function (event){
        console.log(this);
        var film;
        var film_titolo=$(this).attr("name");
        for (i in filmografia){
          if (filmografia[i].titolo.replace(/ /g,"_")==film_titolo){
            film=filmografia[i];
            break;
            console.log("filmfound");
          }
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
        console.log("scroll");
        /*window.scrollTo("#filmdescr");*/
        event.preventDefault();
        console.log($("#desc"));
        
        $('html, body').animate({
          scrollTop: $("#line")
        }, 800);                
      });
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

$(document).ready(function(){

  //handler dell'evento click su attori, mostra i film di ciascun attore
$('#attore').click(function(){
    testo_ricerca="";
    selezAttori();
  });

function selezAttori(){
  window.pagina="Attori";
  $("#sbarinput").attr("placeholder","Ricerca per attore");
  $("#contenitore").empty();
  /*$("#contenitore").append("<div id='barinfo'>Ricerca un attore nella searchbar a lato</div><hr class='halfhr'></hr>");*/
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
    // introduco la variabile attorerepl poichè ogni attore ha uno spazio all'interno del nome-cognome, il che non lo rende
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


//handler dell'evento click su generi, mostra i film di ciascun genere
$('#genere').click(function(){
  testo_ricerca="";
  selezGeneri();
});

function selezGeneri(){
  window.pagina="Generi";
  $("#sbarinput").attr("placeholder","Ricerca per genere");
  $("#contenitore").empty();
  /*$("#contenitore").append("<div id='barinfo'>Ricerca un genere nella searchbar a lato</div><hr class='halfhr'></hr>");*/
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


$('#tutti').click(function(){
  testo_ricerca="";
  selezFilm();
});


/*function selezFilm(){
    console.log("join selez film");
    window.pagina="Tutti";
    $("#contenitore").empty();
    $("#contenitore").append("<div id='barinfo'>Ricerca un film per titolo nella searchbar a lato</div><hr class='halfhr'></hr>");
    var titolo,titolo_img;
    $("#contenitore").append('<div class="group_name" id="tutti-group"></div>');
    $("#tutti-group").after('<div class="film_icon" id="tutti-icon"></div>');
    $("#tutti-icon").append('<ul id="tutti-ul"></ul>');
    for (film in filmografia){
      // salvo nella variabile titolo, il titolo nel formato che può avere un match con l'espressione regolare
      // utilizzata per permettere la ricerca dalla searchbar, mentre titolo_img verrà utilizzato come attributo name, per identificare il film
      // nella funzione mostraFilm, e quindi generare la descrizione del film dinamicamente (al click sull'immagine)
      titolo = filmografia[film].titolo.replace(/[^a-zA-Z0-9]/g,"");
      titolo_img = filmografia[film].titolo.replace(/ /g,"_");
      if (titolo.toLowerCase().indexOf(testo_ricerca.toLowerCase())!=-1 || testo_ricerca==""){
        console.log("Passa il controllo 1");
        $("#tutti-ul").append('<li id="'+titolo+'-li-item"></li>');
        $("#"+titolo+"-li-item").append('<img class="filmimg" name='+titolo_img+' src='+filmografia[film].img+'>');
        console.log("debug");
      }
    }
    mostraFilm();
}
*/
  $("#searchbutton").click(function(){
    testo_ricerca = $("#sbarinput").val();
    $("#sbarinput").val("");
    // rimpiazzo il testo fornito in input con uno che soddisfi l'espressione regolare, ossia tolgo tutti i caratteri non validi
    testo_ricerca=testo_ricerca.replace(/[^a-zA-Z0-9]/g,"");
    console.log(window.pagina);
    if(window.pagina=="Attori")
      selezAttori();
    if(window.pagina=="Generi")
      selezGeneri();
    if(window.pagina=="Tutti")
      selezFilm();
  });

});
