
$( document ).ready(function() {
    console.log( "ready!" );

    $('.accordion').each(function(i) {
      this.addEventListener("click", function() {
        $(this).toggleClass("active");
        if ($(this).css('box-shadow') != 'none') {
          $(this).find('.maximizar').css("display", "none");
          $(this).find('.minimizar').css("display", "block");
          $(this).css('border-radius', '8px 8px 0px 0px');
          $(this).css('box-shadow', 'none');
          $(this.children).each(function(i) {
            $(this).css('color', '#fff');
            $(this).css('text-shadow', '3px 4px 6px #011828');
          });
        } else {
          $(this).find('.maximizar').css("display", "block");
          $(this).find('.minimizar').css("display", "none");
          $(this).css('border-radius', '8px');
          $(this).css('box-shadow', '5px 7px 5px #1114228f');
          $(this.children).each(function(i) {
            $(this).css('color', '#373737');
            $(this).css('text-shadow', 'none');
          });
        }
        var panel = $(this).next();
        if ( panel.css('display') === 'flex') {
          panel.css('display', "none");
        } else {
          panel.css('display', "flex");
        }


      });
    });


});
