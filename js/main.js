
$( document ).ready(function() {
    console.log( "ready!" );

    var acc = document.getElementsByClassName("accordion");

    // $("accordion").find(`[data-slide='${current}']`)

    for (i = 0; i < acc.length; i++) {
      acc[i].addEventListener("click", function() {

        this.classList.toggle("active");
        if (this.style.boxShadow != 'none') {

          $(this).find('.maximizar').css("display", "none");
          $(this).find('.minimizar').css("display", "block");
          this.style.borderRadius = '8px 8px 0px 0px';
          this.style.boxShadow = 'none';
          for (let i = 0; i < this.children.length; i++) {
            for (let j = 0; j < this.children[i].length; j++) {
              console.log(this);
            }
            this.children[i].style.color = '#fff';
            this.children[i].style.textShadow = '3px 4px 6px #011828';
          }
        } else {
          $(this).find('.maximizar').css("display", "block");
          $(this).find('.minimizar').css("display", "none");
          this.style.borderRadius = '8px';
          this.style.boxShadow = '5px 7px 5px #1114228f';
          for (let i = 0; i < this.children.length; i++) {
            this.children[i].style.color = '#373737';
            this.children[i].style.textShadow = 'none';
          }
        }

        var panel = $(this).next();
        if ( panel.css('display') === 'flex') {
          panel.css('display', "none");
        } else {
          panel.css('display', "flex");
        }


      });
    }


});
