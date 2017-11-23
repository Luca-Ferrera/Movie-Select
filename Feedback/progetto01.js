function checkForm(e){
  if (document.modfeed.chec.checked && document.modfeed.sintesi.value==""){
    window.alert("Inserisci la descrizione del problema");
    return false;
  }
}
