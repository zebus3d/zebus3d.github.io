var acc = document.getElementsByClassName("accordion");
var i;
for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function() {
    cabecera_activa = this;
    for(j = 0; j < acc.length; j++) {
      resto_de_cabeceras = acc[j]
      if (cabecera_activa == resto_de_cabeceras){
        cabecera_activa.classList.toggle("active");
        for (let i = 0; i < cabecera_activa.children.length; i++) {
          cabecera_activa.children[i].style.color = '#fff';
          cabecera_activa.children[i].style.textShadow = '3px 4px 6px #011828';
        }
      } else {
        resto_de_cabeceras.nextElementSibling.style.display = "none";
        resto_de_cabeceras.classList.remove("active");
        for (let i = 0; i < resto_de_cabeceras.children.length; i++) {
          resto_de_cabeceras.children[i].style.color = '#373737';
          resto_de_cabeceras.children[i].style.textShadow = 'none';
        }
      }
    }
    // this.classList.toggle("active");
    var panel = this.nextElementSibling;
    if (panel.style.display === "block") {
      panel.style.display = "none";
    } else {
      panel.style.display = "block";
    }
  });
}
