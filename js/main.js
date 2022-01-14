var acc = document.getElementsByClassName("accordion");

// al hacer click en cualquier parte detecto en que elemento se hizo click:
document.addEventListener('click', function(e) {
    e = e || window.event;
    var target = e.target || e.srcElement, text = target.textContent || target.innerText;
    // console.log(target);

    if (target.classList.contains("items_button_acordion")){
      cabecera_activa = target;
      for (i = 0; i < acc.length; i++) {
        resto_de_cabeceras = acc[i]
        if (cabecera_activa == resto_de_cabeceras) {
          cabecera_activa.classList.toggle("active");
          for (let j = 0; j < cabecera_activa.children.length; j++) {
            cabecera_activa.children[j].style.color = '#fff';
            cabecera_activa.children[j].style.textShadow = '3px 4px 6px #011828';
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
      var panel = target.nextElementSibling;
      if (panel.style.display === "block") {
        panel.style.display = "none";
      } else {
        panel.style.display = "block";
      }
    } else {
        // si pincho fuera desactivo todas:
        for (i = 0; i < acc.length; i++) {
          var cabecera = acc[i];
          cabecera.nextElementSibling.style.display = "none";
          cabecera.classList.remove("active");
          for (j = 0; j < cabecera.children.length; j++) {
            cabecera.children[j].style.color = '#fff';
            cabecera.children[j].style.textShadow = 'none';
          }
        }
    }

}, false);
